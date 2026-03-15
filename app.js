const STORAGE_KEY = "filamentos-definitivo-v2";
const EXPORT_VERSION = 2;
const IMPORT_ACCEPTED_KEYS = ["inventory", "filaments", "items", "data"];
let config = null;
let inventory = [];

const byId = (id) => document.getElementById(id);
const variantFallback = "Standard";

function safeAbbrev(name) {
  return config.abbrev[name] || name || "";
}

function fullBrand(name) {
  return name || "";
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function fitText(el, minPx = 6, maxPx = 12) {
  if (!el) return;
  let size = maxPx;
  el.style.fontSize = `${size}px`;
  while (size > minPx && (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth)) {
    size -= 0.5;
    el.style.fontSize = `${size}px`;
  }
}

function colorToCss(colorName) {
  return config.colorHex[colorName] || "#cccccc";
}

function normalizeColorName(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const aliases = {
    blanco: "blanco",
    negro: "negro",
    gris: "gris",
    plateado: "plateado",
    transparente: "transparente",
    rojo: "rojo",
    naranja: "naranja",
    amarillo: "amarillo",
    verde: "verde",
    azul: "azul",
    cian: "cian",
    morado: "morado",
    rosa: "rosa",
    marrón: "marrón",
    marron: "marrón",
    beige: "beige",
    dorado: "dorado",
    bronce: "bronce",
    multicolor: "multicolor",
    madera: "madera",
    mármol: "mármol",
    marmol: "mármol",
    carbón: "carbón",
    carbon: "carbón",
    natural: "natural",
    'galaxy black': 'Galaxy black',
    'jet black': 'jet black',
    'vertigo galaxy': 'Vertigo Galaxy',
    'onyx black': 'onyx black',
    black: 'negro',
  };

  const lowered = raw.toLowerCase();
  if (aliases[lowered]) return aliases[lowered];
  return config.colors.find(color => color.toLowerCase() === lowered) || "";
}

function displayColorLabel(row) {
  return row.color || "";
}

function effectiveColorCss(row) {
  return colorToCss(row.color);
}

function shortMaterial(row) {
  const parts = [row.materialGeneral, row.variante].filter(Boolean);
  return parts.join(" · ");
}

function setStatus(message = "", type = "") {
  const el = byId("syncStatus");
  if (!el) return;
  el.textContent = message;
  el.className = `status-pill${type ? ` ${type}` : ""}`;
}

function parseFilamentIdNumber(id) {
  const match = String(id || "").trim().toUpperCase().match(/^FIL-(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function ensureInventoryIds(rows) {
  let maxNumber = 0;
  rows.forEach((row) => {
    maxNumber = Math.max(maxNumber, parseFilamentIdNumber(row.id));
  });

  const seen = new Set();
  return rows.map((row) => {
    let id = String(row.id || "").trim().toUpperCase();
    if (!/^FIL-\d+$/.test(id) || seen.has(id)) {
      do {
        maxNumber += 1;
        id = `FIL-${String(maxNumber).padStart(4, "0")}`;
      } while (seen.has(id));
    }
    seen.add(id);
    return { ...row, id };
  });
}

function generateNextFilamentId() {
  const maxNumber = inventory.reduce((max, row) => Math.max(max, parseFilamentIdNumber(row.id)), 0);
  return `FIL-${String(maxNumber + 1).padStart(4, "0")}`;
}

function loadData() {
  return Promise.all([
    fetch("data/config.json").then(r => r.json()),
    fetch("data/inventario.json").then(r => r.json()),
  ]).then(([cfg, baseInventory]) => {
    config = cfg;
    const saved = localStorage.getItem(STORAGE_KEY);
    inventory = saved ? JSON.parse(saved) : baseInventory;
    inventory = normalizeInventory(inventory);
    persist();
  });
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}

function getRow(location, hueco) {
  return inventory.find(r => r.ubicacion === location && r.hueco === hueco);
}

function normalizeInventory(rows) {
  if (!Array.isArray(rows)) return [];
  const normalized = rows.map(normalizeRow).filter(Boolean);
  return ensureInventoryIds(normalized);
}

function normalizeRow(row) {
  if (!row || typeof row !== "object") return null;

  const fabricante = config.brands.includes(row.fabricante) ? row.fabricante : config.brands[0];
  const materialGeneral = config.materialGeneral.includes(row.materialGeneral)
    ? row.materialGeneral
    : config.materialGeneral[0];
  const validVariants = config.variants[materialGeneral] || [variantFallback];
  const variante = validVariants.includes(row.variante) ? row.variante : validVariants[0];

  const colorCandidates = [row.color, row.colorManual, row.customColor];
  const normalizedColor = colorCandidates
    .map(normalizeColorName)
    .find(Boolean);
  const color = normalizedColor || config.colors[0];

  const ubicacion = config.locations.includes(row.ubicacion) ? row.ubicacion : config.locations[0];
  const huecos = config.huecos[ubicacion] || [""];
  const hueco = huecos.includes(row.hueco) ? row.hueco : huecos[0];
  const estado = config.states.includes(row.estado) ? row.estado : config.states[0];

  return {
    id: row.id || "",
    fabricante,
    materialGeneral,
    variante,
    color,
    ubicacion,
    hueco,
    estado,
    notas: typeof row.notas === "string" ? row.notas : ""
  };
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
    fill.style.background = row ? effectiveColorCss(row) : "transparent";
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
      <div class="brand">${row ? fullBrand(row.fabricante) : ""}</div>
      <div class="mat">${row ? `${row.materialGeneral}${displayColorLabel(row) ? " · " + displayColorLabel(row) : ""}` : ""}</div>
    `;
    slots.appendChild(tag);
  });
  fig.appendChild(slots);

  card.appendChild(fig);
  requestAnimationFrame(() => {
    card.querySelectorAll(".ams-tag .brand").forEach(el => fitText(el, 5.5, 8.8));
    card.querySelectorAll(".ams-tag .mat").forEach(el => fitText(el, 5.2, 7.4));
  });
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
    circle.style.background = row ? effectiveColorCss(row) : "transparent";
    circleWrap.appendChild(circle);

    const label = document.createElement("div");
    label.className = "slot-label";
    label.innerHTML = `
      <div class="slot-code">${hueco}</div>
      <div class="slot-brand">${row ? fullBrand(row.fabricante) : ""}</div>
      <div class="slot-mat">${row ? `${row.materialGeneral}${displayColorLabel(row) ? " · " + displayColorLabel(row) : ""}` : ""}</div>
    `;

    overlay.appendChild(circleWrap);
    overlay.appendChild(label);
    root.appendChild(overlay);

    requestAnimationFrame(() => {
      fitText(label.querySelector(".slot-brand"), 6.2, 10.4);
      fitText(label.querySelector(".slot-mat"), 5.8, 9.2);
    });
  });
}

function optionList(options, selected) {
  return options.map((item) => {
    const option = typeof item === "string" ? { value: item, label: item } : item;
    return `<option value="${escapeHtml(option.value)}" ${option.value === selected ? "selected" : ""}>${escapeHtml(option.label)}</option>`;
  }).join("");
}

function renderTable() {
  const body = byId("inventoryBody");
  body.innerHTML = "";
  inventory.forEach((row, index) => {
    const tr = document.createElement("tr");

    const huecos = config.huecos[row.ubicacion] || [];
    const variants = config.variants[row.materialGeneral] || [variantFallback];

    tr.innerHTML = `
      <td><span class="id-chip">${escapeHtml(row.id)}</span></td>
      <td><select data-index="${index}" data-field="fabricante">${optionList(config.brands, row.fabricante)}</select></td>
      <td><select data-index="${index}" data-field="materialGeneral">${optionList(config.materialGeneral, row.materialGeneral)}</select></td>
      <td><select data-index="${index}" data-field="variante">${optionList(variants, row.variante)}</select></td>
      <td><select data-index="${index}" data-field="color">${optionList(config.colors, row.color)}</select></td>
      <td><select data-index="${index}" data-field="ubicacion">${optionList(config.locations, row.ubicacion)}</select></td>
      <td><select data-index="${index}" data-field="hueco">${optionList(huecos, row.hueco)}</select></td>
      <td><select data-index="${index}" data-field="estado">${optionList(config.states, row.estado)}</select></td>
      <td><input data-index="${index}" data-field="notas" value="${escapeHtml(row.notas || "")}" /></td>
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
      setStatus("Cambios guardados en este dispositivo.", "ok");
    });
  });

  body.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", () => {
      inventory.splice(Number(btn.dataset.delete), 1);
      persist();
      rerender();
      setStatus("Fila eliminada y cambios guardados.", "ok");
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
    id: generateNextFilamentId(),
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
  setStatus("Fila añadida con ID autogenerado y guardada en este dispositivo.", "ok");
}

