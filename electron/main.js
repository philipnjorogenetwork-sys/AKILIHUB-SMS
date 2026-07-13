const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
let mainWindow = null;
let backendProcess = null;
let backendReady = false;
let shutdownRequested = false;

function getUserDataPath() {
  return app.getPath('userData');
}

function getBackendEnv() {
  const env = { ...process.env };
  env.NODE_ENV = process.env.NODE_ENV || 'production';
  env.PORT = '5000';
  env.HOST = '127.0.0.1';
  env.DB_PATH = path.join(getUserDataPath(), 'akilihub.sqlite');
  env.UPLOAD_DIR = path.join(getUserDataPath(), 'uploads');
  env.LOG_FILE_PATH = path.join(getUserDataPath(), 'logs');
  env.CORS_ORIGINS = 'http://127.0.0.1:5000,http://localhost:5000';
  env.JWT_SECRET = env.JWT_SECRET || 'desktop-secret';
  return env;
}

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function startBackend() {
  const backendEntry = path.join(__dirname, '../backend/dist/server.js');
  if (!fs.existsSync(backendEntry)) {
    dialog.showErrorBox('Backend not built', 'The backend build is missing. Run npm run build in the backend folder first.');
    app.quit();
    return;
  }

  ensureDirectory(getUserDataPath());
  ensureDirectory(path.join(getUserDataPath(), 'uploads'));
  ensureDirectory(path.join(getUserDataPath(), 'logs'));

  backendProcess = spawn(process.execPath, [backendEntry], {
    cwd: path.join(__dirname, '..'),
    env: getBackendEnv(),
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  backendProcess.stdout.on('data', (chunk) => {
    process.stdout.write(`[backend] ${chunk}`);
  });

  backendProcess.stderr.on('data', (chunk) => {
    process.stderr.write(`[backend] ${chunk}`);
  });

  backendProcess.on('exit', (code) => {
    if (!shutdownRequested) {
      console.error(`Backend exited unexpectedly with code ${code}`);
      if (mainWindow) {
        dialog.showErrorBox('Backend crashed', 'The local backend process stopped unexpectedly.');
      }
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 760,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    icon: path.join(__dirname, '../public/icon.png'),
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  const startUrl = isDev
    ? 'http://127.0.0.1:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [{ label: 'Exit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }],
    },
    {
      label: 'Help',
      submenu: [{ label: 'About AkiliHub SMS', click: () => dialog.showMessageBox({ title: 'About AkiliHub SMS', message: 'AkiliHub SMS Desktop' }) }],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function shutdownBackend() {
  shutdownRequested = true;
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill('SIGTERM');
  }
}

app.whenReady().then(() => {
  createMenu();
  startBackend();
  createWindow();
});

app.on('before-quit', () => {
  shutdownBackend();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('get-app-version', () => app.getVersion());
ipcMain.handle('get-app-path', () => app.getAppPath());
