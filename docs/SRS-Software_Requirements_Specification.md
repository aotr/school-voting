# Software Requirements Specification (SRS)
## School Voting System - Desktop Edition

**Version:** 1.0.0  
**Date:** May 2026  
**Status:** Production Ready  
**Document Type:** Software Requirements Specification  

---

## 1. Executive Summary

The School Voting System is a professional desktop application designed to facilitate secure, transparent, and efficient electronic voting for school elections. The system emulates EVM (Electronic Voting Machine) interfaces with native desktop installation for Windows and macOS platforms. It integrates persistent data storage via SQLite, administrative controls, and comprehensive vote tracking capabilities.

**Key Objectives:**
- Provide an accessible, intuitive voting interface for voters
- Maintain secure vote records with persistent storage
- Enable administrators to manage elections, candidates, and results
- Support multi-candidate elections with visual symbols
- Generate comprehensive voting results and reports

---

## 2. Scope

### 2.1 In Scope
- Desktop voting interface with EVM-style design
- SQLite database for persistent vote storage
- Administrative panel for election and candidate management
- Vote recording and result aggregation
- Password-protected admin access
- Backup and restore functionality
- Cross-platform support (Windows, macOS)
- E2E testing framework
- Session management and admin authentication

### 2.2 Out of Scope
- Mobile app development
- Cloud-based voting
- Remote voting or internet-based voting
- Biometric authentication
- Advanced encryption (uses standard hashing)
- Multi-language support beyond English
- Advanced accessibility features (beyond WCAG baseline)

---

## 3. Product Overview

### 3.1 Product Vision
Create a reliable, secure, and user-friendly electronic voting system that mimics real-world EVM machines while leveraging modern desktop technology for school elections.

### 3.2 Key Features

#### 3.2.1 Voter Interface
- **Candidate Display**: Visual representation of candidates with symbols (SVG), names, and taglines
- **Vote Selection**: Button-based voting with clear visual feedback
- **Responsive Layout**: Automatic layout adjustment for 6-8+ candidates (dense, compact, split-grid modes)
- **Vote Confirmation**: Immediate feedback upon successful vote recording
- **Status Indicators**: Real-time election status (open/closed), session time display
- **Accessibility**: ARIA labels, keyboard navigation support

#### 3.2.2 Administrative Panel
- **Dashboard**: Overview of candidates, total votes, and election status
- **Candidate Management**: Add, edit, delete candidates with custom symbols
- **Election Management**: Configure election title, year, voting status
- **Vote Results**: Real-time vote tallies and candidate ranking
- **Vote Reset**: Clear all votes (with confirmation)
- **Backup/Restore**: Export and import voting data
- **Security Settings**: Change admin password with hash storage
- **Session Management**: Secure logout functionality

#### 3.2.3 Database Layer
- **SQLite Integration**: Fast, local persistent storage
- **Schema**: Elections, Candidates, Votes, Admin Settings tables
- **Relationships**: Foreign key constraints for data integrity
- **Transaction Support**: ACID compliance for vote recording

#### 3.2.4 Security Features
- **Authentication**: Password-based admin login with bcrypt hashing
- **Session Management**: HTTP-only cookies with 1-hour expiry
- **Context Isolation**: Electron context isolation prevents Node.js access from renderer
- **Input Validation**: Server-side validation of all inputs
- **Error Handling**: Secure error messages without exposing system details

---

## 4. Functional Requirements

### 4.1 Voter Interface Requirements

| Req ID | Requirement | Priority | Description |
|--------|------------|----------|-------------|
| VR-1.1 | Load Election Data | MUST | System SHALL load active election and candidates from database on startup |
| VR-1.2 | Display Candidates | MUST | System SHALL display all candidates with symbol, name, and tagline |
| VR-1.3 | Record Vote | MUST | System SHALL record voter selection to database when vote button clicked |
| VR-1.4 | Vote Confirmation | MUST | System SHALL display success message upon vote recording |
| VR-1.5 | Show Status | SHOULD | System SHOULD display election status (open/closed) and session time |
| VR-1.6 | Responsive Layout | SHOULD | System SHOULD adjust candidate grid layout based on candidate count |
| VR-1.7 | Disable Voting When Closed | MUST | System SHALL disable vote buttons when admin closes voting |
| VR-1.8 | Audio Feedback | NICE | System MAY provide beep sound on vote recording |
| VR-1.9 | VVPAT Display | NICE | System MAY show voter-verified paper audit trail (VVPAT) animation |

