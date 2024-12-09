const algorithmDropdown = document.getElementById("algorithmDropdown");
const genGraphBtn = document.getElementsByClassName("gen-graph")[0];
const progressBar = document.getElementsByClassName("progress-bar")[0];
const speedControl = document.getElementsByClassName("speed-control")[0];
const playPauseBtn = document.getElementsByClassName("play")[0];
const playPauseIcon = document.getElementById("playPauseIcon");
const reverseBtn = document.getElementsByClassName("reverse")[0];
const forwardBtn = document.getElementsByClassName("forward")[0];
const restartBtn = document.getElementsByClassName("restart")[0];
const codeDisplay = document.getElementsByClassName("code-display")[0];

let nodes = [];
let edges = [];
let adjacencyMatrix = [];

const codeSnippets = {
  dijkstra: [
    "Initialize distance array: inf for all nodes, 0 for start",
    "Initialize PQ, add start node with distance 0",
    "While PQ is not empty:",
    "  u = node with min distance in PQ",
    "  Remove u from PQ",
    "  For each neighbor v of u:",
    "    d = distance[u] + w(u, v)",
    "    If d < distance[v], update distance[v]",
    "    If v not in PQ, add v with updated distance",
    "Return distance array when PQ is empty",
  ],
};

// Helper Functions
function renderGraph(matrix) {
  adjacencyMatrix = matrix;
  nodes = [];
  edges = [];

  // Create nodes based on matrix size
  for (let i = 0; i < matrix.length; i++) {
    nodes.push({ id: i, x: 50 + i * 100, y: 100 + Math.random() * 250 });
  }

  // Convert adjacency matrix to edge list
  let edgeCount = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = i + 1; j < matrix.length; j++) {
      const weight = matrix[i][j];
      if (weight > 0) {
        edgeCount++;
        edges.push({ id: edgeCount, u: i, v: j, weight: weight });
      }
    }
  }

  // Clear previous SVG contents
  const svg = d3.select("svg");
  svg.selectAll("*").remove();

  // Draw edges
  svg
    .selectAll(".edge")
    .data(edges)
    .enter()
    .append("line")
    .attr("id", (d) => `edge-${d.id}`)
    .attr("class", "edge")
    .attr("x1", (d) => nodes[d.u].x)
    .attr("y1", (d) => nodes[d.u].y)
    .attr("x2", (d) => nodes[d.v].x)
    .attr("y2", (d) => nodes[d.v].y);

  // Draw edge labels (weights)
  // Draw edge labels (weights)
  svg
    .selectAll(".edge-label")
    .data(edges)
    .enter()
    .append("text")
    .attr("id", (d) => `edge-label-${d.id}`)
    .attr("class", "edge-label")
    .attr("x", (d) => (nodes[d.u].x + nodes[d.v].x) / 2)
    .attr("y", (d) => (nodes[d.u].y + nodes[d.v].y) / 2)
    .attr("dx", (d) => {
      const dx = nodes[d.v].x - nodes[d.u].x;
      const dy = nodes[d.v].y - nodes[d.u].y;
      return (-dy / Math.sqrt(dx * dx + dy * dy)) * 20; // Offset perpendicular to the line
    })
    .attr("dy", (d) => {
      const dx = nodes[d.v].x - nodes[d.u].x;
      const dy = nodes[d.v].y - nodes[d.u].y;
      return (dx / Math.sqrt(dx * dx + dy * dy)) * 20; // Offset perpendicular to the line
    })
    .attr("text-anchor", "middle")
    .text((d) => d.weight);

  // Draw nodes
  svg
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("id", (d) => `node-${d.id}`)
    .attr("class", "node")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", 20)
    .call(
      d3
        .drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded)
    );

  // Add labels to nodes
  svg
    .selectAll(".label")
    .data(nodes)
    .enter()
    .append("text")
    .attr("id", (d) => `label-${d.id}`)
    .attr("class", "label")
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y + 5)
    .attr("text-anchor", "middle")
    .text((d) => `${d.id}`);

  svg
    .selectAll(".distance-label")
    .data(nodes)
    .enter()
    .append("text")
    .attr("id", (d) => `distance-label-${d.id}`)
    .attr("class", "distance-label")
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y + 30)
    .attr("text-anchor", "middle")
    .text(() => "∞");
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

