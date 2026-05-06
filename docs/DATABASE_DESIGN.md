# Database Design Document
## School Voting System - Database Schema & Design

**Version:** 1.0.0  
**Date:** May 2026  
**Database Type:** SQLite3  
**Database Driver:** better-sqlite3  

---

## 1. Database Overview

### 1.1 Purpose
The School Voting System uses SQLite3 to provide persistent, local data storage for elections, candidates, votes, and administrative settings. SQLite is lightweight, zero-configuration, and ideal for single-machine, offline-first applications.

### 1.2 Database Features
- **ACID Compliance**: Atomic, Consistent, Isolated, Durable transactions
- **Foreign Key Constraints**: Referential integrity enforcement
- **Schema Validation**: Type enforcement and not-null constraints
- **Indexes**: Performance optimization for queries
- **WAL Mode**: Write-Ahead Logging for improved concurrency

### 1.3 Database Location
- **Windows**: `%APPDATA%/Voter App/voting.db`
- **macOS**: `~/Library/Application Support/Voter App/voting.db`
- **Development**: `./database/voting.db`

---

## 2. Schema Design

### 2.1 Entity-Relationship Diagram

```
┌─────────────────────────┐
│      elections          │
├─────────────────────────┤
│ id (PK, AI)             │
│ year (INT)              │
│ title (TEXT)            │
│ is_active (INT)         │
│ created_at (TEXT)       │
└────────┬────────────────┘
         │
         │ 1:N
         │
    ┌────▼──────────────────┐
    │     candidates         │
    ├────────────────────────┤
    │ id (PK, AI)            │
    │ election_id (FK)       │
    │ code (TEXT, UNIQUE)    │
    │ name (TEXT)            │
    │ tagline (TEXT)         │
    │ symbol_path (TEXT)     │
    │ vote_count (INT)       │
    │ created_at (TEXT)      │
    └────┬──────────────────┬┘
         │                  │
         │ 1:N              │ 1:N
         │                  │
    ┌────▼──────────────────▼────┐
    │          votes              │
    ├─────────────────────────────┤
    │ id (PK, AI)                 │
    │ election_id (FK)            │
    │ candidate_id (FK)           │
    │ voted_at (TEXT)             │
    └─────────────────────────────┘

┌─────────────────────────────────┐
│   admin_settings                │
├─────────────────────────────────┤
│ id (PK, AI)                     │
│ admin_password_hash (TEXT)      │
│ last_backup_path (TEXT)         │
│ updated_at (TEXT)               │
└─────────────────────────────────┘
```

### 2.2 Table Definitions

#### Table: elections
**Purpose:** Stores election configurations  
**Cardinality:** 1-5 per year typically

