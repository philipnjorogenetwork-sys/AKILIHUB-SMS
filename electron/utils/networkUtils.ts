import { net } from 'electron';

let isConnected = true;
let checkPromise: Promise<boolean> | null = null;

/**
 * Check if internet connection is available
 * Uses multiple fallback methods to ensure reliability
 */
export const checkInternetConnection = async (): Promise<boolean> => {
  // Prevent multiple simultaneous checks
  if (checkPromise) {
    return checkPromise;
  }

  checkPromise = (async () => {
    try {
      return await Promise.race([
        checkGoogle(),
        checkCloudflare(),
        checkDNS(),
      ]).then(() => true).catch(() => false);
    } catch (error) {
      console.error('Network check error:', error);
      return false;
    } finally {
      checkPromise = null;
    }
  })();

  return checkPromise;
};

/**
 * Check Google's DNS
 */
const checkGoogle = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = net.request('https://www.google.com');
    
    request.on('response', (response) => {
      if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302) {
        resolve();
      } else {
        reject(new Error(`Status: ${response.statusCode}`));
      }
    });
    
    request.on('error', reject);
    request.on('abort', reject);
    
    request.setTimeout(3000);
    request.end();
  });
};

/**
 * Check Cloudflare DNS
 */
const checkCloudflare = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = net.request('https://1.1.1.1');
    
    request.on('response', (response) => {
      if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302) {
        resolve();
      } else {
        reject(new Error(`Status: ${response.statusCode}`));
      }
    });
    
    request.on('error', reject);
    request.on('abort', reject);
    
    request.setTimeout(3000);
    request.end();
  });
};

/**
 * Check using DNS lookup
 */
const checkDNS = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = net.request('https://dns.google');
    
    request.on('response', (response) => {
      if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302) {
        resolve();
      } else {
        reject(new Error(`Status: ${response.statusCode}`));
      }
    });
    
    request.on('error', reject);
    request.on('abort', reject);
    
    request.setTimeout(3000);
    request.end();
  });
};

/**
 * Monitor network status changes
 */
export const monitorNetworkStatus = (callback: () => void) => {
  // Online event
  if (typeof window !== 'undefined') {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
  }
};

/**
 * Get current connection status from cache
 */
export const isOnline = (): boolean => {
  return isConnected;
};

/**
 * Set connection status
 */
export const setConnectionStatus = (status: boolean) => {
  isConnected = status;
};
