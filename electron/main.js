const { app, BrowserWindow, shell, ipcMain, Menu, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const net = require('net');
const fs = require('fs');
const os = require('os');

// Debug logging to temp file
const logFile = path.join(os.tmpdir(), 'prompto-debug.log');
function debugLog(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try { fs.appendFileSync(logFile, line); } catch (e) {}
  console.log(msg);
}
try { fs.writeFileSync(logFile, `=== Prompto starting ===\nPlatform: ${process.platform}\nArch: ${process.arch}\n`); } catch (e) {}
debugLog(`Log file: ${logFile}`);

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
let isManualUpdateCheck = false; // Track manual update checks

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

/**
 * Download file from URL to local path
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);

    const request = (urlString) => {
      https.get(urlString, {
        headers: { 'User-Agent': 'Prompto-Updater' }
      }, (response) => {
        // Handle redirects
        if (response.statusCode === 302 || response.statusCode === 301) {
          request(response.headers.location);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }

        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(destPath);
        });
      }).on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    };

    request(url);
  });
}

/**
 * Configure and setup auto-updater (manual install for unsigned apps)
 */
function setupAutoUpdater() {
  // Don't check for updates in development
  if (isDev) {
    console.log('Auto-updater disabled in development mode');
    return;
  }

  // Configure auto-updater - only for checking, not installing
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'drabdadev',
    repo: 'prompto'
  });

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info.version);

    // Determine DMG filename based on architecture
    const arch = process.arch === 'arm64' ? 'arm64' : '';
    const dmgName = arch ? `Prompto-${info.version}-arm64.dmg` : `Prompto-${info.version}.dmg`;
    const dmgUrl = `https://github.com/drabdadev/prompto/releases/download/v${info.version}/${dmgName}`;

    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Aggiornamento disponibile',
      message: `È disponibile Prompto v${info.version}`,
      detail: 'Vuoi scaricare e installare l\'aggiornamento?\n\nDopo il download, il DMG verrà aperto automaticamente. Trascina Prompto in Applications per aggiornare.',
      buttons: ['Scarica', 'Più tardi'],
      defaultId: 0,
      cancelId: 1
    }).then(async (result) => {
      if (result.response === 0) {
        try {
          // Show downloading message
          const downloadPath = path.join(app.getPath('downloads'), dmgName);

          dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Download in corso',
            message: 'Download in corso...',
            detail: `Salvando in: ${downloadPath}`,
            buttons: ['OK']
          });

          console.log(`Downloading ${dmgUrl} to ${downloadPath}`);
          await downloadFile(dmgUrl, downloadPath);

          // Open the DMG
          console.log('Opening DMG:', downloadPath);
          await shell.openPath(downloadPath);

          dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Aggiornamento scaricato',
            message: 'Il DMG è stato aperto',
            detail: 'Trascina Prompto nella cartella Applications per aggiornare.\n\nChiudi questa versione prima di aprire quella nuova.',
            buttons: ['OK']
          });

        } catch (err) {
          console.error('Download failed:', err);
          dialog.showMessageBox(mainWindow, {
            type: 'error',
            title: 'Errore download',
            message: 'Impossibile scaricare l\'aggiornamento',
            detail: err.message
          });
        }
      }
    });
  });

  autoUpdater.on('update-not-available', (info) => {
    console.log('No updates available');
    if (isManualUpdateCheck) {
      isManualUpdateCheck = false;
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Nessun aggiornamento',
        message: 'Stai già usando l\'ultima versione di Prompto',
        detail: `Versione corrente: v${app.getVersion()}`
      });
    }
  });

  autoUpdater.on('error', (err) => {
    console.error('Auto-updater error:', err);
    if (isManualUpdateCheck) {
      isManualUpdateCheck = false;
      dialog.showMessageBox(mainWindow, {
        type: 'error',
        title: 'Errore',
        message: 'Impossibile verificare gli aggiornamenti',
        detail: err.message
      });
    }
  });

  // Check for updates after a short delay
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch(err => {
      console.error('Failed to check for updates:', err);
    });
  }, 3000);
}

/**
 * Check for updates manually (from menu)
 */
function checkForUpdatesManually() {
  if (isDev) {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Modalità sviluppo',
      message: 'Il controllo aggiornamenti non è disponibile in modalità sviluppo'
    });
    return;
  }

  isManualUpdateCheck = true;
  autoUpdater.checkForUpdates().catch((err) => {
    // Error will be handled by the 'error' event
    console.error('Manual update check failed:', err);
  });
}

/**
 * Create application menu
 */