```sql
CREATE TABLE IF NOT EXISTS elections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER NOT NULL,
  title TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Column Details:**

| Column | Type | Constraints | Description | Example |
|--------|------|-----------|-------------|---------|
| id | INTEGER | PK, AI | Unique identifier | 1 |
| year | INTEGER | NOT NULL | Election year | 2026 |
| title | TEXT | NOT NULL | Election name | "School Election 2026" |
| is_active | INTEGER | NOT NULL, DEFAULT=1 | Voting status (1=open, 0=closed) | 1 |
| created_at | TEXT | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Timestamp created | "2026-05-06T10:00:00Z" |

**Indexes:**
```sql
CREATE INDEX idx_elections_year ON elections(year);
CREATE INDEX idx_elections_is_active ON elections(is_active);
```

**Sample Data:**
```sql
INSERT INTO elections (year, title, is_active)
VALUES (2026, 'School Election 2026', 1);
```

---

#### Table: candidates
**Purpose:** Stores candidate information and vote counts  
**Cardinality:** 4-12 candidates per election typically

```sql
CREATE TABLE IF NOT EXISTS candidates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  election_id INTEGER NOT NULL,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT,
  symbol_path TEXT NOT NULL,
  vote_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE
);
```

**Column Details:**

| Column | Type | Constraints | Description | Example |
|--------|------|-----------|-------------|---------|
| id | INTEGER | PK, AI | Unique identifier | 1 |
| election_id | INTEGER | FK, NOT NULL | Reference to election | 1 |
| code | TEXT | NOT NULL, UNIQUE | Identifier code | "tuhina-khatun" |
| name | TEXT | NOT NULL | Full name | "Tuhina Khatun" |
| tagline | TEXT | Nullable | Symbol/motto | "Clock" |
| symbol_path | TEXT | NOT NULL | Path to SVG symbol | "assets/symbols/clock.svg" |
| vote_count | INTEGER | NOT NULL, DEFAULT=0 | Denormalized vote count | 15 |
| created_at | TEXT | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Timestamp created | "2026-05-06T10:05:00Z" |

**Indexes:**
```sql
CREATE INDEX idx_candidates_election_id ON candidates(election_id);
CREATE INDEX idx_candidates_code ON candidates(code);
CREATE INDEX idx_candidates_vote_count ON candidates(vote_count DESC);
```

**Constraints:**
- **Foreign Key**: election_id must reference elections(id)
- **Unique**: code is globally unique (enforced at application level per election)
- **Cascade Delete**: Deleting election cascades to delete candidates

**Sample Data:**
```sql
INSERT INTO candidates (election_id, code, name, tagline, symbol_path)
VALUES 
  (1, 'tuhina-khatun', 'Tuhina Khatun', 'Clock', 'assets/symbols/clock.svg'),
  (1, 'jeanifer-mandi', 'Jeanifer Mandi', 'Galaxy', 'assets/symbols/galaxy.svg');
```

---

#### Table: votes
**Purpose:** Stores individual vote records for audit trail  
**Cardinality:** 100-1000+ per election typically

```sql
CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  election_id INTEGER NOT NULL,
  candidate_id INTEGER NOT NULL,
  voted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);
```

**Column Details:**

| Column | Type | Constraints | Description | Example |
|--------|------|-----------|-------------|---------|
| id | INTEGER | PK, AI | Unique vote identifier | 1 |
| election_id | INTEGER | FK, NOT NULL | Reference to election | 1 |
| candidate_id | INTEGER | FK, NOT NULL | Reference to candidate | 1 |
| voted_at | TEXT | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Vote timestamp | "2026-05-06T10:15:23Z" |

**Indexes:**
```sql
CREATE INDEX idx_votes_election_id ON votes(election_id);
CREATE INDEX idx_votes_candidate_id ON votes(candidate_id);
CREATE INDEX idx_votes_voted_at ON votes(voted_at);
CREATE INDEX idx_votes_election_candidate ON votes(election_id, candidate_id);
```

**Constraints:**
- **Foreign Key (election_id)**: Must reference elections(id), cascade delete
- **Foreign Key (candidate_id)**: Must reference candidates(id), cascade delete
- **Immutable**: Votes should never be updated, only inserted/deleted

**Sample Data:**
```sql
INSERT INTO votes (election_id, candidate_id, voted_at)
VALUES 
  (1, 1, '2026-05-06T10:15:23Z'),
  (1, 1, '2026-05-06T10:16:45Z'),
  (1, 2, '2026-05-06T10:17:12Z');
```

---

#### Table: admin_settings
**Purpose:** Stores administrative configuration (password, backup settings)  
**Cardinality:** Exactly 1 record

```sql
CREATE TABLE IF NOT EXISTS admin_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_password_hash TEXT NOT NULL,
  last_backup_path TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Column Details:**

| Column | Type | Constraints | Description | Example |
|--------|------|-----------|-------------|---------|
| id | INTEGER | PK, AI | Unique identifier (always 1) | 1 |
| admin_password_hash | TEXT | NOT NULL | Bcrypt hash of admin password | "$2b$10$..." |
| last_backup_path | TEXT | Nullable | Path to last backup export | "/path/to/backup.json" |
| updated_at | TEXT | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | Last update timestamp | "2026-05-06T10:00:00Z" |

