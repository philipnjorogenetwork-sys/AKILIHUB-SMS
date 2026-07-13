import { useEffect, useState } from 'react';

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

/**
 * Hook to check if running in Electron environment
 */
export const useIsElectron = (): boolean => {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    setIsElectron(!!window.electron?.isElectron?.());
  }, []);

  return isElectron;
};

/**
 * Hook to monitor network status
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!window.electron) {
      // For web version, use browser API
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    // For Electron version
    const checkStatus = async () => {
      setIsChecking(true);
      try {
        const status = await window.electron!.getOnlineStatus();
        setIsOnline(status);
      } catch (error) {
        console.error('Error checking online status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    // Initial check
    checkStatus();

    // Listen for status changes from main process
    window.electron!.onNetworkStatusChanged(({ isOnline }) => {
      setIsOnline(isOnline);
    });
  }, []);

  return { isOnline, isChecking };
};

/**
 * Hook to get app version
 */
export const useAppVersion = () => {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    if (window.electron?.getAppVersion) {
      window.electron.getAppVersion().then(setVersion).catch(console.error);
    }
  }, []);

  return version;
};

/**
 * Hook to get app path
 */
export const useAppPath = () => {
  const [appPath, setAppPath] = useState<string | null>(null);

  useEffect(() => {
    if (window.electron?.getAppPath) {
      window.electron.getAppPath().then(setAppPath).catch(console.error);
    }
  }, []);

  return appPath;
};
