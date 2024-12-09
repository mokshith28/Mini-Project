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
const iterationEle = document.getElementById("iterations");
const comparisonEle = document.getElementById("comparisons");
const swapEle = document.getElementById("swaps");
const codeDisplay = document.getElementsByClassName("code-display")[0];

const complexity = {
  bubbleSort: { time: "O(N²)", space: "O(1)" },
  selectionSort: { time: "O(N²)", space: "O(1)" },
  insertionSort: { time: "O(N²)", space: "O(1)" },
  mergeSort: { time: "O(N log N)", space: "O(N)" },
};

const codeSnippets = {
  bubbleSort: [
    "void bubbleSort(int arr[], int n) {",
    "    for (int i = 0; i < n - 1; i++) {",
    "        for (int j = 0; j < n - i - 1; j++) {",
    "            if (arr[j] > arr[j + 1]) {",
    "                // Swap elements",
    "                int temp = arr[j];",
    "                arr[j] = arr[j + 1];",
    "                arr[j + 1] = temp;",
    "            }",
    "        }",
    "    }",
    "    return;",
    "}",
  ],
  selectionSort: [
    "void selectionSort(int arr[], int n) {",
    "    for (int i = 0; i < n - 1; i++) {",
    "        int minIndex = i;",
    "        for (int j = i + 1; j < n; j++) {",
    "            if (arr[j] < arr[minIndex]) {",
    "                minIndex = j;",
    "            }",
    "        }",
    "        swap(arr[i], arr[minIndex]);",
    "    }",
    "    return;",
    "}",
  ],
  insertionSort: [
    "void insertionSort(int arr[], int n) {",
    "    for (int i = 1; i < n; i++) {",
    "        int key = arr[i];",
    "        int j = i - 1;",
    "        while (j >= 0 && arr[j] > key) {",
    "            arr[j + 1] = arr[j];",
    "            j = j - 1;",
    "        }",
    "        arr[j + 1] = key;",
    "    }",
    "    return;",
    "}",
  ],
  mergeSort: [
    "void mergeSort(int arr[], int left, int right) {",
    "    if (left < right) {",
    "        int mid = left + (right - left) / 2;",
    "        mergeSort(arr, left, mid);",
    "        mergeSort(arr, mid + 1, right);",
    "        merge(arr, left, mid, right);",
    "    }",
    "    return;",
    "}",
  ],
};

let myArray = [];
let originalArray = [];
let maxArrayValue = Math.max(...myArray);
let comparisons = 0;
let swaps = 0;
let iterations = 0;

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
    const barHeight =
      (value / maxArrayValue) * arrayContainer.offsetHeight * 0.9;
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
  updateComplexity(selectedAlgorithm);
  renderBars();
  renderCode(selectedAlgorithm);
  // Run the selected sorting function
  if (selectedAlgorithm === "bubbleSort") {
    bubbleSort(myArray);
  } else if (selectedAlgorithm === "selectionSort") {
    selectionSort(myArray);
  } else if (selectedAlgorithm === "insertionSort") {
    insertionSort(myArray);
  } else if (selectedAlgorithm === "mergeSort") {
    mergeSort(myArray);
  }
  console.log("after run: " + myArray);
}

function resetStats() {
  comparisons = 0;
  swaps = 0;
  iterations = 0;
}

function updateComplexity(algorithm) {
  document.getElementById("time-complexity").textContent =
    complexity[algorithm].time;
  document.getElementById("space-complexity").textContent =
    complexity[algorithm].space;
}

