const ADMIN_SESSION_KEY = "school-voting-admin-session";
const PRESET_SYMBOL_OPTIONS = [
  { label: "Clock", value: "./assets/symbols/clock.svg" },
  { label: "Galaxy", value: "./assets/symbols/galaxy.svg" },
  { label: "Butterfly", value: "./assets/symbols/butterfly.svg" },
  { label: "Olive Leaf", value: "./assets/symbols/olive-leaf.svg" },
  { label: "Trophy", value: "./assets/symbols/trophy.svg" },
  { label: "Tree", value: "./assets/symbols/tree.svg" },
  { label: "Book", value: "./assets/symbols/book.svg" },
  { label: "Equality", value: "./assets/symbols/equality.svg" },
];

function setBoxMessage(element, message, tone) {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.classList.remove("is-success", "is-reset");

  if (tone === "success") {
    element.classList.add("is-success");
  }

  if (tone === "reset") {
    element.classList.add("is-reset");
  }
}

function setAdminSession(isLoggedIn) {
  if (isLoggedIn) {
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    return;
  }

  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

function hasAdminSession() {
  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

function requireAdminSession() {
  if (!hasAdminSession()) {
    window.location.href = "./admin.html";
    return false;
  }

  return true;
}

function attachLogoutHandler() {
  const logoutButton = document.getElementById("logout-button");

  if (!logoutButton) {
    return;
  }

  logoutButton.addEventListener("click", () => {
    setAdminSession(false);
    window.location.href = "./admin.html";
  });
}

function buildPresetOptions(selectedValue) {
  return PRESET_SYMBOL_OPTIONS.map((option) => `
    <option value="${option.value}" ${option.value === selectedValue ? "selected" : ""}>
      ${option.label}
    </option>
  `).join("");
}

function fillElectionForm(state) {
  const titleInput = document.getElementById("election-title-input");
  const yearInput = document.getElementById("election-year-input");
  const openInput = document.getElementById("voting-open-input");

  if (titleInput) {
    titleInput.value = state.election.title;
  }

  if (yearInput) {
    yearInput.value = state.election.year;
  }

  if (openInput) {
    openInput.checked = state.election.votingOpen;
  }
}

function renderResults(state, resultsList) {
  console.log("🎯 renderResults called with state:", state, "resultsList:", resultsList);
  
  if (!resultsList) {
    console.error("❌ renderResults: resultsList element not found");
    return;
  }

  if (!state) {
    console.error("❌ renderResults: state is null/undefined", state);
    resultsList.innerHTML = '<p class="support-text">Error: No state data</p>';
    return;
  }

  if (!state.candidates) {
    console.error("❌ renderResults: state.candidates is missing", state);
    resultsList.innerHTML = '<p class="support-text">Error: No candidates data</p>';
    return;
  }

  if (!Array.isArray(state.votes)) {
    console.warn("⚠️ renderResults: state.votes is not an array, treating as empty", state.votes);
    state.votes = [];
  }

  const totalVotes = state.votes.length;
  resultsList.innerHTML = "";

  state.candidates.forEach((candidate) => {
    const result = document.createElement("div");
    result.className = "result-item";
    result.innerHTML = `
      <strong>${candidate.name}</strong>
      <span>${candidate.votes || 0} vote(s)</span>
    `;
    resultsList.appendChild(result);
  });

  const total = document.createElement("div");
  total.className = "result-item";
  total.innerHTML = `
    <strong>Total Votes</strong>
    <span>${totalVotes}</span>
  `;
  resultsList.appendChild(total);
  console.log("✅ Results rendered successfully");
}

function renderWinner(state, winnerPanel) {
  console.log("👑 renderWinner called with state:", state, "winnerPanel:", winnerPanel);
  
  if (!winnerPanel) {
    console.error("❌ renderWinner: winnerPanel element not found");
    return;
  }

  if (!state || !state.candidates) {
    console.error("❌ renderWinner: state or candidates missing", state);
    winnerPanel.innerHTML = '<p class="winner-empty">Error loading data</p>';
    return;
  }

  const totalVotes = (state.votes || []).length;
  winnerPanel.innerHTML = "";

  if (!state.candidates.length) {
    winnerPanel.innerHTML = '<p class="winner-empty">No candidates available yet.</p>';
    return;
  }

  const sortedCandidates = [...state.candidates].sort((left, right) => right.votes - left.votes);
  const topVotes = sortedCandidates[0].votes;

  if (totalVotes === 0 || topVotes === 0) {
    winnerPanel.innerHTML = `
      <span class="winner-badge">Waiting</span>
      <p class="winner-empty">No votes recorded yet. The winner will appear here after voting starts.</p>
    `;
    console.log("ℹ️ No votes yet");
    return;
  }

  const leaders = sortedCandidates.filter((candidate) => candidate.votes === topVotes);
  const isTie = leaders.length > 1;
  const leadName = isTie ? leaders.map((candidate) => candidate.name).join(", ") : leaders[0].name;
  const leadSymbol = isTie ? "Tie" : leaders[0].tagline;
  const leadMargin = sortedCandidates[0].votes - (sortedCandidates[1]?.votes ?? 0);

  winnerPanel.innerHTML = `
    <span class="winner-badge">${isTie ? "Tie" : "Current Leader"}</span>
    <h3 class="winner-name">${leadName}</h3>
    <p class="winner-symbol">${leadSymbol}</p>
    <div class="winner-stats">
      <div class="winner-stat">
        <span class="winner-stat-label">Votes</span>
        <span class="winner-stat-value">${topVotes}</span>
      </div>
      <div class="winner-stat">
        <span class="winner-stat-label">${isTie ? "Leaders" : "Lead Margin"}</span>
        <span class="winner-stat-value">${isTie ? leaders.length : leadMargin}</span>
      </div>
    </div>
    <p class="winner-note ${isTie ? "is-tie" : ""}">
      ${isTie
        ? "Multiple candidates are tied for first place right now."
        : `${leaders[0].name} is currently ahead in the vote count.`}
    </p>
  `;
  console.log("✅ Winner rendered successfully, leader:", leadName);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function initElectionPage() {
  if (!requireAdminSession()) {
    return;
  }

  try {
    attachLogoutHandler();
    const securityMessage = document.getElementById("security-message");
    const electionForm = document.getElementById("election-form");
    
    if (!electionForm) {
      console.error("❌ Election form element not found");
      return;
    }
    
    fillElectionForm(await window.VotingStore.loadVotingState());

    electionForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      window.VotingStore.saveElection({
        title: document.getElementById("election-title-input").value,
        year: document.getElementById("election-year-input").value,
        votingOpen: document.getElementById("voting-open-input").checked,
      });

      setBoxMessage(securityMessage, "Election settings saved.", "success");
      fillElectionForm(await window.VotingStore.loadVotingState());
    });
  } catch (error) {
    console.error("❌ Error initializing election page:", error);
    const securityMessage = document.getElementById("security-message");
    if (securityMessage) {
      setBoxMessage(securityMessage, "Error loading election settings: " + error.message, "reset");
    }
  }
}

function initSecurityPage() {
  if (!requireAdminSession()) {
    return;
  }

  attachLogoutHandler();
  const passwordForm = document.getElementById("password-form");
  const securityMessage = document.getElementById("security-message");

  passwordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const nextPassword = document.getElementById("new-password-input").value.trim();

    if (nextPassword.length < 4) {
      setBoxMessage(securityMessage, "Password must be at least 4 characters.", "reset");
      return;
    }

    window.VotingStore.updateAdminPassword(nextPassword);
    document.getElementById("new-password-input").value = "";
    setBoxMessage(securityMessage, "Admin password updated.", "success");
  });
}

