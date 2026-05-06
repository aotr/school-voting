# System Architecture Document
## School Voting System - Desktop Edition

**Version:** 1.0.0  
**Date:** May 2026  
**Architecture Pattern:** Modular Desktop Application with REST API Backend  

---

## 1. Architecture Overview

The School Voting System follows a **modular monolith architecture** with clear separation between:
1. **Electron Main Process** - Application lifecycle and window management
2. **Renderer Process** - UI layer (voting and admin interfaces)
3. **Express.js Server** - REST API backend and business logic
4. **SQLite Database** - Persistent data storage

### 1.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  Electron Container                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │  Voter Window    │      │  Admin Window    │        │
│  │  (index.html)    │      │  (admin.html)    │        │
│  └────────┬─────────┘      └────────┬─────────┘        │
│           │                         │                    │
│           └──────────┬──────────────┘                    │
│                      │ HTTP Requests                     │
│                      │ (fetch API)                       │
│           ┌──────────▼──────────┐                       │
│           │   preload.js        │                       │
│           │ (Context Bridge)    │                       │
│           └──────────┬──────────┘                       │
│                      │                                   │
│                      │ Direct DB Access                 │
│           ┌──────────▼──────────┐                       │
│           │   db-direct.js      │                       │
│           │ (VotingStore)       │                       │
│           └──────────┬──────────┘                       │
│                      │                                   │
│                      │                                   │
│           ┌──────────▼──────────┐                       │
│           │   better-sqlite3    │                       │
│           │   (SQLite Driver)   │                       │
│           └──────────┬──────────┘                       │
│                      │                                   │
│                      │ Disk I/O                         │
│           ┌──────────▼──────────┐                       │
│           │   voting.db         │                       │
│           │   (SQLite Database) │                       │
│           └─────────────────────┘                       │
│                                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Express.js API Server (Port 3000)               │  │
│  │  ├─ GET  /api/election                           │  │
│  │  ├─ POST /api/vote/:candidateId                  │  │
│  │  ├─ GET  /api/results                            │  │
│  │  ├─ POST /api/admin/login                        │  │
│  │  ├─ POST /api/admin/candidates                   │  │
│  │  └─ POST /api/admin/reset-votes                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Component Architecture

### 2.1 Component Hierarchy

```
Application (main.js)
├── Main Process
│   ├── Window Management
│   ├── Menu System
│   └── IPC Handling
│
├── Voter Interface (index.html + app.js)
│   ├── Candidate Loading
│   ├── Vote Recording
│   ├── UI Animations
│   └── Status Display
│
├── Admin Interface (admin.html)
│   ├── Login Panel (admin-home.js)
│   ├── Dashboard (admin-home.js)
│   ├── Candidate Manager (admin-candidates.js)
│   ├── Election Manager (admin-election.js)
│   ├── Results Viewer (admin-results.js)
│   ├── Backup/Restore (admin-backup.js)
│   └── Security (admin-security.js)
│
├── Data Access Layer (db-direct.js + database/db.js)
│   ├── VotingStore API
│   ├── SQLite Operations
│   └── Transaction Management
│
├── API Server (server.js)
│   ├── Election Endpoints
│   ├── Voting Endpoints
│   ├── Admin Endpoints
│   └── Result Endpoints
│
└── Database (voting.db)
    ├── Elections Table
    ├── Candidates Table
    ├── Votes Table
    └── Admin Settings Table
```

### 2.2 Module Breakdown

#### Main Application Layer
| Module | Purpose | Dependencies |
|--------|---------|--------------|
| main.js | Electron app lifecycle, window management | electron |
| preload.js | Context bridge for secure API exposure | electron, db-direct.js |
| index.html | Voter interface markup | - |
| admin.html | Admin interface markup | - |

#### Frontend Layer
| Module | Purpose | Dependencies |
|--------|---------|--------------|
| app.js | Voter logic, animations, state management | storage.js, utils/api-client.js |
| styles.css | Voter interface styling | - |
| admin-home.js | Admin dashboard logic | storage.js, admin-common.js |
| admin-candidates.js | Candidate management logic | storage.js, admin-common.js |
| admin-election.js | Election configuration logic | storage.js, admin-common.js |
| admin-results.js | Results display logic | storage.js, admin-common.js |
| admin-backup.js | Backup/restore functionality | storage.js, admin-common.js |
| admin-security.js | Security settings logic | storage.js, admin-common.js |
| admin-common.js | Shared admin utilities | - |
| admin.css | Admin interface styling | - |

