# Prompto - Electron Implementation

Documentazione dell'implementazione Electron per Prompto.

## Struttura Creata

```
prompto/
├── electron/
│   ├── main.js           # Main process - avvia backend e crea finestra
│   └── preload.js        # Bridge sicuro renderer-main
├── build/
│   ├── entitlements.mac.plist  # Entitlements per macOS
│   └── icons/            # Directory per icone (da popolare)
├── electron-builder.yml  # Configurazione packaging
├── client/
│   └── src/
│       ├── services/api.ts     # Modificato per supporto porta dinamica
│       ├── main.tsx            # Modificato per init Electron API
│       ├── types/electron.d.ts # Tipi TypeScript per Electron API
│       └── vite-env.d.ts       # Tipi Vite
└── server/
    └── server.js         # Modificato per CORS dinamico
```

## Scripts Disponibili

```bash
# Development
npm run dev              # Web: server + frontend (come prima)
npm run electron:dev     # Electron: server + frontend + finestra Electron

# Build
npm run electron:build       # Build per tutte le piattaforme
npm run electron:build:mac   # Build solo per macOS
npm run electron:build:win   # Build solo per Windows
npm run electron:build:linux # Build solo per Linux
npm run electron:pack        # Build senza packaging (per test)
```

## Come Funziona

### Main Process (electron/main.js)

1. **Trova porta disponibile** - Cerca una porta libera a partire da 5080
2. **Avvia Express server** - Spawna il processo Node.js del backend
3. **Crea BrowserWindow** - Carica il frontend React
4. **Gestisce lifecycle** - Chiude il server quando l'app viene chiusa

### Preload Script (electron/preload.js)

Espone API sicure al renderer:
- `getServerPort()` - Ritorna la porta del backend
- `getVersion()` - Ritorna versione app
- Window controls (minimize, maximize, close)

### Client Integration

Il client React:
1. Chiama `initElectronApi()` all'avvio se in Electron
2. Ottiene la porta del server via IPC
3. Configura axios per usare `http://localhost:{port}/api`

## Icone

Per il packaging, aggiungi le icone in `build/`:
- `icon.icns` - macOS (512x512, formato ICNS)
- `icon.ico` - Windows (256x256, formato ICO)
- `icons/` - Linux (PNG in varie dimensioni: 16, 32, 48, 64, 128, 256, 512)

## Build di Produzione

```bash
# 1. Assicurati che le icone siano presenti
ls build/icon.icns  # macOS
ls build/icon.ico   # Windows

# 2. Build del frontend
npm run build

# 3. Build Electron
npm run electron:build:mac   # per macOS

# Output in dist-electron/
```

## Note Tecniche

- **Database**: In production, il DB viene salvato in `app.getPath('userData')`
- **Porta dinamica**: Se 5080 è occupata, usa la successiva disponibile
- **CORS**: In Electron, CORS è disabilitato (local app, trusted)
- **DevTools**: Aperti automaticamente in development

## TODO Future

- [ ] Aggiungere icone per tutte le piattaforme
- [ ] Code signing per macOS/Windows
- [ ] Auto-updater con GitHub Releases
- [ ] Menu bar nativa
- [ ] System tray support

---

*Implementazione completata: Dicembre 2024*
