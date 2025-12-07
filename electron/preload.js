const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,
  isElectron: true,

  // App info
  getVersion: () => ipcRenderer.invoke('get-version'),

  // Server info
  getServerPort: () => ipcRenderer.invoke('get-server-port'),

  // Window controls (for custom titlebar if needed)
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),

  // File operations (for future export/import features)
  saveFile: (options) => ipcRenderer.invoke('save-file', options),
  openFile: (options) => ipcRenderer.invoke('open-file', options),

  // Notifications
  showNotification: (title, body) => ipcRenderer.send('show-notification', { title, body })
});

// Log that preload script has loaded
console.log('Electron preload script loaded');