### 4.2 Admin Interface Requirements

| Req ID | Requirement | Priority | Description |
|--------|------------|----------|-------------|
| AR-2.1 | Admin Login | MUST | System SHALL require password authentication to access admin panel |
| AR-2.2 | Dashboard Overview | MUST | System SHALL display candidate count, total votes, and election status |
| AR-2.3 | Manage Candidates | MUST | System SHALL allow CRUD operations on candidates |
| AR-2.4 | Manage Elections | SHOULD | System SHALL allow editing election title, year, and voting status |
| AR-2.5 | View Results | MUST | System SHALL display real-time vote tallies for each candidate |
| AR-2.6 | Winner Determination | SHOULD | System SHOULD highlight leading candidate with vote count |
| AR-2.7 | Reset Votes | SHOULD | System SHALL allow admin to clear all votes with confirmation dialog |
| AR-2.8 | Backup Data | SHOULD | System SHALL export voting state to JSON file |
| AR-2.9 | Restore Data | SHOULD | System SHALL import voting state from JSON file |
| AR-2.10 | Change Password | SHOULD | System SHALL allow admin to change login password |
| AR-2.11 | Session Timeout | SHOULD | System SHALL log out admin after 1 hour of inactivity |
| AR-2.12 | Logout | MUST | System SHALL terminate admin session and return to login screen |

### 4.3 Data Management Requirements

| Req ID | Requirement | Priority | Description |
|--------|------------|----------|-------------|
| DR-3.1 | Persist Votes | MUST | System SHALL store all votes persistently in SQLite database |
| DR-3.2 | Vote Count Accuracy | MUST | System SHALL accurately count and display total votes |
| DR-3.3 | Candidate Vote Tracking | MUST | System SHALL track vote count per candidate |
| DR-3.4 | Data Integrity | MUST | System SHALL enforce foreign key constraints and referential integrity |
| DR-3.5 | Timestamp Recording | SHOULD | System SHOULD record voted_at timestamp for audit trail |
| DR-3.6 | Data Export | SHOULD | System SHOULD export voting results to JSON format |
| DR-3.7 | Data Validation | MUST | System SHALL validate candidate IDs before recording votes |

### 4.4 System Requirements

| Req ID | Requirement | Priority | Description |
|--------|------------|----------|-------------|
| SR-4.1 | Cross-Platform | MUST | Application SHALL run on Windows (10+) and macOS (10.13+) |
| SR-4.2 | Desktop Integration | SHOULD | Application SHALL use native desktop installers (.exe, .dmg) |
| SR-4.3 | Database Initialization | MUST | System SHALL automatically create database schema on first run |
| SR-4.4 | API Server | MUST | System SHALL expose REST API on port 3000 for data operations |
| SR-4.5 | Error Recovery | SHOULD | System SHALL recover gracefully from database errors |
| SR-4.6 | Performance | SHOULD | System SHALL respond to API requests within 500ms |
| SR-4.7 | Scalability | NICE | System SHOULD support up to 50 candidates without performance degradation |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- **Response Time**: API requests shall complete within 500ms
- **Database Operations**: Vote recording shall complete within 100ms
- **UI Rendering**: Candidate list shall render within 1 second
- **Startup Time**: Application shall launch within 3 seconds

### 5.2 Security
- **Password Hashing**: Admin passwords stored using bcrypt algorithm
- **Session Security**: HTTP-only cookies with secure flag in production
- **Input Validation**: All user inputs validated on server-side
- **Error Messages**: No sensitive system information in error responses
- **Context Isolation**: Electron renderer process isolated from Node.js

### 5.3 Reliability
- **Availability**: System shall maintain 99.9% uptime (excluding scheduled maintenance)
- **Data Loss Prevention**: ACID-compliant database transactions
- **Error Handling**: Graceful error handling with user-friendly messages
- **Backup**: Automatic data export capability for recovery

### 5.4 Maintainability
- **Code Organization**: Modular architecture with clear separation of concerns
- **Documentation**: Comprehensive API and user documentation
- **Testing**: Unit tests and E2E tests for critical functionality
- **Logging**: Detailed console logs for debugging (dev mode)

