import { useEffect, useState } from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useNetworkStatus, useIsElectron } from '@/hooks/useElectron';

export const NetworkStatusIndicator = () => {
  const { isOnline, isChecking } = useNetworkStatus();
  const isElectron = useIsElectron();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!isOnline && isElectron) {
      setShowWarning(true);
      // Auto-hide after 5 seconds if connection is restored
      const timer = setTimeout(() => {
        if (isOnline) {
          setShowWarning(false);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, isElectron]);

  // Only show in Electron app and when offline or checking
  if (!isElectron || isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-50 border-b border-red-200 p-3 z-50 flex items-center gap-3">
      <WifiOff className="w-5 h-5 text-red-600 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-red-900">
          No Internet Connection
        </p>
        <p className="text-xs text-red-700 mt-0.5">
          {isChecking ? 'Checking connection...' : 'Please check your network connection. Some features may not work properly.'}
        </p>
      </div>
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
    </div>
  );
};

export const NetworkStatusBadge = () => {
  const { isOnline } = useNetworkStatus();
  const isElectron = useIsElectron();

  if (!isElectron) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs">
      {isOnline ? (
        <>
          <Wifi className="w-3 h-3 text-green-600" />
          <span className="text-green-700">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3 text-red-600" />
          <span className="text-red-700">Offline</span>
        </>
      )}
    </div>
  );
};

export default NetworkStatusIndicator;
