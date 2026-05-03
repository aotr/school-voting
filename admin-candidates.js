// Initialize candidates page when DOM is ready
if (window.AdminApp && window.AdminApp.initCandidatesPage) {
  window.AdminApp.initCandidatesPage();
} else {
  console.error("AdminApp or initCandidatesPage not available");
  console.log("window.AdminApp:", window.AdminApp);
}