// Sorting Algorithms
function bubbleSort(arr) {
  // Get the bars
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < arr.length - 1; i++) {
    tl.set(iterationEle, { textContent: iterations++ });
    tl.call(() => highlightLines([2]));
    for (let j = 0; j < arr.length - i - 1; j++) {
      // Select two bars

      tl.to({}, { duration: 0.5 }).call(() => highlightLines([3]));
      tl.set(comparisonEle, { textContent: comparisons++ });
      tl.to(bars[j], { backgroundColor: "#d1507b", duration: 0.25 }, ">");
      tl.to(bars[j + 1], { backgroundColor: "#d1507b", duration: 0.25 }, "<");
      tl.add("beforeSwap");
      if (arr[j] > arr[j + 1]) {
        // Swap two bars
        tl.set(swapEle, { textContent: swaps++ });
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        tl.call(() => highlightLines([5, 6, 7]));
        tl.to(bars[j], { x: 34, ease: "power4.inOut" }), ">";
        tl.to(bars[j + 1], { x: -34, ease: "power4.inOut" }, "<");

        tl.set(bars[j], { x: 0 });
        tl.set(bars[j + 1], { x: 0 });

        tl.set(bars[j], {
          height: `${
            (arr[j] / maxArrayValue) * arrayContainer.offsetHeight * 0.9
          }px`,
        });
        tl.set(bars[j + 1], {
          height: `${
            (arr[j + 1] / maxArrayValue) * arrayContainer.offsetHeight * 0.9
          }px`,
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
  tl.call(() => highlightLines([11]));
  tl.to(bars[0], { backgroundColor: "#50b1d1", duration: 0.25 }, ">");
}

function selectionSort(arr) {
  // Get the bars
  const bars = document.querySelectorAll(".bar");

  tl.call(() => highlightLines([1]));
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;

    // Select the current minimum element
    tl.to(bars[minIndex], { backgroundColor: "#d1507b", duration: 0.25 }, ">");
    tl.set(iterationEle, { textContent: iterations++ });

    tl.call(() => highlightLines([3]));
    for (let j = i + 1; j < arr.length; j++) {
      // Highlight the current element being compared
      tl.to(bars[j], { backgroundColor: "#9f99e0", duration: 0.25 }, ">");
      tl.set(comparisonEle, { textContent: comparisons++ });

      tl.call(() => highlightLines([4]));
      if (arr[j] < arr[minIndex]) {
        // Reset previous minimum's color
        tl.to(bars[minIndex], { backgroundColor: "#ddd", duration: 0.25 }, ">");
        minIndex = j;

        tl.call(() => highlightLines([5]));
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
    tl.call(() => highlightLines([8]));
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      tl.set(swapEle, { textContent: swaps++ });

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
        height: `${
          (arr[i] / maxArrayValue) * arrayContainer.offsetHeight * 0.9
        }px`,
      });
      tl.set(bars[minIndex], {
        x: 0,
        height: `${
          (arr[minIndex] / maxArrayValue) * arrayContainer.offsetHeight * 0.9
        }px`,
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

  tl.call(() => highlightLines([10]));
  // Mark the last element as sorted
  tl.to(
    bars[arr.length - 1],
    { backgroundColor: "#50b1d1", duration: 0.25 },
    ">"
  );
}

// function insertionSort(arr) {
//   const bars = document.querySelectorAll(".bar");

//   for (let i = 1; i < arr.length; i++) {
//     let key = arr[i];
//     let j = i - 1;

//     // Highlight the current element being inserted
//     tl.to(bars[i], { backgroundColor: "#d1507b", duration: 0.25 }, ">");
//     tl.to(bars[i], { y: -300, duration: 0.25 }, ">");

//     while (j >= 0 && arr[j] > key) {
//       // Highlight the compared element
//       tl.to(bars[j], { backgroundColor: "#b0abe0", duration: 0.25 }, ">");

//       // Shift the bar one position to the right
//       arr[j + 1] = arr[j];
//       tl.to(bars[j], { x: 34, ease: "power4.inOut" }, ">");

//       tl.set(bars[j + 1], {
//         height: `${
//           (arr[j] / maxArrayValue) * arrayContainer.offsetHeight * 0.9
//         }px`,
//         x: 0,
//       });
//       tl.set(bars[j + 1].querySelector(".value"), {
//         textContent: `${arr[j]}`,
//       });

//       tl.set(bars[j], {
//         height: `0px`,
//         x: 0,
//       });
//       tl.set(bars[j].querySelector(".value"), {
//         textContent: ``,
//       });

//       // Revert the compared element's color
//       tl.to(bars[j], { backgroundColor: "#ddd", duration: 0.25 }, ">");
//       j--;
//     }

//     // Place the key in its correct position
//     arr[j + 1] = key;

//     tl.to(bars[i], { x: 34 * (j + 1 - i), ease: "power4.inOut" }, ">");
//     tl.set(bars[j + 1], {
//       height: `${(key / maxArrayValue) * arrayContainer.offsetHeight * 0.9}px`,
//       x: 0,
//     });
//     tl.set(bars[j + 1].querySelector(".value"), { textContent: `${key}` });

//     // Revert the current bar's color
//     tl.to(bars[i], { backgroundColor: "#ddd", duration: 0.25 }, ">");
//     tl.to(bars[i], { y: 0, duration: 0.25 }, ">");
//   }

//   // Mark all elements as sorted
//   for (let k = 0; k < arr.length; k++) {
//     tl.to(bars[k], { backgroundColor: "#50b1d1", duration: 0.25 }, ">");
//   }
// }

function insertionSort(arr) {
  const bars = document.querySelectorAll(".bar");

  for (let i = 1; i < arr.length; i++) {
    tl.call(() => highlightLines([2, 3])); // Outer loop
    let key = arr[i];
    let j = i - 1;

    // Highlight the key being picked
    tl.to(bars[i], { backgroundColor: "#d1507b", duration: 0.25 });
    tl.set(iterationEle, { textContent: iterations++ });

    tl.call(() => highlightLines([4])); // Picking the key
    while (j >= 0 && arr[j] > key) {
      tl.set(comparisonEle, { textContent: comparisons++ });
      tl.call(() => highlightLines([5, 6])); // Condition check
      // Move the current element one position to the right
      tl.to(bars[j + 1], { backgroundColor: "#9f99e0", duration: 0.25 });
      arr[j + 1] = arr[j];

      tl.to(bars[j + 1], {
        height: `${
          (arr[j + 1] / maxArrayValue) * arrayContainer.offsetHeight * 0.9
        }px`,
        duration: 0.5,
      });
      tl.set(bars[j + 1].querySelector(".value"), {
        textContent: `${arr[j + 1]}`,
      });

      j--;
      tl.to(bars[j + 1], { backgroundColor: "#ddd", duration: 0.25 }, ">");
    }

    // Insert the key in its correct position
    tl.call(() => highlightLines([8])); // Insertion logic
    arr[j + 1] = key;

    tl.to(bars[j + 1], { backgroundColor: "#d1507b", duration: 0.25 });
    tl.to(bars[j + 1], {
      height: `${
        (arr[j + 1] / maxArrayValue) * arrayContainer.offsetHeight * 0.9
      }px`,
      duration: 0.5,
    });
    tl.set(bars[j + 1].querySelector(".value"), {
      textContent: `${arr[j + 1]}`,
    });
    tl.to(bars[j + 1], { backgroundColor: "#ddd", duration: 0.25 }, ">");

    // Mark all elements before i as sorted
    for (let k = 0; k <= i; k++) {
      tl.to(bars[k], { backgroundColor: "#50b1d1", duration: 0.25 }, ">");
    }
  }
  tl.call(() => highlightLines([10]));
}

function mergeSort(arr, start = 0, end = arr.length - 1) {
  const bars = document.querySelectorAll(".bar");

  function merge(arr, start, mid, end) {
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);

    let i = 0,
      j = 0,
      k = start;

    while (i < left.length && j < right.length) {
      tl.set(comparisonEle, { textContent: comparisons++ }); // Update comparisons
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }

      // Update the height and value of the current bar
      tl.to(bars[k], { backgroundColor: "#d1507b", duration: 0.25 });
      tl.to(bars[k], {
        height: `${
          (arr[k] / maxArrayValue) * arrayContainer.offsetHeight * 0.9
        }px`,
        duration: 0.5,
      });
      tl.set(bars[k].querySelector(".value"), { textContent: `${arr[k]}` });
      tl.to(bars[k], { backgroundColor: "#ddd", duration: 0.25 });
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      i++;
      // Update remaining left elements
      tl.to(bars[k], { backgroundColor: "#d1507b", duration: 0.25 });
      tl.to(bars[k], {
        height: `${
          (arr[k] / maxArrayValue) * arrayContainer.offsetHeight * 0.9
        }px`,
        duration: 0.5,
      });
      tl.set(bars[k].querySelector(".value"), { textContent: `${arr[k]}` });
      tl.to(bars[k], { backgroundColor: "#ddd", duration: 0.25 });
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      j++;
      // Update remaining right elements
      tl.to(bars[k], { backgroundColor: "#d1507b", duration: 0.25 });
      tl.to(bars[k], {
        height: `${
          (arr[k] / maxArrayValue) * arrayContainer.offsetHeight * 0.9
        }px`,
        duration: 0.5,
      });
      tl.set(bars[k].querySelector(".value"), { textContent: `${arr[k]}` });
      tl.to(bars[k], { backgroundColor: "#ddd", duration: 0.25 });
      k++;
    }
  }

  function recursiveMergeSort(arr, start, end) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    tl.set(iterationEle, { textContent: iterations++ }); // Update iterations

    recursiveMergeSort(arr, start, mid);
    recursiveMergeSort(arr, mid + 1, end);
    tl.call(() => highlightLines([3, 4])); // Highlight splitting logic

    merge(arr, start, mid, end);
    tl.call(() => highlightLines([5])); // Highlight merge call

    // Mark the merged section as sorted
    for (let i = start; i <= end; i++) {
      tl.to(bars[i], { backgroundColor: "#50b1d1", duration: 0.25 }, ">");
    }
  }

  recursiveMergeSort(arr, start, end);
  tl.call(() => highlightLines([7])); // Highlight function declaration
}

// Event Listeners
algorithmDropdown.addEventListener("change", () => {
  restartTimeline();
  tl.clear();
  resetStats();

  // Reset the array variable
  myArray = [...originalArray];

  runSelectedAlgorithm();
});

randomizeBtn.addEventListener("click", () => {
  restartTimeline();
  tl.clear();
  resetStats();

  myArray = generateRandomArray(nSlider.value);
  originalArray = [...myArray];

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

  myArray = generateRandomArray(nSlider.value);
  originalArray = [...myArray];

  runSelectedAlgorithm();
});

// Starting Point
myArray = generateRandomArray(nSlider.value);
originalArray = [...myArray];

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
