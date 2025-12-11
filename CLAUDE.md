# Prompto

Prompt management webapp with Kanban-style UI for organizing AI agent prompts by project.

## URLs

- **Development**: http://localhost:3080
- **Backend API**: http://localhost:5080

## Quick Start

```bash
npm run install-all   # Install dependencies
npm run dev           # Start both frontend and backend
```

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Shadcn UI + Tailwind CSS
- **Backend**: Express.js + SQLite3 (better-sqlite3)
- **Drag-and-Drop**: @dnd-kit

## Project Structure

```
prompto/
├── server/
│   ├── server.js           # Express server
│   ├── database.js         # SQLite connection
│   ├── routes/
│   │   ├── projects.js     # Project CRUD
│   │   └── prompts.js      # Prompt CRUD
│   └── migrations/
│       └── 001_initial_schema.sql
├── client/
│   └── src/
│       ├── components/
│       │   ├── ui/         # Shadcn components
│       │   ├── kanban/     # Kanban components
│       │   └── dialogs/    # Modal dialogs
│       ├── hooks/          # Custom hooks
│       ├── services/       # API client
│       └── types/          # TypeScript types
└── package.json
```

## Database

SQLite databases are environment-specific (completely isolated):

| Environment | Database Path | Command |
|-------------|---------------|---------|
| Web dev | `server/data/prompto.db` | `npm run dev` |
| Electron dev | `server/data/prompto-electron.db` | `npm run electron:dev` |
| Electron prod | `~/Library/Application Support/Prompto/prompto.db` | Installed app |

### Tables

**projects**
- id (TEXT PK)
- name (TEXT)
- color (TEXT)
- position (INTEGER)
- created_at, updated_at

**prompts**
- id (TEXT PK)
- project_id (TEXT FK)
- content (TEXT)
- type (TEXT: 'ui' | 'backend')
- position (INTEGER)
- created_at, updated_at

## API Endpoints

### Projects
- GET /api/projects - List all
- POST /api/projects - Create
- PUT /api/projects/:id - Update
- DELETE /api/projects/:id - Delete
- PUT /api/projects/reorder - Reorder

### Prompts
- GET /api/prompts - List all (with ?type filter)
- POST /api/prompts - Create
- PUT /api/prompts/:id - Update
- DELETE /api/prompts/:id - Delete
- PUT /api/prompts/:id/move - Move to project

### Database Management
- POST /api/database/backup - Create server backup
- GET /api/database/backups - List backups
- GET /api/database/backups/:filename - Download backup
- DELETE /api/database/backups/:filename - Delete backup
- POST /api/database/restore - Restore from uploaded file
- GET /api/database/download - Download current database

## Port Configuration

- Frontend: 3080
- Backend: 5080

## Commands

```bash
# Web Development
npm run dev           # Run web app (auto-rebuilds native modules)
npm run server        # Backend only (no rebuild)
npm run client        # Frontend only
npm run build         # Build frontend for production

# Electron Development
npm run electron:dev        # Run Electron (auto-rebuilds native modules)
npm run electron:build      # Build Electron app for current platform
npm run electron:build:mac  # Build for macOS

npm run install-all   # Install all deps
```

Note: `npm run dev` e `npm run electron:dev` ricompilano automaticamente `better-sqlite3` per la piattaforma corretta, quindi puoi passare da uno all'altro senza problemi.

## Features

- Kanban board with projects as columns
- Drag-and-drop column reordering
- Quick add prompts with UI/Backend toggle
- Filter by prompt type (All/UI/Backend)
- One-click copy to clipboard
- Inline edit and delete
- Database backup/restore (accessible via Edit Mode > "Gestione database")
- **Auto-update** (Electron): verifica automatica aggiornamenti da GitHub Releases

## Auto-Update (Electron)

L'app Electron verifica automaticamente gli aggiornamenti da GitHub Releases.

### Comportamento:
1. All'avvio, dopo 3 secondi verifica se ci sono aggiornamenti
2. Se disponibile, mostra dialog per scaricare
3. Dopo il download, chiede di riavviare per installare
4. Menu "Prompto > Verifica aggiornamenti..." per check manuale

### Per rilasciare un aggiornamento:
1. Aggiorna `version` in `package.json` (es. "1.0.1")
2. Build l'app: `npm run electron:build:mac`
3. Crea una GitHub Release con tag `v1.0.1`
4. Upload i file da `dist-electron/`:
   - `Prompto-1.0.1-arm64.dmg`
   - `Prompto-1.0.1-arm64-mac.zip`
   - `latest-mac.yml` (generato automaticamente)

### GitHub Repository:
- https://github.com/drabdadev/prompto

## Known Issues & Learnings (Electron)

### 1. Splash Screen su Windows
`transparent: true` in BrowserWindow non funziona su Windows. Usare `backgroundColor` con colore solido:
```javascript
splashWindow = new BrowserWindow({
  frame: false,
  backgroundColor: '#1a1a2e',  // NON transparent: true
  // ...
});
```

### 2. better-sqlite3 NODE_MODULE_VERSION Mismatch
**Errore**: "NODE_MODULE_VERSION 131 vs 140" al primo avvio.
**Causa**: Il modulo nativo è compilato per Node.js locale, non Electron.

**IMPORTANTE - Build Script Corretti:**
Gli script `electron:build:*` NON devono avere `npm run rebuild:native` alla fine!
Questo perché:
1. `electron-builder` ricompila automaticamente better-sqlite3 per Electron (via `npmRebuild: true`)
2. `npm run rebuild:native` lo ricompilerebbe per Node.js, rompendo la build

**Script corretto** (già configurato):
```json
"electron:build:mac": "npm run build && electron-builder --mac"
```

**Se la build fallisce comunque**, fare clean rebuild:
```bash
rm -rf dist-electron node_modules/better-sqlite3/build
npx electron-rebuild -f -w better-sqlite3
npm run electron:build:mac
```

**Verifica rapida dell'app:**
```bash
dist-electron/mac-arm64/Prompto.app/Contents/MacOS/Prompto 2>&1 | head -20
# Deve mostrare "Database initialized OK" e "Server running on port 5080"
```

### 3. DMG Layout Standard
Per evitare layout incasinati (spazio vuoto, scroll), usare i valori standard:
```yaml
dmg:
  contents:
    - x: 130
      y: 220
    - x: 410
      y: 220
      type: link
      path: /Applications
  window:
    width: 540
    height: 380
```
Fonte: https://www.electron.build/dmg.html

### 4. CSS Height Chain per Electron
Per evitare scroll verticale inutile, serve catena completa di height:
```css
html.electron, body.electron, .electron #root {
  height: 100%;
  overflow: hidden;
}
```
E usare `h-full` invece di `min-h-screen` nei componenti React.

### 5. Auto-Update per Piattaforma
- **Windows/Linux**: `autoUpdater.downloadUpdate()` standard funziona anche per app non firmate
- **macOS**: Download manuale del DMG necessario (app non firmata)
- **Bug M1 Mac**: Usare `app.exit(0)` invece di `autoUpdater.quitAndInstall()` (bug Electron #41888)
