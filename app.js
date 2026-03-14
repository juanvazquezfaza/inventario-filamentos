
const STORAGE_KEY = "filamentos-definitivo-v2";

let config = null;
let inventory = [];

const byId = (id) => document.getElementById(id);

const variantFallback = "Standard";

function safeAbbrev(name) {
  return config.abbrev[name] || name.slice(0, 3).toUpperCase();
}

function colorToCss(colorName) {
  return config.colorHex[colorName] || "#cccccc";
}

function shortMaterial(row) {
  const parts = [row.materialGeneral, row.variante].filter(Boolean);
  return parts.join(" · ");
}

function loadData() {
  return Promise.all([
    fetch("data/config.json").then(r => r.json()),
    fetch("data/inventario.json").then(r => r.json()),
  ]).then(([cfg, baseInventory]) => {
    config = cfg;
    const saved = localStorage.getItem(STORAGE_KEY);
    inventory = saved ? JSON.parse(saved) : baseInventory;
  });
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}

function getRow(location, hueco) {
  return inventory.find(r => r.ubicacion === location && r.hueco === hueco);
}

function createAmsCard(title, type, location, huecos, baseFile, maskFiles) {
  const card = document.createElement("div");
  card.className = `ams-card ${type === "ht" ? "ht-card" : "ams2-card"}`;

  const titleEl = document.createElement("div");
  titleEl.className = "ams-title";
  titleEl.textContent = title;
  card.appendChild(titleEl);

  const fig = document.createElement("div");
  fig.className = "ams-figure";
  const figSize = type === "ht" ? config.visual.amsHt.size : config.visual.ams2Pro.size;
  fig.style.aspectRatio = `${figSize[0]} / ${figSize[1]}`;

  const img = document.createElement("img");
  img.className = "base";
  img.src = baseFile;
  img.alt = title;
  fig.appendChild(img);

  huecos.forEach((hueco, i) => {
    const row = getRow(location, hueco);
    const fill = document.createElement("div");
    fill.className = "ams-fill";
    fill.style.background = row ? colorToCss(row.color) : "transparent";
    fill.style.webkitMaskImage = `url("${maskFiles[i]}")`;
    fill.style.maskImage = `url("${maskFiles[i]}")`;
    fig.appendChild(fill);
  });

  const slots = document.createElement("div");
  slots.className = "ams-slots";
  huecos.forEach((hueco, i) => {
    const row = getRow(location, hueco);
    const bbox = type === "ht"
      ? config.visual.amsHt.masks[0].bbox
      : config.visual.ams2Pro.masks[i].bbox;
    const baseSize = type === "ht" ? config.visual.amsHt.size : config.visual.ams2Pro.size;
    const centerX = ((bbox[0] + bbox[2]) / 2) / baseSize[0] * 100;
    const y = type === "ht" ? 63 : 62;

    const tag = document.createElement("div");
    tag.className = "ams-tag";
    tag.style.left = `${centerX}%`;
    tag.style.top = `${y}%`;
    tag.innerHTML = `
      <div class="slot">${hueco}</div>
      <div class="brand">${row ? safeAbbrev(row.fabricante) : ""}</div>
      <div class="mat">${row ? `${row.materialGeneral}${row.color ? " · " + row.color : ""}` : ""}</div>
    `;
    slots.appendChild(tag);
  });
  fig.appendChild(slots);

  card.appendChild(fig);
  return card;
}

function renderAms() {
  const row = byId("amsRow");
  row.innerHTML = "";

  row.appendChild(
    createAmsCard(
      "AMS HT *1",
      "ht",
      "AMS HT *1",
      ["HT1"],
      "drawings/ams-ht-base.svg",
      ["drawings/ams-ht-fill-1.png"]
    )
  );
  row.appendChild(
    createAmsCard(
      "AMS HT *2",
      "ht",
      "AMS HT *2",
      ["HT2"],
      "drawings/ams-ht-base.svg",
      ["drawings/ams-ht-fill-1.png"]
    )
  );

  row.appendChild(
    createAmsCard(
      "AMS 2 Pro *1",
      "ams2",
      "AMS 2 Pro *1",
      ["A1", "A2", "A3", "A4"],
      "drawings/ams-2pro-base.svg",
      [
        "drawings/ams-2pro-fill-1.png",
        "drawings/ams-2pro-fill-2.png",
        "drawings/ams-2pro-fill-3.png",
        "drawings/ams-2pro-fill-4.png",
      ]
    )
  );
  row.appendChild(
    createAmsCard(
      "AMS 2 Pro *2",
      "ams2",
      "AMS 2 Pro *2",
      ["B1", "B2", "B3", "B4"],
      "drawings/ams-2pro-base.svg",
      [
        "drawings/ams-2pro-fill-1.png",
        "drawings/ams-2pro-fill-2.png",
        "drawings/ams-2pro-fill-3.png",
        "drawings/ams-2pro-fill-4.png",
      ]
    )
  );
  row.appendChild(
    createAmsCard(
      "AMS 2 Pro *3",
      "ams2",
      "AMS 2 Pro *3",
      ["C1", "C2", "C3", "C4"],
      "drawings/ams-2pro-base.svg",
      [
        "drawings/ams-2pro-fill-1.png",
        "drawings/ams-2pro-fill-2.png",
        "drawings/ams-2pro-fill-3.png",
        "drawings/ams-2pro-fill-4.png",
      ]
    )
  );
}

