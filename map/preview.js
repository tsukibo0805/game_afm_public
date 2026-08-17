const MAPS = [
  { id: "west-island", displayName: "西の島" },
  { id: "central-island", displayName: "中央の島" },
  { id: "east-island", displayName: "東の島" },
];

const TYPE_LABELS = {
  Town: "街",
  Coast: "海岸",
  Church: "教会",
  Mountain: "山岳",
  Cave: "洞窟",
  Forest: "森",
  Graveyard: "墓地",
  Sea: "航路",
  Checkpoint: "検問",
  Road: "街道",
  Port: "港",
  Lighthouse: "灯台",
  Market: "市場",
  Shrine: "神殿",
  Village: "村",
  Gate: "門",
  Temple: "神殿",
  Capital: "帝都",
  Prison: "牢",
  Ruins: "遺跡",
};

const svgNs = "http://www.w3.org/2000/svg";

const state = {
  mapId: "west-island",
  map: { id: "", displayName: "", nodes: [] },
  layout: { nodes: {}, viewBox: [0, 0, 1000, 1000] },
  currentId: "",
  nodesById: {},
  positions: {},
  loadToken: 0,
};

async function loadJson(url) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return await response.json();
  } catch {
    return null;
  }
}

function svgEl(name, attrs) {
  const element = document.createElementNS(svgNs, name);
  Object.entries(attrs || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.setAttribute(key, String(value));
    }
  });
  return element;
}

function edgeKey(from, to) {
  return [from, to].sort().join("::");
}

function uniqueEdges(nodes) {
  const seen = new Set();
  const edges = [];
  nodes.forEach((node) => {
    (node.choices || [])
      .filter((choice) => choice.action === "Move" && choice.toNode)
      .forEach((choice) => {
        const key = edgeKey(node.id, choice.toNode);
        if (!seen.has(key)) {
          seen.add(key);
          edges.push({
            from: node.id,
            to: choice.toNode,
            external: !state.nodesById[choice.toNode],
          });
        }
      });
  });
  (state.layout.impliedEdges || []).forEach((edge) => {
    const key = edgeKey(edge.from, edge.to);
    if (!seen.has(key)) {
      seen.add(key);
      edges.push({ from: edge.from, to: edge.to, external: true });
    }
  });
  return edges;
}

function movesFrom(nodeId) {
  const node = state.nodesById[nodeId];
  if (!node) {
    return [];
  }
  return (node.choices || []).filter((choice) => choice.action === "Move" && choice.toNode);
}

function displayName(nodeId) {
  if (state.nodesById[nodeId]) {
    return state.nodesById[nodeId].displayName;
  }
  const external = state.layout.externalNodes && state.layout.externalNodes[nodeId];
  return external ? external.displayName : nodeId;
}

function nodeType(nodeId) {
  if (state.nodesById[nodeId]) {
    return state.nodesById[nodeId].type || "Unknown";
  }
  const external = state.layout.externalNodes && state.layout.externalNodes[nodeId];
  return (external && external.type) || "Unknown";
}

function mapLabel(nodeId) {
  const point = state.positions[nodeId] || {};
  if (point.shortLabel) {
    return point.shortLabel;
  }
  const name = displayName(nodeId);
  const match = String(name).match(/^(山岳[A-E]|精霊森[A-D])/);
  return match ? match[1] : name;
}

function nodeRadius(nodeId) {
  const point = state.positions[nodeId] || {};
  if (point.r) {
    return point.r;
  }
  return state.layout.dense ? 13 : 16;
}

function buildPositions() {
  const positions = {};
  Object.entries(state.layout.nodes || {}).forEach(([id, point]) => {
    positions[id] = point;
  });
  Object.entries(state.layout.externalNodes || {}).forEach(([id, point]) => {
    positions[id] = point;
  });
  let fallbackIndex = 0;
  state.map.nodes.forEach((node) => {
    if (!positions[node.id]) {
      positions[node.id] = { x: 80 + (fallbackIndex % 5) * 90, y: 80 + Math.floor(fallbackIndex / 5) * 90 };
      fallbackIndex += 1;
    }
  });
  state.positions = positions;
}