### 5.5 Usability
- **User Interface**: Intuitive, clear, and accessible design
- **Accessibility**: WCAG 2.1 Level A compliance
- **Help System**: Inline help and error messages
- **Consistency**: Consistent UI patterns across voting and admin interfaces

---

## 6. User Classes and Characteristics

### 6.1 Voters
- **Profile**: School students/staff participating in election
- **Technical Skill**: Low to moderate (basic computer usage)
- **Frequency**: Single vote per election
- **Requirements**: Simple, intuitive interface with clear instructions

### 6.2 Administrators
- **Profile**: School staff managing elections
- **Technical Skill**: Moderate (can operate admin panel)
- **Frequency**: Multiple sessions during election period
- **Requirements**: Comprehensive controls, data visibility, security

### 6.3 System Administrators
- **Profile**: IT personnel installing and maintaining system
- **Technical Skill**: High (developers/sysadmins)
- **Frequency**: Setup, maintenance, troubleshooting
- **Requirements**: Technical documentation, build scripts, debug tools

---

## 7. Use Cases

### 7.1 UC-1: Vote in Election
**Actors:** Voter  
**Preconditions:** Election is active, voting is open  
**Main Flow:**
1. Voter starts application and sees voting interface
2. System displays candidates with symbols and names
3. Voter selects candidate by clicking vote button
4. System records vote to database
5. System displays success confirmation
6. Voter sees updated total vote count

**Alternate Flows:**
- If voting is closed, vote buttons are disabled
- If database error occurs, error message is shown

### 7.2 UC-2: Login as Admin
**Actors:** Administrator  
**Preconditions:** Admin panel application running  
**Main Flow:**
1. Admin opens admin panel and sees login screen
2. Admin enters password and clicks submit
3. System verifies password against stored hash
4. System authenticates user and creates session
5. Admin sees dashboard with voting overview

**Alternate Flows:**
- If password is incorrect, error message shown
- If session exists, admin goes directly to dashboard

### 7.3 UC-3: Manage Candidates
**Actors:** Administrator  
**Preconditions:** Admin is authenticated, viewing admin panel  
**Main Flow:**
1. Admin navigates to Candidates section
2. System displays list of current candidates
3. Admin can: Add new, Edit existing, Delete candidate
4. Admin fills candidate details (name, symbol, tagline)
5. System validates and saves to database
6. System updates candidate list display

### 7.4 UC-4: View Election Results
**Actors:** Administrator  
**Preconditions:** Admin is authenticated, voting is underway  
**Main Flow:**
1. Admin navigates to Results section
2. System loads vote counts from database
3. System displays candidates ranked by vote count
4. System shows total votes cast
5. System highlights leading candidate

### 7.5 UC-5: Reset Votes
**Actors:** Administrator  
**Preconditions:** Admin is authenticated  
**Main Flow:**
1. Admin navigates to Results section
2. Admin clicks "Reset All Votes" button
3. System displays confirmation dialog
4. Admin confirms reset
5. System clears all votes from database
6. System resets vote counters

### 7.6 UC-6: Backup Voting Data
**Actors:** Administrator  
**Preconditions:** Admin is authenticated  
**Main Flow:**
1. Admin navigates to Backup section
2. Admin clicks "Export Data" button
3. System generates JSON export of voting state
4. System triggers file download
5. Admin saves backup file locally

---

## 8. Data Requirements

### 8.1 Data Dictionary

#### Elections Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PK, AI | Unique election identifier |
| year | INTEGER | NOT NULL | Election year (e.g., 2026) |
| title | TEXT | NOT NULL | Election name |
| is_active | INTEGER | NOT NULL, DEFAULT=1 | Voting status (1=open, 0=closed) |
| created_at | TEXT | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Creation timestamp |

#### Candidates Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PK, AI | Unique candidate identifier |
| election_id | INTEGER | FK, NOT NULL | Reference to election |
| code | TEXT | NOT NULL, UNIQUE | Candidate identifier code |
| name | TEXT | NOT NULL | Candidate full name |
| tagline | TEXT | Nullable | Candidate motto/tagline |
| symbol_path | TEXT | NOT NULL | Path to symbol SVG file |
| vote_count | INTEGER | NOT NULL, DEFAULT=0 | Current vote count |
| created_at | TEXT | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Creation timestamp |