function parseAdjacencyMatrix(input) {
  const lines = input.trim().split("\n");
  return lines.map((line) => line.split(/\s+/).map(Number));
}

function dragStarted(event, d) {
  d3.select(this).attr("r", 25);
}

function dragged(event, d) {
  d.x = event.x;
  d.y = event.y;
  d3.select(this).attr("cx", d.x).attr("cy", d.y);

  // Update edges connected to the dragged node
  const svg = d3.select("svg");
  svg
    .selectAll(".edge")
    .filter((e) => e.u === d.id || e.v === d.id)
    .attr("x1", (e) => (e.u === d.id ? d.x : nodes[e.u].x))
    .attr("y1", (e) => (e.u === d.id ? d.y : nodes[e.u].y))
    .attr("x2", (e) => (e.v === d.id ? d.x : nodes[e.v].x))
    .attr("y2", (e) => (e.v === d.id ? d.y : nodes[e.v].y));

  // Update edge labels connected to the dragged node
  svg
    .selectAll(".edge-label")
    .filter((e) => e.u === d.id || e.v === d.id)
    .attr("x", (e) => (nodes[e.u].x + nodes[e.v].x) / 2)
    .attr("y", (e) => (nodes[e.u].y + nodes[e.v].y) / 2);

  // Update the node's label and ensure it's on top of the circle
  svg
    .selectAll(".label")
    .filter((n) => n.id === d.id)
    .attr("x", d.x)
    .attr("y", d.y + 5);

  svg
    .selectAll(".distance-label")
    .filter((n) => n.id === d.id)
    .attr("x", d.x)
    .attr("y", d.y + 30);
}

function dragEnded(event, d) {
  d3.select(this).attr("r", 20);
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
  if (selectedAlgorithm === "dijkstra") {
    const startNode = parseInt(document.getElementById("startNodeInput").value);
    dijkstra(startNode);
  }
}

// MST Algorithms
function dijkstra(startNode) {
  const distances = Array(nodes.length).fill(Infinity);
  const visited = Array(nodes.length).fill(false);
  distances[startNode] = 0;

  const priorityQueue = [];
  priorityQueue.push({ node: startNode, distance: 0 });

  while (priorityQueue.length > 0) {
    priorityQueue.sort((a, b) => a.distance - b.distance);
    const current = priorityQueue.shift();

    if (visited[current.node]) continue;
    visited[current.node] = true;

    tl.to(`#node-${current.node}`, { fill: "#ff9f50", duration: 0.25 });

    for (let neighbor = 0; neighbor < adjacencyMatrix.length; neighbor++) {
      const weight = adjacencyMatrix[current.node][neighbor];
      if (weight > 0 && !visited[neighbor]) {
        const newDistance = distances[current.node] + weight;
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          priorityQueue.push({ node: neighbor, distance: newDistance });

          tl.to(
            `#edge-${
              edges.find(
                (e) =>
                  (e.u === current.node && e.v === neighbor) ||
                  (e.u === neighbor && e.v === current.node)
              ).id
            }`,
            {
              stroke: "#ff9f50",
              strokeWidth: 4,
              duration: 0.25,
            }
          );

          tl.set(`#distance-label-${neighbor}`, {
            textContent: newDistance,
          });
        }
      }
    }
  }

  console.log("Shortest distances:", distances);
}

genGraphBtn.addEventListener("click", () => {
  restartTimeline();
  tl.clear();
  const input = document.getElementById("adjacencyMatrixInput").value;
  const adjacencyMatrix = parseAdjacencyMatrix(input);
  renderGraph(adjacencyMatrix);
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

renderCode(algorithmDropdown.value);