function createMenu() {
  const template = [
    {
      label: 'Prompto',
      submenu: [
        { label: 'Informazioni su Prompto', role: 'about' },
        {
          label: 'Verifica aggiornamenti...',
          click: () => checkForUpdatesManually()
        },
        { type: 'separator' },
        { label: 'Preferenze...', accelerator: 'CmdOrCtrl+,', enabled: false },
        { type: 'separator' },
        { label: 'Servizi', role: 'services' },
        { type: 'separator' },
        { label: 'Nascondi Prompto', role: 'hide' },
        { label: 'Nascondi altri', role: 'hideOthers' },
        { label: 'Mostra tutti', role: 'unhide' },
        { type: 'separator' },
        { label: 'Esci', role: 'quit' }
      ]
    },
    {
      label: 'Modifica',
      submenu: [
        { label: 'Annulla', role: 'undo' },
        { label: 'Ripeti', role: 'redo' },
        { type: 'separator' },
        { label: 'Taglia', role: 'cut' },
        { label: 'Copia', role: 'copy' },
        { label: 'Incolla', role: 'paste' },
        { label: 'Seleziona tutto', role: 'selectAll' }
      ]
    },
    {
      label: 'Vista',
      submenu: [
        { label: 'Ricarica', role: 'reload' },
        { label: 'Forza ricarica', role: 'forceReload' },
        { type: 'separator' },
        { label: 'Dimensione reale', role: 'resetZoom' },
        { label: 'Ingrandisci', role: 'zoomIn' },
        { label: 'Riduci', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Schermo intero', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Finestra',
      submenu: [
        { label: 'Riduci a icona', role: 'minimize' },
        { label: 'Zoom', role: 'zoom' },
        { type: 'separator' },
        { label: 'Chiudi', role: 'close' }
      ]
    }
  ];

  // Add DevTools in development
  if (isDev) {
    template[2].submenu.push(
      { type: 'separator' },
      { label: 'Strumenti sviluppatore', role: 'toggleDevTools' }
    );
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

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
  debugLog('startBackendServer() called');
  serverPort = await findAvailablePort(5080);
  debugLog(`Port: ${serverPort}`);

  // Set paths based on environment
  const serverDir = isDev
    ? path.join(__dirname, '..', 'server')
    : path.join(process.resourcesPath, 'server');

  const dbPath = isDev
    ? path.join(__dirname, '..', 'server', 'data', 'prompto-electron.db')
    : path.join(app.getPath('userData'), 'prompto.db');

  debugLog(`serverDir: ${serverDir}`);
  debugLog(`dbPath: ${dbPath}`);
  debugLog(`resourcesPath: ${process.resourcesPath}`);

  // Set environment variables before requiring server modules
  process.env.PORT = serverPort.toString();
  process.env.DATABASE_PATH = dbPath;
  process.env.SERVER_DIR = serverDir;
  process.env.NODE_ENV = isDev ? 'development' : 'production';
  process.env.ELECTRON = 'true';

  // In production, add module paths
  if (!isDev) {
    const extraNodeModules = path.join(process.resourcesPath, 'node_modules');
    debugLog(`extraNodeModules: ${extraNodeModules}`);
    debugLog(`extraNodeModules exists: ${fs.existsSync(extraNodeModules)}`);
    require('module').globalPaths.push(extraNodeModules);
  }

  // Load server dependencies
  debugLog('Loading express...');
  const express = require('express');
  debugLog('Loading cors...');
  const cors = require('cors');
  debugLog('Loading compression...');
  const compression = require('compression');

  // Load database and routes from server directory
  debugLog('Loading database.js...');
  const { initializeDatabase } = require(path.join(serverDir, 'database.js'));
  debugLog('Loading routes...');
  const projectsRouter = require(path.join(serverDir, 'routes', 'projects.js'));
  const promptsRouter = require(path.join(serverDir, 'routes', 'prompts.js'));
  const databaseRouter = require(path.join(serverDir, 'routes', 'database.js'));
  debugLog('All modules loaded');

  expressApp = express();

  // Log all incoming requests for debugging
  expressApp.use((req, res, next) => {
    debugLog(`REQUEST: ${req.method} ${req.url} from ${req.headers.origin || 'no-origin'}`);
    next();
  });

  // Security middleware - skip helmet in Electron (not needed for desktop app)
  expressApp.use(compression());

  // CORS - allow all in Electron
  expressApp.use(cors({ origin: true, credentials: true }));

  // Body parsing
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));

  debugLog('Initializing database...');
  return new Promise((resolve, reject) => {
    initializeDatabase()
      .then((db) => {
        debugLog('Database initialized OK');
        expressApp.locals.db = db;

        // Health check
        expressApp.get('/api/health', (req, res) => {
          res.json({ status: 'healthy', timestamp: new Date().toISOString() });
        });

        // API routes
        expressApp.use('/api/projects', projectsRouter);
        expressApp.use('/api/prompts', promptsRouter);
        expressApp.use('/api/database', databaseRouter);

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
        debugLog('Starting HTTP server...');
        httpServer = expressApp.listen(serverPort, () => {
          debugLog(`Server running on port ${serverPort}`);
          resolve(serverPort);
        });
      })
      .catch((err) => {
        debugLog(`Database init FAILED: ${err.message}`);
        debugLog(err.stack);
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
  const appUrl = isDev ? `http://localhost:3080` : `http://localhost:${serverPort}`;
  debugLog(`Loading window URL: ${appUrl}`);
  debugLog(`Preload path: ${path.join(__dirname, 'preload.js')}`);
  mainWindow.loadURL(appUrl);

  // Open DevTools only in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
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
    // Setup application menu
    createMenu();

    // Setup IPC handlers
    setupIpcHandlers();

    // Start backend server first (in-process)
    await startBackendServer();
    console.log(`Backend server running on port ${serverPort}`);

    // Create window
    createWindow();

    // Setup auto-updater (checks for updates on startup)
    setupAutoUpdater();
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