#### Votes Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PK, AI | Unique vote identifier |
| election_id | INTEGER | FK, NOT NULL | Reference to election |
| candidate_id | INTEGER | FK, NOT NULL | Reference to candidate |
| voted_at | TEXT | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Vote timestamp |

#### Admin_Settings Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PK, AI | Unique setting identifier |
| admin_password_hash | TEXT | NOT NULL | Bcrypt hash of admin password |
| last_backup_path | TEXT | Nullable | Path to last backup file |
| updated_at | TEXT | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Last update timestamp |

### 8.2 Data Volume Expectations
- **Elections**: 1-5 per year
- **Candidates**: 4-12 per election
- **Votes**: Varies (100-1000+ per election)
- **Database Size**: < 10MB for typical usage

---

## 9. Interface Requirements

### 9.1 Voter Interface
- **Resolution**: 1200x1000 minimum (1920x1080 typical)
- **Layout**: Single-column candidate list with symbol badges
- **Colors**: Professional color scheme (green for vote, red for reset)
- **Typography**: Clear, readable fonts (15-18px)
- **Responsiveness**: Automatic layout adjustment for candidate count

### 9.2 Admin Interface
- **Resolution**: 1400x1000 minimum
- **Layout**: Multi-tab dashboard with sections (Home, Candidates, Election, Results, Backup, Security)
- **Navigation**: Clear menu/tab system
- **Controls**: Buttons for actions (Add, Edit, Delete, Reset, Export)
- **Feedback**: Status messages and confirmation dialogs

### 9.3 API Interface
- **Protocol**: HTTP REST
- **Content-Type**: application/json
- **Base URL**: http://localhost:3000
- **Authentication**: Session-based via express-session

---

## 10. Constraints and Assumptions

### 10.1 Constraints
- **Single Machine Deployment**: Designed for single-machine/local area network use
- **No Cloud Storage**: All data stored locally on machine
- **Offline Operation**: Requires no internet connection
- **Single Admin**: One admin user per installation
- **Database**: SQLite (not suitable for high-concurrency scenarios)

### 10.2 Assumptions
- **Hardware**: Standard desktop/laptop with 4GB+ RAM
- **OS**: Windows 10+ or macOS 10.13+
- **User Behavior**: Voters vote only once per election
- **Admin Trust**: Admin passwords are secret and managed securely
- **Elections**: One active election at a time

---

## 11. Acceptance Criteria

### 11.1 Voting System Acceptance
- [ ] All candidates display correctly with symbols and names
- [ ] Votes are recorded to database successfully
- [ ] Vote count updates in real-time
- [ ] Success message displays after vote
- [ ] Voting cannot occur when closed by admin
- [ ] Application launches within 3 seconds
- [ ] No crashes or errors during normal operation
- [ ] All E2E tests pass

### 11.2 Admin Panel Acceptance
- [ ] Admin login requires correct password
- [ ] Admin can view voting dashboard
- [ ] Admin can add/edit/delete candidates
- [ ] Admin can toggle voting open/closed
- [ ] Admin can view real-time results
- [ ] Admin can reset votes with confirmation
- [ ] Admin can export voting data
- [ ] All admin functions logged and traceable

### 11.3 Database Acceptance
- [ ] Schema initializes automatically
- [ ] All tables created with correct constraints
- [ ] Votes persist after application restart
- [ ] Vote counts remain accurate
- [ ] Foreign keys prevent orphaned records
- [ ] No data corruption on normal operation

---

## 12. Glossary

| Term | Definition |
|------|-----------|
| EVM | Electronic Voting Machine - physical voting interface |
| Voter | Person casting a vote in the election |
| Candidate | Person running for elected position |
| Vote | Act of selecting a candidate |
| Election | Formal process of voting for candidates |
| Admin | Administrative user with elevated privileges |
| Session | Authenticated connection to admin panel |
| Hash | One-way encryption of password |
| Foreign Key | Database constraint linking related records |
| VVPAT | Voter-Verified Paper Audit Trail |
| ACID | Atomicity, Consistency, Isolation, Durability (database properties) |

---

## 13. Sign-Off

**Document Version:** 1.0.0  
**Last Updated:** May 6, 2026  
**Status:** Approved for Development  

