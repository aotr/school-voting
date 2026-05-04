const { contextBridge, ipcRenderer } = require("electron");

// Expose secure IPC API to renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  // Database operations
  getVotingState: () => ipcRenderer.invoke("db:get-voting-state"),
  recordVote: (candidateId) => ipcRenderer.invoke("db:record-vote", candidateId),
  resetVotes: () => ipcRenderer.invoke("db:reset-votes"),
  updateCandidates: (candidates) => ipcRenderer.invoke("db:update-candidates", candidates),
  getResults: () => ipcRenderer.invoke("db:get-results"),
  adminQuery: (query, params) => ipcRenderer.invoke("db:admin-query", query, params),

  // Utility
  getAppPath: () => ipcRenderer.invoke("app:get-path"),
});
