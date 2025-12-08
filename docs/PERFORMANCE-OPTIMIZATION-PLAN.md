# Piano di Ottimizzazione Performance Electron - Prompto

**Data:** 2025-12-07
**Versione Electron:** 39.2.6

---

## Stato Attuale

L'app **Prompto** (gestione prompt con UI Kanban) ha già implementato alcune ottimizzazioni di base:

### Ottimizzazioni Esistenti
- Metal acceleration (macOS)
- High-performance GPU preference
- Background throttling disabilitato
- WebGL abilitato
- Context isolation (security best practice)
- Lazy window show (`show: false` + `ready-to-show`)
- Compression middleware (gzip)
- ASAR packaging con unpack per native modules

### Aree di Miglioramento Identificate
1. **Caricamento moduli** - Tutti i moduli server caricati in modo sincrono allo startup
2. **Nessun bundling** - Main process usa `require()` multipli (costoso)
3. **Nessun V8 snapshot** - Perdita di opportunità startup significativa
4. **Nessun profiling** - Nessuna metrica di performance in produzione
5. **IPC non ottimizzato** - Chiamate sequenziali invece che batch

---

## Ottimizzazioni Raccomandate

### Priorità 1: Impatto Alto, Complessità Bassa

#### 1.1 Lazy Loading dei Moduli Server
**File:** `electron/main.js`

Attualmente (linee 68-77):
```javascript
// Caricamento EAGER - blocca startup
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
```

**Ottimizzazione:** Caricare moduli solo quando necessari, usando pattern factory.

#### 1.2 Rimozione Menu Default
**File:** `electron/main.js`

Aggiungere prima di `app.whenReady()`:
```javascript
const { Menu } = require('electron');
Menu.setApplicationMenu(null);
```

Risparmia tempo di inizializzazione del menu default.

#### 1.3 Preload Script Minimo
**File:** `electron/preload.js`

Rimuovere IPC handlers non implementati (`saveFile`, `openFile`, `showNotification`) per ridurre overhead.

---

### Priorità 2: Impatto Alto, Complessità Media

#### 2.1 Bundling Main Process con esbuild
**Nuovo file:** `esbuild.main.js`

Bundlare tutto il codice del main process in un singolo file per eliminare il costo di `require()` multipli.

```javascript
// Esempio configurazione esbuild
require('esbuild').build({
  entryPoints: ['electron/main.js'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'electron/main.bundle.js',
  external: ['electron', 'better-sqlite3']
})
```

**Beneficio:** Riduzione 30-50% tempo startup (basato su esperienza VSCode/Slack).

#### 2.2 Ottimizzazione SQLite
**File:** `server/database.js`

```javascript
// Aggiungere PRAGMA per performance
db.pragma('journal_mode = WAL');          // Già presente
db.pragma('synchronous = NORMAL');        // Meno I/O (default FULL)
db.pragma('cache_size = -64000');         // 64MB cache (default 2MB)
db.pragma('temp_store = MEMORY');         // Temp tables in RAM
db.pragma('mmap_size = 268435456');       // Memory-mapped I/O 256MB
```

#### 2.3 Batch IPC per Operazioni Multiple
**File:** `client/src/services/api.ts`

Combinare chiamate API multiple in singole richieste dove possibile (es. reorder + update).

---

### Priorità 3: Impatto Medio, Complessità Media

#### 3.1 Ottimizzazione Renderer
**File:** `client/src/main.tsx`

```typescript
// Usare requestIdleCallback per operazioni non critiche
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // Inizializzazioni non critiche
  });
}
```

#### 3.2 Hardware Acceleration Switches Aggiuntivi
**File:** `electron/main.js`

```javascript
// Aggiunte raccomandate
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
```

#### 3.3 Window Options Ottimizzate
```javascript
// In createWindow()
webPreferences: {
  // ... esistenti ...
  v8CacheOptions: 'code',           // Cache bytecode V8
  spellcheck: false,                // Disabilita se non serve
}
```

---

### Priorità 4: Impatto Alto, Complessità Alta

#### 4.1 V8 Snapshots con electron-link
**Descrizione:** Creare snapshot V8 del codice applicativo per eliminare parsing/compilation a runtime.

**Strumenti:**
- `electron-link` per preparare codice per snapshotting
- `mksnapshot` per generare snapshot

**Beneficio:** VSCode riporta 20-40% miglioramento startup.

**Complessità:** Richiede refactoring significativo per rendere il codice "snapshotable".

#### 4.2 Native Module Optimization (Rust/NAPI-RS)
**Descrizione:** Se emergono bottleneck in operazioni JS compute-intensive, considerare riscrittura in Rust.

**Benchmark riferimento:** 10x miglioramento per operazioni CRC32 (da 800ms a 75ms).