function renderCandidates(state, candidateForm) {
  if (!state || !state.candidates || !Array.isArray(state.candidates)) {
    console.error("❌ Invalid state or candidates array");
    candidateForm.innerHTML = "<p>Error loading candidates. Please refresh the page.</p>";
    return;
  }

  console.log(`🎨 Rendering ${state.candidates.length} candidates`);
  candidateForm.innerHTML = "";
  candidateForm.classList.toggle("two-column-mode", state.candidates.length >= 6);

  state.candidates.forEach((candidate, index) => {
    try {
      const row = document.createElement("div");
      row.className = "candidate-card";
      row.dataset.candidateIndex = index;
      row.dataset.symbolPath = candidate.symbolPath;
      const selectedPreset = PRESET_SYMBOL_OPTIONS.some((option) => option.value === candidate.symbolPath)
        ? candidate.symbolPath
        : "";
      const symbolLabel = candidate.tagline || "Symbol";

      row.innerHTML = `
        <div class="candidate-card-top">
          <div class="candidate-preview">
            <img src="${candidate.symbolPath}" alt="${candidate.name || "Candidate"} symbol" data-preview-image>
          </div>
          <div class="candidate-meta">
            <p class="candidate-index">Candidate ${index + 1}</p>
            <h3 class="candidate-current-name">${candidate.name || "New Candidate"}</h3>
            <p class="small-note" data-card-note>${symbolLabel}</p>
          </div>
        </div>
        <div class="candidate-fields">
          <label class="field">
            <span>Candidate Name</span>
            <input data-field="name" value="${candidate.name}" placeholder="Candidate Name">
          </label>
          <label class="field">
            <span>Candidate Code</span>
            <input data-field="id" value="${candidate.id}" placeholder="candidate-code">
          </label>
          <label class="field">
            <span>Symbol Name</span>
            <input data-field="tagline" value="${candidate.tagline}" placeholder="Clock">
          </label>
          <label class="field">
            <span>Preset Symbol</span>
            <select data-field="presetSymbol">
              <option value="">Keep current image</option>
              ${buildPresetOptions(selectedPreset)}
            </select>
          </label>
          <label class="field">
            <span>Upload Custom Symbol</span>
            <input data-field="symbolUpload" type="file" accept="image/*,.svg">
          </label>
          <p class="small-note">Uploaded images are stored inside this browser prototype. Preset symbols stay portable by default.</p>
        </div>
        <div class="candidate-actions">
          <button class="reset-button remove-button" type="button" data-remove-index="${index}">Remove</button>
        </div>
      `;
      candidateForm.appendChild(row);
    } catch (error) {
      console.error(`❌ Error rendering candidate ${index}:`, error);
    }
  });
  
  console.log(`✅ Successfully rendered all candidates`);
}