function renderShelf(containerId, location, baseFile, size, boxes) {
  const root = byId(containerId);
  root.innerHTML = "";
  root.style.aspectRatio = `${size[0]} / ${size[1]}`;

  const img = document.createElement("img");
  img.className = "base";
  img.src = baseFile;
  img.alt = location;
  root.appendChild(img);

  boxes.forEach((box, idx) => {
    const hueco = location === "Estantería *1"
      ? `S1-${String(idx + 1).padStart(2, "0")}`
      : `S2-${String(idx + 1).padStart(2, "0")}`;
    const row = getRow(location, hueco);

    const overlay = document.createElement("div");
    overlay.className = "slot-overlay";
    overlay.style.left = `${box[0] / size[0] * 100}%`;
    overlay.style.top = `${box[1] / size[1] * 100}%`;
    overlay.style.width = `${box[2] / size[0] * 100}%`;
    overlay.style.height = `${box[3] / size[1] * 100}%`;

    const circleWrap = document.createElement("div");
    circleWrap.className = "slot-circle-wrap";

    const circle = document.createElement("div");
    circle.className = "slot-circle-inner";
    circle.style.background = row ? colorToCss(row.color) : "transparent";
    circleWrap.appendChild(circle);

    const label = document.createElement("div");
    label.className = "slot-label";
    label.innerHTML = `
      <div class="slot-code">${hueco}</div>
      <div class="slot-brand">${row ? safeAbbrev(row.fabricante) : ""}</div>
      <div class="slot-mat">${row ? `${row.materialGeneral} · ${row.color}` : ""}</div>
    `;

    overlay.appendChild(circleWrap);
    overlay.appendChild(label);
    root.appendChild(overlay);
  });
}

function optionList(options, selected) {
  return options.map(v => `<option value="${String(v).replaceAll('"','&quot;')}" ${v === selected ? "selected" : ""}>${v}</option>`).join("");
}

function renderTable() {
  const body = byId("inventoryBody");
  body.innerHTML = "";
  inventory.forEach((row, index) => {
    const tr = document.createElement("tr");

    const huecos = config.huecos[row.ubicacion] || [];
    const variants = config.variants[row.materialGeneral] || [variantFallback];

    tr.innerHTML = `
      <td><select data-index="${index}" data-field="fabricante">${optionList(config.brands, row.fabricante)}</select></td>
      <td><select data-index="${index}" data-field="materialGeneral">${optionList(config.materialGeneral, row.materialGeneral)}</select></td>
      <td><select data-index="${index}" data-field="variante">${optionList(variants, row.variante)}</select></td>
      <td><select data-index="${index}" data-field="color">${optionList(config.colors, row.color)}</select></td>
      <td><select data-index="${index}" data-field="ubicacion">${optionList(config.locations, row.ubicacion)}</select></td>
      <td><select data-index="${index}" data-field="hueco">${optionList(huecos, row.hueco)}</select></td>
      <td><select data-index="${index}" data-field="estado">${optionList(config.states, row.estado)}</select></td>
      <td><input data-index="${index}" data-field="notas" value="${(row.notas || "").replaceAll('"','&quot;')}" /></td>
      <td><button class="small-btn" data-delete="${index}">Borrar</button></td>
    `;
    body.appendChild(tr);
  });

  body.querySelectorAll("select, input").forEach(el => {
    el.addEventListener("change", (e) => {
      const index = Number(e.target.dataset.index);
      const field = e.target.dataset.field;
      inventory[index][field] = e.target.value;

      if (field === "materialGeneral") {
        const nextVariants = config.variants[inventory[index].materialGeneral] || [variantFallback];
        if (!nextVariants.includes(inventory[index].variante)) {
          inventory[index].variante = nextVariants[0];
        }
      }

      if (field === "ubicacion") {
        inventory[index].hueco = (config.huecos[inventory[index].ubicacion] || [""])[0];
      }

      persist();
      rerender();
    });
  });

  body.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", () => {
      inventory.splice(Number(btn.dataset.delete), 1);
      persist();
      rerender();
    });
  });
}

function rerender() {
  renderAms();
  renderShelf("shelf1Visual", "Estantería *1", "drawings/shelf1-base.svg", config.visual.shelf1.size, config.visual.shelf1.boxes);
  renderShelf("shelf2Visual", "Estantería *2", "drawings/shelf2-base.svg", config.visual.shelf2.size, config.visual.shelf2.boxes);
  renderTable();
}

function addRow() {
  inventory.unshift({
    id: Date.now(),
    fabricante: config.brands[0],
    materialGeneral: config.materialGeneral[0],
    variante: (config.variants[config.materialGeneral[0]] || [variantFallback])[0],
    color: config.colors[0],
    ubicacion: config.locations[0],
    hueco: config.huecos[config.locations[0]][0],
    estado: config.states[0],
    notas: ""
  });
  persist();
  rerender();
}

function resetDemo() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

loadData().then(() => {
  byId("addRowBtn").addEventListener("click", addRow);
  byId("resetBtn").addEventListener("click", resetDemo);
  rerender();
});