**Security Notes:**
- Password stored as **bcrypt hash**, never plain text
- Hashing algorithm: bcrypt (cost factor: 10)
- Default: password "admin123" pre-hashed during setup

**Sample Data:**
```sql
-- Example: password "admin123" hashed
INSERT INTO admin_settings (admin_password_hash)
VALUES ('$2b$10$...');  -- bcrypt hash
```

---

## 3. Data Model Details

### 3.1 Relationships

#### One-to-Many: Election → Candidates
- One election has many candidates
- Candidates cannot exist without election
- Deletion of election cascades to candidates
- Query: `SELECT * FROM candidates WHERE election_id = ?`

#### One-to-Many: Candidate → Votes
- One candidate receives many votes
- Votes record who was voted for
- Deletion of candidate cascades to votes
- Query: `SELECT COUNT(*) FROM votes WHERE candidate_id = ?`

#### One-to-Many: Election → Votes
- One election has many votes
- Votes linked to election for audit trail
- Deletion of election cascades to votes
- Query: `SELECT * FROM votes WHERE election_id = ?`

### 3.2 Data Integrity

**Referential Integrity:**
```sql
PRAGMA foreign_keys = ON;
```
This ensures:
- No orphaned candidates (must have valid election_id)
- No orphaned votes (must have valid election_id and candidate_id)
- Cascade deletes maintain consistency

**Uniqueness:**
```sql
UNIQUE (code)  -- Candidate code is unique globally
```

**Not Null Constraints:**
All critical fields are NOT NULL:
- elections: year, title, is_active
- candidates: election_id, code, name, symbol_path
- votes: election_id, candidate_id, voted_at
- admin_settings: admin_password_hash

### 3.3 Denormalization

**vote_count in candidates table:**
- Denormalized field for performance
- Counts votes per candidate
- Kept in sync via UPDATE on every vote
- Denormalization rationale: Frequent access, aggregate calculation

**Alternative (Normalized):**
```sql
-- Instead of vote_count, use:
SELECT COUNT(*) FROM votes WHERE candidate_id = ?
-- This is slower on large vote tables
```

---

## 4. Performance Optimization

### 4.1 Indexes

**Primary Indexes (automatically created with PK):**
```sql
-- Fast lookups by ID
CREATE INDEX idx_elections_id ON elections(id);
CREATE INDEX idx_candidates_id ON candidates(id);
CREATE INDEX idx_votes_id ON votes(id);
```

**Foreign Key Indexes:**
```sql
-- Fast lookups by foreign key
CREATE INDEX idx_candidates_election_id ON candidates(election_id);
CREATE INDEX idx_votes_election_id ON votes(election_id);
CREATE INDEX idx_votes_candidate_id ON votes(candidate_id);
```

**Query Optimization Indexes:**
```sql
-- Common query patterns
CREATE INDEX idx_elections_is_active ON elections(is_active);
CREATE INDEX idx_candidates_code ON candidates(code);
CREATE INDEX idx_candidates_vote_count ON candidates(vote_count DESC);
CREATE INDEX idx_votes_voted_at ON votes(voted_at);

-- Composite index for common join
CREATE INDEX idx_votes_election_candidate ON votes(election_id, candidate_id);
```

### 4.2 Query Performance

**Fast Queries (< 10ms with index):**
```sql
-- Get active election
SELECT * FROM elections WHERE is_active = 1 LIMIT 1;

-- Get candidate by code
SELECT * FROM candidates WHERE code = 'tuhina-khatun';

-- Count votes for candidate
SELECT vote_count FROM candidates WHERE id = 1;

-- Get results ranked
SELECT * FROM candidates WHERE election_id = 1 ORDER BY vote_count DESC;
```