function collectCandidatesFromForm(candidateForm) {
  return Array.from(candidateForm.querySelectorAll(".candidate-card")).map((row) => {
    const presetSymbol = row.querySelector('[data-field="presetSymbol"]').value;
    const currentSymbolPath = row.dataset.symbolPath || "./assets/symbols/clock.svg";

    return {
      id: row.querySelector('[data-field="id"]').value,
      name: row.querySelector('[data-field="name"]').value,
      tagline: row.querySelector('[data-field="tagline"]').value,
      symbolPath: presetSymbol || currentSymbolPath,
    };
  });
}

function updateCandidateCardHeader(row) {
  const nameInput = row.querySelector('[data-field="name"]');
  const taglineInput = row.querySelector('[data-field="tagline"]');
  const title = row.querySelector(".candidate-current-name");
  const note = row.querySelector("[data-card-note]");

  title.textContent = nameInput.value.trim() || "New Candidate";
  note.textContent = taglineInput.value.trim() || "Symbol";
}

function initCandidatesPage() {
  if (!requireAdminSession()) {
    return;
  }

  attachLogoutHandler();
  const candidateForm = document.getElementById("candidate-form");
  const addCandidateButton = document.getElementById("add-candidate-button");
  const saveCandidatesButton = document.getElementById("save-candidates-button");
  const backupMessage = document.getElementById("backup-message");

  // Validate all required elements exist
  if (!candidateForm) {
    console.error("❌ candidate-form element not found!");
    console.error("Available IDs:", Array.from(document.querySelectorAll("[id]")).map(el => el.id));
    return;
  }

  if (!addCandidateButton) {
    console.error("❌ add-candidate-button not found!");
    return;
  }

  if (!saveCandidatesButton) {
    console.error("❌ save-candidates-button not found!");
    return;
  }

  console.log("✅ All required elements found for candidates page");

  async function refreshCandidates() {
    try {
      const state = await window.VotingStore.loadVotingState();
      console.log("📋 Loading candidates:", state.candidates);
      console.log("   Total candidates:", state.candidates ? state.candidates.length : 0);
      renderCandidates(state, candidateForm);
      console.log("✅ Candidates rendered successfully");
    } catch (error) {
      console.error("❌ Error loading candidates:", error);
      backupMessage.textContent = "Error loading candidates. Check console.";
    }
  }

  refreshCandidates();

  addCandidateButton.addEventListener("click", async () => {
    console.log("➕ Adding new candidate");
    const state = await window.VotingStore.loadVotingState();
    state.candidates.push({
      id: `candidate-${state.candidates.length + 1}`,
      name: "New Candidate",
      tagline: "Symbol",
      symbolPath: "./assets/symbols/clock.svg",
      votes: 0,
    });
    window.VotingStore.saveVotingState(state);
    await refreshCandidates();
  });

  candidateForm.addEventListener("input", (event) => {
    const row = event.target.closest(".candidate-card");

    if (!row) {
      return;
    }

    if (event.target.matches('[data-field="name"], [data-field="tagline"]')) {
      updateCandidateCardHeader(row);
    }
  });

  candidateForm.addEventListener("change", async (event) => {
    const row = event.target.closest(".candidate-card");

    if (!row) {
      return;
    }

    if (event.target.matches('[data-field="presetSymbol"]')) {
      const selectedValue = event.target.value;

      if (selectedValue) {
        row.dataset.symbolPath = selectedValue;
        row.querySelector("[data-preview-image]").src = selectedValue;
      }
      return;
    }

    if (event.target.matches('[data-field="symbolUpload"]')) {
      const file = event.target.files && event.target.files[0];

      if (!file) {
        return;
      }

      try {
        const dataUrl = await readFileAsDataUrl(file);
        row.dataset.symbolPath = dataUrl;
        row.querySelector('[data-field="presetSymbol"]').value = "";
        row.querySelector("[data-preview-image]").src = dataUrl;
        setBoxMessage(backupMessage, `Loaded custom symbol for ${row.querySelector('[data-field="name"]').value || "candidate"}.`, "success");
      } catch (error) {
        setBoxMessage(backupMessage, "Could not load uploaded image. Please try another file.", "reset");
      }
    }
  });

  candidateForm.addEventListener("click", async (event) => {
    const removeButton = event.target.closest("[data-remove-index]");

    if (!removeButton) {
      return;
    }

    const candidates = collectCandidatesFromForm(candidateForm);
    const removeIndex = Number(removeButton.dataset.removeIndex);
    console.log(`🗑️ Removing candidate at index ${removeIndex}`);
    candidates.splice(removeIndex, 1);
    
    if (candidates.length === 0) {
      setBoxMessage(backupMessage, "You must keep at least one candidate.", "reset");
      return;
    }

    const state = window.VotingStore.saveCandidates(candidates);
    await refreshCandidates();
    setBoxMessage(backupMessage, "Candidate removed.", "reset");
  });

  if (saveCandidatesButton) {
    saveCandidatesButton.addEventListener("click", async () => {
      console.log("💾 Saving candidates");
      const candidates = collectCandidatesFromForm(candidateForm).filter((candidate) => candidate.name.trim());

      if (!candidates.length) {
        setBoxMessage(backupMessage, "Add at least one candidate before saving.", "reset");
        return;
      }

      console.log("Saving", candidates.length, "candidates");
      window.VotingStore.saveCandidates(candidates);
      await refreshCandidates();
      setBoxMessage(backupMessage, "✅ Candidates saved successfully.", "success");
    });
  } else {
    console.error("❌ Could not attach save button listener - button not found");
  }
}

