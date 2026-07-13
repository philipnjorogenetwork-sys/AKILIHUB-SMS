interface ElectronAPI {
  getOnlineStatus: () => Promise<boolean>;
  onNetworkStatusChanged: (callback: (status: { isOnline: boolean }) => void) => void;
  getAppVersion: () => Promise<string>;
  getAppPath: () => Promise<string>;
  getPlatform: () => string;
  isElectron: () => boolean;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

export {};
