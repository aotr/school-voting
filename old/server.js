const express = require("express");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const { VotingStore, getDatabase } = require("./db-direct.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Session middleware for admin authentication
app.use(session({
  secret: "voting-system-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 3600000, // 1 hour
  },
}));

// Static files
app.use(express.static(path.join(__dirname)));

// Initialize database
try {
  const db = getDatabase();
  console.log("✅ Database initialized and ready");
} catch (error) {
  console.error("❌ Database initialization failed:", error);
  process.exit(1);
}

// ==================== API ROUTES ====================

// GET /api/election - Get active election and candidates
app.get("/api/election", (req, res) => {
  try {
    console.log("📊 GET /api/election - Loading election and candidates");
    const data = VotingStore.loadVotingState();
    
    if (!data) {
      return res.status(500).json({ error: "No active election found" });
    }

    res.json({
      election: {
        id: data.election.id,
        title: data.election.title,
        year: data.election.year,
        votingOpen: data.election.votingOpen,
      },
      candidates: data.candidates,
      totalVotes: data.totalVotes,
    });
  } catch (error) {
    console.error("❌ Error loading election:", error);
    res.status(500).json({ error: "Failed to load election data" });
  }
});

// GET /api/results - Get voting results
app.get("/api/results", (req, res) => {
  try {
    console.log("📈 GET /api/results - Loading results");
    const results = VotingStore.getResults();
    res.json(results);
  } catch (error) {
    console.error("❌ Error loading results:", error);
    res.status(500).json({ error: "Failed to load results" });
  }
});

// POST /api/vote/:candidateId - Record a vote
app.post("/api/vote/:candidateId", (req, res) => {
  try {
    const { candidateId } = req.params;
    console.log(`🗳️ POST /api/vote/${candidateId} - Recording vote`);

    const result = VotingStore.recordVote(candidateId);
    
    if (!result) {
      return res.status(400).json({ error: "Failed to record vote" });
    }

    const data = VotingStore.loadVotingState();
    res.json({
      success: true,
      message: "Vote recorded successfully",
      totalVotes: data.totalVotes,
    });
  } catch (error) {
    console.error("❌ Error recording vote:", error);
    res.status(500).json({ error: "Failed to record vote" });
  }
});

// POST /api/admin/login - Verify admin password and start session
app.post("/api/admin/login", (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: "Password required" });
    }

    console.log("🔐 POST /api/admin/login - Verifying password");
    const isValid = VotingStore.verifyAdminPassword(password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Set admin session
    req.session.isAdmin = true;
    console.log("✅ Admin password verified, session started");
    res.json({ success: true, message: "Admin access granted" });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// POST /api/admin/logout - End admin session
app.post("/api/admin/logout", (req, res) => {
  req.session.isAdmin = false;
  console.log("👋 Admin session ended");
  res.json({ success: true, message: "Logged out" });
});

// GET /api/admin/status - Check if admin session is active
app.get("/api/admin/status", (req, res) => {
  res.json({ isAdmin: req.session.isAdmin === true });
});

// Middleware to verify admin session
function requireAdmin(req, res, next) {
  if (req.session.isAdmin !== true) {
    return res.status(401).json({ error: "Admin access required" });
  }
  next();
}

// POST /api/admin/candidates - Update candidates (admin only)
app.post("/api/admin/candidates", requireAdmin, (req, res) => {
  try {
    const { candidates } = req.body;

    if (!Array.isArray(candidates)) {
      return res.status(400).json({ error: "Candidates must be an array" });
    }

    console.log(`📋 POST /api/admin/candidates - Updating ${candidates.length} candidates`);
    VotingStore.updateCandidates(candidates);

    const data = VotingStore.loadVotingState();
    res.json({
      success: true,
      message: "Candidates updated",
      candidates: data.candidates,
    });
  } catch (error) {
    console.error("❌ Error updating candidates:", error);
    res.status(500).json({ error: "Failed to update candidates" });
  }
});

// POST /api/admin/reset-votes - Reset all votes (admin only)
app.post("/api/admin/reset-votes", requireAdmin, (req, res) => {
  try {
    console.log("🔄 POST /api/admin/reset-votes - Resetting votes");
    VotingStore.resetVotes();

    res.json({
      success: true,
      message: "All votes have been reset",
    });
  } catch (error) {
    console.error("❌ Error resetting votes:", error);
    res.status(500).json({ error: "Failed to reset votes" });
  }
});

// POST /api/admin/election - Update election settings (admin only)
app.post("/api/admin/election", requireAdmin, (req, res) => {
  try {
    const { election } = req.body;

    if (!election) {
      return res.status(400).json({ error: "Election data required" });
    }

    console.log("📝 POST /api/admin/election - Updating election settings");
    VotingStore.saveElection(election);

    const data = VotingStore.loadVotingState();
    res.json({
      success: true,
      message: "Election updated",
      election: data.election,
    });
  } catch (error) {
    console.error("❌ Error updating election:", error);
    res.status(500).json({ error: "Failed to update election" });
  }
});

// POST /api/admin/password - Update admin password (admin only)
app.post("/api/admin/password", requireAdmin, (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "New password required" });
    }

    console.log("🔐 POST /api/admin/password - Updating admin password");
    VotingStore.saveAdminPassword(password);

    res.json({
      success: true,
      message: "Admin password updated",
    });
  } catch (error) {
    console.error("❌ Error updating password:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
});

// GET /api/export - Export voting state (admin only)
app.get("/api/export", requireAdmin, (req, res) => {
  try {
    console.log("📤 GET /api/export - Exporting voting state");
    const state = VotingStore.exportVotingState();

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=voting-state.json");
    res.send(state);
  } catch (error) {
    console.error("❌ Error exporting state:", error);
    res.status(500).json({ error: "Failed to export state" });
  }
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  console.warn(`⚠️ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("❌ Server error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🗳️ VOTING SYSTEM SERVER STARTED     ║
╠════════════════════════════════════════╣
║  📡 Server: http://localhost:${PORT}        ║
║  🗄️  Database: database/voting.db      ║
║  ✅ Ready for voting                   ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