function clearInventory() {
  const confirmed = window.confirm("Se vaciará todo el inventario guardado en este dispositivo. ¿Continuar?");
  if (!confirmed) {
    setStatus("Vaciado cancelado.", "warn");
    return;
  }

  inventory = [];
  persist();
  rerender();
  setStatus("Inventario vaciado en este dispositivo.", "ok");
}

function formatTimestampForFile(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
}

function downloadTextFile(filename, text, mimeType = "application/json") {
  const blob = new Blob([text], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportInventory() {
  const payload = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    app: "inventario-filamentos",
    inventory
  };

  const filename = `inventario-filamentos_${formatTimestampForFile()}.json`;
  downloadTextFile(filename, JSON.stringify(payload, null, 2));
  setStatus(`Archivo exportado: ${filename}`, "ok");
}

function extractImportedRows(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return null;

  for (const key of IMPORT_ACCEPTED_KEYS) {
    if (Array.isArray(payload[key])) {
      return payload[key];
    }
  }

  return null;
}

async function importInventoryFile(file) {
  if (!file) return;

  try {
    const text = await file.text();
    const payload = JSON.parse(text);
    const importedRows = extractImportedRows(payload);

    if (!importedRows) {
      throw new Error("El archivo no tiene un inventario válido.");
    }

    const normalizedRows = normalizeInventory(importedRows);
    if (!normalizedRows.length) {
      throw new Error("El archivo está vacío o no contiene filas utilizables.");
    }

    const confirmed = window.confirm(
      `Se van a reemplazar ${inventory.length} filas actuales por ${normalizedRows.length} filas del archivo. ¿Continuar?`
    );

    if (!confirmed) {
      setStatus("Importación cancelada.", "warn");
      return;
    }

    inventory = normalizedRows;
    persist();
    rerender();
    setStatus(`Importación completada: ${normalizedRows.length} filas cargadas.`, "ok");
  } catch (error) {
    console.error(error);
    setStatus(error.message || "No se pudo importar el archivo.", "error");
  }
}

function triggerImportPicker() {
  const input = byId("importFileInput");
  if (!input) return;
  input.value = "";
  input.click();
}

loadData().then(() => {
  byId("addRowBtn").addEventListener("click", addRow);
  byId("resetBtn").addEventListener("click", clearInventory);
  byId("exportBtn").addEventListener("click", exportInventory);
  byId("importBtn").addEventListener("click", triggerImportPicker);
  byId("importFileInput").addEventListener("change", (event) => {
    importInventoryFile(event.target.files?.[0]);
  });
  rerender();
  setStatus("Los cambios se guardan en este dispositivo. Usa exportar/importar para pasarlos a otro.", "ok");
}).catch((error) => {
  console.error(error);
  setStatus("No se pudieron cargar los datos iniciales.", "error");
});