**Slower Queries (may need optimization):**
```sql
-- Count total votes (without index)
SELECT COUNT(*) FROM votes WHERE election_id = 1;
-- Alternative: SUM(vote_count) FROM candidates

-- Get vote distribution
SELECT candidate_id, COUNT(*) as votes FROM votes 
GROUP BY candidate_id;
```

### 4.3 Database Configuration

```javascript
// Connection settings
db.pragma("journal_mode = WAL");        // Write-Ahead Logging
db.pragma("foreign_keys = ON");         // Enable foreign keys
db.pragma("synchronous = NORMAL");      // Balance safety/speed
db.pragma("cache_size = -64000");       // 64MB cache
```

**Benefits:**
- **WAL Mode**: Better concurrency, faster writes
- **Foreign Keys**: Referential integrity
- **NORMAL Sync**: Safe for most use cases
- **Cache Size**: Faster query execution

---

## 5. Data Operations

### 5.1 Common Queries

#### Record a Vote
```javascript
// Transaction: Insert vote + update candidate vote_count
db.exec("BEGIN TRANSACTION");
  db.prepare(
    `INSERT INTO votes (election_id, candidate_id, voted_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)`
  ).run(electionId, candidateId);
  
  db.prepare(
    `UPDATE candidates SET vote_count = vote_count + 1
     WHERE id = ?`
  ).run(candidateId);
db.exec("COMMIT");
```

#### Get Voting State
```javascript
const state = {
  election: db.prepare(
    `SELECT id, year, title, is_active as votingOpen
     FROM elections WHERE is_active = 1`
  ).get(),
  
  candidates: db.prepare(
    `SELECT id, code, name, tagline, symbol_path as symbolPath, 
            vote_count as votes
     FROM candidates WHERE election_id = ? ORDER BY id`
  ).all(electionId),
  
  totalVotes: db.prepare(
    `SELECT COUNT(*) as count FROM votes WHERE election_id = ?`
  ).get(electionId).count
};
```

#### Get Results
```javascript
const results = db.prepare(`
  SELECT c.id, c.code, c.name, c.vote_count as votes,
         ROUND(100.0 * c.vote_count / 
           (SELECT COUNT(*) FROM votes WHERE election_id = c.election_id), 2) 
           as percentage,
         ROW_NUMBER() OVER (ORDER BY c.vote_count DESC) as rank
  FROM candidates c
  WHERE c.election_id = ?
  ORDER BY c.vote_count DESC
`).all(electionId);
```

#### Reset Votes
```javascript
db.exec("BEGIN TRANSACTION");
  db.prepare(`DELETE FROM votes WHERE election_id = ?`).run(electionId);
  db.prepare(`UPDATE candidates SET vote_count = 0 
             WHERE election_id = ?`).run(electionId);
db.exec("COMMIT");
```

### 5.2 Transaction Management

**Atomic Operations:**
```javascript
// Ensure vote count and vote record stay in sync
try {
  db.exec("BEGIN IMMEDIATE");
  
  // Insert vote record
  const voteId = db.prepare(
    `INSERT INTO votes (election_id, candidate_id, voted_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)`
  ).run(electionId, candidateId).lastInsertRowid;
  
  // Update candidate count
  db.prepare(
    `UPDATE candidates SET vote_count = vote_count + 1
     WHERE id = ?`
  ).run(candidateId);
  
  db.exec("COMMIT");
  return { success: true, voteId };
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
}
```

### 5.3 Backup and Restore

**Export to JSON:**
```javascript
const backup = {
  timestamp: new Date().toISOString(),
  election: db.prepare(`SELECT * FROM elections WHERE id = ?`).get(electionId),
  candidates: db.prepare(`SELECT * FROM candidates WHERE election_id = ?`).all(electionId),
  votes: db.prepare(`SELECT * FROM votes WHERE election_id = ?`).all(electionId),
  adminSettings: db.prepare(`SELECT * FROM admin_settings`).get()
};

// Write to file
fs.writeFileSync('backup.json', JSON.stringify(backup, null, 2));
```