function drawMap() {
  const svg = document.getElementById("map");
  const [minX, minY, width, height] = state.layout.viewBox || [0, 0, 1000, 1000];
  svg.replaceChildren();
  svg.setAttribute("viewBox", `${minX} ${minY} ${width} ${height}`);
  svg.classList.toggle("is-dense", Boolean(state.layout.dense));
  svg.setAttribute("aria-label", `${state.map.displayName || "島"}のノード接続図`);

  svg.appendChild(svgEl("rect", { x: minX, y: minY, width, height, class: "water-hatch" }));
  if (state.layout.islandPath) {
    svg.appendChild(svgEl("path", { class: "island-fill", d: state.layout.islandPath }));
  }

  (state.layout.regions || []).forEach((region) => {
    const text = svgEl("text", {
      class: "region-label",
      x: region.x,
      y: region.y,
      "text-anchor": "middle",
    });
    text.textContent = region.label;
    svg.appendChild(text);
  });

  const edgesLayer = svgEl("g", { id: "edges" });
  const nodesLayer = svgEl("g", { id: "nodes" });
  svg.appendChild(edgesLayer);
  svg.appendChild(nodesLayer);

  uniqueEdges(state.map.nodes).forEach((edge) => {
    const from = state.positions[edge.from];
    const to = state.positions[edge.to];
    if (!from || !to) {
      return;
    }
    edgesLayer.appendChild(
      svgEl("line", {
        class: `edge${edge.external ? " is-external" : ""}`,
        "data-from": edge.from,
        "data-to": edge.to,
        x1: from.x,
        y1: from.y,
        x2: to.x,
        y2: to.y,
      })
    );
  });

  const renderIds = [
    ...state.map.nodes.map((node) => node.id),
    ...Object.keys(state.layout.externalNodes || {}),
  ];

  renderIds.forEach((id) => {
    const point = state.positions[id];
    if (!point) {
      return;
    }
    const radius = nodeRadius(id);
    const group = svgEl("g", {
      class: `node type-${nodeType(id)}`,
      "data-id": id,
      tabindex: state.nodesById[id] ? "0" : "-1",
      role: "button",
      "aria-label": displayName(id),
    });
    group.appendChild(svgEl("circle", { class: "pulse", cx: point.x, cy: point.y, r: radius + 2 }));
    group.appendChild(svgEl("circle", { class: "node-ring", cx: point.x, cy: point.y, r: radius + 10 }));
    group.appendChild(
      svgEl("circle", { class: `node-core type-${nodeType(id)}`, cx: point.x, cy: point.y, r: radius })
    );

    const labelAnchor = point.labelAnchor || "middle";
    const labelX = labelAnchor === "end" ? point.x - 22 : point.x;
    const label = svgEl("text", {
      class: "node-label",
      x: labelX,
      y: point.y + radius + 18,
      "text-anchor": labelAnchor,
    });
    label.textContent = mapLabel(id);
    group.appendChild(label);

    const flag = svgEl("text", {
      class: "current-flag",
      x: point.x,
      y: point.y - radius - 12,
      "text-anchor": "middle",
    });
    flag.textContent = "現在地";
    flag.style.display = "none";
    group.appendChild(flag);

    if (state.nodesById[id]) {
      group.addEventListener("click", () => setCurrent(id));
      group.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setCurrent(id);
        }
      });
    }
    nodesLayer.appendChild(group);
  });
}

function fillSelect() {
  const select = document.getElementById("node-select");
  select.replaceChildren();
  state.map.nodes.forEach((node) => {
    const option = document.createElement("option");
    option.value = node.id;
    option.textContent = `${node.displayName}（${node.id}）`;
    select.appendChild(option);
  });
  select.value = state.currentId;
}

