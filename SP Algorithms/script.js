const algorithmDropdown = document.getElementById("algorithmDropdown");
const progressBar = document.getElementsByClassName("progress-bar")[0];
const speedControl = document.getElementsByClassName("speed-control")[0];
const playPauseBtn = document.getElementsByClassName("play")[0];
const playPauseIcon = document.getElementById("playPauseIcon");
const reverseBtn = document.getElementsByClassName("reverse")[0];
const forwardBtn = document.getElementsByClassName("forward")[0];
const restartBtn = document.getElementsByClassName("restart")[0];
const nSlider = document.getElementsByClassName("n-slider")[0];
const nValue = document.getElementsByClassName("array-size-value")[0];
const randomizeBtn = document.getElementsByClassName("randomize")[0];
const codeDisplay = document.getElementsByClassName("code-display")[0];

const codeSnippets = {
  prims: [
    "Initialize MST = {}",
    "Initialize priority queue Q with the start vertex",
    "Set key value of the start vertex to 0",
    "While Q is not empty:",
    "  u = vertex with minimum key in Q",
    "  Remove u from Q",
    "  For each neighbor v of u:",
    "    If v is in Q and weight(u, v) < key[v]:",
    "      Update key[v] = weight(u, v)",
    "      Set parent[v] = u",
    "MST is formed by the parent relationships",
  ],

  kruskal: [
    "Sort edges E by increasing weight",
    "Initialize empty MST = {}",
    "For each edge e in E:",
    "  If adding e to MST does not form a cycle:",
    "    Add e to MST",
    "  Else:",
    "    Ignore e",
    "Return MST",
  ],
};

function renderCode(algorithm) {
  const code = codeSnippets[algorithm];
  if (!code) {
    codeDisplay.innerHTML = `<div class="error">No code available for ${algorithm}</div>`;
    return;
  }

  codeDisplay.innerHTML = `<div class="code-line-wrapper">${code
    .map(
      (line, index) =>
        `<div class="code-line" data-line="${index}">${line}</div>`
    )
    .join("")}</div>`;
}

function highlightLines(lines) {
  document.querySelectorAll(".code-line").forEach((line) => {
    line.classList.remove("highlight");
  });

  lines.forEach((lineNumber) => {
    const line = document.querySelector(
      `.code-line[data-line="${lineNumber}"]`
    );
    if (line) line.classList.add("highlight");
  });
}

function restartTimeline() {
  progressBar.style.width = "0%";
  playPauseIcon.classList.remove("fa-pause");
  playPauseIcon.classList.add("fa-play");
  tl.restart();
  tl.pause();
}

function runSelectedAlgorithm() {
  // Get the selected value
  const selectedAlgorithm = algorithmDropdown.value;
  renderCode(selectedAlgorithm);
  // Run the selected sorting function
  if (selectedAlgorithm === "prims") {
    prims();
  } else if (selectedAlgorithm === "kruskal") {
    kruskal();
  }
}

// MST Algorithms
function kruskal() {}

function prims() {}

// Event Listeners
algorithmDropdown.addEventListener("change", () => {
  restartTimeline();
  tl.clear();

  runSelectedAlgorithm();
});

randomizeBtn.addEventListener("click", () => {
  restartTimeline();
  tl.clear();

  runSelectedAlgorithm();
});

playPauseBtn.addEventListener("click", () => {
  if (tl.progress() != 1) {
    if (tl.isActive()) {
      playPauseIcon.classList.remove("fa-pause");
      playPauseIcon.classList.add("fa-play");
      tl.pause();
    } else {
      playPauseIcon.classList.remove("fa-play");
      playPauseIcon.classList.add("fa-pause");
      tl.resume();
    }
  }
});

reverseBtn.addEventListener("click", () => {
  if (tl.progress() != 0) {
    playPauseIcon.classList.remove("fa-play");
    playPauseIcon.classList.add("fa-pause");
    tl.reverse();
  }
});

forwardBtn.addEventListener("click", () => {
  if (tl.progress() != 1) {
    playPauseIcon.classList.remove("fa-play");
    playPauseIcon.classList.add("fa-pause");
    tl.play();
  }
});

restartBtn.addEventListener("click", restartTimeline);

speedControl.addEventListener("change", (e) => {
  const speedFactor = parseFloat(e.target.value);
  tl.timeScale(speedFactor);
  playPauseIcon.classList.remove("fa-pause");
  playPauseIcon.classList.add("fa-play");
  tl.pause();
});

nSlider.addEventListener("input", () => {
  nValue.textContent = nSlider.value;
  restartTimeline();
  tl.clear();
  resetStats();

  runSelectedAlgorithm();
});

// Starting Point

// Create Timeline
let tl = gsap.timeline({
  paused: true,
  defaults: { duration: 0.5 },
  onUpdate: () => (progressBar.style.width = tl.progress() * 100 + "%"),
  onComplete: () => {
    playPauseIcon.classList.remove("fa-pause");
    playPauseIcon.classList.add("fa-play");
  },
  onReverseComplete: () => {
    playPauseIcon.classList.remove("fa-pause");
    playPauseIcon.classList.add("fa-play");
  },
});

runSelectedAlgorithm();
