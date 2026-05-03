# School Voting System Prototype

This folder now contains a portable offline voting UI inspired by an EVM machine.

## Files

- `index.html` - main voting screen
- `admin.html` - admin login and management panel
- `styles.css` - EVM-style layout, states, and animation
- `admin.css` - admin page layout and form styling
- `app.js` - vote interaction, beep, lock, reset, and sample candidate config
- `admin.js` - admin login, candidate editing, password change, and export flow
- `storage.js` - shared browser-side prototype storage for voting and admin pages
- `assets/symbols/` - sample relative symbol files
- `database/` - placeholder location for `voting.db`
- `database/schema.sql` - starter SQLite tables for elections, candidates, votes, and admin settings

## Current behavior

- Large candidate symbols
- Round one-click vote buttons
- Beep on vote
- Successful vote message
- Selected row turns green
- Other buttons lock immediately
- Reset button for next student

## Admin access

- Open `admin.html`
- Default password: `admin123`
- From there you can change election title, year, open or close voting, edit candidates, change password, and export a backup

## Prototype note

The new admin page currently stores data in browser local storage so the static prototype can work immediately with no backend.
For true machine-to-machine portability of live admin data and vote counts, the next step is still to connect both pages to `database/voting.db` through Electron, Tauri, or another local desktop wrapper.

## Portable database setup

Use this structure for deployment:

```text
VotingApp/
├── index.html
├── styles.css
├── app.js
├── database/
│   └── voting.db
└── assets/
    └── symbols/
```

## Next backend step

To make the vote persist permanently, connect the click handler in `app.js` to a small desktop wrapper such as Electron or Tauri, then write votes into `database/voting.db` using relative paths only.