function setCurrent(nodeId) {
  if (!state.nodesById[nodeId]) {
    return;
  }
  state.currentId = nodeId;
  const neighborIds = new Set(movesFrom(nodeId).map((choice) => choice.toNode));
  const select = document.getElementById("node-select");
  if (select.value !== nodeId) {
    select.value = nodeId;
  }

  document.querySelectorAll(".edge").forEach((edge) => {
    const from = edge.getAttribute("data-from");
    const to = edge.getAttribute("data-to");
    const active = (from === nodeId && neighborIds.has(to)) || (to === nodeId && neighborIds.has(from));
    edge.classList.toggle("is-neighbor", active);
  });

  document.querySelectorAll(".node").forEach((nodeEl) => {
    const id = nodeEl.getAttribute("data-id");
    const isCurrent = id === nodeId;
    const isNeighbor = neighborIds.has(id);
    nodeEl.classList.toggle("is-current", isCurrent);
    nodeEl.classList.toggle("is-neighbor", isNeighbor);
    nodeEl.classList.toggle("is-dim", !isCurrent && !isNeighbor);
    const flag = nodeEl.querySelector(".current-flag");
    if (flag) {
      flag.style.display = isCurrent ? "block" : "none";
    }
  });

  const current = state.nodesById[nodeId];
  document.getElementById("current-name").textContent = current.displayName;
  document.getElementById("current-meta").textContent = `${TYPE_LABELS[current.type] || current.type} / ${current.id}`;

  const list = document.getElementById("move-list");
  list.replaceChildren();
  const moves = movesFrom(nodeId);
  if (moves.length === 0) {
    const item = document.createElement("li");
    item.textContent = "移動先はありません。";
    list.appendChild(item);
    return;
  }
  moves.forEach((choice) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${displayName(choice.toNode)} へ`;
    if (state.nodesById[choice.toNode]) {
      button.addEventListener("click", () => setCurrent(choice.toNode));
    } else {
      button.disabled = true;
    }
    const note = document.createElement("span");
    note.textContent = ` ${choice.displayName || ""}`;
    item.appendChild(button);
    item.appendChild(note);
    list.appendChild(item);
  });
}

function requestedMapId() {
  const hash = window.location.hash.replace(/^#/, "");
  if (MAPS.some((item) => item.id === hash)) {
    return hash;
  }
  return MAPS[0].id;
}

function updateTabs(mapId) {
  document.querySelectorAll(".island-tabs [data-map]").forEach((button) => {
    const selected = button.getAttribute("data-map") === mapId;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", selected ? "true" : "false");
  });
}

async function loadIsland(mapId) {
  const spec = MAPS.find((item) => item.id === mapId) || MAPS[0];
  const loadToken = state.loadToken + 1;
  state.loadToken = loadToken;
  const status = document.getElementById("status");
  status.textContent = `${spec.displayName}を読み込み中…`;

  const [mapData, layoutData] = await Promise.all([
    loadJson(`./fallbacks/${spec.id}.json`),
    loadJson(`./layouts/${spec.id}.json`),
  ]);
  if (loadToken !== state.loadToken) {
    return;
  }
  const fallbackMap = mapData && Array.isArray(mapData.nodes) ? null : await loadJson(`./fallbacks/${spec.id}.json`);
  if (loadToken !== state.loadToken) {
    return;
  }
  const sources = [];

  const resolvedMap = mapData && Array.isArray(mapData.nodes) ? mapData : fallbackMap;
  if (!resolvedMap || !Array.isArray(resolvedMap.nodes)) {
    status.textContent = `${spec.displayName}のマップデータを読めません。`;
    return;
  }
  if (!layoutData || !layoutData.nodes) {
    status.textContent = `${spec.displayName}の座標レイアウトを読めません。`;
    return;
  }

  state.mapId = spec.id;
  state.map = resolvedMap;
  state.layout = layoutData;
  state.nodesById = Object.fromEntries(state.map.nodes.map((node) => [node.id, node]));
  state.currentId =
    state.layout.defaultNodeId && state.nodesById[state.layout.defaultNodeId]
      ? state.layout.defaultNodeId
      : state.map.nodes[0].id;

  if (mapData && Array.isArray(mapData.nodes)) {
    sources.push(`${spec.id}.json`);
  } else {
    sources.push("fallbackマップ");
  }
  sources.push(`layouts/${spec.id}.json`);

  if (window.location.hash.replace(/^#/, "") !== spec.id) {
    window.history.replaceState(null, "", `#${spec.id}`);
  }
  updateTabs(spec.id);
  buildPositions();
  fillSelect();
  drawMap();
  setCurrent(state.currentId);
  status.textContent = `${spec.displayName} / 読み込み元: ${sources.join(" / ")}`;
}

function bindUi() {
  document.getElementById("node-select").addEventListener("change", (event) => {
    setCurrent(event.target.value);
  });
  document.querySelectorAll(".island-tabs [data-map]").forEach((button) => {
    button.addEventListener("click", () => loadIsland(button.getAttribute("data-map")));
  });
  window.addEventListener("hashchange", () => loadIsland(requestedMapId()));
}

bindUi();
loadIsland(requestedMapId());
