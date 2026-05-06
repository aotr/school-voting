# Deployment & Operations Guide
## School Voting System - Desktop Edition

**Version:** 1.0.0  
**Date:** May 2026  
**Audience:** IT Administrators, Deployment Staff  

---

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Installation Guide](#installation-guide)
3. [Configuration](#configuration)
4. [Operations](#operations)
5. [Disaster Recovery](#disaster-recovery)
6. [Performance Tuning](#performance-tuning)

---

## Pre-Deployment Checklist

### System Requirements Verification

- [ ] Windows 10+ or macOS 10.13+
- [ ] Minimum 4GB RAM available
- [ ] 500MB free disk space
- [ ] Display minimum 1024x768 resolution
- [ ] No network requirement, but connectivity helps for updates
- [ ] Administrative rights for installation (Windows NSIS only)

### Hardware Verification

```bash
# Windows: Check system info
systeminfo | findstr /B /C:"OS Version"
systeminfo | findstr /B /C:"System Memory"

# macOS: Check system info
system_profiler SPSoftwareDataType
system_profiler SPHardwareDataType
```

### Pre-Installation Tasks

- [ ] **Backup existing data** - If upgrading, backup old voting.db
- [ ] **Close antivirus** - Temporarily disable antivirus during installation
- [ ] **Disable Windows updates** - Prevent automatic restart during setup
- [ ] **Clear disk space** - Ensure 500MB+ free space
- [ ] **Document current passwords** - Note admin password if exists
- [ ] **Test display** - Verify monitor resolution/rotation

### Network Setup (Optional)

```
Current: Offline-first, no network needed
Future: If deploying across network:
  - Ensure firewall allows port 3000 (localhost only)
  - No internet access required
  - LAN access: If using shared database (future)
```

---

## Installation Guide

### Windows Installation

#### Option 1: NSIS Installer (Recommended)

**Steps:**
1. Download `Voter App Setup.exe` (150 MB)
2. Right-click → "Run as Administrator"
3. Welcome dialog appears
4. Accept license agreement
5. Select installation folder:
   - Default: `C:\Program Files\Voter App\`
   - Custom: Choose alternate location
6. Select components:
   - ☑ Install application
   - ☑ Create desktop shortcut
   - ☑ Create Start Menu shortcut
7. Click "Install"
8. Installation progress: 30-60 seconds
9. "Installation Complete" → Click "Finish"
10. Application launches automatically
11. Database initialized on first run

**Installer Log:**
- Location: `%TEMP%\Voter App Setup.log`
- Useful for debugging installation issues

**Uninstall:**
```
Control Panel → Programs → Uninstall a Program
Select "Voter App" → Click "Uninstall"
OR use: C:\Program Files\Voter App\uninstall.exe
```

#### Option 2: Portable Version (No Installation)

**Steps:**
1. Download `Voter App.exe` (150 MB)
2. Place in desired location (USB, network share, etc.)
3. Double-click to run
4. No installation required
5. Faster startup (no registry access)

**Benefits:**
- Run from USB drive
- No administrator rights needed
- No installation folders
- Portable to different machines

**Database Location:**
- Same directory as Voter App.exe
- Database created automatically
- Can move database with executable

**Usage in Lab:**
```
[USB Drive]\Voter App.exe
[USB Drive]\voting.db (created automatically)
```

#### Batch Installation (Multiple Machines)

**Create Installation Script (install.bat):**
```batch
@echo off
REM School Voter App Batch Installation Script

echo Installing Voter App...
"Voter App Setup.exe" /S /D=C:\Program Files\Voter App

REM Wait for installation to complete
timeout /t 30

REM Verify installation
if exist "C:\Program Files\Voter App\Voter App.exe" (
    echo Installation successful
    exit /b 0
) else (
    echo Installation failed
    exit /b 1
)
```

**Deployment Steps:**
1. Create shared folder on network
2. Copy installer to shared folder
3. Copy install.bat to shared folder
4. Run via Group Policy or manually on each machine
5. Verify installation on each machine

### macOS Installation

#### Option 1: DMG Installer (Recommended)

**Steps:**
1. Download `Voter App.dmg` (150 MB)
2. Double-click DMG file
3. Installer window opens with "Voter App" icon and "Applications" folder
4. Drag "Voter App" icon to "Applications" folder
5. Copying starts (30-60 seconds)
6. Eject DMG when done (right-click → Eject)
7. Open Applications folder
8. Double-click "Voter App"
9. Security warning appears (first run)
10. Click "Open" to proceed
11. Application launches
12. Database initialized on first run

**Gatekeeper Warning:**
```
"Voter App" cannot be opened because the developer cannot be verified.
```
**Solution:** Click "Open" or (Control-click → Open)

**Installation Location:**
- Standard: `/Applications/Voter App.app`
- Alternative: User Applications (~/Applications)

**Uninstall:**
1. Drag application to Trash
2. Empty Trash
3. Optional: Delete ~/Library/Application Support/Voter App/ (keeps database)

#### Option 2: ZIP Archive (Portable)

**Steps:**
1. Download `Voter App-mac.zip` (150 MB)
2. Double-click to extract
3. Voter App.app appears in Downloads
4. Move to Applications folder (or any location)
5. Double-click to run

#### Command-Line Installation

```bash
# Mount DMG
hdiutil mount Voter\ App.dmg

# Copy application
cp -r /Volumes/Voter\ App/Voter\ App.app /Applications/

# Unmount
hdiutil unmount /Volumes/Voter\ App

# Launch
open /Applications/Voter\ App.app
```

#### Bulk Deployment (Multiple Macs)

**Using Apple Remote Desktop:**
```bash
#!/bin/bash
# Deployment script for multiple Macs

URL="https://school.edu/downloads/Voter-App.dmg"
MOUNT_POINT="/tmp/voter-mount"
APP_PATH="/Applications/Voter App.app"

# Download
curl -o /tmp/Voter\ App.dmg "$URL"

# Mount
mkdir -p "$MOUNT_POINT"
hdiutil mount -mountpoint "$MOUNT_POINT" /tmp/Voter\ App.dmg

# Copy
cp -r "$MOUNT_POINT/Voter App.app" "$APP_PATH"

# Cleanup
hdiutil unmount "$MOUNT_POINT"
rm /tmp/Voter\ App.dmg

# Launch verification
open "$APP_PATH"
```

---

## Configuration

### Initial Setup After Installation

#### Step 1: Launch Application
```
Windows: Double-click shortcut or search "Voter App"
macOS: Open Applications folder, double-click "Voter App"
```

#### Step 2: Access Admin Panel
```
Windows: Press Ctrl + Shift + A
macOS: Press Cmd + Shift + A
```

#### Step 3: Login with Default Credentials
```
Username: (not required)
Password: admin123
```

#### Step 4: Change Admin Password (CRITICAL)
1. Click "Security" tab
2. Click "Change Password"
3. Current Password: admin123
4. New Password: [Create strong password]
5. Confirm Password: [Re-type]
6. Click "Change Password"
7. Confirmation message appears

**Password Requirements:**
- Minimum 8 characters
- Mixed case recommended
- Numbers and symbols recommended
- Avoid simple patterns (123456, qwerty)

**Example Strong Passwords:**
- School2026Voting!
- VotingSystem@2026
- E1ection#2026Safe

#### Step 5: Configure Election
1. Click "Election" tab
2. Edit title: "School Election 2026"
3. Verify year: 2026
4. Click "Save Changes"

#### Step 6: Review Candidates
1. Click "Candidates" tab
2. Review pre-loaded candidates
3. Edit names/symbols as needed
4. Add/delete candidates as required

#### Step 7: Open Voting
1. Click "Election" tab
2. Click "Open Voting" button
3. Verify status shows "Voting Open"
4. Test with practice vote

### Environment Configuration

#### Kiosk Mode Setup (Windows)

**Create Kiosk Desktop Shortcut:**
```batch
REM Target: C:\Program Files\Voter App\Voter App.exe --kiosk

REM Set shortcut properties:
REM Start in: C:\Program Files\Voter App
REM Window: Maximized
REM Hotkey: None
```

**Lock Down Machine:**
```registry
; Disable Ctrl+Alt+Delete
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System
DisableTaskMgr = 1

; Disable Windows key
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System
DisableUACMessages = 1
```

#### Full-Screen Mode (macOS)

```bash
# Grant app full-screen permission
chmod +x "/Applications/Voter App.app"

# Launch in full screen
open -a "Voter App" --args --fullscreen
```

### Database Configuration

#### Database Reset

**If database is corrupted:**
```bash
# Windows
del %APPDATA%\Voter App\voting.db
del %APPDATA%\Voter App\voting.db-wal
del %APPDATA%\Voter App\voting.db-shm

# macOS
rm ~/Library/Application\ Support/Voter\ App/voting.db
rm ~/Library/Application\ Support/Voter\ App/voting.db-wal
rm ~/Library/Application\ Support/Voter\ App/voting.db-shm

# Linux
rm ~/.config/Voter\ App/voting.db*
```

Next run will recreate empty database with schema.

#### Database Optimization

```javascript
// Connect to database and optimize
const db = require('better-sqlite3')('voting.db');

// Vacuum (cleanup)
db.exec("VACUUM");

// Analyze (statistics)
db.exec("ANALYZE");

// Rebuild indexes
db.exec("REINDEX");

db.close();
```

#### Database Backup Strategy

**Daily Backup Script (Windows - batch):**
```batch
@echo off
REM Daily backup script
set timestamp=%date:~-4%-%date:~-10,2%-%date:~-7,2%_%time:~0,2%-%time:~5,2%
set source=%APPDATA%\Voter App\voting.db
set dest=C:\Backups\voting_%timestamp%.db

REM Create backup directory
if not exist C:\Backups mkdir C:\Backups

REM Copy database
copy "%source%" "%dest%"

REM Keep only last 30 backups
forfiles /S /D +30 /C "cmd /c del @file"
```

**Daily Backup Script (macOS - bash):**
```bash
#!/bin/bash
# Daily backup script

TIMESTAMP=$(date +%Y-%m-%d_%H-%M)
SOURCE=~/Library/Application\ Support/Voter\ App/voting.db
DEST=~/Backups/voting_${TIMESTAMP}.db
BACKUP_DIR=~/Backups

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Copy database (sqlite backup command is safer)
sqlite3 "$SOURCE" ".backup $DEST"

# Keep only last 30 backups
find "$BACKUP_DIR" -name "voting_*.db" -mtime +30 -delete
```

**Automated Backup (Windows - Task Scheduler):**
1. Open Task Scheduler
2. Create Basic Task
3. Name: "Voter App Daily Backup"
4. Trigger: Daily at 11:59 PM
5. Action: Run script C:\Scripts\backup.bat
6. Enabled: Yes

**Automated Backup (macOS - Cron):**
```bash
# Edit crontab
crontab -e

# Add line (runs daily at 11:59 PM):
59 23 * * * /usr/local/bin/backup-voter.sh

# Make script executable
chmod +x /usr/local/bin/backup-voter.sh
```

---

## Operations

### Pre-Election Checklist

**2 Weeks Before:**
- [ ] Test application on target machines
- [ ] Configure candidates and election
- [ ] Create backup of clean database
- [ ] Document admin password in secure location
- [ ] Train staff on application usage

**1 Week Before:**
- [ ] Final test run with full candidate list
- [ ] Verify all symbols display correctly
- [ ] Test backup/restore functionality
- [ ] Prepare kiosk machines if using
- [ ] Create runsheet for election day

**Day Before:**
- [ ] Reset database (clear test votes)
- [ ] Close voting
- [ ] Test open voting
- [ ] Verify all machines boot properly
- [ ] Backup clean database

**Election Day Morning:**
- [ ] Start application on all machines
- [ ] Verify candidates display correctly
- [ ] Perform test vote
- [ ] Clear test votes
- [ ] Open voting
- [ ] Monitor first votes
- [ ] Be ready for issues

### During Election Monitoring

**Monitoring Checklist:**
- [ ] Monitor vote count every 15-30 minutes
- [ ] Check for errors in console (if dev mode)
- [ ] Verify application responsiveness
- [ ] Monitor machine temperatures/resources
- [ ] Watch for unusual voting patterns
- [ ] Be alert for connectivity issues (if networked)

**Monitoring Dashboard (Admin Panel):**
1. Open Admin Panel
2. Click "Results" tab
3. Click "Refresh Results"
4. View:
   - Current vote counts
   - Total votes cast
   - Candidate percentages
   - Leading candidate

**Interval Backups:**
- Export data every 30 minutes
- Save with timestamp: voting-2026-05-06-10-30.json
- Store on external drive
- Multiple copies if possible

### Post-Election Tasks

**Immediately After Voting Closes:**
1. Click "Election" tab
2. Click "Close Voting"
3. Export final results via Results tab
4. Take screenshot of final results
5. Backup database to external drive

**Within 24 Hours:**
- [ ] Announce results
- [ ] Export voting data to JSON
- [ ] Print results report
- [ ] Archive backup files
- [ ] Document any issues
- [ ] Prepare audit report

**Within 1 Week:**
- [ ] Archive all files (backups, exports, screenshots)
- [ ] Document final vote counts
- [ ] Prepare summary report
- [ ] Reset database for next election
- [ ] Train new staff if needed

**Audit Trail Documentation:**
```
Election Report: School Election 2026
Date: May 6, 2026
Prepared by: [Admin Name]
Witnessed by: [Administrator Name]

Total Votes Cast: 127
Voting Duration: 3:00 PM - 4:00 PM

Final Results:
1. Tuhina Khatun     45 votes (35.4%) ★ WINNER
2. Anish Kujur       31 votes (24.4%)
3. Jeanifer Mandi    28 votes (22.0%)
4. Sumitra Hansda    23 votes (18.1%)

Database Backups:
- voting-backup-2026-05-06-14-00.db
- voting-backup-2026-05-06-15-00.db
- voting-backup-2026-05-06-16-00.db (Final)

Machine Log:
- No errors reported
- All votes recorded successfully
- No downtime
- Performance: Normal

Certified: [Signature] Date: [Date]
```

---

## Disaster Recovery

### Data Loss Scenarios

#### Scenario 1: Database Corruption

**Symptoms:**
- Application crashes when accessing candidates
- Error message: "Database disk image is malformed"
- Cannot record votes

**Recovery:**
1. Close application
2. Restore from backup:
   ```bash
   # Windows
   copy backup.db %APPDATA%\Voter App\voting.db
   
   # macOS
   cp backup.db ~/Library/Application\ Support/Voter\ App/voting.db
   ```
3. Delete WAL and shared memory files
4. Restart application
5. Verify data restored

#### Scenario 2: Accidental Vote Reset

**Symptoms:**
- Admin accidentally clicked "Reset Votes"
- All votes cleared
- Total votes now 0

**Recovery:**
1. **If Backup Exists:**
   - Stop application
   - Restore voting.db from backup
   - Restart application
   - Votes restored

2. **If No Backup:**
   - Votes are permanently lost
   - Cannot be recovered
   - Must restart election

**Prevention:**
- Admin confirms before reset
- Multiple backups
- Restricted admin access
- Training on reset procedure

#### Scenario 3: Hard Disk Failure

**Symptoms:**
- Machine won't start
- Hard drive clicking/grinding noise
- Application inaccessible

**Recovery:**
1. **If SSD/backup available:**
   - Replace hard drive
   - Reinstall application
   - Restore database from backup
   - Election data recovered

2. **If no backup:**
   - Data is permanently lost
   - Cannot be recovered

**Prevention:**
- Regular external backups
- Multiple backup locations
- Redundant machines if critical

#### Scenario 4: Administrator Locked Out

**Symptoms:**
- Admin password forgotten
- Cannot access admin panel
- Voting data needs management

**Recovery:**
1. **If backup database available:**
   - Restore database from time when password was known
   - Use old password to login
   - Change to new password

2. **If no admin password record:**
   - Contact application support
   - May need to reset database
   - Loss of voting data possible

**Prevention:**
- Document password securely
- Use password manager
- Multiple admins with different passwords
- Password hint stored separately

### Recovery Procedures

#### Full System Recovery

```bash
# Step 1: Stop application
pkill "Voter App"  # macOS/Linux
taskkill /IM "Voter App.exe" /F  # Windows

# Step 2: Restore database from backup
cp backup.db voting.db

# Step 3: Remove temporary files
rm voting.db-wal
rm voting.db-shm

# Step 4: Verify database integrity
sqlite3 voting.db "PRAGMA integrity_check;"

# Step 5: Start application
# [Launch application]

# Step 6: Verify data
# [Check candidates and vote counts]
```

#### Partial Data Recovery (JSON Backup)

**If only JSON backup available:**
1. Restore votes from JSON export
2. Manually re-enter candidates
3. Python script can help:

```python
import json
import sqlite3

backup = json.load(open('backup.json'))
db = sqlite3.connect('voting.db')
cursor = db.cursor()

# Re-insert votes
for vote in backup['votes']:
    cursor.execute(
        'INSERT INTO votes (election_id, candidate_id, voted_at) VALUES (?, ?, ?)',
        (vote['election_id'], vote['candidate_id'], vote['voted_at'])
    )

db.commit()
db.close()
```

### Backup & Recovery Best Practices

| Item | Frequency | Location | Retention |
|------|-----------|----------|-----------|
| Database export | Every vote | USB drive | Entire election |
| JSON backup | Every 30 min | External drive | 1 week |
| System image | Weekly | External drive | Latest 4 weeks |
| Configuration | After setup | Network share | Until next setup |

---

## Performance Tuning

### Database Optimization

**Enable WAL Mode:**
```javascript
db.pragma("journal_mode = WAL");
```
- Improves write performance
- Better for concurrent reads

**Increase Cache:**
```javascript
db.pragma("cache_size = -64000");  // 64MB cache
```
- Reduces disk I/O
- Faster queries

**Optimize Pragmas:**
```javascript
db.pragma("synchronous = NORMAL");  // vs FULL
db.pragma("temp_store = MEMORY");
db.pragma("query_only = false");
```

### Application Performance

**Monitor Memory Usage:**
```bash
# Windows - Task Manager
# Monitor: Voter App.exe in Processes tab

# macOS - Activity Monitor
# Monitor: Voter App in CPU/Memory tabs
```

**Reduce UI Redraws:**
- Minimize animations when > 20 candidates
- Disable auto-refresh results
- Use static view until refresh requested

**Optimize Candidate Loading:**
- Limit candidates displayed per page
- Lazy load candidate symbols
- Use thumbnails instead of full images

### Network Optimization (If Deployed Across Network)

**Reduce Latency:**
```javascript
// Compress responses
app.use(compression());

// Cache static assets
app.use(express.static(__dirname, {
  maxAge: '1d'
}));
```

**Load Testing:**
```bash
# Test API performance
ab -n 1000 -c 10 http://localhost:3000/api/election
ab -n 100 -c 5 -p vote.json http://localhost:3000/api/vote/1
```

### Machine Configuration Optimization

**Windows Performance:**
- Disable unnecessary services
- Close background applications
- Disable screen savers
- Set power plan to "High Performance"

**macOS Performance:**
- Close unused applications
- Disable visual effects (if needed)
- Ensure adequate free disk space
- Monitor thermal output

---

## Support & Troubleshooting

### Log Collection

**Windows Logs:**
```
%APPDATA%\Voter App\logs\
C:\Program Files\Voter App\logs\
```

**macOS Logs:**
```
~/Library/Application Support/Voter App/logs/
~/Library/Logs/Voter App/
```

**System Event Logs:**
```bash
# Windows - Event Viewer
eventvwr.exe

# macOS - Console.app
open /Applications/Utilities/Console.app

# Linux - Journal
journalctl -xe
```

### Troubleshooting Common Issues

**Application won't start:**
1. Check event logs for errors
2. Verify database file exists
3. Restore from backup if corrupted
4. Reinstall application

**Votes not recording:**
1. Check disk space (need 200MB+)
2. Verify database not corrupted
3. Check for file permissions
4. Review database logs

**Admin panel frozen:**
1. Kill application process
2. Check system resources (CPU, RAM)
3. Restore from backup if database issue
4. Reinstall application

---

## Document Info

**Version:** 1.0.0  
**Last Updated:** May 6, 2026  
**Audience:** IT Administrators, Deployment Staff  

