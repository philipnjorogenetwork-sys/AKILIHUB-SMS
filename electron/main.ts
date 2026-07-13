import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkInternetConnection, monitorNetworkStatus } from './utils/networkUtils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow: BrowserWindow | null = null;
let isOnline = true;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true,
    },
    icon: path.join(__dirname, '../public/logo.png'),
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// Check internet connection and show warning if offline
const checkAndNotifyConnection = async () => {
  const connected = await checkInternetConnection();
  
  if (!connected && isOnline) {
    isOnline = false;
    if (mainWindow) {
      mainWindow.webContents.send('network-status-changed', { isOnline: false });
    }
    showOfflineDialog();
  } else if (connected && !isOnline) {
    isOnline = true;
    if (mainWindow) {
      mainWindow.webContents.send('network-status-changed', { isOnline: true });
    }
  }
};

const showOfflineDialog = () => {
  if (mainWindow) {
    dialog.showMessageBox(mainWindow, {
      type: 'warning',
      title: 'No Internet Connection',
      message: 'You are currently offline. Some features may not work properly.',
      buttons: ['OK'],
    });
  }
};

// IPC Handlers
ipcMain.handle('get-online-status', async () => {
  return checkInternetConnection();
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-app-path', () => {
  return app.getAppPath();
});

// Create application menu
const createMenu = () => {
  const template: any = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About AkiliHub SMS',
          click: () => {
            dialog.showMessageBox(mainWindow!, {
              type: 'info',
              title: 'About AkiliHub SMS',
              message: 'AkiliHub SMS - School Management System',
              detail: `Version ${app.getVersion()}\n\nA comprehensive school management platform for admissions, enrollment, and SMS communications.`,
            });
          },
        },
      ],
    },
  ];

  if (isDev) {
    template.push({
      label: 'Developer',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
      ],
    });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

app.on('ready', () => {
  createWindow();
  createMenu();
  
  // Start monitoring network status
  monitorNetworkStatus(checkAndNotifyConnection);
  
  // Initial check
  checkAndNotifyConnection();
  
  // Check every 10 seconds
  setInterval(checkAndNotifyConnection, 10000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  if (mainWindow) {
    dialog.showErrorBox('Application Error', 'An unexpected error occurred. Please restart the application.');
  }
});

export default mainWindow;
