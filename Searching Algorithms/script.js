const indexContainer = document.getElementsByClassName("index-container")[0];
const arrayContainer = document.getElementsByClassName("array-container")[0];
const algorithmDropdown = document.getElementById("algorithmDropdown");
const searchKey = document.getElementById("search-key");
const outputDisplay = document.getElementsByClassName("output")[0];

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
const searchBtn = document.getElementsByClassName("search-button")[0];
const iValueEle = document.getElementById("i-value");
const eleValueEle = document.getElementById("element-value");
const comparisonEle = document.getElementById("comparisons");
const lowIndexEle = document.getElementById("low-index");
const highIndexEle = document.getElementById("high-index");
const midIndexEle = document.getElementById("mid-index");
const codeDisplay = document.getElementsByClassName("code-display")[0];

const complexity = {
  linearSearch: { time: "O(N)", space: "O(1)" },
  binarySearch: { time: "O(N log N)", space: "O(1)" },
};

const statsVisibility = {
  linearSearch: [
    "i-value",
    "element-value",
    "comparisons",
    "time-complexity",
    "space-complexity",
  ],
  binarySearch: [
    "low-index",
    "mid-index",
    "high-index",
    "comparisons",
    "time-complexity",
    "space-complexity",
  ],
};

const codeSnippets = {
  linearSearch: [
    "int linearSearch(int arr[], int n, int key) {",
    "    for (int i = 0; i < n; i++) {",
    "        if (arr[i] == key) {",
    "            return i; // Key found",
    "        }",
    "    }",
    "    return -1; // Key not found",
    "}",
  ],
  binarySearch: [
    "int binarySearch(int arr[], int key) {",
    "    while (left <= right) {",
    "        int mid = left + (right - left) / 2;",
    "        if (arr[mid] == key) {",
    "            return mid; // Key found",
    "        }",
    "        if (arr[mid] < key) {",
    "            left = mid + 1; // Search right half",
    "        } else {",
    "            right = mid - 1; // Search left half",
    "        }",
    "    }",
    "    return -1; // Key not found",
    "}",
  ],
};

let myArray = [];
let originalArray = [];
let maxArrayValue = Math.max(...myArray);
let comparisons = 0;
let iValue = 0;
let eleValue = 0;

// Helper Functions
function generateRandomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
}

function renderBoxes() {
  arrayContainer.innerHTML = "";
  indexContainer.innerHTML = "";

  myArray.forEach((value, index) => {
    // Create box element
    const box = document.createElement("div");
    box.classList.add("box");
    box.textContent = value; // Set the array value

    // Create index element
    const indexElement = document.createElement("div");
    indexElement.classList.add("index");
    indexElement.textContent = index; // Set the array index

    arrayContainer.appendChild(box);
    indexContainer.appendChild(indexElement);
  });
}

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
  const key = parseInt(searchKey.value, 10);
  resetStats();
  // Run the selected sorting function
  if (selectedAlgorithm === "linearSearch") {
    linearSearch(myArray, key);
  } else if (selectedAlgorithm === "binarySearch") {
    binarySearch(myArray, key);
  }
  console.log("after run: " + myArray);
}

function resetStats() {
  comparisons = 0;
  iValue = 0;
  eleValue = 0;
}

function updateComplexity(algorithm) {
  document.getElementById("time-complexity").textContent =
    complexity[algorithm].time;
  document.getElementById("space-complexity").textContent =
    complexity[algorithm].space;
}

function updateStatsDisplay(algorithm) {
  // Hide all stats initially
  document.querySelectorAll(".stats-value p").forEach((stat) => {
    stat.style.display = "none";
  });

  // Show relevant stats for the selected algorithm
  statsVisibility[algorithm].forEach((id) => {
    document.getElementById(id).parentElement.style.display = "block";
  });
}