**Applicabilità Prompto:** Al momento non ci sono operazioni compute-intensive evidenti.

---

### Priorità 5: Monitoring e Profiling

#### 5.1 Performance Metrics Collection
**File:** Nuovo `electron/performance.js`

```javascript
const { app } = require('electron');

const metrics = {
  appStartTime: Date.now(),
  timeToReady: 0,
  timeToFirstRender: 0,
  serverStartTime: 0,
  windowCreateTime: 0,
  memoryUsage: {}
};

function markReady() {
  metrics.timeToReady = Date.now() - metrics.appStartTime;
  console.log(`[Performance] Time to ready: ${metrics.timeToReady}ms`);
}

function markServerStart() {
  metrics.serverStartTime = Date.now() - metrics.appStartTime;
  console.log(`[Performance] Server start: ${metrics.serverStartTime}ms`);
}

function markWindowCreate() {
  metrics.windowCreateTime = Date.now() - metrics.appStartTime;
  console.log(`[Performance] Window create: ${metrics.windowCreateTime}ms`);
}

function collectMemoryMetrics() {
  metrics.memoryUsage = process.memoryUsage();
  console.log(`[Performance] Memory:`, {
    heapUsed: Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024) + 'MB',
    rss: Math.round(metrics.memoryUsage.rss / 1024 / 1024) + 'MB'
  });
}

function logAllMetrics() {
  collectMemoryMetrics();
  console.log('[Performance] All metrics:', metrics);
}

module.exports = {
  metrics,
  markReady,
  markServerStart,
  markWindowCreate,
  collectMemoryMetrics,
  logAllMetrics
};
```

#### 5.2 DevTools Performance Tab
Usare periodicamente:
1. Chrome DevTools → Performance tab → Record
2. Analizzare main thread blocking
3. Identificare Long Tasks (>50ms)

---

## File Critici da Modificare

| File | Modifiche |
|------|-----------|
| `electron/main.js` | Lazy loading, menu removal, GPU switches, profiling hooks |
| `electron/preload.js` | Rimuovere handlers non usati |
| `electron/performance.js` | NUOVO - Metrics collection |
| `server/database.js` | PRAGMA SQLite aggiuntivi |
| `client/src/main.tsx` | requestIdleCallback |
| `esbuild.main.js` | NUOVO - Bundling config (se implementato) |
| `package.json` | Script per bundling |

---

## Ordine di Implementazione Raccomandato

### Fase 1 - Quick Wins (~30 min)
- [ ] Implementare `electron/performance.js` per baseline
- [ ] Rimozione menu default
- [ ] GPU switches aggiuntivi
- [ ] PRAGMA SQLite ottimizzati
- [ ] Cleanup preload.js
- [ ] Misurare miglioramenti

### Fase 2 - Bundling (1-2 ore)
- [ ] Setup esbuild per main process
- [ ] Aggiornare script build
- [ ] Test su tutte le piattaforme
- [ ] Misurare miglioramenti

### Fase 3 - Renderer Optimizations (~1 ora)
- [ ] requestIdleCallback in main.tsx
- [ ] v8CacheOptions e spellcheck
- [ ] Misurare miglioramenti

### Fase 4 - V8 Snapshots (opzionale, 4-8 ore)
- [ ] Solo se necessario dopo profiling
- [ ] Richiede test approfonditi
- [ ] Valutare ROI vs complessità

---

## Metriche Target

| Metrica | Attuale (da misurare) | Target |
|---------|----------------------|--------|
| Cold startup | ~3-4s (stimato) | <2s |
| Time to interactive | ~2s (stimato) | <1s |
| Memory usage idle | TBD | <150MB |
| Memory under load | TBD | <250MB |
| Bundle size | TBD | Riduzione 20% |

---

## Fonti e Riferimenti

- [Electron Performance Docs](https://www.electronjs.org/docs/latest/tutorial/performance) - Documentazione ufficiale
- [Slack/Notion/VSCode Optimizations](https://palette.dev/blog/improving-performance-of-electron-apps) - Case studies aziende
- [Brainhub Electron Performance](https://brainhub.eu/library/electron-app-performance) - Native modules e bundling
- [V8 Custom Snapshots](https://v8.dev/blog/custom-startup-snapshots) - V8 team blog
- [NAPI-RS](https://napi.rs/) - Rust bindings per Node.js

---

## Note Implementazione

### Compatibilità
- Testare su macOS (arm64 + x64), Windows (x64), Linux (x64)
- Verificare che native modules (better-sqlite3) funzionino dopo bundling

### Rollback
- Mantenere versione non ottimizzata fino a test completi
- Usare feature flags se necessario per A/B testing

### Monitoraggio Post-Deploy
- Raccogliere metriche reali dagli utenti (opt-in)
- Confrontare con baseline pre-ottimizzazione
