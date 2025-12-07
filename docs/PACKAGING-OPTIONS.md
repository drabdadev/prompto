# Prompto - Opzioni di Packaging Cross-Platform

Questo documento analizza le opzioni per pacchettizzare Prompto come applicazione desktop distribuibile su Windows, macOS e Linux.

## Stato Attuale

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Express.js + SQLite (better-sqlite3)
- **Modalità attuale**: PWA che richiede avvio manuale del server

## Obiettivo

Creare un'applicazione desktop che:
- Si installi con un click
- Avvii automaticamente il server backend
- Funzioni offline
- Sia distribuibile su Win/Mac/Linux

---

## Opzioni Analizzate

### 1. Electron (Raccomandato)

**Descrizione**: Framework per creare app desktop con tecnologie web, sviluppato da GitHub.

| Aspetto | Dettaglio |
|---------|-----------|
| Bundle Size | ~150MB |
| RAM Usage | ~100-200MB |
| Maturità | Molto alta (VS Code, Slack, Discord) |
| Packaging | electron-builder |
| Auto-update | Supportato nativamente |

**Pro**:
- Backend Node.js già pronto → zero riscrittura
- Documentazione eccellente
- Genera `.dmg` (Mac), `.exe`/`.msi` (Win), `.AppImage`/`.deb` (Linux)
- Il server Express può girare nel main process
- SQLite funziona senza modifiche

**Contro**:
- Bundle relativamente grande
- Consuma più RAM di soluzioni native

**Struttura proposta**:
```
prompto/
├── electron/
│   ├── main.ts          # Main process (avvia backend)
│   ├── preload.ts       # Bridge sicuro renderer-main
│   └── electron-builder.yml
├── client/              # React app (renderer)
├── server/              # Express backend
└── package.json
```

---

### 2. Tauri

**Descrizione**: Framework moderno in Rust che usa il webview nativo del sistema.

| Aspetto | Dettaglio |
|---------|-----------|
| Bundle Size | ~10-15MB |
| RAM Usage | ~30-50MB |
| Maturità | Media (v1.0 nel 2022) |
| Packaging | tauri-bundler |
| Auto-update | Supportato |

**Pro**:
- Bundle molto più piccolo
- Usa webview nativo (meno risorse)
- Più sicuro (Rust)
- Performance migliori

**Contro**:
- Richiede riscrivere il backend in Rust, OPPURE
- Usare "sidecar" per bundlare Node.js (complica il setup)
- Community più piccola
- Meno plugin disponibili

**Note**: Se si sceglie Tauri con sidecar Node.js, si perde parte del vantaggio di dimensioni ridotte.

---

### 3. Neutralino.js

**Descrizione**: Framework leggero che usa il webview di sistema.

| Aspetto | Dettaglio |
|---------|-----------|
| Bundle Size | ~5MB |
| RAM Usage | ~20-40MB |
| Maturità | Bassa |
| Packaging | neu build |

**Pro**:
- Estremamente leggero
- Può eseguire comandi shell nativi
- Setup semplice

**Contro**:
- Community piccola
- Meno features
- Gestione backend più complessa
- Meno stabile

---

### 4. PWA + Installer Script

**Descrizione**: Mantenere l'app come PWA ma creare installer che configurano il server come servizio di sistema.

**Pro**:
- Nessuna modifica al codice attuale
- Aggiornamenti più semplici

**Contro**:
- Esperienza utente frammentata
- Configurazione più complessa per l'utente
- Gestione servizi diversa per ogni OS

---

## Raccomandazione Finale

### Electron è la scelta migliore per Prompto perché:

1. **Zero riscrittura**: Il backend Express funziona immediatamente
2. **SQLite compatibile**: better-sqlite3 funziona in Electron
3. **Packaging semplice**: Un comando genera installer per tutti gli OS
4. **Esperienza utente**: L'utente scarica, installa, usa
5. **Maturità**: Ecosistema solido e ben documentato

### Piano di Implementazione

1. **Setup Electron**
   - Installare electron e electron-builder
   - Creare main.ts per avviare il backend
   - Configurare preload.ts per sicurezza

2. **Integrazione Backend**
   - Il main process avvia Express su porta random
   - Il renderer si connette al backend locale
   - Database SQLite in `app.getPath('userData')`

3. **Build & Packaging**
   - Configurare electron-builder.yml
   - Script per build: `npm run build:electron`
   - Output: dmg, exe, AppImage

4. **Distribuzione**
   - GitHub Releases per hosting
   - Auto-update con electron-updater
   - Code signing per evitare warning di sicurezza

---

## Risorse

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder](https://www.electron.build/)
- [Tauri](https://tauri.app/) (alternativa futura)
- [Neutralino.js](https://neutralino.js.org/)

---

*Documento creato: Dicembre 2024*
