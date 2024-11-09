const indexContainer = document.getElementsByClassName("index-container")[0];
const arrayContainer = document.getElementsByClassName("array-container")[0];
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

let myArray = [];
let maxArrayValue = Math.max(...myArray);
const maxBarHeight = 250;

// Helper Functions
function generateRandomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
}

function renderBars() {
  arrayContainer.innerHTML = "";
  indexContainer.innerHTML = "";
  myArray.forEach((value, i) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");

    maxArrayValue = Math.max(...myArray);
    const barHeight = (value / maxArrayValue) * maxBarHeight;
    bar.style.height = `${barHeight}px`;

    const barValue = document.createElement("div");
    barValue.classList.add("value");
    barValue.textContent = value;

    const barIndex = document.createElement("div");
    barIndex.classList.add("index");
    barIndex.textContent = i;

    bar.appendChild(barValue);
    arrayContainer.appendChild(bar);
    indexContainer.appendChild(barIndex);
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

  // Run the selected sorting function
  if (selectedAlgorithm === "bubbleSort") {
    bubbleSort(myArray);
  } else if (selectedAlgorithm === "selectionSort") {
    selectionSort(myArray);
  }
}

// Sorting Algorithms
function bubbleSort(arr) {
  // Get the bars
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      // Select two bars
      tl.to(bars[j], { backgroundColor: "#d1507b", duration: 0.25 }, ">");
      tl.to(bars[j + 1], { backgroundColor: "#d1507b", duration: 0.25 }, "<");
      tl.add("beforeSwap");

      if (arr[j] > arr[j + 1]) {
        // Swap two bars
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        tl.to(bars[j], { x: 34, ease: "power4.inOut" }), ">";
        tl.to(bars[j + 1], { x: -34, ease: "power4.inOut" }, "<");

        tl.set(bars[j], { x: 0 });
        tl.set(bars[j + 1], { x: 0 });

        tl.set(bars[j], {
          height: `${(arr[j] / maxArrayValue) * maxBarHeight}px`,
        });
        tl.set(bars[j + 1], {
          height: `${(arr[j + 1] / maxArrayValue) * maxBarHeight}px`,
        });

        tl.set(bars[j].querySelector(".value"), {
          textContent: `${arr[j]}`,
        });
        tl.set(bars[j + 1].querySelector(".value"), {
          textContent: `${arr[j + 1]}`,
        });
      }

      // Revert color back after comparison
      tl.to(
        bars[j],
        { backgroundColor: "#ddd", duration: 0.25 },
        "beforeSwap+=0.5"
      );
    }

    // Mark the sorted element
    tl.to(
      bars[arr.length - 1 - i],
      { backgroundColor: "#50b1d1", duration: 0.25 },
      ">"
    );
  }
  tl.to(bars[0], { backgroundColor: "#50b1d1", duration: 0.25 }, ">");
}

function selectionSort(arr) {
  // Get the bars
  const bars = document.querySelectorAll(".bar");

  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;

    // Select the current minimum element
    tl.to(bars[minIndex], { backgroundColor: "#d1507b", duration: 0.25 }, ">");

    for (let j = i + 1; j < arr.length; j++) {
      // Highlight the current element being compared
      tl.to(bars[j], { backgroundColor: "#b0abe0", duration: 0.25 }, ">");

      if (arr[j] < arr[minIndex]) {
        // Reset previous minimum's color
        tl.to(bars[minIndex], { backgroundColor: "#ddd", duration: 0.25 }, ">");
        minIndex = j;

        // Highlight new minimum
        tl.to(
          bars[minIndex],
          { backgroundColor: "#d1507b", duration: 0.25 },
          "<"
        );
      } else {
        // Revert color back after comparison
        tl.to(bars[j], { backgroundColor: "#ddd", duration: 0.25 }, ">");
      }
    }

    // Swap if minIndex changed
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

      // Animate the swap
      tl.to(bars[i], { x: 34 * (minIndex - i), ease: "power4.inOut" }, ">");
      tl.to(
        bars[minIndex],
        { x: -34 * (minIndex - i), ease: "power4.inOut" },
        "<"
      );

      // Reset positions and update heights after the swap
      tl.set(bars[i], {
        x: 0,
        height: `${(arr[i] / maxArrayValue) * maxBarHeight}px`,
      });
      tl.set(bars[minIndex], {
        x: 0,
        height: `${(arr[minIndex] / maxArrayValue) * maxBarHeight}px`,
      });

      // Update bar values
      tl.set(bars[i].querySelector(".value"), { textContent: `${arr[i]}` });
      tl.set(bars[minIndex].querySelector(".value"), {
        textContent: `${arr[minIndex]}`,
      });

      tl.set(bars[minIndex], { backgroundColor: "#ddd" });
    }

    // Mark the sorted element
    tl.to(bars[i], { backgroundColor: "#50b1d1", duration: 0.25 }, ">");
  }

  // Mark the last element as sorted
  tl.to(
    bars[arr.length - 1],
    { backgroundColor: "#50b1d1", duration: 0.25 },
    ">"
  );
}

// Event Listeners
algorithmDropdown.addEventListener("change", () => {
  restartTimeline();
  tl.clear();

  // Reset the array variable
  let prevArr = [];
  const values = document.querySelectorAll(".value");
  values.forEach((value) => {
    prevArr.push(value.textContent);
  });
  myArray = prevArr;

  console.log(myArray);

  runSelectedAlgorithm();
});

randomizeBtn.addEventListener("click", () => {
  restartTimeline();
  tl.clear();

  myArray = generateRandomArray(nSlider.value);
  renderBars();
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
});

// Starting Point
myArray = generateRandomArray(nSlider.value);
renderBars();

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