// Searching Algorithms
function linearSearch(arr, target) {
  const bars = document.querySelectorAll(".box");
  const indices = document.querySelectorAll(".index");
  let isFound = false;
  for (let i = 0; i < arr.length; i++) {
    tl.set(eleValueEle, { textContent: arr[i] });
    tl.set(iValueEle, { textContent: iValue++ });
    tl.call(() => highlightLines([1]));
    // Highlight the current bar being compared
    tl.set(indices[i], {
      innerHTML: "i",
      fontSize: 20,
      fontWeight: "bold",
      color: "#d1507b",
    });
    tl.to(bars[i], { backgroundColor: "#d1507b", duration: 0.25 }, ">");

    tl.call(() => highlightLines([2]));

    tl.set(comparisonEle, { textContent: comparisons++ });
    if (arr[i] === target) {
      // If the target is found, highlight it

      tl.call(() => highlightLines([3]));
      tl.set(indices[i], {
        innerHTML: "i",
        fontSize: 20,
        fontWeight: "bold",
        color: "#50b1d1",
      });
      tl.set(outputDisplay, { innerHTML: "Key is found at index " + i });
      tl.to(bars[i], { backgroundColor: "#50b1d1", duration: 0.5 }, ">");
      isFound = true;
      break; // Stop the search once the target is found
    } else {
      // Revert the color of the bar if not the target
      tl.set(outputDisplay, {
        innerHTML: target + " is not equal to " + arr[i],
      });
      tl.to(bars[i], { backgroundColor: "#333", duration: 0.25 }, ">");
    }
    tl.set(indices[i], {
      innerHTML: i,
      fontSize: 12,
      fontWeight: "normal",
      color: "#fff",
    });
  }
  if (!isFound) {
    tl.call(() => highlightLines([6]));
    tl.set(outputDisplay, { innerHTML: "Key is not found" });
  }
}

