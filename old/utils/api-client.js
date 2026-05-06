/**
 * HTTP API Client for voting system
 * Centralized fetch wrapper for all API calls from the frontend
 */

class APIClient {
  constructor(baseURL = "/api") {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Log the request
      console.log(`${config.method || "GET"} ${endpoint} - ${response.status}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`❌ API Error [${endpoint}]:`, error.message);
      throw error;
    }
  }

  // ==================== VOTING OPERATIONS ====================

  async getElection() {
    return this.request("/election", { method: "GET" });
  }

  async getResults() {
    return this.request("/results", { method: "GET" });
  }

  async recordVote(candidateId) {
    return this.request(`/vote/${candidateId}`, { method: "POST" });
  }

  // ==================== ADMIN OPERATIONS ====================

  async adminLogin(password) {
    return this.request("/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  }

  async adminLogout() {
    return this.request("/admin/logout", { method: "POST" });
  }

  async checkAdminStatus() {
    return this.request("/admin/status", { method: "GET" });
  }

  async updateCandidates(candidates) {
    return this.request("/admin/candidates", {
      method: "POST",
      body: JSON.stringify({ candidates }),
    });
  }

  async resetVotes() {
    return this.request("/admin/reset-votes", { method: "POST" });
  }

  async updateElection(election) {
    return this.request("/admin/election", {
      method: "POST",
      body: JSON.stringify({ election }),
    });
  }

  async updateAdminPassword(password) {
    return this.request("/admin/password", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  }

  async exportState() {
    return this.request("/export", { method: "GET" });
  }
}

// Create global instance
window.APIClient = new APIClient("/api");
