const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
const net = require('net');

// Performance optimizations for smooth animations
app.commandLine.appendSwitch('enable-features', 'Metal'); // Enable Metal on macOS
app.commandLine.appendSwitch('disable-renderer-backgrounding'); // Don't throttle background tabs
app.commandLine.appendSwitch('disable-background-timer-throttling'); // Don't throttle timers
app.commandLine.appendSwitch('force_high_performance_gpu'); // Use dedicated GPU if available

// Keep a global reference of the window object
let mainWindow = null;
let serverPort = null;
let expressApp = null;
let httpServer = null;

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

/**
 * Find an available port
 */
function findAvailablePort(startPort = 5080) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      // Port in use, try next one
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

/**
 * Start the Express backend server in-process
 */
async function startBackendServer() {
  serverPort = await findAvailablePort(5080);

  // Set database path
  const dbPath = isDev
    ? path.join(__dirname, '..', 'server', 'data', 'prompto.db')
    : path.join(app.getPath('userData'), 'prompto.db');

  // Set environment variables before requiring server modules
  process.env.PORT = serverPort.toString();
  process.env.DATABASE_PATH = dbPath;
  process.env.NODE_ENV = isDev ? 'development' : 'production';
  process.env.ELECTRON = 'true';

  console.log(`Starting backend server on port ${serverPort}...`);
  console.log(`Database path: ${dbPath}`);

  // Require server modules
  const serverDir = isDev
    ? path.join(__dirname, '..', 'server')
    : path.join(process.resourcesPath, 'server');

  // In production, add extraResources node_modules to module paths
  if (!isDev) {
    const extraNodeModules = path.join(process.resourcesPath, 'node_modules');
    require('module').globalPaths.push(extraNodeModules);
  }

  // Load server dependencies
  const express = require('express');
  const cors = require('cors');
  const helmet = require('helmet');
  const compression = require('compression');

  // Load database and routes from server directory
  const { initializeDatabase } = require(path.join(serverDir, 'database.js'));
  const projectsRouter = require(path.join(serverDir, 'routes', 'projects.js'));
  const promptsRouter = require(path.join(serverDir, 'routes', 'prompts.js'));

  expressApp = express();

  // Security middleware
  expressApp.use(helmet());
  expressApp.use(compression());

  // CORS - allow all in Electron
  expressApp.use(cors({ origin: true, credentials: true }));

  // Body parsing
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));

  return new Promise((resolve, reject) => {
    initializeDatabase()
      .then((db) => {
        // Make db available to routes
        expressApp.locals.db = db;

        // Health check
        expressApp.get('/api/health', (req, res) => {
          res.json({ status: 'healthy', timestamp: new Date().toISOString() });
        });

        // API routes
        expressApp.use('/api/projects', projectsRouter);
        expressApp.use('/api/prompts', promptsRouter);

        // Serve static files in production
        if (!isDev) {
          const clientDist = path.join(__dirname, '..', 'client', 'dist');
          expressApp.use(express.static(clientDist));
          expressApp.get('*', (req, res) => {
            res.sendFile(path.join(clientDist, 'index.html'));
          });
        }

        // Error handling middleware
        expressApp.use((err, req, res, next) => {
          console.error('Server error:', err);
          res.status(500).json({ error: 'Internal server error' });
        });

        // Start listening
        httpServer = expressApp.listen(serverPort, () => {
          console.log(`Prompto server running on port ${serverPort}`);
          resolve(serverPort);
        });
      })
      .catch((err) => {
        console.error('Failed to initialize database:', err);
        reject(err);
      });
  });
}

/**
 * Create the main browser window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      // Performance optimizations
      backgroundThrottling: false, // Don't throttle animations when in background
      enableWebGL: true, // Enable WebGL for GPU acceleration
    },
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 15, y: 15 },
    show: false, // Don't show until ready
    backgroundColor: '#1a1a2e'
  });

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Load the app
  if (isDev) {
    // In development, load from Vite dev server
    mainWindow.loadURL(`http://localhost:3080`);
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from local server
    mainWindow.loadURL(`http://localhost:${serverPort}`);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * IPC Handlers
 */
function setupIpcHandlers() {
  // Return app version
  ipcMain.handle('get-version', () => {
    return app.getVersion();
  });

  // Return server port
  ipcMain.handle('get-server-port', () => {
    return serverPort;
  });

  // Window controls
  ipcMain.on('window-minimize', () => {
    mainWindow?.minimize();
  });

  ipcMain.on('window-maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });

  ipcMain.on('window-close', () => {
    mainWindow?.close();
  });
}

/**
 * App lifecycle
 */
app.whenReady().then(async () => {
  try {
    // Setup IPC handlers
    setupIpcHandlers();

    // Start backend server first (in-process)
    await startBackendServer();
    console.log(`Backend server running on port ${serverPort}`);

    // Create window
    createWindow();
  } catch (err) {
    console.error('Failed to start application:', err);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Close HTTP server
  if (httpServer) {
    console.log('Stopping backend server...');
    httpServer.close();
    httpServer = null;
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
