const arrayContainer = document.getElementById("array-container");
const myButton = document.getElementById("my-button");
const array = [5, 3, 8, 4, 2, 1, 7]; // Example array, you can randomize it as well

// Function to render array as bars
function renderArray(arr) {
  arrayContainer.innerHTML = ""; // Clear existing bars
  arr.forEach((value) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value * 20}px`; // Scale height for better visualization
    bar.textContent = value;
    arrayContainer.appendChild(bar);
  });
}

renderArray(array);

async function bubbleSort(arr) {
  const bars = document.querySelectorAll(".bar");

  // Bubble Sort algorithm with GSAP animations
  for (let i = 0; i < arr.length - 1; i++) {
    console.log(arr);
    for (let j = 0; j < arr.length - i - 1; j++) {
      // Highlight the bars being compared
      bars[j].style.backgroundColor = "red";
      bars[j + 1].style.backgroundColor = "red";

      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay for better visualization
      if (arr[j] > arr[j + 1]) {
        // Swap values in the array
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

        // Swap bars visually
        await Promise.all([
          gsap.to(bars[j], { x: 34, duration: 0.5 }),
          gsap.to(bars[j + 1], { x: -34, duration: 0.5 }),
        ]);

        // bars[j].style.transform = "translateX(0px)";
        // bars[j + 1].style.transform = "translateX(0px)";
        gsap.set(bars[j], { x: 0 });
        gsap.set(bars[j + 1], { x: 0 });

        [bars[j].style.height, bars[j + 1].style.height] = [
          bars[j + 1].style.height,
          bars[j].style.height,
        ];
        [bars[j].textContent, bars[j + 1].textContent] = [
          bars[j + 1].textContent,
          bars[j].textContent,
        ];
      }
      await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for animation

      // Revert color back after comparison
      bars[j].style.backgroundColor = "#3498db";
      bars[j + 1].style.backgroundColor = "#3498db";
    }

    // Mark the last sorted element
    bars[arr.length - 1 - i].style.backgroundColor = "green";
  }
  bars[0].style.backgroundColor = "green";
}

myButton.addEventListener("click", function (event) {
  this.disabled = true;
  bubbleSort(array);
});
