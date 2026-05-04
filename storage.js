// Global error handlers for better debugging
window.addEventListener("unhandledrejection", (event) => {
  console.error("❌ Unhandled promise rejection:", event.reason);
  event.preventDefault(); // Prevent app crash
});

window.addEventListener("error", (event) => {
  console.error("❌ Uncaught error:", event.error);
});

const VOTING_STORAGE_KEY = "school-voting-system-state";
const CURRENT_SEED_VERSION = 2;

function buildSeedCandidates() {
  return [
    {
      id: "tuhina-khatun",
      name: "Tuhina Khatun",
      tagline: "Clock",
      symbolPath: "./assets/symbols/clock.svg",
      votes: 0,
    },
    {
      id: "jeanifer-mandi",
      name: "Jeanifer Mandi",
      tagline: "Galaxy",
      symbolPath: "./assets/symbols/galaxy.svg",
      votes: 0,
    },
    {
      id: "sumitra-hansda",
      name: "Sumitra Hansda",
      tagline: "Butterfly",
      symbolPath: "./assets/symbols/butterfly.svg",
      votes: 0,
    },
    {
      id: "rilamala-murmu",
      name: "Rilamala Murmu",
      tagline: "Olive Leaf",
      symbolPath: "./assets/symbols/olive-leaf.svg",
      votes: 0,
    },
    {
      id: "anish-kujur",
      name: "Anish Kujur",
      tagline: "Trophy",
      symbolPath: "./assets/symbols/trophy.svg",
      votes: 0,
    },
    {
      id: "devendra-sing",
      name: "Devendra Sing",
      tagline: "Tree",
      symbolPath: "./assets/symbols/tree.svg",
      votes: 0,
    },
    {
      id: "bikram-sing",
      name: "Bikram Sing",
      tagline: "Book",
      symbolPath: "./assets/symbols/book.svg",
      votes: 0,
    },
    {
      id: "sunit-mandi",
      name: "Sunit Mandi",
      tagline: "Equality",
      symbolPath: "./assets/symbols/equality.svg",
      votes: 0,
    },
  ];
}

function createDefaultVotingState() {
  return {
    seedVersion: CURRENT_SEED_VERSION,
    adminPassword: "admin123",
    election: {
      title: "Choose Your Candidate",
      year: 2026,
      votingOpen: true,
    },
    candidates: buildSeedCandidates(),
    votes: [],
  };
}

const DEFAULT_VOTING_STATE = createDefaultVotingState();

function cloneVotingState(state) {
  return JSON.parse(JSON.stringify(state));
}

function createCandidateId(name, index) {
  const normalized = String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || `candidate-${index + 1}`;
}

function normalizeCandidate(candidate, index) {
  return {
    id: candidate.id || createCandidateId(candidate.name, index),
    name: String(candidate.name || `Candidate ${index + 1}`).trim(),
    tagline: String(candidate.tagline || "").trim(),
    symbolPath: String(candidate.symbolPath || "").trim() || "./assets/symbols/clock.svg",
    votes: Number(candidate.votes || 0),
  };
}

function normalizeVotingState(rawState) {
  const fallback = cloneVotingState(DEFAULT_VOTING_STATE);
  const state = rawState && typeof rawState === "object" ? rawState : fallback;

  return {
    seedVersion: Number(state.seedVersion || fallback.seedVersion),
    adminPassword: String(state.adminPassword || fallback.adminPassword),
    election: {
      title: String(state.election?.title || fallback.election.title),
      year: Number(state.election?.year || fallback.election.year),
      votingOpen: Boolean(
        typeof state.election?.votingOpen === "boolean"
          ? state.election.votingOpen
          : fallback.election.votingOpen
      ),
    },
    candidates: Array.isArray(state.candidates) && state.candidates.length
      ? state.candidates.map(normalizeCandidate)
      : fallback.candidates.map(normalizeCandidate),
    votes: Array.isArray(state.votes) ? state.votes : [],
  };
}