#### Backend Layer
| Module | Purpose | Dependencies |
|--------|---------|--------------|
| server.js | Express API server, routing, middleware | express, express-session, cors, db-direct.js |
| db-direct.js | VotingStore API, database operations | better-sqlite3, database/db.js |
| database/db.js | SQLite driver and utilities | better-sqlite3 |
| database/schema.sql | Database schema definition | - |
| storage.js | Browser-based storage API wrapper | db-direct.js (preload exposed) |
| utils/api-client.js | HTTP client for API calls | - |

---

## 3. Data Flow Architecture

### 3.1 Vote Recording Flow

```
Voter Interface (app.js)
        │
        │ User clicks "Vote" button
        │
        ▼
    JavaScript Handler
        │
        │ Calls window.APIClient.recordVote(candidateId)
        │
        ▼
    API Client (utils/api-client.js)
        │
        │ HTTP POST /api/vote/:candidateId
        │
        ▼
    Express Router (server.js)
        │
        │ Validates request
        │
        ▼
    VotingStore (db-direct.js)
        │
        │ recordVote(candidateId)
        │
        ▼
    SQLite Database (voting.db)
        │
        │ INSERT INTO votes (election_id, candidate_id, voted_at)
        │ UPDATE candidates SET vote_count = vote_count + 1
        │
        ▼
    Response to Client
        │
        │ { success: true, totalVotes: N }
        │
        ▼
    UI Update (app.js)
        │
        │ Display success message
        │ Update vote counter
        │ Disable vote button
```

### 3.2 Authentication Flow

```
Admin Interface (admin.html)
        │
        │ User enters password and submits
        │
        ▼
    Login Handler (admin-home.js)
        │
        │ Calls window.APIClient.adminLogin(password)
        │
        ▼
    API Client (utils/api-client.js)
        │
        │ HTTP POST /api/admin/login
        │ Body: { password: "user-input" }
        │
        ▼
    Express Router + Session Middleware (server.js)
        │
        │ Hash password input: bcrypt.hash(input)
        │ Compare with stored hash
        │
        ▼
    VotingStore.verifyAdminPassword(password)
        │
        │ Retrieved stored hash from admin_settings
        │ bcrypt.compare(input, hash)
        │
        ▼
    Session Creation (express-session)
        │
        │ req.session.admin = true
        │ Set HTTP-only cookie
        │
        ▼
    Response: { authenticated: true }
        │
        │
        ▼
    Admin Dashboard (admin-home.js)
        │
        │ Display dashboard
        │ Render candidates, results, etc.
```

### 3.3 Election Configuration Flow

```
Admin Interface (admin-election.js)
        │
        │ User modifies election settings
        │ (title, year, voting status)
        │
        ▼
    Save Handler
        │
        │ Calls window.APIClient.saveElection(electionData)
        │
        ▼
    API Client (utils/api-client.js)
        │
        │ HTTP POST /api/admin/election
        │ Requires: req.session.admin === true
        │
        ▼
    Express Router (server.js)
        │
        │ Validates session
        │ Validates input data
        │
        ▼
    VotingStore.saveElection(election)
        │
        │ UPDATE elections SET
        │   title = ?, year = ?, is_active = ?
        │
        ▼
    SQLite Database
        │
        │ UPDATE elections WHERE id = ?
        │
        ▼
    Response: { success: true }
        │
        │
        ▼
    UI Update (admin-election.js)
        │
        │ Refresh election display
        │ Show success message
```

---

## 4. Database Architecture

### 4.1 Entity-Relationship Diagram

```
┌─────────────────────┐
│    elections        │
├─────────────────────┤
│ id (PK)             │
│ year                │
│ title               │
│ is_active           │
│ created_at          │
└────────┬────────────┘
         │ 1
         │
         │ N
    ┌────▼──────────────────┐
    │   candidates           │
    ├────────────────────────┤
    │ id (PK)                │
    │ election_id (FK)       │
    │ code                   │
    │ name                   │
    │ tagline                │
    │ symbol_path            │
    │ vote_count             │
    │ created_at             │
    └────┬──────────────────┬┘
         │                  │
         │ 1                │ 1
         │                  │
    ┌────▼──────────────────▼───────────┐
    │        votes                        │
    ├─────────────────────────────────────┤
    │ id (PK)                             │
    │ election_id (FK)                    │
    │ candidate_id (FK)                   │
    │ voted_at                            │
    └─────────────────────────────────────┘

┌────────────────────────────┐
│   admin_settings           │
├────────────────────────────┤
│ id (PK)                    │
│ admin_password_hash        │
│ last_backup_path           │
│ updated_at                 │
└────────────────────────────┘
```

### 4.2 Data Integrity Constraints

