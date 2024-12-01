const graphContainer = document.getElementById("graph-container");

function createGraph(vertices, edges) {
  graphContainer.innerHTML = "";

  vertices.forEach(({ x, y, label }) => {
    const vertex = document.createElement("div");
    vertex.className = "vertex";
    vertex.style.left = `${x}px`;
    vertex.style.top = `${y}px`;
    vertex.textContent = label;
    graphContainer.appendChild(vertex);
  });

  edges.forEach(({ x1, y1, x2, y2 }) => {
    const edge = document.createElement("div");
    edge.className = "edge";
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx ** 2 + dy ** 2);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    edge.style.width = `${length}px`;
    edge.style.left = `${x1}px`;
    edge.style.top = `${y1}px`;
    edge.style.transform = `rotate(${angle}deg)`;

    graphContainer.appendChild(edge);
  });
}

function kruskalMST(vertices, edges) {
  // Sort edges by weight
  edges.sort((a, b) => a.weight - b.weight);
  const result = [];
  const parent = Array(vertices.length)
    .fill(null)
    .map((_, i) => i);

  function findParent(node) {
    if (parent[node] !== node) parent[node] = findParent(parent[node]);
    return parent[node];
  }

  edges.forEach((edge) => {
    const parent1 = findParent(edge.u);
    const parent2 = findParent(edge.v);
    if (parent1 !== parent2) {
      result.push(edge);
      parent[parent1] = parent2;
      // Animate edge
      const edgeElement = document.querySelector(
        `.edge[data-u="${edge.u}"][data-v="${edge.v}"]`
      );
      if (edgeElement) {
        gsap.to(edgeElement, { backgroundColor: "#50b1d1", duration: 1 });
      }
    }
  });

  return result;
}

function primMST(vertices, edges) {
  const visited = new Set();
  const result = [];
  const pq = new MinPriorityQueue();

  visited.add(0); // Start from the first vertex
  edges.filter((e) => e.u === 0).forEach((e) => pq.enqueue(e, e.weight));

  while (!pq.isEmpty()) {
    const edge = pq.dequeue().element;
    if (!visited.has(edge.v)) {
      result.push(edge);
      visited.add(edge.v);

      // Animate edge
      const edgeElement = document.querySelector(
        `.edge[data-u="${edge.u}"][data-v="${edge.v}"]`
      );
      if (edgeElement) {
        gsap.to(edgeElement, { backgroundColor: "#50b1d1", duration: 1 });
      }

      edges
        .filter((e) => e.u === edge.v && !visited.has(e.v))
        .forEach((e) => {
          pq.enqueue(e, e.weight);
        });
    }
  }

  return result;
}

algorithmDropdown.addEventListener("change", () => {
  const selectedAlgorithm = algorithmDropdown.value;
  if (selectedAlgorithm === "kruskal") {
    const mstEdges = kruskalMST(vertices, edges);
    console.log("Kruskal's MST:", mstEdges);
  } else if (selectedAlgorithm === "prim") {
    const mstEdges = primMST(vertices, edges);
    console.log("Prim's MST:", mstEdges);
  }
});
