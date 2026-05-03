const candidateList = document.getElementById("candidate-list");
const messageBox = document.getElementById("message-box");
const resetButton = document.getElementById("reset-button");
const sessionTime = document.getElementById("session-time");
const ballotScreen = document.getElementById("ballot-screen");
const votingPanel = document.getElementById("voting-panel");
const electionTitle = document.getElementById("election-title");
const electionYearLabel = document.getElementById("election-year-label");
const votingStatus = document.getElementById("voting-status");

let selectedCandidateId = null;
let lastRenderedCandidateCount = 0;
let activeAudioContext = null;
let activeOscillator = null;
const vvpatPanel = document.getElementById("vvpat-panel");
const vvpatSlip = document.getElementById("vvpat-slip");
const vvpatStatus = document.getElementById("vvpat-status");
const vvpatPlaceholder = document.getElementById("vvpat-placeholder");

function getState() {
  // This now returns a promise when using Electron IPC
  return window.VotingStore.loadVotingState();
}

function applyDensityMode(candidateCount) {
  if (!votingPanel) {
    return;
  }

  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const shouldUseSplitGrid = candidateCount >= 7 && viewportWidth >= 860;
  const shouldUseCompactMode = candidateCount >= 8 || (candidateCount >= 7 && viewportHeight < 860);
  const shouldUseDenseMode = !shouldUseCompactMode && (candidateCount >= 6 || viewportHeight < 780);

  votingPanel.classList.toggle("dense-mode", shouldUseDenseMode || shouldUseCompactMode);
  votingPanel.classList.toggle("compact-mode", shouldUseCompactMode);
  votingPanel.classList.toggle("split-grid-mode", shouldUseSplitGrid);
}

function renderElectionMeta(state) {
  electionTitle.textContent = state.election.title;
  electionYearLabel.textContent = `School Election ${state.election.year}`;
  votingStatus.textContent = state.election.votingOpen ? "Voting Open" : "Voting Closed";
}

async function renderCandidates() {
  const state = await getState();
  candidateList.innerHTML = "";
  lastRenderedCandidateCount = state.candidates.length;
  applyDensityMode(lastRenderedCandidateCount);

  state.candidates.forEach((candidate) => {
    const row = document.createElement("article");
    row.className = "candidate-row";
    row.dataset.candidateId = candidate.id;
    const votingDisabled = !state.election.votingOpen;

    row.innerHTML = `
      <div class="symbol-wrap">
        <div class="symbol-badge">
          <img src="${candidate.symbolPath}" alt="${candidate.name} symbol">
        </div>
      </div>
      <div>
        <h2 class="candidate-name">${candidate.name}</h2>
        <p class="candidate-tagline">${candidate.tagline}</p>
      </div>
      <button
        type="button"
        class="vote-button"
        data-vote-button="${candidate.id}"
        aria-label="Vote for ${candidate.name}"
        ${votingDisabled ? "disabled" : ""}
      >
        ${votingDisabled ? "Closed" : "Vote"}
      </button>
    `;

    candidateList.appendChild(row);
  });

  renderElectionMeta(state);

  if (!state.election.votingOpen) {
    setMessage("Voting is currently closed by the admin panel.");
  }
}

function updateClock() {
  const now = new Date();
  sessionTime.textContent = now.toLocaleTimeString("en-IN", {
    hour12: false,
  });
}

function setMessage(text, tone = "default") {
  messageBox.textContent = text;
  messageBox.classList.remove("is-success", "is-reset");

  if (tone === "success") {
    messageBox.classList.add("is-success");
  }

  if (tone === "reset") {
    messageBox.classList.add("is-reset");
  }
}

function stopBeep() {
  if (activeOscillator) {
    try {
      activeOscillator.stop();
    } catch (error) {
      // Ignore stop errors when the oscillator already ended.
    }
  }

  if (activeAudioContext) {
    activeAudioContext.close().catch(() => {});
  }

  activeOscillator = null;
  activeAudioContext = null;
}

function playBeep() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  stopBeep();

  const audioContext = new AudioContextClass();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const beepDuration = 10;

  activeAudioContext = audioContext;
  activeOscillator = oscillator;

  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(1360, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(1280, audioContext.currentTime + 2.4);
  oscillator.frequency.exponentialRampToValueAtTime(1420, audioContext.currentTime + 5.8);
  oscillator.frequency.exponentialRampToValueAtTime(1320, audioContext.currentTime + beepDuration);
  gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.11, audioContext.currentTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.09, audioContext.currentTime + 6.5);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + beepDuration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + beepDuration);

  oscillator.addEventListener("ended", () => {
    audioContext.close().catch(() => {});
    activeOscillator = null;
    activeAudioContext = null;
  });
}

function playEVMBeep() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  stopBeep();

  const audioContext = new AudioContextClass();
  const now = audioContext.currentTime;
  
  // Create a series of quick beeps like an EVM machine - 10 second duration
  const beepPattern = [
    { start: 0, duration: 0.12, frequency: 1200 },
    { start: 0.15, duration: 0.12, frequency: 1400 },
    { start: 0.30, duration: 0.16, frequency: 1100 }
  ];

  activeAudioContext = audioContext;

  // Repeat pattern to fill 10 seconds (pattern is ~0.46s, repeat 22 times for 10+ seconds)
  const repeatCount = 10;
  const patternDuration = 0.46;
  
  for (let i = 0; i < repeatCount; i++) {
    const timeOffset = now + (i * patternDuration);
    
    beepPattern.forEach((beep) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(beep.frequency, timeOffset + beep.start);
      
      // LOUDER: Increased gain from 0.15 to 0.35
      gainNode.gain.setValueAtTime(0, timeOffset + beep.start);
      gainNode.gain.linearRampToValueAtTime(0.35, timeOffset + beep.start + 0.02);
      gainNode.gain.linearRampToValueAtTime(0.33, timeOffset + beep.start + beep.duration - 0.02);
      gainNode.gain.linearRampToValueAtTime(0, timeOffset + beep.start + beep.duration);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start(timeOffset + beep.start);
      oscillator.stop(timeOffset + beep.start + beep.duration);
    });
  }

  const totalDuration = 10.12; // 10+ seconds
  window.setTimeout(() => {
    audioContext.close().catch(() => {});
    activeOscillator = null;
    activeAudioContext = null;
  }, totalDuration * 1000);
}

