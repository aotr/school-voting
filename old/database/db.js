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
      return { election: null, candidates: [], votes: [] };
    }

    const candidates = db
      .prepare(
        `SELECT id, code, name, tagline, symbol_path as symbolPath, vote_count as votes
         FROM candidates WHERE election_id = ? 
         ORDER BY id ASC`
      )
      .all(election.id);

    // Get vote history (voting records)
    const voteHistory = db
      .prepare(
        `SELECT id, candidate_id as candidateId, voted_at as votedAt
         FROM votes WHERE election_id = ?
         ORDER BY voted_at DESC`
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
      votes: voteHistory,
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
          c.id, c.name, c.symbol_path as symbolPath, c.vote_count as votes,
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
        votes: c.votes,
        percentage: totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(2) : 0,
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

// Update candidates (admin function)
function updateCandidates(candidates) {
  if (!db) initDatabase();

  try {
    if (!Array.isArray(candidates)) {
      throw new Error("Invalid candidates: must be an array");
    }

    const election = db
      .prepare("SELECT id FROM elections WHERE is_active = 1")
      .get();

    if (!election) {
      throw new Error("No active election found");
    }

    console.log(`🔄 Updating candidates for election ${election.id}...`);
    
    // Get current candidates for comparison
    const currentCandidates = db
      .prepare("SELECT id, name, code FROM candidates WHERE election_id = ?")
      .all(election.id);
    console.log(`📋 Current candidates in DB: ${currentCandidates.length}`);

    // CRITICAL GUARD: Prevent data loss from cascading updates
    const currentCount = currentCandidates.length;
    const newCount = candidates.filter(c => (c.name || "").trim()).length; // Count valid candidates
    const candidateLossThreshold = 2; // Allow up to 2 candidate loss (editing)
    
    if (newCount < currentCount - candidateLossThreshold) {
      const errorMsg = `❌ CRITICAL GUARD: Would lose ${currentCount - newCount} candidates (${currentCount} → ${newCount}). Rejecting update to prevent data loss.`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    // Delete existing candidates for this election (PREVENT DUPLICATES)
    const deleteResult = db.prepare("DELETE FROM candidates WHERE election_id = ?").run(election.id);
    console.log(`🗑️ Deleted ${deleteResult.changes} old candidates from database`);

    // Insert new candidates with duplicate prevention
    const insertStmt = db.prepare(
      `INSERT INTO candidates (election_id, code, name, tagline, symbol_path, vote_count)
       VALUES (?, ?, ?, ?, ?, 0)`
    );

    let insertedCount = 0;
    candidates.forEach((candidate, index) => {
      const candidateCode = candidate.id || candidate.code || `candidate-${index + 1}`;
      const candidateName = (candidate.name || "").trim();
      
      // Skip empty candidates
      if (!candidateName) {
        console.warn(`⚠️ Skipping empty candidate at index ${index}`);
        return;
      }
      
      try {
        insertStmt.run(
          election.id,
          candidateCode,
          candidateName,
          candidate.tagline || "",
          candidate.symbolPath || candidate.symbol_path || "./assets/symbols/clock.svg"
        );
        insertedCount++;
      } catch (err) {
        console.error(`❌ Error inserting candidate ${candidateCode}:`, err.message);
        throw err;
      }
    });

    console.log(`✅ Successfully inserted ${insertedCount} new candidates into database`);
    
    // Verify the insert
    const verifyCount = db
      .prepare("SELECT COUNT(*) as count FROM candidates WHERE election_id = ?")
      .get(election.id);
    console.log(`✔️ Verification: Database now has ${verifyCount.count} candidates for this election`);
    
    return { success: true, count: insertedCount, verified: verifyCount.count };
  } catch (error) {
    console.error("❌ Error updating candidates:", error);
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
  updateCandidates,
  adminQuery,
  db: () => db,
};
