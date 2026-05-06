const adminLogin = document.getElementById("admin-login");
const adminDashboard = document.getElementById("admin-dashboard");
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const homeStatusPanel = document.getElementById("home-status-panel");
const homeWinnerPanel = document.getElementById("home-winner-panel");

async function renderHomeDashboard() {
  const state = await window.VotingStore.loadVotingState();
  const totalVotes = state.votes.length;
  const candidateCount = state.candidates.length;

  homeStatusPanel.innerHTML = `
    <div class="winner-stats">
      <div class="winner-stat">
        <span class="winner-stat-label">Candidates</span>
        <span class="winner-stat-value">${candidateCount}</span>
      </div>
      <div class="winner-stat">
        <span class="winner-stat-label">Total Votes</span>
        <span class="winner-stat-value">${totalVotes}</span>
      </div>
    </div>
  `;

  window.AdminApp.renderWinner(state, homeWinnerPanel);
}

async function openDashboard() {
  adminLogin.classList.add("hidden");
  adminDashboard.classList.remove("hidden");
  window.AdminApp.attachLogoutHandler();
  await renderHomeDashboard();
}

if (window.AdminApp.hasAdminSession()) {
  (async () => {
    await openDashboard();
  })();
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = document.getElementById("admin-password").value;

  try {
    // Attempt login via API
    await window.APIClient.adminLogin(password);
    
    window.AdminApp.setAdminSession(true);
    window.AdminApp.setBoxMessage(loginMessage, "Admin access granted.", "success");
    await openDashboard();
  } catch (error) {
    console.error("❌ Login failed:", error.message);
    window.AdminApp.setBoxMessage(loginMessage, "Incorrect password. Please try again.", "reset");
  }
});
