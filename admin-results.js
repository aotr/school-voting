console.log("📊 admin-results.js loaded");

if (document.readyState === "loading") {
  console.log("⏳ DOM still loading, waiting for DOMContentLoaded...");
  document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOMContentLoaded fired, initializing results page");
    window.AdminApp.initResultsPage();
  });
} else {
  console.log("✅ DOM already loaded, initializing results page");
  window.AdminApp.initResultsPage();
}
