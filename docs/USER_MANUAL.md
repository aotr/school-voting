# User Manual & Administrative Guide
## School Voting System - Desktop Edition

**Version:** 1.0.0  
**Date:** May 2026  
**Audience:** School Administrators and Voters  

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [For Voters](#for-voters)
3. [For Administrators](#for-administrators)
4. [Troubleshooting](#troubleshooting)
5. [FAQ](#faq)

---

## Getting Started

### System Requirements

**Windows:**
- Windows 10 or later
- 4GB RAM minimum (8GB recommended)
- 200MB free disk space
- No administrative rights required

**macOS:**
- macOS 10.13 (High Sierra) or later
- 4GB RAM minimum (8GB recommended)
- 200MB free disk space
- No administrative rights required

### Installation

#### Windows Installation

**Using Installer:**
1. Download `Voter App Setup.exe`
2. Double-click the installer
3. Follow setup wizard
4. Choose installation location
5. Application installs to `C:\Program Files\Voter App\`
6. Desktop shortcut created automatically
7. Launch application from Start Menu or desktop shortcut

**Using Portable Version:**
1. Download `Voter App.exe`
2. Place in desired location (USB drive, network drive, etc.)
3. Double-click to run (no installation required)
4. Application stores database in same directory as .exe

**Uninstalling:**
1. Control Panel → Programs → Programs and Features
2. Find "Voter App" in list
3. Click "Uninstall"
4. Follow uninstaller wizard
5. Desktop shortcut removed automatically

#### macOS Installation

**Using DMG Installer:**
1. Download `Voter App.dmg`
2. Double-click DMG file
3. Drag "Voter App" icon to "Applications" folder
4. Eject DMG file
5. Applications folder now contains Voter App

**Using Portable ZIP:**
1. Download `Voter App-mac.zip`
2. Extract to desired location
3. Applications folder or external drive recommended
4. Double-click "Voter App.app" to run

**Launching Application:**
1. Open Applications folder
2. Find "Voter App"
3. Double-click to launch
4. May see "Unidentified Developer" warning on first run
5. Click "Open" to proceed (macOS security)

### First Launch

1. **Click "Voter" to vote or "Admin" to manage**
2. Voter interface loads with candidate list
3. Admin panel requires password (default: admin123)
4. Database automatically initialized with sample candidates

---

## For Voters

### Voting Interface Overview

```
┌────────────────────────────────────────────────┐
│  School Election 2026        [10:35]           │
├────────────────────────────────────────────────┤
│                                                 │
│  Candidate 1 [Symbol]  Vote Button             │
│  Candidate 2 [Symbol]  Vote Button             │
│  Candidate 3 [Symbol]  Vote Button             │
│                                                 │
│  Status: Voting Open | Total Votes: 42         │
│                                                 │
│  Message: "Your vote has been recorded"        │
└────────────────────────────────────────────────┘
```

### How to Vote

**Step 1: Start the Application**
- Double-click application icon
- Voting interface appears
- See all candidates with their symbols and names

**Step 2: View Candidates**
- Each candidate displayed with:
  - **Symbol**: Visual representation (image icon)
  - **Name**: Full name of candidate
  - **Tagline**: Symbol name or motto
  - **Vote Button**: Green button to record vote

**Step 3: Select Your Choice**
- Review all candidates
- Click the **"Vote"** button next to your chosen candidate
- Button color changes to green briefly
- You will hear a beep sound (system feedback)

**Step 4: Confirmation**
- Screen displays: "Your vote has been recorded successfully"
- Total vote count updates
- Vote button becomes disabled (to prevent double voting)

**Step 5: Session Time**
- Current time shown in top-right corner
- Refreshes every second

### Voting Tips

✓ **Take your time** - Review all candidates before voting  
✓ **Double-check** - Confirm candidate name before clicking  
✓ **One vote only** - You may vote only once per election  
✗ **Don't force buttons** - Button works when clicked once  
✗ **Don't restart** - Restarting won't let you vote again  

### What If...

**"Voting is currently closed"**
- Admin has stopped voting
- Contact administrator to reopen voting
- Try again later

**"Vote not recorded"**
- Check internet connection (if applicable)
- Candidate may have been deleted
- Try voting for different candidate

**Application won't launch**
- Check system requirements
- Restart computer
- Try reinstalling application

---

## For Administrators

### Admin Panel Overview

```
┌──────────────────────────────────────────────────────┐
│  Admin Panel - School Election Management            │
├──────────────────────────────────────────────────────┤
│                                                       │
│  [Home] [Candidates] [Election] [Results]           │
│  [Backup] [Security]                                │
│                                                       │
│  ├─ HOME DASHBOARD                                   │
│  │  Candidates: 8                                    │
│  │  Total Votes: 127                                │
│  │  Leading: Tuhina Khatun (45 votes)               │
│  │                                                   │
│  ├─ CANDIDATES MANAGER                              │
│  │  [Add Candidate] [Edit] [Delete]                 │
│  │  List of all candidates with edit options        │
│  │                                                   │
│  ├─ ELECTION SETTINGS                               │
│  │  Title: School Election 2026                     │
│  │  Year: 2026                                      │
│  │  Status: [Open Voting] [Close Voting]            │
│  │                                                   │
│  ├─ RESULTS VIEWER                                  │
│  │  1. Tuhina Khatun     45 votes (35%)             │
│  │  2. Jeanifer Mandi    28 votes (22%)             │
│  │  ...                                              │
│  │                                                   │
│  ├─ BACKUP & RESTORE                                │
│  │  [Export Data] [Import Data]                     │
│  │  Last Backup: 2026-05-06 09:00 AM                │
│  │                                                   │
│  └─ SECURITY SETTINGS                               │
│     [Change Password]                               │
│     Session expires in: 59 minutes                   │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Accessing Admin Panel

**Option 1: Keyboard Shortcut (Recommended)**
- Windows: Press `Ctrl + Shift + A`
- macOS: Press `Cmd + Shift + A`
- Admin login window appears

**Option 2: Menu Bar**
1. Click "File" menu
2. Select "Open Admin Panel"
3. Admin login window appears

**Option 3: Application Icon**
- Right-click application icon
- Select "Admin Mode"

### Admin Login

**Default Credentials:**
- **Username:** (not required)
- **Password:** `admin123`

**Important:** Change password on first use!

**Login Steps:**
1. Admin login window appears
2. Click password field
3. Enter password
4. Click "Login" button
5. If correct, dashboard loads
6. If wrong, error message shows

### Admin Tasks

#### 1. Managing Candidates

**View Candidates:**
1. Click "Candidates" tab
2. See list of all candidates with:
   - Name
   - Tagline
   - Symbol (thumbnail)
   - Current vote count
   - Edit/Delete buttons

**Add New Candidate:**
1. Click "Add Candidate" button
2. Fill form:
   - **Name:** Candidate full name (required)
   - **Tagline:** Symbol name or motto (optional)
   - **Symbol:** Upload or select SVG image
3. Click "Save Candidate"
4. New candidate appears in list and voting interface

**Edit Candidate:**
1. In candidates list, click "Edit" button
2. Modify name, tagline, or symbol
3. Click "Save Changes"
4. Updates appear immediately

**Delete Candidate:**
1. In candidates list, click "Delete" button
2. Confirmation dialog appears
3. Click "Confirm Delete"
4. Candidate removed from voting
5. Existing votes for candidate NOT deleted (audit trail preserved)

#### 2. Managing Election

**View Election Settings:**
1. Click "Election" tab
2. See current election:
   - Title
   - Year
   - Voting status (Open/Closed)

**Edit Election Title:**
1. Click "Election" tab
2. Edit title field
3. Click "Save Changes"
4. New title appears in voting interface

**Control Voting Status:**

**OPEN VOTING:**
1. Click "Election" tab
2. Click "Open Voting" button
3. Vote buttons enable in voting interface
4. Voters can now cast votes

**CLOSE VOTING:**
1. Click "Election" tab
2. Click "Close Voting" button
3. Vote buttons disable in voting interface
4. Voters see "Voting Closed" message
5. No new votes recorded

**Why Close Voting?**
- Election period ended
- Technical issues
- Count votes
- Pause for announcement

#### 3. Viewing Results

**View Voting Results:**
1. Click "Results" tab
2. See candidates ranked by votes:
   - Rank (1st, 2nd, etc.)
   - Candidate name
   - Vote count
   - Percentage of total votes
   - Visual bar chart (optional)

**What Results Show:**
```
Rank  Candidate           Votes  Percentage
────────────────────────────────────────
1.    Tuhina Khatun        45     35.4%  ████████████
2.    Jeanifer Mandi       28     22.0%  ████████
3.    Sumitra Hansda       23     18.1%  ███████
4.    Anish Kujur          31     24.4%  █████████
────────────────────────────────────────
     Total Votes: 127
     Leading: Tuhina Khatun
```

**Update Results:**
- Click "Refresh Results" button
- Results update from database
- Auto-refresh every 30 seconds (if enabled)

#### 4. Backing Up Data

**Automatic Backups:**
- System can export data anytime
- No automatic scheduled backups (manual only)

**Manual Backup (Export):**
1. Click "Backup" tab
2. Click "Export Data" button
3. File dialog opens
4. Choose save location
5. File saved as `voting-export-2026-05-06.json`
6. Contains all election data and votes

**What's in Backup:**
```json
{
  "election": { ... },
  "candidates": [ ... ],
  "votes": [ ... ],
  "totalVotes": 127,
  "exportedAt": "2026-05-06T11:00:00Z"
}
```

**Backup Best Practices:**
- Export after each voting session
- Store multiple backups (e.g., daily)
- Keep backups in safe location
- Use external drive or cloud storage
- Consider encryption for sensitive data

**Restoring from Backup:**
1. Click "Backup" tab
2. Click "Import Data" button
3. Choose JSON backup file
4. Click "Import"
5. Confirmation dialog appears
6. Click "Confirm Import"
7. Data restored to database

**Warning:** Importing overwrites current voting data!

#### 5. Security Settings

**Change Admin Password:**
1. Click "Security" tab
2. See "Change Password" section
3. Enter current password
4. Enter new password (8+ characters)
5. Confirm new password
6. Click "Change Password"
7. Password updated

**Password Requirements:**
- Minimum 8 characters
- Letters and numbers recommended
- Avoid simple passwords (e.g., 123456)
- Change regularly (monthly recommended)

**Session Management:**
- Admin session automatically expires after 1 hour
- Time remaining shown in security tab
- Click "Logout" to end session immediately
- Closing admin window does NOT logout automatically

**Default Password Handling:**
- Default password: `admin123`
- **MUST CHANGE on first use**
- Default is well-known, security risk
- Change even if single-user system

#### 6. Generating Reports

**Vote Count Report:**
1. Click "Results" tab
2. Click "Print Results" (or screenshot)
3. Report shows:
   - Election name and date
   - All candidates with vote counts
   - Percentages
   - Winner announcement

**Sample Report:**
```
═══════════════════════════════════════
    SCHOOL ELECTION 2026 - RESULTS
    Date: May 6, 2026 | Time: 2:00 PM
═══════════════════════════════════════

FINAL RESULTS:
─────────────────────────────────────

Rank  Candidate           Votes  % of Total
─────────────────────────────────────
1.    Tuhina Khatun        45    35.4%  ★ WINNER
2.    Anish Kujur          31    24.4%
3.    Jeanifer Mandi       28    22.0%
4.    Sumitra Hansda       23    18.1%

─────────────────────────────────────
TOTAL VOTES CAST: 127
VOTER TURNOUT: 92%

═══════════════════════════════════════
Certified by: [Admin Name]
Approved by: [Principal]
═══════════════════════════════════════
```

---

## Troubleshooting

### Common Issues and Solutions

#### "Incorrect password. Please try again."

**Problem:** Admin password not accepted

**Solutions:**
1. Verify caps lock is OFF
2. Check password hasn't been changed
3. Default is `admin123` (first installation)
4. Retype password slowly, check spelling
5. If still failing, may need to reset database

**If Locked Out:**
- Contact IT administrator
- Database may need to be reset
- Contact application support

#### "Voting is currently closed"

**Problem:** Vote buttons disabled, can't vote

**Solutions:**
1. Admin may have closed voting
2. Check election status
3. Contact administrator to reopen voting
4. Try again in 5 minutes

#### "No candidates available"

**Problem:** No candidates shown in voting interface

**Solutions:**
1. Admin may not have added candidates
2. Election may not be configured
3. Try restarting application
4. Contact administrator

#### "Database Error"

**Problem:** Application shows database error

**Solutions:**
1. Database file may be corrupted
2. Insufficient disk space
3. File permissions issue

**Actions:**
1. Close application
2. Restart computer
3. Relaunch application
4. Check disk space (need 200MB free)
5. Contact IT administrator if persists

#### "Application won't launch"

**Problem:** Double-clicking application does nothing

**Solutions:**
1. Wait 5-10 seconds (may be loading)
2. Check system requirements
3. Try from different location
4. Restart computer
5. Reinstall application
6. Check Event Viewer for error messages

#### "Vote not recorded"

**Problem:** Clicked vote button but message didn't appear

**Solutions:**
1. Check internet connection status
2. Candidate may have been deleted
3. Voting may have been closed
4. Try again in 10 seconds
5. Try voting for different candidate

#### "Can't access admin panel"

**Problem:** Keyboard shortcut doesn't work

**Solutions:**
1. Use menu bar instead (File → Open Admin Panel)
2. Ensure voting interface is focused
3. Try again with clear focus on window
4. Restart application
5. Check if shortcut was customized

#### "Password change didn't work"

**Problem:** New password not accepted after change

**Solutions:**
1. Log out completely
2. Log back in with new password
3. Ensure caps lock is OFF
4. Check you confirmed new password correctly
5. If still failing, password may not have saved

### Diagnostic Tools

**Check Application Log:**
- Open app with `--debug` flag
- Enable developer tools (Ctrl+Shift+I)
- Console shows detailed messages
- Share log with support team if needed

**Verify Database:**
```bash
# Check if database file exists
# Windows: %APPDATA%/Voter App/voting.db
# macOS: ~/Library/Application Support/Voter App/voting.db

# Database integrity check
sqlite3 voting.db "PRAGMA integrity_check;"
```

---

## FAQ

### General Questions

**Q: Is this system internet-based?**  
A: No, the system runs entirely on your local computer. No internet required.

**Q: Can multiple people vote from the same computer?**  
A: Yes, each person can click the vote button in sequence. Each vote is recorded separately.

**Q: Can someone vote twice?**  
A: The application allows only one vote per restart. Multiple restarts could allow multiple votes. Admin should monitor voting.

**Q: Where are votes stored?**  
A: Votes are stored in a local database file (voting.db) on the computer. File is not encrypted.

**Q: Is the system secure?**  
A: The system includes password protection for admin panel and database integrity checks. For high-security elections, additional measures recommended.

### Admin Questions

**Q: How often should I backup voting data?**  
A: Backup after each voting session or at least daily during election period. More frequent if possible.

**Q: Can I undo a vote reset?**  
A: Only if you have a backup from before the reset. Reset is permanent unless restored from backup.

**Q: What if the admin password is lost?**  
A: You will need to contact a system administrator to reset the database or password hash.

**Q: Can multiple admin users exist?**  
A: Current version supports only single admin user. Use shared password if multiple admins needed.

**Q: How long before admin session expires?**  
A: Sessions expire after 1 hour of inactivity. Shown in Security tab. Close admin window to end session immediately.

**Q: Can I import data from another election?**  
A: Only if data is in compatible JSON format. Custom imports may require technical support.

### Voting Questions

**Q: What if I click the wrong candidate by mistake?**  
A: Unfortunately, votes cannot be undone. Admin can reset all votes if necessary. Vote carefully.

**Q: Will my vote be seen by anyone?**  
A: Votes are recorded with timestamp. Admin can see how many people voted and for whom, but not how you personally voted.

**Q: What if the power goes out while voting?**  
A: Any votes recorded before power loss are saved. Votes in progress are lost.

**Q: Is voting anonymous?**  
A: Votes are recorded but not linked to voter identity. Admin can see vote counts and timing, but not voter names.

### Technical Questions

**Q: System requirements?**  
A: Windows 10+ or macOS 10.13+, 4GB RAM, 200MB disk space

**Q: Can I run multiple instances?**  
A: Not recommended. Each instance uses same database file, may cause conflicts.

**Q: What about data recovery?**  
A: Regular backups recommended. Data recovery from corrupted database may require professional help.

**Q: Can system be connected to network?**  
A: Current version designed for local use only. Network deployment requires additional configuration.

---

## Support

**For Technical Issues:**
1. Check Troubleshooting section above
2. Review FAQ for your question
3. Check application logs (developer tools)
4. Contact school IT administrator
5. Document error message and steps to reproduce

**Information to Include When Reporting Issues:**
- Operating system (Windows 10, macOS 11, etc.)
- Application version (shown in About dialog)
- Error message (exact text)
- Steps to reproduce the issue
- Screenshot of error (if applicable)
- Whether issue is reproducible

**Contact Information:**
- School IT Department
- Email: [IT Email]
- Phone: [IT Phone]
- Support Hours: [Business Hours]

---

## Document Info

**Version:** 1.0.0  
**Last Updated:** May 6, 2026  
**Audience:** Voters and Administrators  