function migrateVotingState(state) {
  if (Number(state.seedVersion) >= CURRENT_SEED_VERSION) {
    return state;
  }

  return normalizeVotingState({
    ...state,
    seedVersion: CURRENT_SEED_VERSION,
    candidates: buildSeedCandidates(),
    votes: [],
  });
}

// All localStorage functions removed - now using direct SQLite database via preload
// These were the old synchronous fallback functions, no longer needed

window.VotingStore = {
  // Direct database access (NO IPC, NO localStorage fallback)
  async loadVotingState() {
    try {
      console.log("📊 Loading state from DATABASE...");
      const data = window._DBStore.loadVotingState();
      console.log("✅ State loaded from DATABASE:", { 
        candidates: data?.candidates?.length, 
        votes: data?.totalVotes,
      });
      return data;
    } catch (error) {
      console.error("❌ Database load failed:", error.message);
      throw error;
    }
  },

  async recordVote(candidateId) {
    try {
      console.log(`🗳️ Recording vote for ${candidateId}...`);
      const result = window._DBStore.recordVote(candidateId);
      console.log("✅ Vote recorded in DATABASE");
      return result;
    } catch (error) {
      console.error("❌ Error recording vote:", error.message);
      throw error;
    }
  },

  async resetVotingState() {
    try {
      console.log("🔄 Resetting votes in DATABASE...");
      window._DBStore.resetVotes();
      console.log("✅ Votes reset in DATABASE");
      return { success: true };
    } catch (error) {
      console.error("❌ Error resetting votes:", error.message);
      throw error;
    }
  },

  async getResults() {
    try {
      console.log("📈 Loading results from DATABASE...");
      const results = window._DBStore.getResults();
      console.log("✅ Results loaded from DATABASE:", {
        candidates: results?.candidates?.length,
      });
      return results;
    } catch (error) {
      console.error("❌ Error loading results:", error.message);
      throw error;
    }
  },

  // Candidates persistence - Direct database only
  async saveCandidates(candidates) {
    if (!Array.isArray(candidates)) {
      console.error("❌ saveCandidates: candidates must be an array", candidates);
      throw new Error("Invalid candidates data");
    }
    
    console.log(`💾 Saving ${candidates.length} candidates to DATABASE...`);
    
    try {
      // Validate before save
      const validCandidates = candidates.filter(c => {
        const name = (c.name || "").trim();
        return name.length > 0;
      });

      if (validCandidates.length === 0) {
        throw new Error("No valid candidates to save");
      }

      window._DBStore.updateCandidates(validCandidates);
      console.log(`✅ ${validCandidates.length} candidates saved to DATABASE`);
      
      return { success: true, count: validCandidates.length, source: "database" };
    } catch (error) {
      console.error("❌ Error saving candidates:", error.message);
      throw error;
    }
  },

  saveElection,
  updateAdminPassword,
  verifyAdminPassword,
  exportVotingState,
  saveVotingState,
};

// Admin helper functions (using direct database)
function saveElection(election) {
  try {
    window._DBStore.saveElection(election);
    console.log("✅ Election saved");
    return true;
  } catch (error) {
    console.error("❌ Error saving election:", error.message);
    throw error;
  }
}

function saveVotingState(state) {
  // No-op: database handles persistence directly
  return state;
}

function updateAdminPassword(nextPassword) {
  try {
    window._DBStore.saveAdminPassword(nextPassword);
    console.log("✅ Admin password updated");
    return true;
  } catch (error) {
    console.error("❌ Error updating password:", error.message);
    throw error;
  }
}

function verifyAdminPassword(password) {
  try {
    return window._DBStore.verifyAdminPassword(password);
  } catch (error) {
    console.error("❌ Error verifying password:", error.message);
    return false;
  }
}

function exportVotingState() {
  try {
    return window._DBStore.exportVotingState();
  } catch (error) {
    console.error("❌ Error exporting state:", error.message);
    return "{}";
  }
}

// Initialize
if (typeof window !== "undefined" && window.VotingStore) {
  console.log("✅ VotingStore initialized - Using direct SQLite database (no IPC, no localStorage)");
}

