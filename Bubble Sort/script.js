const arrayContainer = document.getElementsByClassName("array-container")[0];

const progressBar = document.getElementsByClassName("progress-bar")[0];
const speedControl = document.getElementsByClassName("speedControl")[0];
const playBtn = document.getElementsByClassName("play")[0];
const pauseBtn = document.getElementsByClassName("pause")[0];
const reverseBtn = document.getElementsByClassName("reverse")[0];
const restartBtn = document.getElementsByClassName("restart")[0];

const myArray = [5, 3, 1, 6, 4, 2];

// Render Array
arrayContainer.innerHTML = "";
myArray.forEach((value) => {
  const bar = document.createElement("div");
  bar.classList.add("bar");
  bar.style.height = `${value * 20}px`;
  bar.textContent = value;
  arrayContainer.appendChild(bar);
});

// Get the bars
const bars = document.querySelectorAll(".bar");

// Create Timeline
const t1 = gsap.timeline({
  paused: true,
  defaults: { duration: 0.5 },
  onComplete: () => console.log("Completed"),
  onReverseComplete: () => console.log("Reverse Completed"),
  onUpdate: () => (progressBar.style.width = t1.progress() * 100 + "%"),
});

// Bubble Sort
for (let i = 0; i < myArray.length - 1; i++) {
  for (let j = 0; j < myArray.length - i - 1; j++) {
    // Select two bars
    t1.to(bars[j], { backgroundColor: "#d1507b", duration: 0.25 }, ">");
    t1.to(bars[j + 1], { backgroundColor: "#d1507b", duration: 0.25 }, "<");
    t1.add("beforeSwap");

    if (myArray[j] > myArray[j + 1]) {
      // Swap two bars
      [myArray[j], myArray[j + 1]] = [myArray[j + 1], myArray[j]];
      t1.to(bars[j], { x: 34, ease: "power4.inOut" }), ">";
      t1.to(bars[j + 1], { x: -34, ease: "power4.inOut" }, "<");

      t1.set(bars[j], { x: 0 });
      t1.set(bars[j + 1], { x: 0 });

      t1.set(bars[j], { height: `${myArray[j] * 20}px` });
      t1.set(bars[j + 1], { height: `${myArray[j + 1] * 20}px` });

      t1.set(bars[j], { textContent: `${myArray[j]}` });
      t1.set(bars[j + 1], { textContent: `${myArray[j + 1]}` });
    }

    // Revert color back after comparison
    t1.to(
      bars[j],
      { backgroundColor: "#ddd", duration: 0.25 },
      "beforeSwap+=0.5"
    );
  }

  // Mark the sorted element
  t1.to(
    bars[myArray.length - 1 - i],
    { backgroundColor: "#50b1d1", duration: 0.25 },
    ">"
  );
}
t1.to(bars[0], { backgroundColor: "#50b1d1", duration: 0.25 }, ">");

// Event Listeners
playBtn.addEventListener("click", () => {
  t1.play();
});

pauseBtn.addEventListener("click", () => {
  t1.pause();
});

reverseBtn.addEventListener("click", () => {
  t1.reverse();
});

restartBtn.addEventListener("click", () => {
  t1.restart();
});

speedControl.addEventListener("change", (e) => {
  const speedFactor = parseFloat(e.target.value);
  t1.timeScale(speedFactor);
});
