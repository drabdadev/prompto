import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initElectronApi } from './services/api'

// Check if running in Electron
const isElectron = window.electronAPI?.isElectron ?? false;

// Register service worker for PWA (not in Electron)
if (!isElectron && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration failed - ignore silently
    });
  });
}

// Initialize app
async function init() {
  // Initialize Electron API if in Electron environment
  if (isElectron) {
    await initElectronApi();
    // Add class to html and body for Electron-specific styling (e.g., traffic lights spacing, elastic scroll)
    document.documentElement.classList.add('electron');
    document.body.classList.add('electron');
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

init();
