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

SQLite database stored at `server/data/prompto.db`

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

## Port Configuration

- Frontend: 3080
- Backend: 5080

## Commands

```bash
npm run dev           # Run both servers
npm run server        # Backend only
npm run client        # Frontend only
npm run build         # Build for production
npm run install-all   # Install all deps
```

## Features

- Kanban board with projects as columns
- Drag-and-drop column reordering
- Quick add prompts with UI/Backend toggle
- Filter by prompt type (All/UI/Backend)
- One-click copy to clipboard
- Inline edit and delete
