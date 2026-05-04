// Direct SQLite database access (no IPC, no localStorage)
const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "database", "voting.db");
let db = null;

function initDatabase() {
  if (db) return db;
  
  try {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    console.log("✅ Database initialized at", DB_PATH);
    return db;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

function getDatabase() {
  if (!db) {
    initDatabase();
  }
  return db;
}

// Voting Store API - Direct database access
const VotingStore = {
  loadVotingState() {
    const database = getDatabase();
    
    try {
      // Get active election
      const election = database
        .prepare("SELECT id, title FROM elections WHERE is_active = 1")
        .get();

      if (!election) {
        console.error("❌ No active election found");
        return null;
      }

      // Get candidates
      const candidates = database
        .prepare(`
          SELECT id, code, name, tagline, symbol_path, vote_count
          FROM candidates
          WHERE election_id = ?
          ORDER BY id ASC
        `)
        .all(election.id);

      // Get votes
      const votes = database
        .prepare("SELECT COUNT(*) as count FROM votes WHERE election_id = ?")
        .get(election.id);

      console.log(`✅ Loaded from DATABASE: ${candidates.length} candidates, ${votes.count} votes`);

      return {
        election: {
          id: election.id,
          title: election.title,
        },
        candidates: candidates.map(c => ({
          id: c.code,
          name: c.name,
          tagline: c.tagline,
          symbolPath: c.symbol_path,
          votes: c.vote_count,
        })),
        totalVotes: votes.count,
        seedVersion: 2,
      };
    } catch (error) {
      console.error("❌ Error loading voting state:", error);
      throw error;
    }
  },

  recordVote(candidateId) {
    const database = getDatabase();
    
    try {
      // Get active election
      const election = database
        .prepare("SELECT id FROM elections WHERE is_active = 1")
        .get();

      if (!election) {
        throw new Error("No active election");
      }

      // Get candidate by code
      const candidate = database
        .prepare("SELECT id FROM candidates WHERE code = ? AND election_id = ?")
        .get(candidateId, election.id);

      if (!candidate) {
        throw new Error(`Candidate not found: ${candidateId}`);
      }

      // Record vote
      database.prepare(`
        INSERT INTO votes (election_id, candidate_id)
        VALUES (?, ?)
      `).run(election.id, candidate.id);

      // Update candidate vote count
      database.prepare(`
        UPDATE candidates
        SET vote_count = vote_count + 1
        WHERE id = ?
      `).run(candidate.id);

      console.log(`✅ Vote recorded for candidate ${candidateId}`);
      return true;
    } catch (error) {
      console.error("❌ Error recording vote:", error);
      throw error;
    }
  },

  resetVotes() {
    const database = getDatabase();
    
    try {
      const election = database
        .prepare("SELECT id FROM elections WHERE is_active = 1")
        .get();

      if (!election) {
        throw new Error("No active election");
      }

      // Delete all votes
      database.prepare("DELETE FROM votes WHERE election_id = ?").run(election.id);

      // Reset vote counts
      database.prepare(`
        UPDATE candidates
        SET vote_count = 0
        WHERE election_id = ?
      `).run(election.id);

      console.log("✅ All votes reset");
      return true;
    } catch (error) {
      console.error("❌ Error resetting votes:", error);
      throw error;
    }
  },

  getResults() {
    const database = getDatabase();
    
    try {
      const election = database
        .prepare("SELECT id FROM elections WHERE is_active = 1")
        .get();

      if (!election) {
        throw new Error("No active election");
      }

      const results = database
        .prepare(`
          SELECT code, name, vote_count
          FROM candidates
          WHERE election_id = ?
          ORDER BY vote_count DESC
        `)
        .all(election.id);

      const totalVotes = database
        .prepare("SELECT COUNT(*) as count FROM votes WHERE election_id = ?")
        .get(election.id);

      console.log(`✅ Results loaded: ${results.length} candidates, ${totalVotes.count} votes`);

      return {
        candidates: results.map(c => ({
          id: c.code,
          name: c.name,
          votes: c.vote_count,
        })),
        totalVotes: totalVotes.count,
      };
    } catch (error) {
      console.error("❌ Error loading results:", error);
      throw error;
    }
  },

  updateCandidates(candidates) {
    const database = getDatabase();
    
    try {
      if (!Array.isArray(candidates)) {
        throw new Error("Invalid candidates: must be an array");
      }

      const election = database
        .prepare("SELECT id FROM elections WHERE is_active = 1")
        .get();

      if (!election) {
        throw new Error("No active election found");
      }

      console.log(`🔄 Updating candidates for election ${election.id}...`);
      
      // Get current candidates for comparison
      const currentCandidates = database
        .prepare("SELECT id, name, code FROM candidates WHERE election_id = ?")
        .all(election.id);
      console.log(`📋 Current candidates in DB: ${currentCandidates.length}`);

      // CRITICAL GUARD: Prevent data loss from cascading updates
      const currentCount = currentCandidates.length;
      const newCount = candidates.filter(c => (c.name || "").trim()).length;
      const candidateLossThreshold = 2;
      
      if (newCount < currentCount - candidateLossThreshold) {
        const errorMsg = `❌ CRITICAL GUARD: Would lose ${currentCount - newCount} candidates (${currentCount} → ${newCount}). Rejecting update to prevent data loss.`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Delete existing candidates
      const deleteResult = database.prepare("DELETE FROM candidates WHERE election_id = ?").run(election.id);
      console.log(`🗑️ Deleted ${deleteResult.changes} old candidates`);

      // Insert new candidates
      const insertStmt = database.prepare(`
        INSERT INTO candidates (election_id, code, name, tagline, symbol_path, vote_count)
        VALUES (?, ?, ?, ?, ?, 0)
      `);

      let insertedCount = 0;
      candidates.forEach((candidate, index) => {
        const candidateCode = candidate.id || candidate.code || `candidate-${index + 1}`;
        const candidateName = (candidate.name || "").trim();
        
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

      console.log(`✅ Successfully inserted ${insertedCount} new candidates`);
      
      // Verify
      const verifyCount = database
        .prepare("SELECT COUNT(*) as count FROM candidates WHERE election_id = ?")
        .get(election.id);
      console.log(`✔️ Verification: Database now has ${verifyCount.count} candidates`);
      
      return true;
    } catch (error) {
      console.error("❌ Error updating candidates:", error);
      throw error;
    }
  },

  // Admin functions
  saveElection(election) {
    const database = getDatabase();
    
    try {
      const activeElection = database
        .prepare("SELECT id FROM elections WHERE is_active = 1")
        .get();

      if (!activeElection) {
        throw new Error("No active election found");
      }

      database.prepare(`
        UPDATE elections
        SET title = ?, year = ?
        WHERE id = ?
      `).run(election.title, election.year, activeElection.id);

      console.log("✅ Election updated");
      return true;
    } catch (error) {
      console.error("❌ Error saving election:", error);
      throw error;
    }
  },

  saveAdminPassword(password) {
    const database = getDatabase();
    
    try {
      // For now, just log this - password storage would need its own table
      console.log("⚠️ Note: Password persistence not yet implemented in database");
      return true;
    } catch (error) {
      console.error("❌ Error saving password:", error);
      throw error;
    }
  },

  verifyAdminPassword(password) {
    // For now, hardcoded password - would be in database in production
    // This matches the DEFAULT_VOTING_STATE password
    return password === "admin123";
  },

  exportVotingState() {
    try {
      const state = this.loadVotingState();
      return JSON.stringify(state, null, 2);
    } catch (error) {
      console.error("❌ Error exporting state:", error);
      throw error;
    }
  },
};

module.exports = { VotingStore, getDatabase };
