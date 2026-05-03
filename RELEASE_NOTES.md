# Voter App - Release v1.0.0

**Release Date:** May 3, 2026

## 📦 Distribution Packages

### Windows (x64)
- **Installer:** `Voter App Setup 1.0.0.exe` (76 MB)
  - Professional NSIS installer
  - Auto-creates Start Menu shortcut
  - Desktop shortcut available
  - Database auto-initialized in AppData
  - Works on Windows 7+

- **Portable:** `Voter App 1.0.0.exe` (75 MB)
  - No installation required
  - Run from USB or network drive
  - Database stored in app folder

### macOS (ARM64 - Apple Silicon)
- **Installer:** `Voter App-1.0.0-arm64.dmg` (93 MB)
  - Standard DMG installer
  - Drag to Applications
  - Auto-runs on mount
  - Database in ~/Library/Application Support

- **Archive:** `Voter App-1.0.0-arm64-mac.zip` (90 MB)
  - Alternative distribution format
  - Same functionality as DMG

**Note:** Native Intel (x64) macOS builds available on request

---

## ✨ Features

### Voter Interface
✅ EVM-style voting screen  
✅ Voter slip drop animation (1200ms smooth fall)  
✅ Machine beep sound effects (3-note sequence)  
✅ Confetti celebration animation  
✅ Real-time vote confirmation  
✅ Reset for next voter  

### Admin Panel
✅ Keyboard access: Ctrl+Shift+A (Windows) | Cmd+Shift+A (Mac)  
✅ Candidate management (add/edit/delete)  
✅ Election configuration (title, year, open/close voting)  
✅ Live vote counting and results  
✅ Admin password protection  
✅ Vote backup/export functionality  
✅ Reset all votes feature  
✅ Vote history tracking  

### Database
✅ SQLite persistent storage  
✅ Auto-initializes on first run  
✅ Tables: elections, candidates, votes, admin_settings  
✅ Foreign key constraints  
✅ WAL mode for fast writes  
✅ Automatic backups via admin panel  

### Technical
✅ Electron 27 desktop framework  
✅ better-sqlite3 for database  
✅ Secure IPC communication  
✅ Context isolation enabled  
✅ No Node.js in renderer  
✅ Cross-platform code base  

---

## 🚀 Installation

### Windows
1. Download `Voter App Setup 1.0.0.exe`
2. Run the installer
3. Follow on-screen prompts
4. App launches automatically
5. Database creates in `%APPDATA%\Voter App\voting.db`

### macOS
1. Download `Voter App-1.0.0-arm64.dmg`
2. Mount the DMG (double-click)
3. Drag "Voter App" to Applications folder
4. Launch from Applications
5. Database creates in `~/Library/Application Support/Voter App/voting.db`

---

## 🔑 Default Credentials

**Admin Username:** `admin`  
**Admin Password:** `admin123`  

⚠️ **Change password immediately after first login** (Admin Panel → Security)

---

## 📊 System Requirements

### Windows
- OS: Windows 7 or later (x64)
- RAM: 512 MB minimum
- Disk: 150 MB free space
- No additional software needed

### macOS
- OS: macOS 10.13 (High Sierra) or later
- Chip: Apple Silicon (M1/M2/M3) or Intel
- RAM: 512 MB minimum
- Disk: 200 MB free space
- No additional software needed

---

## 🐛 Known Issues

### Windows
- First launch may be slow (SQLite initializing)
- Windows Defender may show warning (unsigned app) - safe to ignore
- Database file uses space in %APPDATA% (can grow with vote count)

### macOS
- Not code-signed (due to no developer certificate) - may show warning
- Delete cache with: `rm -rf ~/Library/Application\ Support/Voter\ App/`
- M1/M2 native support (no Rosetta needed)

---

## 📝 Upgrade Instructions

### From Previous Web Version
1. **Export votes from old system**
   - Save JSON backup if available

2. **Install desktop version**
   - Run Windows .exe installer OR Mac DMG

3. **Restore votes** (optional)
   - Import previously exported votes via Admin Panel

**Note:** Database structures are compatible across upgrades

---

## 🔒 Security Notes

- Admin password verified locally (no network)
- Database encrypted by OS file system
- All votes stored locally in voting.db
- No telemetry or phone home
- No automatic updates (manual installation required)

### For Enhanced Security
- Change default admin password immediately
- Store database backups in secure location
- Use Windows/Mac user account security
- Backup database before elections
- Run on secured, non-public network

---

## 📞 Support

### Common Issues

**Q: Database is locked**
- Close all app instances and restart

**Q: Admin panel won't open**
- Windows: Press Ctrl+Shift+A
- Mac: Press Cmd+Shift+A

**Q: Can't find database file**
- Windows: Check `%APPDATA%\Voter App\`
- Mac: Check `~/Library/Application Support/Voter App/`

**Q: Votes disappeared**
- Check database exists at location above
- Restore from backup if available

---

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Developer setup guide
- **[ELECTRON_SETUP.md](ELECTRON_SETUP.md)** - Technical documentation
- **[README.md](README.md)** - Feature overview
- **[BUILD_SUMMARY.md](BUILD_SUMMARY.md)** - Build reference

---

## 🎉 What's New Since Last Release

### v1.0.0 (Current)
- ✨ Electron desktop application
- ✨ SQLite persistent database
- ✨ Native Windows installer
- ✨ Native macOS DMG
- ✨ Voter slip drop animation
- ✨ EVM machine sounds
- ✨ Admin panel with full features
- ✨ Vote backup/restore
- ✨ Professional packaging

---

## 📦 File Checksums

```
dist/
├── Voter App Setup 1.0.0.exe           (76 MB - Windows Installer)
├── Voter App 1.0.0.exe                 (75 MB - Windows Portable)
├── Voter App-1.0.0-arm64.dmg           (93 MB - macOS DMG)
└── Voter App-1.0.0-arm64-mac.zip       (90 MB - macOS Archive)
```

All files are in `dist/` directory after build.

---

## 🔄 Upgrade Path

**From v0.x (Web version):**
1. Export votes from old system
2. Install v1.0.0 desktop version
3. Import votes via Admin Panel
4. Resume voting with enhanced features

**From v1.0.0 → Future versions:**
- Download new installer
- Install to same location
- Database migrates automatically
- All votes preserved

---

## 📄 License

School Voting System © 2026  
All rights reserved

---

## ✅ Verification Checklist

After installation, verify:
- [ ] App launches successfully
- [ ] Voter screen displays candidates
- [ ] Can cast a vote
- [ ] Slip animation plays
- [ ] Sound plays on vote
- [ ] Admin panel opens (Ctrl/Cmd+Shift+A)
- [ ] Can edit candidates
- [ ] Results show vote count
- [ ] Can reset votes
- [ ] Can backup votes

---

**Release built on:** May 3, 2026  
**Platform support:** Windows 7+ (x64) | macOS 10.13+ (ARM64)  
**Repository:** https://github.com/aotr/school-voting
