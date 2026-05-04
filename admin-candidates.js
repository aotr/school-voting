// Initialize candidates page when DOM is ready
console.log("admin-candidates.js loading...");

function initializeCandidatesPage() {
  if (!window.AdminApp) {
    console.error("❌ window.AdminApp not available - retrying in 500ms");
    setTimeout(initializeCandidatesPage, 500);
    return;
  }

  if (!window.AdminApp.initCandidatesPage) {
    console.error("❌ AdminApp.initCandidatesPage not available");
    console.log("Available AdminApp methods:", Object.keys(window.AdminApp));
    return;
  }

  console.log("✅ Starting admin candidates page initialization");
  window.AdminApp.initCandidatesPage();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCandidatesPage);
} else {
  // DOM already loaded
  initializeCandidatesPage();
}