function binarySearch(arr, target) {
  const bars = document.querySelectorAll(".box");
  const indices = document.querySelectorAll(".index");

  let low = 0;
  let high = arr.length - 1;
  let isFound = false;

  while (low <= high) {
    tl.set(lowIndexEle, { textContent: low }); // Display the low index
    tl.set(highIndexEle, { textContent: high }); // Display the high index
    const mid = Math.floor((low + high) / 2);
    tl.set(midIndexEle, { textContent: mid }); // Display the mid index

    tl.set(indices[low], {
      innerHTML: "low",
      fontSize: 20,
      fontWeight: "bold",
      color: "#50b1d1",
    });
    tl.set(indices[high], {
      innerHTML: "high",
      fontSize: 20,
      fontWeight: "bold",
      color: "#50b1d1",
    });
    tl.set(indices[mid], {
      innerHTML: "mid",
      fontSize: 20,
      fontWeight: "bold",
      color: "#d1507b",
    });

    // Highlight the range being searched
    tl.call(() => highlightLines([1]));
    for (let i = low; i <= high; i++) {
      tl.to(bars[i], { backgroundColor: "#9f99e0", duration: 0.25 }, ">");
    }

    tl.to(bars[mid], { backgroundColor: "#d1507b", duration: 0.25 }, ">");

    tl.set(comparisonEle, { textContent: comparisons++ });

    if (arr[mid] === target) {
      // Target found
      tl.call(() => highlightLines([3]));
      tl.set(outputDisplay, { innerHTML: "Key is found at index " + mid });
      tl.to(bars[mid], { backgroundColor: "#50b1d1", duration: 0.5 }, ">");
      isFound = true;
      tl.set(indices[low], {
        innerHTML: low,
        fontSize: 12,
        fontWeight: "normal",
        color: "#fff",
      });
      tl.set(indices[high], {
        innerHTML: high,
        fontSize: 12,
        fontWeight: "normal",
        color: "#fff",
      });
      tl.set(indices[mid], {
        innerHTML: "mid",
        fontSize: 20,
        fontWeight: "bold",
        color: "#d1507b",
      });
      tl.call(() => highlightLines([4]));
      break;
    } else if (arr[mid] < target) {
      // Search in the right half
      tl.call(() => highlightLines([6]));
      tl.set(outputDisplay, {
        innerHTML:
          target +
          " is greater than " +
          arr[mid] +
          "<br>Search in the right half",
      });
      tl.to(bars[mid], { backgroundColor: "#333", duration: 0.25 }, ">");
      for (let i = low; i <= mid; i++) {
        tl.to(bars[i], { backgroundColor: "#333", duration: 0.25 }, ">");
      }
      tl.call(() => highlightLines([7]));
      tl.to({}, { duration: 0.5 });
      tl.set(indices[low], {
        innerHTML: low,
        fontSize: 12,
        fontWeight: "normal",
        color: "#fff",
      });
      tl.set(indices[high], {
        innerHTML: high,
        fontSize: 12,
        fontWeight: "normal",
        color: "#fff",
      });
      tl.set(indices[mid], {
        innerHTML: mid,
        fontSize: 12,
        fontWeight: "normal",
        color: "#fff",
      });
      low = mid + 1;
    } else {
      // Search in the left half
      tl.call(() => highlightLines([8]));

      tl.set(outputDisplay, {
        innerHTML:
          target +
          " is lesser than " +
          arr[mid] +
          "<br>Search in the left half",
      });
      tl.to(bars[mid], { backgroundColor: "#333", duration: 0.25 }, ">");
      for (let i = mid; i <= high; i++) {
        tl.to(bars[i], { backgroundColor: "#333", duration: 0.25 }, ">");
      }
      tl.call(() => highlightLines([9]));
      tl.to({}, { duration: 0.5 });
      tl.set(indices[low], {
        innerHTML: low,
        fontSize: 12,
        fontWeight: "normal",
        color: "#fff",
      });
      tl.set(indices[high], {
        innerHTML: high,
        fontSize: 12,
        fontWeight: "normal",
        color: "#fff",
      });
      tl.set(indices[mid], {
        innerHTML: mid,
        fontSize: 12,
        fontWeight: "normal",
        color: "#fff",
      });
      high = mid - 1;
    }
  }

  if (!isFound) {
    tl.call(() => highlightLines([12]));
    tl.set(outputDisplay, { innerHTML: "Key is not found" });
  }
}

// Event Listeners
algorithmDropdown.addEventListener("change", () => {
  restartTimeline();
  tl.clear();
  resetStats();

  // Reset the array variable
  myArray = originalArray;

  console.log("after reset: " + myArray);
  myArray.sort((a, b) => a - b);
  renderBoxes();
  const selectedAlgorithm = algorithmDropdown.value;
  updateComplexity(selectedAlgorithm);
  updateStatsDisplay(selectedAlgorithm);
  renderCode(selectedAlgorithm);
});

randomizeBtn.addEventListener("click", () => {
  restartTimeline();
  tl.clear();

  myArray = generateRandomArray(nSlider.value);
  if (algorithmDropdown.value === "binarySearch") {
    myArray.sort((a, b) => a - b);
  }
  originalArray = [...myArray];
  renderBoxes();
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

searchBtn.addEventListener("click", () => {
  restartTimeline();
  tl.clear();
  resetStats();
  renderBoxes();
  runSelectedAlgorithm();
  playPauseIcon.classList.remove("fa-play");
  playPauseIcon.classList.add("fa-pause");
  tl.play();
});

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

  myArray = generateRandomArray(nSlider.value);
  if (algorithmDropdown.value === "binarySearch") {
    myArray.sort((a, b) => a - b);
  }
  originalArray = [...myArray];
  renderBoxes();
});

// Starting Point
myArray = generateRandomArray(nSlider.value);
originalArray = [...myArray];
renderBoxes();
renderCode(algorithmDropdown.value);
updateComplexity(algorithmDropdown.value);
updateStatsDisplay(algorithmDropdown.value);

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
