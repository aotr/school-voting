# School Voting System - Desktop Edition

A professional desktop voting application with EVM-style interface, SQLite database, and native installers for Windows and macOS.

## 🚀 Quick Start

See **[QUICK_START.md](QUICK_START.md)** for step-by-step build instructions.

### TL;DR:
```bash
npm install
npm start                  # Test development version
npm run build:win         # Windows .exe installer
npm run build:mac         # macOS .dmg installer
npm run build:all         # Both platforms
```

---

## ✨ Features

✅ **EVM-Style Interface**
- Voter slip drop animation into box
- Machine beep sound effects
- Green selection feedback
- Instant vote confirmation

✅ **SQLite Database**
- Persistent vote storage
- Candidate management
- Election configuration
- Admin settings

✅ **Native Desktop Apps**
- Windows: Installer + Portable .exe
- macOS: DMG installer + ZIP archive
- Professional UX with desktop integration

✅ **Admin Panel**
- Candidate editing
- Election management
- Vote results tracking
- Backup & restore
- Password protection

✅ **Security**
- Context isolation
- No Node.js in UI
- Secure IPC communication
- Admin authentication

---

## 📁 File Structure

```
voter/
├── main.js                 # Electron main process
├── preload.js             # IPC security bridge
├── index.html             # Voter interface
├── app.js                 # Voter logic + animations
├── admin.html             # Admin login & panel
├── admin-*.js             # Admin features
├── storage.js             # Database abstraction
├── styles.css             # Voter UI styling
├── admin.css              # Admin UI styling
├── database/
│   ├── db.js              # SQLite operations
│   └── schema.sql         # Database schema
├── assets/symbols/        # Candidate symbols (SVG)
├── package.json           # Electron config
├── QUICK_START.md         # Build instructions
├── ELECTRON_SETUP.md      # Detailed setup
└── dist/                  # Installers (after build)
    ├── Voter App Setup.exe
    ├── Voter App.dmg
    └── ...
```

---

## 📦 Built With

- **Electron 27** - Desktop app framework
- **better-sqlite3** - Persistent database
- **electron-builder** - Native installers
- **HTML/CSS/JavaScript** - UI & animations

---

## 🎯 Admin Access

**Keyboard Shortcut:**
- Windows: `Ctrl + Shift + A`
- macOS: `Cmd + Shift + A`

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

---

## 🛠️ Development

### Install Dependencies
```bash
npm install
```

### Run Development Version
```bash
npm start
npm run dev    # With developer tools
```

### Build for Distribution

**Windows:**
```bash
npm run build:win
```
Output: `Voter App Setup.exe` (installer) + `Voter App.exe` (portable)

**macOS:**
```bash
npm run build:mac
```
Output: `Voter App.dmg` (installer) + `Voter App.zip` (archive)

---

## 💾 Database

### Location
- **Windows**: `%APPDATA%\Voter App\voting.db`
- **macOS**: `~/Library/Application Support/Voter App/voting.db`

### Schema
- `elections` - Election metadata
- `candidates` - Candidate info + vote counts
- `votes` - Individual vote records
- `admin_settings` - Admin config

### Reset Votes
Use admin panel → Results → "Reset All Votes"

---

## ⚙️ Customization

### Change Candidates
1. Open Admin Panel (Ctrl/Cmd+Shift+A)
2. Go to "Candidates" tab
3. Edit name, tagline, and symbol
4. Save changes (auto-syncs to voting UI)

### Change Admin Password
1. Admin Panel → "Security"
2. Enter current password
3. Enter new password
4. Save

### Add/Remove Candidates
Admin Panel → "Candidates" → "Add New Candidate"

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `better-sqlite3` won't install | `npm install --build-from-source` |
| Database locked error | Close app instances & restart |
| Admin panel won't open | Press Ctrl+Shift+A (Cmd+Shift+A Mac) |
| SQLite version mismatch | `rm -rf node_modules && npm install` |

See **[ELECTRON_SETUP.md](ELECTRON_SETUP.md)** for more help.

---

## 📋 Voters See

- **Candidate list** with symbols
- **One-click vote button**
- **Green selection highlight**
- **Voter slip drops into box** ✨
- **Machine beep sound** 🔊
- **Confirmation message**
- **Reset button for next voter**

---

## 👨‍💼 Admin Can

- ✏️ Edit candidates (name, tagline, symbol)
- 🗳️ Create elections
- 🔒 Open/close voting
- 📊 View live results
- 🔑 Change admin password
- 💾 Backup votes to file
- ♻️ Reset all votes
- 🔍 View vote history

---

## 🔒 Security Notes

**Current:**
- ✅ Admin password verification
- ✅ Context isolation enabled
- ✅ IPC request validation
- ✅ No eval() or dangerous APIs

**Production Recommendations:**
- 🔐 Hash admin password with bcrypt
- 📜 Enable audit logging
- 🔄 Implement vote integrity checks
- 🛡️ Add encryption for database backups

---

## 📦 Distribution

After building:

1. **Windows Users:**
   - Distribute `Voter App Setup.exe`
   - Users run installer
   - App launches with database ready

2. **Mac Users:**
   - Distribute `Voter App.dmg`
   - Users drag app to Applications
   - Database syncs to ~/Library/Application Support

---

## 📝 License

School Voting System © 2026

---

## ❓ Questions?

Refer to:
- **[QUICK_START.md](QUICK_START.md)** - Build & distribution guide
- **[ELECTRON_SETUP.md](ELECTRON_SETUP.md)** - Detailed technical setup

    └── symbols/
```

## Next backend step

To make the vote persist permanently, connect the click handler in `app.js` to a small desktop wrapper such as Electron or Tauri, then write votes into `database/voting.db` using relative paths only.
