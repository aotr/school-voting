# Quick Start Guide - Build Voter App for Windows & Mac

## Prerequisites

1. **Node.js & npm** - Download from https://nodejs.org/ (LTS recommended)
2. **Git** (optional) - For version control
3. On **macOS**: Xcode Command Line Tools
   ```bash
   xcode-select --install
   ```

---

## Step 1: Initial Setup

### On macOS/Linux:
```bash
cd /Users/animeshchakrobarty/Documents/voter
chmod +x setup.sh
./setup.sh
```

### On Windows:
```bash
cd C:\Users\YourUsername\Documents\voter
setup.bat
```

This will:
- ✅ Check Node.js installation
- ✅ Install npm dependencies (including better-sqlite3)
- ✅ Create database directory
- ✅ Initialize SQLite schema

---

## Step 2: Test Development Version

```bash
npm start
```

The app should launch with:
- ✅ Voter interface with all animations
- ✅ EVM machine sounds
- ✅ SQLite database storing votes
- ✅ Admin panel accessible via Ctrl+Shift+A (Cmd+Shift+A on Mac)

---

## Step 3: Build Installers

### For Windows (.exe installer + portable)

```bash
npm run build:win
```

**Output:**
- `dist/Voter App Setup.exe` - Installer (recommended for distribution)
- `dist/Voter App.exe` - Portable version (run directly)

**Installation:**
- User runs Setup.exe
- Chooses install location
- Desktop shortcut created automatically
- Database saved to: `C:\Users\[User]\AppData\Roaming\Voter App\voting.db`

---

### For macOS (.dmg installer + zip)

```bash
npm run build:mac
```

**Output:**
- `dist/Voter App.dmg` - Installer (drag & drop to Applications)
- `dist/Voter App.zip` - Archive for distribution

**Installation:**
- User opens Voter App.dmg
- Drags app to Applications folder
- Database saved to: `~/Library/Application Support/Voter App/voting.db`

---

### For Both Platforms

```bash
npm run build:all
```

Builds Windows .exe + macOS .dmg simultaneously.

---

## Step 4: Distribute

After building, you'll have ready-to-distribute files in `dist/`:

### Windows Distribution Package:
```
- Voter App Setup.exe (19-25 MB)
- Voter App.exe (portable, same size)
- System requirements: Windows 7+ (x64)
```

### macOS Distribution Package:
```
- Voter App.dmg (80-100 MB)
- Voter App.zip (same, alternative format)
- System requirements: macOS 10.13+ (Intel or Apple Silicon)
```

---

## File Structure After Build

```
voter/
├── package.json          ← Electron config
├── main.js              ← Desktop app entry
├── preload.js           ← Security bridge
├── index.html           ← Voter UI
├── admin.html           ← Admin UI
├── database/
│   ├── db.js            ← SQLite operations
│   └── schema.sql       ← Database schema
├── dist/                ← Distribution packages (after build)
│   ├── Voter App Setup.exe
│   ├── Voter App.exe
│   ├── Voter App.dmg
│   └── ...
└── node_modules/        ← Dependencies
```

---

## Troubleshooting

### ❌ "better-sqlite3 build failed"

**Windows:**
```bash
npm install --build-from-source
```

**macOS:**
```bash
brew install python3
npm rebuild better-sqlite3
```

### ❌ "Database locked" error

Close all instances of Voter App and restart.

### ❌ Admin panel won't open

Use keyboard shortcut: **Ctrl+Shift+A** (Windows) or **Cmd+Shift+A** (Mac)

### ❌ SQLite version mismatch

Delete node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Database Management

### Reset All Votes (Admin Panel)
- Open Admin Panel (Ctrl+Shift+A)
- Go to "Results" or "Security" tab
- Click "Reset All Votes"

### Database Location
- **Windows**: `%APPDATA%\Voter App\voting.db`
- **macOS**: `~/Library/Application Support/Voter App/voting.db`
- **Linux**: `~/.config/Voter App/voting.db`

### Database Backup
- Copy the `.db` file from the above locations
- Store in safe location

### Database Restore
- Replace the current `.db` file with backup
- Restart application

---

## Publishing for Real Use

### Windows:
1. Sign the .exe with a code signing certificate (optional but recommended)
2. Create installer using the .exe from `dist/`
3. Test on clean Windows machine
4. Distribute via USB, network share, or cloud storage

### macOS:
1. For distribution outside App Store, may need notarization
2. Create .dmg installer for professional distribution
3. Test on different macOS versions (10.13+)

---

## Security Notes

- ✅ No Node.js integration in renderer process
- ✅ Context isolation enabled
- ✅ IPC validation in main process
- ✅ Admin password verification (upgrade to hashing in production)
- ✅ Database file not accessible from web

### For Production:
- Implement bcrypt for password hashing
- Add election security logs
- Enable audit trail for vote records
- Use environment variables for sensitive config
- Add automatic backups

---

## Next Steps

1. ✅ Run `npm start` to test
2. ✅ Run `npm run build:win` for Windows .exe
3. ✅ Run `npm run build:mac` for Mac .dmg
4. ✅ Distribute installers to users
5. ✅ Users run Setup.exe or mount .dmg and drag to Applications

Enjoy! 🎉
