<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>{{ config('app.name', 'School Voting System') }}</title>
  <link rel="stylesheet" href="{{ asset('css/evm.css') }}">
</head>
<body>
  <main class="machine-shell">
    <section class="machine-panel voting-panel" id="voting-panel">
      <header class="panel-header">
        <div class="header-with-logo">
          @if($election && $election->logo_path)
            <img src="{{ asset($election->logo_path) }}" alt="Logo" class="school-logo">
          @else
            <img src="{{ asset('assets/logobg.png') }}" alt="School Logo" class="school-logo">
          @endif
          <div>
            <p class="eyebrow" id="election-year-label">School Election {{ $election ? $election->year : '' }}</p>
            <h1 id="election-title">{{ $election ? $election->title : 'No Active Election' }}</h1>
          </div>
        </div>
        <div class="status-cluster">
          <div class="status-card">
            <span class="status-label">Mode</span>
            <strong id="voting-status">{{ $election && $election->is_active ? 'Voting Open' : 'Voting Closed' }}</strong>
          </div>
          <div class="status-card">
            <span class="status-label">Session</span>
            <strong id="session-time">--:--:--</strong>
          </div>
        </div>
      </header>

      <section class="instruction-bar">
        <span class="instruction-dot" aria-hidden="true"></span>
        Press one round vote button only once.
      </section>

      <section class="ballot-screen" id="ballot-screen" aria-live="polite">
        <div class="list-header">
          <span>Symbol</span>
          <span>Candidate</span>
          <span>Action</span>
        </div>
        <div id="candidate-list" class="candidate-list">
          @if($election && $election->candidates)
            @foreach($election->candidates as $candidate)
              <article class="candidate-row" data-candidate-id="{{ $candidate->id }}" data-candidate-name="{{ $candidate->name }}" data-candidate-tagline="{{ $candidate->tagline }}" data-candidate-symbol="{{ asset($candidate->symbol_path) }}">
                <div class="symbol-wrap">
                  <div class="symbol-badge">
                    <img src="{{ asset($candidate->symbol_path) }}" alt="{{ $candidate->name }} symbol">
                  </div>
                </div>
                <div>
                  <h2 class="candidate-name">{{ $candidate->name }}</h2>
                  <p class="candidate-tagline">{{ $candidate->tagline }}</p>
                </div>
                <button
                  type="button"
                  class="vote-button"
                  data-vote-button="{{ $candidate->id }}"
                  aria-label="Vote for {{ $candidate->name }}"
                  {{ !$election->is_active ? 'disabled' : '' }}
                >
                  {{ !$election->is_active ? 'Closed' : 'Vote' }}
                </button>
              </article>
            @endforeach
          @endif
        </div>
      </section>

      <footer class="panel-footer">
        <div class="message-box" id="message-box">
          {{ $election && $election->is_active ? 'Ready for the next student. Select a candidate to cast the vote.' : 'Voting is currently closed by the admin panel.' }}
        </div>
        <section class="vvpat-panel" id="vvpat-panel" aria-live="polite">
          <div class="vvpat-head">
            <span class="vvpat-label">Voter Slip Box</span>
            <span class="vvpat-status" id="vvpat-status">Waiting For Vote</span>
          </div>
          <div class="vvpat-box">
            <span class="vvpat-indicator" aria-hidden="true"></span>
            <span class="vvpat-slot" aria-hidden="true"></span>
            <div class="vvpat-placeholder" id="vvpat-placeholder">Slip box empty</div>
            <article class="vvpat-slip" id="vvpat-slip" aria-hidden="true">
              <div class="vvpat-slip-symbol">
                <img id="vvpat-slip-symbol" src="" alt="">
              </div>
              <div class="vvpat-slip-copy">
                <span class="vvpat-slip-title">Printed Vote</span>
                <strong id="vvpat-slip-name">Ready</strong>
                <span id="vvpat-slip-symbol-name">Awaiting selection</span>
              </div>
            </article>
          </div>
        </section>
        <button class="reset-button" id="reset-button" type="button">
          Reset For Next Student
        </button>
      </footer>
    </section>
  </main>

  <script>
    // Constants
    const candidateCount = {{ $election ? $election->candidates->count() : 0 }};
    const isVotingOpen = {{ $election && $election->is_active ? 'true' : 'false' }};
    const voteStoreUrl = "{{ route('vote.store') }}";
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // DOM Elements
    const candidateList = document.getElementById("candidate-list");
    const messageBox = document.getElementById("message-box");
    const resetButton = document.getElementById("reset-button");
    const sessionTime = document.getElementById("session-time");
    const ballotScreen = document.getElementById("ballot-screen");
    const votingPanel = document.getElementById("voting-panel");
    const vvpatPanel = document.getElementById("vvpat-panel");
    const vvpatSlip = document.getElementById("vvpat-slip");
    const vvpatStatus = document.getElementById("vvpat-status");
    const vvpatPlaceholder = document.getElementById("vvpat-placeholder");

    let selectedCandidateId = null;
    let activeAudioContext = null;
    let activeOscillator = null;
    let isVoting = false;

    // Functions
    function applyDensityMode() {
      if (!votingPanel) return;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const shouldUseSplitGrid = candidateCount >= 7 && viewportWidth >= 860;
      const shouldUseCompactMode = candidateCount >= 8 || (candidateCount >= 7 && viewportHeight < 860);
      const shouldUseDenseMode = !shouldUseCompactMode && (candidateCount >= 6 || viewportHeight < 780);

      votingPanel.classList.toggle("dense-mode", shouldUseDenseMode || shouldUseCompactMode);
      votingPanel.classList.toggle("compact-mode", shouldUseCompactMode);
      votingPanel.classList.toggle("split-grid-mode", shouldUseSplitGrid);
    }

    function updateClock() {
      const now = new Date();
      sessionTime.textContent = now.toLocaleTimeString("en-IN", { hour12: false });
    }

    function setMessage(text, tone = "default") {
      messageBox.textContent = text;
      messageBox.classList.remove("is-success", "is-reset");
      if (tone === "success") messageBox.classList.add("is-success");
      if (tone === "reset") messageBox.classList.add("is-reset");
    }

    function stopBeep() {
      if (activeOscillator) {
        try { activeOscillator.stop(); } catch (e) {}
      }
      if (activeAudioContext) {
        activeAudioContext.close().catch(() => {});
      }
      activeOscillator = null;
      activeAudioContext = null;
    }

    function playEVMBeep() {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      stopBeep();

      const audioContext = new AudioContextClass();
      const now = audioContext.currentTime;
      
      const beepPattern = [
        { start: 0, duration: 0.12, frequency: 1200 },
        { start: 0.15, duration: 0.12, frequency: 1400 },
        { start: 0.30, duration: 0.16, frequency: 1100 }
      ];

      activeAudioContext = audioContext;

      const repeatCount = 10;
      const patternDuration = 0.46;
      
      for (let i = 0; i < repeatCount; i++) {
        const timeOffset = now + (i * patternDuration);
        
        beepPattern.forEach((beep) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(beep.frequency, timeOffset + beep.start);
          
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

      const totalDuration = 10.12;
      window.setTimeout(() => {
        audioContext.close().catch(() => {});
        activeOscillator = null;
        activeAudioContext = null;
      }, totalDuration * 1000);
    }

    function animateVoterSlip(candidate) {
      if (!vvpatSlip || !vvpatPanel || !candidate) return;

      const slipSymbol = vvpatSlip.querySelector("#vvpat-slip-symbol");
      const slipName = vvpatSlip.querySelector("#vvpat-slip-name");
      const slipSymbolName = vvpatSlip.querySelector("#vvpat-slip-symbol-name");

      if (slipSymbol) {
        slipSymbol.src = candidate.symbol;
        slipSymbol.alt = `${candidate.name} - ${candidate.tagline}`;
      }
      if (slipName) slipName.textContent = candidate.name;
      if (slipSymbolName) slipSymbolName.textContent = candidate.tagline ? `${candidate.tagline} - ${candidate.name}` : `Vote for ${candidate.name}`;

      vvpatSlip.style.opacity = "";
      vvpatPanel.classList.add("is-printing", "has-slip");
      vvpatPlaceholder.style.display = "none";
      vvpatSlip.classList.remove("is-resting");
      vvpatSlip.classList.add("is-animating");

      vvpatStatus.textContent = "Vote Confirmed!";

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
        const isSelected = row.dataset.candidateId == selectedId;

        row.classList.toggle("is-selected", isSelected);
        row.classList.toggle("is-disabled", !isSelected);

        voteButton.disabled = true;
        voteButton.classList.toggle("is-selected", isSelected);
        voteButton.classList.toggle("is-locked", !isSelected);
        voteButton.textContent = isSelected ? "Done" : "Locked";
      });
    }

    function resetBallot() {
      if (!isVotingOpen) {
        setMessage("Voting is currently closed by the admin panel.");
        return;
      }
      
      selectedCandidateId = null;
      isVoting = false;
      stopBeep();

      document.querySelectorAll(".candidate-row").forEach((row) => {
        const voteButton = row.querySelector(".vote-button");
        row.classList.remove("is-selected", "is-disabled");
        voteButton.disabled = false;
        voteButton.classList.remove("is-selected", "is-locked");
        voteButton.textContent = "Vote";
      });

      vvpatPanel.classList.remove("is-printing", "has-slip");
      vvpatSlip.classList.remove("is-animating", "is-resting");
      vvpatSlip.style.opacity = "0";
      vvpatPlaceholder.style.display = "grid";
      vvpatStatus.textContent = "Waiting For Vote";

      setMessage("Ready for the next student. Select a candidate to cast the vote.", "reset");
    }

    // Event Listeners
    if (candidateList) {
      candidateList.addEventListener("click", async (event) => {
        const voteButton = event.target.closest(".vote-button");
        
        if (!voteButton || selectedCandidateId || !isVotingOpen || isVoting) {
          return;
        }

        const selectedId = voteButton.dataset.voteButton;
        const selectedRow = voteButton.closest(".candidate-row");
        const candidateInfo = {
            id: selectedId,
            name: selectedRow.dataset.candidateName,
            tagline: selectedRow.dataset.candidateTagline,
            symbol: selectedRow.dataset.candidateSymbol,
        };

        isVoting = true;

        try {
            const response = await fetch(voteStoreUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ candidate_id: selectedId })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                playEVMBeep();
                lockBallot(selectedId);
                launchConfetti(selectedRow);
                animateVoterSlip(candidateInfo);
                setMessage(`Vote recorded successfully for ${candidateInfo.name}.`, "success");
            } else {
                setMessage(data.message || 'Unable to record vote. Please check admin settings.', "reset");
                isVoting = false;
            }
        } catch (error) {
            console.error(error);
            setMessage('Network error. Please try again.', "reset");
            isVoting = false;
        }
      });
    }

    if (resetButton) {
        resetButton.addEventListener("click", resetBallot);
    }

    // Initialize
    applyDensityMode();
    updateClock();
    window.addEventListener("resize", applyDensityMode);
    window.setInterval(updateClock, 1000);

  </script>
</body>
</html>
