# Voter App - Electron Desktop Application

A desktop voting system with EVM-style interface, SQLite database, and native Windows/Mac packaging.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Install SQLite Native Module

On Windows, you may need to install Visual Studio Build Tools or use pre-built binaries:

```bash
npm install better-sqlite3
```

### 3. Run Development

```bash
npm start
```

To run with dev tools:

```bash
npm run dev
```

## Build for Distribution

### Windows (32/64-bit .exe installer + portable)

```bash
npm run build:win
```

Output: `dist/Voter App Setup.exe` and `dist/Voter App.exe` (portable)

### macOS (.dmg + .zip)

```bash
npm run build:mac
```

Output: `dist/Voter App.dmg` and `dist/Voter App.zip`

### Both Platforms

```bash
npm run build:all
```

## File Structure

```
voter/
├── main.js              # Electron main process
├── preload.js           # Secure IPC bridge
├── index.html           # Voter interface
├── app.js               # Voter app logic
├── admin.html           # Admin interface
├── admin-*.js           # Admin features
├── storage.js           # Database abstraction
├── styles.css           # Styling
├── database/
│   ├── db.js           # SQLite operations
│   └── schema.sql      # Database schema
└── assets/             # Symbols and media
```

## Database

SQLite database stored at:
- **Windows**: `%APPDATA%/Voter App/voting.db`
- **macOS**: `~/Library/Application Support/Voter App/voting.db`

### Tables

- `elections` - Election metadata
- `candidates` - Candidate information
- `votes` - Individual vote records
- `admin_settings` - Admin password and settings

## Features

✅ EVM-style voter slip animation  
✅ Machine sound effects  
✅ SQLite persistent storage  
✅ Admin panel for managing candidates/elections  
✅ Real-time results tracking  
✅ Native Windows & Mac installers  
✅ Secure IPC communication  
✅ Responsive UI design  

## Admin Access

Press **Ctrl+Shift+A** (Cmd+Shift+A on Mac) to open the admin panel.

## Troubleshooting

### better-sqlite3 compilation issues

On Windows:
```bash
npm install --build-from-source
```

On macOS:
```bash
brew install python3
npm install better-sqlite3
```

### Database locked error

Close other instances of the app and restart.

### Admin panel not opening

Check that the keyboard shortcut is correctly mapped in your OS.

## Security Notes

- Admin password stored in SQLite (should use proper hashing in production)
- IPC calls validated in main process
- Context isolation enabled to prevent XSS exploitation
- Node integration disabled

## License

School Voting System © 2026