**Foreign Key Constraints:**
- `candidates.election_id` → `elections.id` (ON DELETE CASCADE)
- `votes.election_id` → `elections.id` (ON DELETE CASCADE)
- `votes.candidate_id` → `candidates.id` (ON DELETE CASCADE)

**Unique Constraints:**
- `candidates.code` (UNIQUE per election via application logic)

**Not Null Constraints:**
- All primary keys, foreign keys, and required fields

**Default Values:**
- `candidates.vote_count` = 0
- `elections.is_active` = 1
- All `*_at` timestamps default to CURRENT_TIMESTAMP

---

## 5. API Architecture

### 5.1 API Endpoints

#### Public Endpoints (No Auth Required)
```
GET  /api/election
     Returns: { election, candidates, totalVotes }
     
POST /api/vote/:candidateId
     Body: {}
     Returns: { success, totalVotes }
     
GET  /api/results
     Returns: [{ candidate, voteCount, rank }...]
```

#### Protected Endpoints (Admin Session Required)
```
POST /api/admin/login
     Body: { password }
     Returns: { authenticated, message }
     Sets: session.admin = true
     
POST /api/admin/election
     Body: { election data }
     Returns: { success, message }
     
POST /api/admin/candidates
     Body: { action, candidateData }
     Returns: { success, candidates }
     
POST /api/admin/reset-votes
     Body: { confirmation: true }
     Returns: { success, message }
     
GET  /api/admin/export
     Returns: JSON file download
```

### 5.2 API Request/Response Format

**Request Format:**
```json
{
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "Cookie": "connect.sid=<session-id>"
  },
  "body": {
    "candidateId": 1,
    "password": "admin123"
  }
}
```

**Response Format (Success):**
```json
{
  "success": true,
  "message": "Operation completed",
  "data": {}
}
```

**Response Format (Error):**
```json
{
  "success": false,
  "error": "Error description",
  "statusCode": 400
}
```

---

## 6. Security Architecture

### 6.1 Security Layers

```
┌─────────────────────────────────────┐
│  Layer 1: Application Entry Point   │
│  Electron Context Isolation         │
│  Renderer process ≠ Node process    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Layer 2: API Communication         │
│  HTTP-only cookies                  │
│  Session validation                 │
│  CORS policy                        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Layer 3: Backend Validation        │
│  Input validation                   │
│  SQL parameter binding              │
│  Error handling                     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Layer 4: Data Storage              │
│  Password hashing (bcrypt)          │
│  Foreign key constraints            │
│  Database access control            │
└─────────────────────────────────────┘
```

### 6.2 Authentication & Authorization

**Authentication Method:** Password-based (bcrypt hashing)
- Admin password stored as bcrypt hash in admin_settings table
- Default credentials: username=admin, password=admin123 (MUST change in production)
- Password verification: `bcrypt.compare(input, hash)`

**Session Management:**
- Express-session middleware
- Session ID stored in HTTP-only cookie
- Secure flag set in production (HTTPS only)
- MaxAge: 3600000ms (1 hour)
- Automatic cleanup of expired sessions

**Authorization Rules:**
- Voting endpoints: No authentication required
- Admin endpoints: Require `req.session.admin === true`
- Session validation performed before each protected endpoint

### 6.3 Input Validation

**Voter Input:**
- Candidate ID must be integer
- Candidate must exist in database

**Admin Input:**
- Password: String, required for login
- Candidate data: name, tagline, symbol_path validated
- Election data: title, year validated
- All inputs sanitized before database operations

---

## 7. Deployment Architecture

### 7.1 Build Targets

```
Development Environment
├── npm start
├── Runs Express server on :3000
├── Loads HTML from file system
├── Dev tools enabled
└── Fast iteration

Production Build
├── electron-builder
├── Windows Target
│   ├── .exe installer
│   ├── Portable .exe
│   └── Bundled all dependencies
├── macOS Target
│   ├── .dmg installer
│   ├── .zip archive
│   └── Code signing (optional)
└── Single-file executables with embedded database
```

### 7.2 Installation & Distribution

**Windows:**
- Installer: `Voter App Setup.exe` (includes registry entries)
- Portable: `Voter App.exe` (no installation required)
- Start Menu shortcuts
- Uninstaller support

**macOS:**
- DMG installer: `Voter App.dmg` (drag-and-drop)
- ZIP archive: `Voter App-mac.zip` (portable)
- Applications folder integration
- Code signing optional

**Database Location:**
- Windows: `%APPDATA%/Voter App/voting.db`
- macOS: `~/Library/Application Support/Voter App/voting.db`

---

## 8. Scalability Considerations