async function initResultsPage() {
  if (!requireAdminSession()) {
    return;
  }

  attachLogoutHandler();
  
  try {
    const state = await window.VotingStore.loadVotingState();
    console.log("📊 Results page loaded, state:", state);
    
    const votesHistoryElement = document.getElementById("votes-history");
    const votesMessageElement = document.getElementById("votes-message");
    const resetAllButton = document.getElementById("reset-all-votes-button");
    const resultsList = document.getElementById("results-list");
    const winnerPanel = document.getElementById("winner-panel");

    if (!state) {
      console.error("❌ Results page: state is null/undefined");
      if (votesMessageElement) {
        votesMessageElement.textContent = "Error: Could not load voting data";
        votesMessageElement.className = "message-box is-reset";
      }
      return;
    }

    console.log("✅ State loaded:", {
      candidatesCount: state.candidates?.length || 0,
      votesCount: state.votes?.length || 0,
      candidates: state.candidates
    });

    // Render voting history
    async function renderVotingHistory() {
      const updatedState = await window.VotingStore.loadVotingState();
      console.log("🔄 Rendering voting history, votes:", updatedState.votes);
      votesHistoryElement.innerHTML = "";

      if (!updatedState.votes || updatedState.votes.length === 0) {
        votesHistoryElement.innerHTML = "<p class='support-text'>No votes cast yet.</p>";
        return;
      }

    const votesList = document.createElement("ul");
    votesList.className = "votes-history-list";

    updatedState.votes.forEach((vote, index) => {
      const candidate = updatedState.candidates.find((c) => c.id === vote.candidateId);
      const candidateName = candidate ? candidate.name : "Unknown";
      const voteItem = document.createElement("li");
      voteItem.className = "vote-item";
      voteItem.innerHTML = `
        <span class="vote-number">#${index + 1}</span>
        <span class="vote-candidate">${candidateName}</span>
        <span class="vote-id">(${vote.candidateId})</span>
      `;
      votesList.appendChild(voteItem);
    });

    votesHistoryElement.appendChild(votesList);
    votesMessageElement.textContent = `${updatedState.votes.length} vote${updatedState.votes.length !== 1 ? "s" : ""} cast.`;
  }

  renderResults(state, document.getElementById("results-list"));
  renderWinner(state, document.getElementById("winner-panel"));
  await renderVotingHistory();

  // Reset all votes handler
  resetAllButton.addEventListener("click", async () => {
    const confirmed = confirm("Are you sure you want to reset ALL votes? This cannot be undone.");
    if (confirmed) {
      window.VotingStore.resetVotes();
      votesMessageElement.textContent = "All votes have been reset.";
      votesMessageElement.className = "message-box is-success";
      renderResults(await window.VotingStore.loadVotingState(), document.getElementById("results-list"));
      renderWinner(await window.VotingStore.loadVotingState(), document.getElementById("winner-panel"));
      await renderVotingHistory();
      setTimeout(() => {
        votesMessageElement.className = "message-box";
      }, 3000);
    }
  });
  } catch (error) {
    console.error("❌ Error initializing results page:", error);
    const votesMessageElement = document.getElementById("votes-message");
    if (votesMessageElement) {
      votesMessageElement.textContent = "Error loading results: " + error.message;
      votesMessageElement.className = "message-box is-reset";
    }
  }
}

function initBackupPage() {
  if (!requireAdminSession()) {
    return;
  }

  attachLogoutHandler();
  const exportButton = document.getElementById("export-button");
  const resetDemoButton = document.getElementById("reset-demo-button");
  const backupMessage = document.getElementById("backup-message");

  exportButton.addEventListener("click", () => {
    const blob = new Blob([window.VotingStore.exportVotingState()], {
      type: "application/json",
    });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = "voting_backup.json";
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
    setBoxMessage(backupMessage, "Backup exported as voting_backup.json.", "success");
  });

  resetDemoButton.addEventListener("click", () => {
    window.VotingStore.resetVotingState();
    setBoxMessage(backupMessage, "Prototype data reset to defaults.", "reset");
  });
}

window.AdminApp = {
  PRESET_SYMBOL_OPTIONS,
  setBoxMessage,
  setAdminSession,
  hasAdminSession,
  requireAdminSession,
  attachLogoutHandler,
  initElectionPage,
  initSecurityPage,
  initCandidatesPage,
  initResultsPage,
  initBackupPage,
  renderResults,
  renderWinner,
};
