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
