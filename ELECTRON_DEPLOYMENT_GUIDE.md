# AkiliHub SMS Desktop Application - Deployment Guide

## Overview

AkiliHub SMS is now available as a downloadable desktop application for Windows, macOS, and Linux. Users can download and install it without needing a web browser.

## Features

✅ **Offline Awareness**: The app monitors internet connection and warns users when offline  
✅ **Standalone Installation**: Single-click installer for easy deployment  
✅ **Auto-Updates Ready**: Infrastructure in place for future auto-update capabilities  
✅ **Data Network Only**: App requires active data connection to function  
✅ **Cross-Platform**: Works on Windows, macOS, and Linux  

---

## For End Users

### Installation

#### Windows
1. Download `AkiliHub-SMS-Setup.exe` or `AkiliHub-SMS-${version}.exe` from the download link
2. Run the installer and follow the prompts
3. The app will be installed to your Program Files directory
4. A desktop shortcut and Start Menu entry will be created

#### macOS
1. Download `AkiliHub-SMS-${version}.dmg`
2. Open the DMG file
3. Drag the AkiliHub SMS app to the Applications folder
4. Launch from Applications

#### Linux
1. Download `AkiliHub-SMS-${version}.AppImage`
2. Make it executable: `chmod +x AkiliHub-SMS-${version}.AppImage`
3. Double-click to run or execute from terminal

### Network Requirements

- **Active Data Connection Required**: The application needs internet access to:
  - Authenticate users
  - Sync student/staff data
  - Send notifications
  - Access school management features

- **Network Status Indicator**: 
  - A banner appears at the top if you lose internet connection
  - The app will attempt to reconnect automatically every 10 seconds
  - Reconnect to continue using the app

### Using the App

1. **Launch**: Double-click the AkiliHub SMS application
2. **Login**: Enter your credentials (student, teacher, admin, etc.)
3. **Dashboard**: Navigate to your role-specific dashboard
4. **Network Issues**: If you see the offline banner, check your internet connection

---

## For Developers / System Administrators

### Building the Application

#### Prerequisites
- Node.js 16+ and npm or bun
- Git

#### Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd akilihub-sms

# Install dependencies
npm install
# or
bun install

# Start development server with Electron
npm run dev:electron
```

This will:
1. Start the Vite development server on port 5173
2. Open the Electron app connected to the dev server
3. Enable hot reload for React changes

#### Building Installers

**Windows (NSIS Installer + Portable)**
```bash
npm run electron:build
```

**All Platforms**
```bash
npm run electron:build:all
```

**Portable EXE (No Installation)**
```bash
/'
```

### Build Outputs

After building, find installers in the `dist-electron/` directory:

- `AkiliHub-SMS-Setup.exe` - NSIS installer for Windows
- `AkiliHub-SMS-${version}.exe` - Portable executable
- `AkiliHub-SMS-${version}.dmg` - macOS installer
- `AkiliHub-SMS-${version}.AppImage` - Linux AppImage

### Distribution

#### Hosting Installers
1. Upload installers to your server/cloud storage
2. Create download links for users
3. (Optional) Set up auto-update server with electron-updater

#### Auto-Update Setup (Future Enhancement)

The infrastructure is ready for auto-updates. To enable:

1. Set up a GitHub release repository
2. Update `electron-builder.json`:
```json
{
  "publish": {
    "provider": "github",
    "owner": "your-org",
    "repo": "akilihub-sms"
  }
}
```

3. Implement electron-updater in the main process

### Code Structure

```
electron/
├── main.ts              # Electron main process
├── preload.ts           # Secure IPC bridge
└── utils/
    └── networkUtils.ts  # Network connectivity checking

src/
├── components/
│   └── NetworkStatusIndicator.tsx  # UI for network warnings
├── hooks/
│   └── useElectron.ts  # React hooks for Electron APIs
└── types/
    └── electron.d.ts   # TypeScript definitions
```

### Network Monitoring

The app automatically:
- Checks internet connection every 10 seconds
- Uses multiple fallback methods (Google, Cloudflare, DNS)
- Shows offline warnings to users
- Automatically reconnects when connection is restored

### Configuration Files

- **electron-builder.json**: Package and installer configuration
- **vite.config.ts**: Build configuration for web assets
- **package.json**: Scripts and dependencies

---

## Troubleshooting

### App Won't Start
- Ensure you have an active internet connection
- Check that your firewall isn't blocking the app
- Try reinstalling the application

### Network Connection Issues
- Check your internet connection
- Try a different network (mobile hotspot, different WiFi)
- The app will reconnect automatically within 10 seconds

### Installer Won't Run (Windows)
- Try running as Administrator
- Disable antivirus temporarily (may flag as unknown developer)
- Download from official source only

### App Crashes
- Check available disk space
- Update to the latest version
- Contact support with error details

---

## Security Notes

✅ **Context Isolation**: Electron context isolation enabled for security  
✅ **Preload Scripts**: IPC communication restricted through preload  
✅ **No Node Integration**: Node.js APIs not exposed to renderer  
✅ **Sandbox Enabled**: Renderer process runs in isolated sandbox  

---

## Support

- **Documentation**: See NOTIFICATION_SYSTEM_GUIDE.md for app features
- **Issues**: Report bugs through the official support channel
- **Updates**: Check for updates regularly from the download portal

---

## Version History

- **v0.0.1** - Initial desktop application release
  - Network monitoring
  - Offline detection
  - Multi-platform support

---

## Future Enhancements

- [ ] Auto-update capability
- [ ] Local data caching for offline features
- [ ] System tray icon
- [ ] Biometric login support
- [ ] Email signature integration
- [ ] SMS template customization
