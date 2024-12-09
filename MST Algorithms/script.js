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

// Helper Functions
function renderGraph(matrix) {
  adjacencyMatrix = matrix;
  nodes = [];
  edges = [];

  // Create nodes based on matrix size
  for (let i = 0; i < matrix.length; i++) {
    nodes.push({ id: i, x: 100 + i * 120, y: 100 + Math.random() * 250 });
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
  if (selectedAlgorithm === "prims") {
    prims();
  } else if (selectedAlgorithm === "kruskal") {
    kruskal();
  }
}

// MST Algorithms
function kruskal() {
  const svg = d3.select("svg");

  // Kruskal's algorithm
  const mst = [];
  const parent = Array(nodes.length)
    .fill(null)
    .map((_, i) => i);

  function find(x) {
    if (parent[x] === x) return x;
    return (parent[x] = find(parent[x]));
  }

  function union(x, y) {
    const rootX = find(x);
    const rootY = find(y);
    if (rootX !== rootY) parent[rootX] = rootY;
  }

  edges.sort((a, b) => a.weight - b.weight);

  for (const edge of edges) {
    const { u, v, id } = edge;

    tl.call(() => highlightLines([3]));
    if (find(u) !== find(v)) {
      union(u, v);
      mst.push(edge);

      tl.to(`#node-${u}`, { fill: "#ff8c2e" });
      tl.to(`#edge-${id}`, { stroke: "#ff8c2e", strokeWidth: 4 });
      tl.to(`#edge-label-${id}`, { fill: "#eee" }, "<");
      tl.call(() => highlightLines([4]));
      tl.to(`#node-${v}`, { fill: "#ff8c2e" });
    } else {
      tl.call(() => highlightLines([6]));
      tl.to(`#edge-${id}`, { stroke: "#ddd3", strokeWidth: 3 });
      tl.to(`#edge-label-${id}`, { fill: "#ddd3" }, "<");
    }
  }

  tl.call(() => highlightLines([7]));

  console.log("MST Edges:", mst);
}
function prims() {
  const svg = d3.select("svg");
  const mst = [];
  const visited = Array(nodes.length).fill(false);

  const edgesQueue = [];
  let currentNode = 0; // Start from the first node
  visited[currentNode] = true;

  // Highlight: Initialize MST = {} (Line 0)
  tl.call(() => highlightLines([0]));

  // Add initial edges from the first node to the priority queue
  addEdgesToQueue(currentNode);

  // Highlight: Initialize priority queue Q with the start vertex (Line 1)
  tl.call(() => highlightLines([1]));

  while (edgesQueue.length > 0) {
    // Find the smallest edge
    edgesQueue.sort((a, b) => a.weight - b.weight);
    const smallestEdge = edgesQueue.shift();

    const { id, u, v } = smallestEdge;

    // Highlight: u = vertex with minimum key in Q (Line 3)
    tl.call(() => highlightLines([3]));

    // Remove u from Q
    tl.call(() => highlightLines([4]));

    // Check if the edge connects to an unvisited node
    if (visited[u] && visited[v]) {
      // Highlight: If edge is not part of MST (skipping it)
      tl.call(() => highlightLines([6]));
      tl.to(`#edge-${id}`, { stroke: "#ddd3", strokeWidth: 2 });
      tl.to(`#edge-label-${id}`, { fill: "#ddd3" }, "<");
      continue;
    }

    // Add the edge to the MST
    mst.push(smallestEdge);

    // Highlight: Update MST (parent relationship) (Line 8)
    tl.call(() => highlightLines([8]));
    tl.to(`#edge-${id}`, { stroke: "#ff8c2e", strokeWidth: 4 }, "+=0.25");
    tl.to(`#edge-label-${id}`, { fill: "#fff" }, "<");

    const nextNode = visited[u] ? v : u;
    tl.to(`#node-${nextNode}`, { fill: "#ff8c2e", duration: 0.25 }, ">");

    // Mark the node as visited and add its edges
    visited[nextNode] = true;

    // Highlight: Add edges to queue (Line 9)
    tl.call(() => highlightLines([9]));
    addEdgesToQueue(nextNode);
  }

  // Highlight: MST formation complete (Line 10)
  tl.call(() => highlightLines([10]));

  // Highlight remaining edges in a different color
  edges.forEach((edge) => {
    const isInMST = mst.some((mstEdge) => mstEdge.id === edge.id);
    if (!isInMST) {
      tl.to(`#edge-${edge.id}`, {
        stroke: "#ddd3",
        strokeWidth: 2,
        duration: 0.5,
      });
      tl.to(`#edge-label-${edge.id}`, { fill: "#ddd3", duration: 0.5 }, "<");
    }
  });

  console.log("MST Edges:", mst);

  // Helper function to add edges from a node to the priority queue
  function addEdgesToQueue(node) {
    edges.forEach((edge) => {
      if (edge.u === node && !visited[edge.v]) {
        edgesQueue.push(edge);
      } else if (edge.v === node && !visited[edge.u]) {
        edgesQueue.push(edge);
      }
    });
  }
}

// Event Listeners
algorithmDropdown.addEventListener("change", () => {
  restartTimeline();
  tl.clear();

  runSelectedAlgorithm();
});

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
