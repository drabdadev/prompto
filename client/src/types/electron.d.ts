export interface ElectronAPI {
  platform: string;
  isElectron: boolean;
  getVersion: () => Promise<string>;
  getServerPort: () => Promise<number>;
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  saveFile: (options: unknown) => Promise<unknown>;
  openFile: (options: unknown) => Promise<unknown>;
  showNotification: (title: string, body: string) => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
