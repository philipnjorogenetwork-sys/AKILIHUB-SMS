import { contextBridge, ipcRenderer } from 'electron';

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // Network status
  getOnlineStatus: () => ipcRenderer.invoke('get-online-status'),
  onNetworkStatusChanged: (callback: (status: { isOnline: boolean }) => void) => {
    ipcRenderer.on('network-status-changed', (_, status) => callback(status));
  },
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  
  // Platform info
  getPlatform: () => process.platform,
  isElectron: () => true,
});

export {};