function animateVoterSlip(candidate) {
  if (!vvpatSlip || !vvpatPanel || !candidate) {
    return;
  }

  // Ensure candidate has all required properties
  const name = String(candidate.name || "Unknown Candidate");
  const tagline = String(candidate.tagline || "");
  const symbolPath = String(candidate.symbolPath || "./assets/symbols/clock.svg");

  // Update slip content
  const slipSymbol = vvpatSlip.querySelector("#vvpat-slip-symbol");
  const slipName = vvpatSlip.querySelector("#vvpat-slip-name");
  const slipSymbolName = vvpatSlip.querySelector("#vvpat-slip-symbol-name");

  if (slipSymbol) {
    slipSymbol.src = symbolPath;
    slipSymbol.alt = `${name} - ${tagline}`;
  }
  if (slipName) slipName.textContent = name;
  if (slipSymbolName) slipSymbolName.textContent = tagline ? `${tagline} - ${name}` : `Vote for ${name}`;

  // Reset inline styles and add classes to trigger animation
  vvpatSlip.style.opacity = "";  // Remove inline opacity to allow CSS to work
  vvpatPanel.classList.add("is-printing", "has-slip");
  vvpatPlaceholder.style.display = "none";
  vvpatSlip.classList.remove("is-resting");
  vvpatSlip.classList.add("is-animating");

  // Update status
  vvpatStatus.textContent = "Vote Confirmed!";

  // After animation completes, move to resting position
  window.setTimeout(() => {
    vvpatSlip.classList.remove("is-animating");
    vvpatSlip.classList.add("is-resting");
    vvpatStatus.textContent = "Slip Stored";
  }, 1200);
}

function launchConfetti(anchorRow) {
  const layer = document.createElement("div");
  layer.className = "confetti-layer";

  const colors = ["#f4c64c", "#2b9a5a", "#b4362c", "#21567a", "#ffffff"];
  const rowBounds = anchorRow.getBoundingClientRect();
  const screenBounds = ballotScreen.getBoundingClientRect();
  const topOffset = rowBounds.top - screenBounds.top + 20;

  for (let index = 0; index < 18; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.background = colors[index % colors.length];
    piece.style.left = `${12 + Math.random() * 82}%`;
    piece.style.top = `${topOffset}px`;
    piece.style.setProperty("--drift", `${-60 + Math.random() * 120}px`);
    piece.style.animationDelay = `${index * 16}ms`;
    layer.appendChild(piece);
  }

  ballotScreen.appendChild(layer);
  window.setTimeout(() => layer.remove(), 1100);
}

function lockBallot(selectedId) {
  selectedCandidateId = selectedId;

  document.querySelectorAll(".candidate-row").forEach((row) => {
    const voteButton = row.querySelector(".vote-button");
    const isSelected = row.dataset.candidateId === selectedId;

    row.classList.toggle("is-selected", isSelected);
    row.classList.toggle("is-disabled", !isSelected);

    voteButton.disabled = true;
    voteButton.classList.toggle("is-selected", isSelected);
    voteButton.classList.toggle("is-locked", !isSelected);
    voteButton.textContent = isSelected ? "Done" : "Locked";
  });
}

function resetBallot() {
  selectedCandidateId = null;
  stopBeep();

  document.querySelectorAll(".candidate-row").forEach((row) => {
    const voteButton = row.querySelector(".vote-button");

    row.classList.remove("is-selected", "is-disabled");
    voteButton.disabled = false;
    voteButton.classList.remove("is-selected", "is-locked");
    voteButton.textContent = "Vote";
  });

  // Reset VVPAT panel
  vvpatPanel.classList.remove("is-printing", "has-slip");
  vvpatSlip.classList.remove("is-animating", "is-resting");
  vvpatSlip.style.opacity = "0";
  vvpatPlaceholder.style.display = "grid";
  vvpatStatus.textContent = "Waiting For Vote";

  setMessage("Ready for the next student. Select a candidate to cast the vote.", "reset");
}

candidateList.addEventListener("click", async (event) => {
  const voteButton = event.target.closest(".vote-button");
  
  if (!voteButton || selectedCandidateId) {
    return;
  }

  // Await the state promise
  const state = await getState();

  if (!state.election.votingOpen) {
    return;
  }

  const selectedId = voteButton.dataset.voteButton;
  
  // Await the recordVote promise
  const candidate = await window.VotingStore.recordVote(selectedId);
  const selectedRow = voteButton.closest(".candidate-row");

  if (!candidate) {
    setMessage("Unable to record vote. Please check admin settings.", "reset");
    return;
  }

  playEVMBeep();
  lockBallot(selectedId);
  launchConfetti(selectedRow);
  animateVoterSlip(candidate);
  setMessage(`Vote recorded successfully for ${candidate.name}.`, "success");
});

resetButton.addEventListener("click", resetBallot);

// Initialize app
renderCandidates();
updateClock();
window.addEventListener("resize", () => applyDensityMode(lastRenderedCandidateCount));
window.setInterval(updateClock, 1000);
