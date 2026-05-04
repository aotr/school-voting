const { contextBridge } = require("electron");
const path = require("path");
const { VotingStore } = require(path.join(__dirname, "db-direct.js"));

// Expose VotingStore directly via contextBridge (no IPC needed)
// Using _DBStore internally, VotingStore is the public API in storage.js
contextBridge.exposeInMainWorld("_DBStore", {
  // Database operations (direct, no IPC)
  loadVotingState: () => VotingStore.loadVotingState(),
  recordVote: (candidateId) => VotingStore.recordVote(candidateId),
  resetVotes: () => VotingStore.resetVotes(),
  updateCandidates: (candidates) => VotingStore.updateCandidates(candidates),
  getResults: () => VotingStore.getResults(),
  // Admin functions
  saveElection: (election) => VotingStore.saveElection(election),
  saveAdminPassword: (password) => VotingStore.saveAdminPassword(password),
  verifyAdminPassword: (password) => VotingStore.verifyAdminPassword(password),
  exportVotingState: () => VotingStore.exportVotingState(),
});
