console.log("📋 admin-election.js loaded");

if (document.readyState === "loading") {
  console.log("⏳ DOM still loading, waiting for DOMContentLoaded...");
  document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOMContentLoaded fired, initializing election page");
    window.AdminApp.initElectionPage();
  });
} else {
  console.log("✅ DOM already loaded, initializing election page");
  window.AdminApp.initElectionPage();
}