**Restore from JSON:**
```javascript
const backup = JSON.parse(fs.readFileSync('backup.json', 'utf8'));

db.exec("BEGIN TRANSACTION");
try {
  // Clear existing data
  db.prepare(`DELETE FROM votes WHERE election_id = ?`).run(backup.election.id);
  db.prepare(`DELETE FROM candidates WHERE election_id = ?`).run(backup.election.id);
  
  // Restore candidates
  backup.candidates.forEach(candidate => {
    db.prepare(
      `INSERT INTO candidates 
       (election_id, code, name, tagline, symbol_path, vote_count, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(
      candidate.election_id, candidate.code, candidate.name,
      candidate.tagline, candidate.symbol_path, candidate.vote_count,
      candidate.created_at
    );
  });
  
  // Restore votes
  backup.votes.forEach(vote => {
    db.prepare(
      `INSERT INTO votes (election_id, candidate_id, voted_at)
       VALUES (?, ?, ?)`
    ).run(vote.election_id, vote.candidate_id, vote.voted_at);
  });
  
  db.exec("COMMIT");
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
}
```

---

## 6. Schema Initialization

### 6.1 Schema File (schema.sql)
```sql
PRAGMA foreign_keys = ON;

-- Elections table
CREATE TABLE IF NOT EXISTS elections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER NOT NULL,
  title TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  election_id INTEGER NOT NULL,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT,
  symbol_path TEXT NOT NULL,
  vote_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  election_id INTEGER NOT NULL,
  candidate_id INTEGER NOT NULL,
  voted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- Admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_password_hash TEXT NOT NULL,
  last_backup_path TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert default data
INSERT INTO elections (year, title, is_active)
SELECT 2026, 'School Election 2026', 1
WHERE NOT EXISTS (SELECT 1 FROM elections WHERE year = 2026);

INSERT INTO candidates (election_id, code, name, tagline, symbol_path)
SELECT e.id, 'tuhina-khatun', 'Tuhina Khatun', 'Clock', 'assets/symbols/clock.svg'
FROM elections e WHERE e.year = 2026
AND NOT EXISTS (SELECT 1 FROM candidates WHERE code = 'tuhina-khatun');

