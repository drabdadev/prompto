const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const { initializeDatabase } = require('./database');
const projectsRouter = require('./routes/projects');
const promptsRouter = require('./routes/prompts');
const databaseRouter = require('./routes/database');
const { logger } = require('./config/logger');

const app = express();
const PORT = process.env.PORT || 5080;

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
const isElectron = process.env.ELECTRON === 'true';
const allowedOrigins = isElectron
  ? true // Allow all origins in Electron (local app)
  : process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_URL]
    : ['http://localhost:3080', 'http://127.0.0.1:3080'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database and start server
initializeDatabase()
  .then((db) => {
    // Make db available to routes
    app.locals.db = db;

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    });

    // API routes
    app.use('/api/projects', projectsRouter);
    app.use('/api/prompts', promptsRouter);
    app.use('/api/database', databaseRouter);

    // Serve static files in production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    }

    // Error handling middleware
    app.use((err, req, res, next) => {
      logger.error('Unhandled error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });

    app.listen(PORT, () => {
      logger.info(`Prompto server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to initialize database:', err);
    process.exit(1);
  });
