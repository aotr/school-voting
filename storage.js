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

function loadVotingState() {
  const raw = window.localStorage.getItem(VOTING_STORAGE_KEY);

  if (!raw) {
    const initialState = cloneVotingState(DEFAULT_VOTING_STATE);
    saveVotingState(initialState);
    return initialState;
  }

  try {
    const parsed = JSON.parse(raw);
    const normalized = migrateVotingState(normalizeVotingState(parsed));
    saveVotingState(normalized);
    return normalized;
  } catch (error) {
    const fallback = cloneVotingState(DEFAULT_VOTING_STATE);
    saveVotingState(fallback);
    return fallback;
  }
}

function saveVotingState(state) {
  window.localStorage.setItem(
    VOTING_STORAGE_KEY,
    JSON.stringify(normalizeVotingState(state))
  );
}

function recordVote(candidateId) {
  const state = loadVotingState();
  const candidate = state.candidates.find((item) => item.id === candidateId);

  if (!candidate || !state.election.votingOpen) {
    return null;
  }

  candidate.votes += 1;
  state.votes.push({
    candidateId,
    votedAt: new Date().toISOString(),
  });
  saveVotingState(state);
  return candidate;
}

function saveCandidates(candidates) {
  const state = loadVotingState();
  state.candidates = candidates
    .map((candidate, index) => normalizeCandidate(candidate, index))
    .filter((candidate) => candidate.name);
  saveVotingState(state);
  return state;
}

function saveElection(election) {
  const state = loadVotingState();
  state.election = {
    title: String(election.title || state.election.title).trim(),
    year: Number(election.year || state.election.year),
    votingOpen: Boolean(election.votingOpen),
  };
  saveVotingState(state);
  return state;
}

function updateAdminPassword(nextPassword) {
  const state = loadVotingState();
  state.adminPassword = String(nextPassword || "").trim() || state.adminPassword;
  saveVotingState(state);
  return state;
}

function verifyAdminPassword(password) {
  return loadVotingState().adminPassword === String(password);
}

function exportVotingState() {
  return JSON.stringify(loadVotingState(), null, 2);
}

function resetVotingState() {
  const initialState = cloneVotingState(DEFAULT_VOTING_STATE);
  saveVotingState(initialState);
  return initialState;
}

window.VotingStore = {
  // Async methods for Electron/IPC support
  async loadVotingState() {
    if (window.electronAPI) {
      try {
        return await window.electronAPI.getVotingState();
      } catch (error) {
        console.error("IPC Error:", error);
        return loadVotingState();
      }
    }
    return loadVotingState();
  },

  async recordVote(candidateId) {
    if (window.electronAPI) {
      try {
        return await window.electronAPI.recordVote(candidateId);
      } catch (error) {
        console.error("IPC Error:", error);
        return recordVote(candidateId);
      }
    }
    return recordVote(candidateId);
  },

  async resetVotingState() {
    if (window.electronAPI) {
      try {
        await window.electronAPI.resetVotes();
        return { success: true };
      } catch (error) {
        console.error("IPC Error:", error);
        return resetVotingState();
      }
    }
    return resetVotingState();
  },

  async getResults() {
    if (window.electronAPI) {
      try {
        return await window.electronAPI.getResults();
      } catch (error) {
        console.error("IPC Error:", error);
        const state = loadVotingState();
        return { candidates: state.candidates, totalVotes: 0 };
      }
    }
    const state = loadVotingState();
    return { candidates: state.candidates, totalVotes: 0 };
  },

  // Sync methods for localStorage (backwards compatible)
  saveCandidates,
  saveElection,
  updateAdminPassword,
  verifyAdminPassword,
  exportVotingState,
  saveVotingState,
};

