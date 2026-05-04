const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "voting.db");

// Initialize database
let db;

function initDatabase() {
  try {
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");

    // Create tables if they don't exist
    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    const statements = schema.split(";").filter((s) => s.trim());

    statements.forEach((statement) => {
      if (statement.trim()) {
        db.exec(statement);
      }
    });

    console.log("Database initialized successfully at", dbPath);
    return db;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}

// Get voting state
function getVotingState() {
  if (!db) initDatabase();

  try {
    const election = db
      .prepare(
        `SELECT id, year, title, is_active as votingOpen 
         FROM elections WHERE is_active = 1 LIMIT 1`
      )
      .get();

    if (!election) {
      return { election: null, candidates: [] };
    }

    const candidates = db
      .prepare(
        `SELECT id, code, name, tagline, symbol_path as symbolPath, vote_count as votes
         FROM candidates WHERE election_id = ? 
         ORDER BY id ASC`
      )
      .all(election.id);

    return {
      election: {
        id: election.id,
        year: election.year,
        title: election.title,
        votingOpen: election.votingOpen === 1,
      },
      candidates,
    };
  } catch (error) {
    console.error("Error getting voting state:", error);
    throw error;
  }
}

// Record a vote
function recordVote(candidateId) {
  if (!db) initDatabase();

  try {
    const candidate = db
      .prepare("SELECT id, name FROM candidates WHERE id = ?")
      .get(candidateId);

    if (!candidate) {
      throw new Error("Candidate not found");
    }

    const election = db
      .prepare("SELECT id FROM elections WHERE is_active = 1")
      .get();

    if (!election) {
      throw new Error("No active election");
    }

    // Record the vote
    const stmt = db.prepare(
      `INSERT INTO votes (election_id, candidate_id) VALUES (?, ?)`
    );
    stmt.run(election.id, candidateId);

    // Update vote count
    db.prepare(`UPDATE candidates SET vote_count = vote_count + 1 WHERE id = ?`).run(
      candidateId
    );

    return {
      id: candidate.id,
      name: candidate.name,
      success: true,
    };
  } catch (error) {
    console.error("Error recording vote:", error);
    throw error;
  }
}

// Get results
function getResults() {
  if (!db) initDatabase();

  try {
    const election = db
      .prepare("SELECT id FROM elections WHERE is_active = 1")
      .get();

    if (!election) {
      return { candidates: [], totalVotes: 0 };
    }

    const candidates = db
      .prepare(
        `SELECT 
          c.id, c.name, c.symbol_path as symbolPath, c.vote_count as voteCount,
          (SELECT COUNT(*) FROM votes WHERE election_id = ?) as totalVotes
         FROM candidates c
         WHERE c.election_id = ?
         ORDER BY c.vote_count DESC, c.id ASC`
      )
      .all(election.id, election.id);

    const totalVotes = candidates.length > 0 ? candidates[0].totalVotes : 0;

    return {
      candidates: candidates.map((c) => ({
        id: c.id,
        name: c.name,
        symbolPath: c.symbolPath,
        voteCount: c.voteCount,
        percentage: totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(2) : 0,
      })),
      totalVotes,
    };
  } catch (error) {
    console.error("Error getting results:", error);
    throw error;
  }
}

// Reset votes (admin function)
function resetVotes() {
  if (!db) initDatabase();

  try {
    const election = db
      .prepare("SELECT id FROM elections WHERE is_active = 1")
      .get();

    if (!election) {
      throw new Error("No active election");
    }

    // Clear votes
    db.prepare("DELETE FROM votes WHERE election_id = ?").run(election.id);

    // Reset vote counts
    db.prepare("UPDATE candidates SET vote_count = 0 WHERE election_id = ?").run(
      election.id
    );

    return { success: true, message: "All votes reset" };
  } catch (error) {
    console.error("Error resetting votes:", error);
    throw error;
  }
}

// Admin query (for admin panel)
function adminQuery(query, params = []) {
  if (!db) initDatabase();

  try {
    if (query.toLowerCase().startsWith("select")) {
      return db.prepare(query).all(...params);
    } else {
      return db.prepare(query).run(...params);
    }
  } catch (error) {
    console.error("Error executing admin query:", error);
    throw error;
  }
}

// Initialize on module load
if (!db) {
  initDatabase();
}

module.exports = {
  getVotingState,
  recordVote,
  getResults,
  resetVotes,
  adminQuery,
  db: () => db,
};
