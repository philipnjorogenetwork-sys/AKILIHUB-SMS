# Quick Start: Building AkiliHub SMS as a Desktop App

## What's New

Your React web app is now **Electron-enabled** - meaning users can download and run it as a standalone desktop application without needing a web browser!

## Key Components Added

### 1. **Electron Main Process** (`electron/main.ts`)
- Handles window creation and app lifecycle
- Monitors internet connection
- Shows offline warnings to users
- Integrates with desktop environment

### 2. **Network Monitoring** (`electron/utils/networkUtils.ts`)
- Checks connectivity every 10 seconds
- Uses multiple fallback methods
- Alerts user when connection is lost
- Auto-reconnects when available

### 3. **Network UI Component** (`src/components/NetworkStatusIndicator.tsx`)
- Shows red banner when offline
- Warns users that features may not work
- Auto-hides when reconnected

### 4. **React Hooks** (`src/hooks/useElectron.ts`)
- `useNetworkStatus()` - Get current online status
- `useIsElectron()` - Check if running in Electron
- `useAppVersion()` - Get app version
- Use these in any component!

---

## Development

### Start Dev Environment
```bash
npm run dev:electron
```
This launches:
- Vite dev server on port 5173
- Electron app connected to the dev server
- Hot reload when you save changes

### Normal Development
```bash
npm run dev
# Just the web version (localhost:5173)
```

---

## Building for Distribution

### Build for Windows Only
```bash
npm run electron:build
```
Creates:
- `dist-electron/AkiliHub-SMS-Setup.exe` - Full installer
- `dist-electron/AkiliHub-SMS-${version}.exe` - Portable (no installation)

### Build for All Platforms
```bash
npm run electron:build:all
```
Creates installers for Windows, macOS, and Linux

### Build Portable EXE (One-File)
```bash
npm run electron:build:portable
```
Single executable file - no installation needed!

---

## Distribution Workflow

### 1. Build the App
```bash
npm run electron:build
```

### 2. Find Installers
Look in `dist-electron/` for:
- `.exe` files (Windows)
- `.dmg` files (macOS)
- `.AppImage` files (Linux)

### 3. Upload to Server
```bash
# Upload to your server/cloud storage
scp dist-electron/AkiliHub-SMS-Setup.exe user@server:/downloads/
```

### 4. Create Download Links
Share the download URLs with users

### 5. Users Download and Install
Users click the link, download the installer, and run it

---

## File Structure

```
akilihub-sms/
├── electron/                    # ← NEW: Electron main process
│   ├── main.ts                  # App entry point
│   ├── preload.ts               # Secure IPC bridge
│   └── utils/
│       └── networkUtils.ts      # Network checking
├── src/
│   ├── components/
│   │   └── NetworkStatusIndicator.tsx  # ← NEW: Offline warning
│   ├── hooks/
│   │   └── useElectron.ts       # ← NEW: Electron React hooks
│   ├── types/
│   │   └── electron.d.ts        # ← NEW: TypeScript definitions
│   └── App.tsx                  # Updated with NetworkStatusIndicator
├── public/                      # App icons here
├── electron-builder.json        # ← NEW: Packaging config
├── package.json                 # Updated with scripts & deps
└── vite.config.ts              # Updated for Electron

```

---

## Key Scripts Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Web dev server only (port 5173) |
| `npm run dev:electron` | Web dev server + Electron |
| `npm run electron:build` | Build for Windows |
| `npm run electron:build:all` | Build for Windows/Mac/Linux |
| `npm run electron:build:portable` | Single .exe file |
| `npm run build` | Build web assets only |

---

## Features

### ✅ Implemented
- Network connection monitoring
- Offline detection and warnings
- Windows/macOS/Linux installers
- Development environment setup
- IPC communication bridge

### 🔄 Ready for Future Enhancement
- Auto-update capability (infrastructure in place)
- Local data caching
- System tray integration
- Biometric login
- Offline mode (data syncing)

---

## Environment Variables

No additional environment variables needed for basic functionality.

For advanced features like auto-updates, you can configure:
```
GITHUB_OWNER=your-org
GITHUB_REPO=akilihub-sms
```

---

## Important Notes

⚠️ **Users Must Have Internet Connection**
- The app requires active data network to function
- Network status is monitored and displayed

🔒 **Security Features**
- Context isolation enabled
- No Node.js access from renderer
- Secure IPC communication
- Sandbox enabled

📱 **Works on Windows, macOS, Linux**
- Same codebase for all platforms
- Platform-specific installers

---

## Next Steps

1. **Test locally**: `npm run dev:electron`
2. **Build for distribution**: `npm run electron:build`
3. **Upload installers** to your server
4. **Share download links** with users
5. **Users download and run** - that's it!

---

## Troubleshooting

### "Module not found" errors
```bash
npm install
```

### Port 5173 already in use
```bash
# Kill the process on that port
# Or use a different port in vite.config.ts
```

### Build fails
- Ensure all dependencies installed: `npm install`
- Check Node.js version: `node --version` (should be 16+)
- Clear cache: `rm -rf node_modules dist dist-electron && npm install`

### App won't start in Electron
- Check that Vite dev server is running (port 5173)
- Check browser console for React errors
- Check terminal for Electron errors

---

## See Also

- `ELECTRON_DEPLOYMENT_GUIDE.md` - User and admin guide
- `NOTIFICATION_SYSTEM_GUIDE.md` - App features
- `electron-builder.json` - Packaging configuration

---

**Your app is now ready to be distributed to users as a standalone desktop application!** 🚀
