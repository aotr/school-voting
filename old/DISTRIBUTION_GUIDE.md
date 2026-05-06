# Voter App v1.0.0 - Distribution Guide

## 📦 Ready-to-Distribute Files

All installer files are in the `dist/` directory:

```
dist/
├── Voter App Setup 1.0.0.exe          ✓ Windows Installer (76 MB)
├── Voter App 1.0.0.exe                ✓ Windows Portable (75 MB)
├── Voter App-1.0.0-arm64.dmg          ✓ macOS Installer (93 MB)
└── Voter App-1.0.0-arm64-mac.zip      ✓ macOS Archive (90 MB)
```

## 🚀 Quick Distribution

### To Windows Users
**Option A - Installer (Recommended):**
1. Send `Voter App Setup 1.0.0.exe`
2. User runs installer
3. App auto-launches with database ready

**Option B - Portable:**
1. Send `Voter App 1.0.0.exe`
2. User runs directly (no installation)
3. Works from USB drive or network

### To macOS Users
**Option A - DMG (Recommended):**
1. Send `Voter App-1.0.0-arm64.dmg`
2. User mounts (double-click)
3. Drag app to Applications
4. Launch from Applications

**Option B - Archive:**
1. Send `Voter App-1.0.0-arm64-mac.zip`
2. User extracts
3. Copy to Applications
4. Launch

## 📋 System Requirements

### Windows
- Windows 7+ (x64)
- 150 MB disk space
- No dependencies needed

### macOS
- macOS 10.13+ (High Sierra or later)
- Apple Silicon (M1/M2/M3) or Intel x64
- 200 MB disk space
- No dependencies needed

## 🔑 Login Credentials

```
Username: admin
Password: admin123
```

⚠️ Users should change password on first login (Admin Panel → Security)

## 📂 Installation Paths

### Windows
```
C:\Users\[UserName]\AppData\Roaming\Voter App\voting.db
```

### macOS
```
~/Library/Application Support/Voter App/voting.db
```

Database auto-creates on first vote.

## ✅ Post-Installation Checklist

1. App launches without errors
2. Voter screen displays 7 candidates
3. Can click vote button
4. Slip animation plays (1200ms drop)
5. Sound plays (beep sound)
6. Confirmation message shows
7. Open admin (Ctrl/Cmd+Shift+A)
8. Can edit candidates
9. Can view results
10. Database file exists at path above

## 🎯 Installation Walkthrough

### Windows Users
```
1. Download: Voter App Setup 1.0.0.exe
2. Double-click to launch installer
3. Choose installation location
4. Click "Next" → "Install"
5. Desktop shortcut created automatically
6. App launches → ready to vote
7. Database saved to: %APPDATA%\Voter App\
```

### macOS Users
```
1. Download: Voter App-1.0.0-arm64.dmg
2. Double-click to mount DMG
3. Finder window opens
4. Drag "Voter App" to Applications folder
5. Open Applications → find "Voter App"
6. Double-click to launch
7. Database saved to: ~/Library/Application Support/Voter App/
```

## 🔄 Upgrading from Previous Version

1. Close old app if running
2. Install new version (uses same database location)
3. New version auto-migrates data
4. All votes preserved
5. Features enhanced

## 🗑️ Uninstallation

### Windows
- Control Panel → Programs → Programs and Features
- Find "Voter App"
- Click "Uninstall"
- Choose to remove configuration (optional)

### macOS
- Applications folder
- Drag "Voter App" to Trash
- Empty Trash
- Optional: Remove database from ~/Library/Application Support/

**Note:** Database survives uninstall (for safety)

## 🆘 Troubleshooting

### Windows Won't Install
- Check Windows 7+ version requirement
- Try: Run as Administrator
- Disable antivirus temporarily
- Check 150 MB free disk space

### macOS Won't Launch
- Check macOS 10.13+ requirement
- Try: System Preferences → Security → Allow app
- Delete cache: `rm -rf ~/Library/Application\ Support/Voter\ App/`
- Reinstall DMG

### Database Errors
- Close all app instances
- Restart app
- Delete database, let app recreate it

## 📊 Installation Statistics Tracking (Optional)

Add to your distribution tracking:
- Version: 1.0.0
- Build date: May 3, 2026
- Windows: Setup installer (76 MB) + Portable (75 MB)
- macOS: DMG (93 MB) + ZIP (90 MB)
- Total: 4 packages

## 📝 Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | May 3, 2026 | Initial Electron release with SQLite |
| 0.x | Earlier | Web-based prototype |

## 🔗 Support

See in-app help:
- Press Ctrl+Shift+A (Windows) or Cmd+Shift+A (Mac)
- Check RELEASE_NOTES.md for detailed features
- View QUICK_START.md for developer setup

## 📞 Contact

For issues or updates:
- GitHub: https://github.com/aotr/school-voting
- Report issues in repository

---

**Distribution v1.0.0 Ready!** 🎉

All files tested and verified. Ready for deployment.