-- ... more candidates ...
```

### 6.2 Initialization Code
```javascript
function initDatabase() {
  try {
    const db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");

    // Read and execute schema
    const schema = fs.readFileSync(
      path.join(__dirname, "schema.sql"),
      "utf8"
    );
    
    const statements = schema
      .split(";")
      .filter(s => s.trim());

    statements.forEach(statement => {
      if (statement.trim()) {
        db.exec(statement);
      }
    });

    console.log("✅ Database initialized successfully");
    return db;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}
```

---

## 7. Data Validation

### 7.1 Input Validation

| Field | Type | Validation | Example |
|-------|------|-----------|---------|
| election.year | INTEGER | 1900-2100 | 2026 |
| election.title | TEXT | 1-200 chars, non-empty | "School Election 2026" |
| election.is_active | INTEGER | 0 or 1 | 1 |
| candidate.code | TEXT | Alphanumeric, hyphens, unique | "tuhina-khatun" |
| candidate.name | TEXT | 1-100 chars, non-empty | "Tuhina Khatun" |
| candidate.tagline | TEXT | 0-50 chars | "Clock" |
| candidate.symbol_path | TEXT | Valid file path | "assets/symbols/clock.svg" |
| votes.candidate_id | INTEGER | Must exist in candidates | 1 |
| admin_password | TEXT | Minimum 8 chars | "admin123" |

### 7.2 Database Constraints

**NOT NULL Checks:**
- All IDs, names, and required fields checked
- Enforced at schema level

**UNIQUE Checks:**
- Candidate code globally unique
- Enforced via UNIQUE constraint

**FOREIGN KEY Checks:**
- Candidate election_id must reference valid election
- Vote election_id and candidate_id must be valid
- Enforced by database engine (PRAGMA foreign_keys = ON)

### 7.3 Application-Level Validation

```javascript
// Validate before insert
function validateVote(candidateId) {
  // Check candidate exists
  const candidate = db.prepare(
    "SELECT id FROM candidates WHERE id = ?"
  ).get(candidateId);
  
  if (!candidate) {
    throw new Error("Candidate not found");
  }
  
  // Check election is active
  const election = db.prepare(
    "SELECT is_active FROM elections WHERE is_active = 1"
  ).get();
  
  if (!election) {
    throw new Error("No active election");
  }
  
  return true;
}
```

---

## 8. Scalability Considerations

### 8.1 Current Limitations

| Aspect | Limit | Notes |
|--------|-------|-------|
| Database Size | ~10MB | Typical for 1000 votes |
| Candidates | 12-50 | Practical limit with performance |
| Votes | 10,000+ | Before noticeable slowdown |
| Concurrency | Low | SQLite locks during writes |
| Connections | 1 | Single-process Electron app |

### 8.2 Future Migration Path

**Phase 1 (Current):** SQLite local
- Single machine, offline-first
- Zero configuration
- Limited concurrency

**Phase 2:** PostgreSQL cloud
- Multi-machine deployment
- Better concurrency
- Network replication

**Phase 3:** Distributed DB
- Sharding by region
- Global scale
- Complex consistency requirements

---

## 9. Maintenance

### 9.1 Database Maintenance Tasks

**Vacuum (optimize storage):**
```sql
VACUUM;  -- Defragment database, recover space
```

**Analyze (optimize queries):**
```sql
ANALYZE;  -- Update statistics for query planner
```

**Backup:**
```bash
# Full backup
cp voting.db voting.db.backup

# Transaction-safe backup
sqlite3 voting.db ".backup backup.db"
```

### 9.2 Health Checks

```javascript
function healthCheck() {
  try {
    const election = db.prepare(
      "SELECT COUNT(*) as count FROM elections"
    ).get();
    
    const votes = db.prepare(
      "SELECT COUNT(*) as count FROM votes"
    ).get();
    
    return {
      status: "healthy",
      elections: election.count,
      totalVotes: votes.count,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: "error",
      error: error.message
    };
  }
}
```

---

## 10. Security Considerations

### 10.1 Data Protection

**Password Storage:**
- Bcrypt hashing (cost factor 10)
- Never store plain text passwords
- Use constant-time comparison for verification

**SQL Injection Prevention:**
- All queries use parameterized statements
- Never concatenate user input into SQL
- Database driver handles escaping

**Access Control:**
- Admin functions require session authentication
- Public voting endpoints unrestricted
- Session validation on all protected operations

### 10.2 Backup Security

**Backup Contents:**
- Includes complete voting data
- Does NOT include passwords (exported separately if needed)
- Timestamp to prevent accidental overwrites

**Backup Storage:**
- Local filesystem (typically user home directory)
- User responsible for securing backup files
- Recommended: Encrypt backups using OS-level encryption

---

## 11. Glossary

| Term | Definition |
|------|-----------|
| Primary Key (PK) | Unique identifier for each row |
| Foreign Key (FK) | Reference to another table's primary key |
| Autoincrement (AI) | Automatically generate unique ID |
| Denormalization | Store redundant data for performance |
| Index | Sorted data structure for fast lookups |
| Transaction | Group of operations as single atomic unit |
| ACID | Atomicity, Consistency, Isolation, Durability |
| WAL | Write-Ahead Logging for concurrency |
| Cascade Delete | Delete related records automatically |
| Pragma | SQLite configuration directive |

---

## Document Info

**Version:** 1.0.0  
**Last Updated:** May 6, 2026  
**Status:** Complete  

