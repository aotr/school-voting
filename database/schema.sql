PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS elections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER NOT NULL,
  title TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  election_id INTEGER NOT NULL,
  candidate_id INTEGER NOT NULL,
  voted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admin_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_password_hash TEXT NOT NULL,
  last_backup_path TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO elections (year, title, is_active)
SELECT 2026, 'School Election 2026', 1
WHERE NOT EXISTS (
  SELECT 1 FROM elections WHERE year = 2026
);

INSERT INTO candidates (election_id, code, name, tagline, symbol_path)
SELECT e.id, 'tuhina-khatun', 'Tuhina Khatun', 'Clock', 'assets/symbols/clock.svg'
FROM elections e
WHERE e.year = 2026
  AND NOT EXISTS (SELECT 1 FROM candidates WHERE code = 'tuhina-khatun');

INSERT INTO candidates (election_id, code, name, tagline, symbol_path)
SELECT e.id, 'jeanifer-mandi', 'Jeanifer Mandi', 'Galaxy', 'assets/symbols/galaxy.svg'
FROM elections e
WHERE e.year = 2026
  AND NOT EXISTS (SELECT 1 FROM candidates WHERE code = 'jeanifer-mandi');

INSERT INTO candidates (election_id, code, name, tagline, symbol_path)
SELECT e.id, 'sumitra-hansda', 'Sumitra Hansda', 'Butterfly', 'assets/symbols/butterfly.svg'
FROM elections e
WHERE e.year = 2026
  AND NOT EXISTS (SELECT 1 FROM candidates WHERE code = 'sumitra-hansda');

INSERT INTO candidates (election_id, code, name, tagline, symbol_path)
SELECT e.id, 'rilamala-murmu', 'Rilamala Murmu', 'Olive Leaf', 'assets/symbols/olive-leaf.svg'
FROM elections e
WHERE e.year = 2026
  AND NOT EXISTS (SELECT 1 FROM candidates WHERE code = 'rilamala-murmu');

INSERT INTO candidates (election_id, code, name, tagline, symbol_path)
SELECT e.id, 'anish-kujur', 'Anish Kujur', 'Trophy', 'assets/symbols/trophy.svg'
FROM elections e
WHERE e.year = 2026
  AND NOT EXISTS (SELECT 1 FROM candidates WHERE code = 'anish-kujur');

INSERT INTO candidates (election_id, code, name, tagline, symbol_path)
SELECT e.id, 'devendra-sing', 'Devendra Sing', 'Tree', 'assets/symbols/tree.svg'
FROM elections e
WHERE e.year = 2026
  AND NOT EXISTS (SELECT 1 FROM candidates WHERE code = 'devendra-sing');

INSERT INTO candidates (election_id, code, name, tagline, symbol_path)
SELECT e.id, 'bikram-sing', 'Bikram Sing', 'Book', 'assets/symbols/book.svg'
FROM elections e
WHERE e.year = 2026
  AND NOT EXISTS (SELECT 1 FROM candidates WHERE code = 'bikram-sing');

INSERT INTO candidates (election_id, code, name, tagline, symbol_path)
SELECT e.id, 'sunit-mandi', 'Sunit Mandi', 'Equality', 'assets/symbols/equality.svg'
FROM elections e
WHERE e.year = 2026
  AND NOT EXISTS (SELECT 1 FROM candidates WHERE code = 'sunit-mandi');