### 8.1 Current Limitations
- **Single Machine**: No network distribution
- **SQLite**: Not suitable for high concurrency (> 100 concurrent votes)
- **No Sharding**: All data in single database
- **Memory**: Entire candidate list loaded into memory

### 8.2 Future Scaling Options
- **Migration Path 1**: PostgreSQL backend for multi-machine deployments
- **Migration Path 2**: Node.js clustering for multiple processes
- **Migration Path 3**: Load balancing with API replication
- **Migration Path 4**: Cloud-based deployment with distributed database

### 8.3 Performance Optimization
- **Database Indexing**: Indexes on election_id, candidate_id
- **Prepared Statements**: All queries use parameterized statements
- **Connection Pooling**: sqlite3 handles connection management
- **Caching**: Vote counts cached in candidate records

---

## 9. Technology Stack

| Layer | Component | Purpose | Version |
|-------|-----------|---------|---------|
| **Desktop** | Electron | Application framework | 27.x |
| **Frontend** | HTML/CSS/JavaScript | UI rendering | ES2020 |
| **Backend** | Express.js | REST API server | 4.18.x |
| **Database** | SQLite3 | Persistent storage | 3.x |
| **Database Driver** | better-sqlite3 | Node.js bindings | 9.2.x |
| **Session** | express-session | Authentication | 1.17.x |
| **Password** | bcryptjs | Password hashing | 2.4.x |
| **CORS** | cors | Cross-origin requests | 2.8.x |
| **Testing** | Playwright | E2E testing | 1.40.x |
| **Testing** | Jest | Unit testing | 29.7.x |

---

## 10. Decision Records

### ADR-001: Use Electron for Desktop App
**Context:** Need cross-platform desktop application  
**Decision:** Use Electron with context isolation  
**Consequences:**
- ✓ Single codebase for Windows/macOS
- ✓ Web technologies familiar to team
- ✗ Larger app size (~150MB)
- ✗ Slower startup than native

### ADR-002: Local SQLite Database
**Context:** Need persistent local data storage  
**Decision:** Use SQLite with better-sqlite3  
**Consequences:**
- ✓ Zero configuration
- ✓ No external dependencies
- ✓ ACID compliance
- ✗ Not suitable for distributed voting
- ✗ Limited concurrency

### ADR-003: REST API in Same Process
**Context:** API server architecture  
**Decision:** Embed Express.js in main Electron process  
**Consequences:**
- ✓ Simpler deployment
- ✓ Shared database connection
- ✓ No inter-process communication overhead
- ✗ Limited scalability
- ✗ Single process bottleneck

### ADR-004: Session-Based Authentication
**Context:** Admin panel security  
**Decision:** Use express-session with bcrypt password hashing  
**Consequences:**
- ✓ Standard, proven approach
- ✓ HTTP-only cookies secure against XSS
- ✓ Server-side session control
- ✗ Single server limitation (not distributed)
- ✗ No multi-factor authentication

---

## 11. Monitoring & Observability

### 11.1 Logging Strategy
- **Console Logs**: Development debugging (dev mode only)
- **Vote Tracking**: Every vote recorded with timestamp
- **Error Logging**: All errors logged with context
- **Audit Trail**: Admin actions and login attempts

### 11.2 Metrics
- Total votes recorded
- Votes per candidate
- Admin login attempts
- API response times
- Database operation times

### 11.3 Health Checks
```javascript
GET /api/health
Returns: { 
  status: "healthy",
  database: "connected",
  timestamp: "2026-05-06T10:30:00Z"
}
```

---

## 12. Architectural Constraints

| Constraint | Impact | Mitigation |
|-----------|--------|-----------|
| Single process | Restart causes downtime | Minimize restarts, auto-recovery |
| SQLite concurrency | Vote conflicts possible | Queue-based vote recording |
| Local storage only | No disaster recovery | Backup/export functionality |
| Fixed IP/port | Limited deployment options | Use localhost:3000 |
| No multi-tenancy | Single election per instance | Deploy multiple instances if needed |

---

## 13. Future Architecture Evolution

**Phase 2: Enhanced Admin Dashboard**
- Real-time voting updates via WebSocket
- Advanced analytics and reporting
- Multi-election support
- Audit logs and compliance reports

**Phase 3: Distributed Architecture**
- Migrate to PostgreSQL
- Implement message queue (RabbitMQ)
- Multi-server deployment
- API authentication tokens

**Phase 4: Cloud Integration**
- Deploy to AWS/Azure
- Cloud-based backups
- Multi-region replication
- Advanced monitoring/alerting

---

## Sign-Off

**Document Version:** 1.0.0  
**Date:** May 6, 2026  
**Architecture Review:** Approved  

