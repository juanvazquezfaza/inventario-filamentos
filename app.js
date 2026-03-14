const app = document.getElementById("app");

const COLOR_MAP = {
  blanco: "#f5f5f5",
  negro: "#1f1f1f",
  gris: "#8c8c8c",
  plateado: "#bcc3cc",
  transparente: "rgba(235,235,235,0.58)",
  rojo: "#d63031",
  naranja: "#e67e22",
  amarillo: "#f1c40f",
  verde: "#2ecc71",
  azul: "#3498db",
  cian: "#00bcd4",
  morado: "#8e44ad",
  rosa: "#ff6fae",
  marrón: "#8d5524",
  beige: "#d7c2a3",
  dorado: "#c9a227",
  bronce: "#b07d4f",
  madera: "#a97142",
  mármol: "#d9dde2",
  carbón: "#454b54",
  natural: "#d9c6a0",
  multicolor: "linear-gradient(135deg,#ff4d4d,#ffcc00,#4cd137,#3498db,#9b59b6)",
};

const DRAWINGS = {
  "AMS HT *1": "/drawings/ams-ht-base.png",
  "AMS HT *2": "/drawings/ams-ht-base.png",
  "AMS 2 Pro *1": "/drawings/ams-2pro-base.png",
  "AMS 2 Pro *2": "/drawings/ams-2pro-base.png",
  "AMS 2 Pro *3": "/drawings/ams-2pro-base.png",
  "Estantería *1": "/drawings/shelf-1-base.png",
  "Estantería *2": "/drawings/shelf-2-base.png",
};

const SLOT_LAYOUTS = {
  "AMS HT *1": [{ code: "HT1", fill: { left: 25.2, top: 12.5, width: 29.5, height: 54 }, label: { left: 16.5, top: 43.5, width: 28.5 } }],
  "AMS HT *2": [{ code: "HT1", fill: { left: 25.2, top: 12.5, width: 29.5, height: 54 }, label: { left: 16.5, top: 43.5, width: 28.5 } }],
  "AMS 2 Pro *1": [
    { code: "A1", fill: { left: 7.4, top: 10.6, width: 17.4, height: 66 }, label: { left: 9.4, top: 52.5, width: 16.5 } },
    { code: "A2", fill: { left: 28.4, top: 10.6, width: 17.4, height: 66 }, label: { left: 28.9, top: 52.5, width: 16.5 } },
    { code: "A3", fill: { left: 49.5, top: 10.6, width: 17.4, height: 66 }, label: { left: 48.6, top: 52.5, width: 16.5 } },
    { code: "A4", fill: { left: 70.6, top: 10.6, width: 17.4, height: 66 }, label: { left: 67.8, top: 52.5, width: 16.5 } },
  ],
  "AMS 2 Pro *2": [
    { code: "B1", fill: { left: 7.4, top: 10.6, width: 17.4, height: 66 }, label: { left: 9.4, top: 52.5, width: 16.5 } },
    { code: "B2", fill: { left: 28.4, top: 10.6, width: 17.4, height: 66 }, label: { left: 28.9, top: 52.5, width: 16.5 } },
    { code: "B3", fill: { left: 49.5, top: 10.6, width: 17.4, height: 66 }, label: { left: 48.6, top: 52.5, width: 16.5 } },
    { code: "B4", fill: { left: 70.6, top: 10.6, width: 17.4, height: 66 }, label: { left: 67.8, top: 52.5, width: 16.5 } },
  ],
  "AMS 2 Pro *3": [
    { code: "C1", fill: { left: 7.4, top: 10.6, width: 17.4, height: 66 }, label: { left: 9.4, top: 52.5, width: 16.5 } },
    { code: "C2", fill: { left: 28.4, top: 10.6, width: 17.4, height: 66 }, label: { left: 28.9, top: 52.5, width: 16.5 } },
    { code: "C3", fill: { left: 49.5, top: 10.6, width: 17.4, height: 66 }, label: { left: 48.6, top: 52.5, width: 16.5 } },
    { code: "C4", fill: { left: 70.6, top: 10.6, width: 17.4, height: 66 }, label: { left: 67.8, top: 52.5, width: 16.5 } },
  ],
  "Estantería *1": [
    { code: "S1-01", fill: { left: 10.3, top: 7.2, width: 9.2, height: 6.7, circle: true }, label: { left: 7.0, top: 14.0, width: 16.0 } },
    { code: "S1-02", fill: { left: 31.2, top: 7.2, width: 9.2, height: 6.7, circle: true }, label: { left: 28.1, top: 14.0, width: 16.0 } },
    { code: "S1-03", fill: { left: 60.8, top: 7.2, width: 9.2, height: 6.7, circle: true }, label: { left: 57.8, top: 14.0, width: 16.0 } },
    { code: "S1-04", fill: { left: 81.0, top: 7.2, width: 9.2, height: 6.7, circle: true }, label: { left: 77.9, top: 14.0, width: 16.0 } },
    { code: "S1-05", fill: { left: 9.9, top: 36.8, width: 9.2, height: 6.7, circle: true }, label: { left: 6.7, top: 43.5, width: 16.0 } },
    { code: "S1-06", fill: { left: 31.0, top: 36.8, width: 9.2, height: 6.7, circle: true }, label: { left: 27.8, top: 43.5, width: 16.0 } },
    { code: "S1-07", fill: { left: 60.4, top: 36.8, width: 9.2, height: 6.7, circle: true }, label: { left: 57.4, top: 43.5, width: 16.0 } },
    { code: "S1-08", fill: { left: 81.0, top: 36.8, width: 9.2, height: 6.7, circle: true }, label: { left: 77.8, top: 43.5, width: 16.0 } },
    { code: "S1-09", fill: { left: 10.2, top: 68.2, width: 9.2, height: 6.7, circle: true }, label: { left: 7.0, top: 74.8, width: 16.0 } },
    { code: "S1-10", fill: { left: 31.3, top: 68.2, width: 9.2, height: 6.7, circle: true }, label: { left: 28.1, top: 74.8, width: 16.0 } },
    { code: "S1-11", fill: { left: 60.8, top: 68.2, width: 9.2, height: 6.7, circle: true }, label: { left: 57.8, top: 74.8, width: 16.0 } },
    { code: "S1-12", fill: { left: 81.0, top: 68.2, width: 9.2, height: 6.7, circle: true }, label: { left: 77.8, top: 74.8, width: 16.0 } }
  ],
  "Estantería *2": [
    { code: "S2-01", fill: { left: 3.5, top: 10.4, width: 4.4, height: 5.7, circle: true }, label: { left: 2.1, top: 17.0, width: 11.4 } },
    { code: "S2-02", fill: { left: 28.2, top: 10.4, width: 4.4, height: 5.7, circle: true }, label: { left: 26.7, top: 17.0, width: 11.4 } },
    { code: "S2-03", fill: { left: 52.4, top: 10.4, width: 4.4, height: 5.7, circle: true }, label: { left: 51.0, top: 17.0, width: 11.4 } },
    { code: "S2-04", fill: { left: 77.5, top: 10.4, width: 4.4, height: 5.7, circle: true }, label: { left: 76.0, top: 17.0, width: 11.4 } },
    { code: "S2-05", fill: { left: 3.5, top: 20.6, width: 4.4, height: 5.7, circle: true }, label: { left: 2.1, top: 27.1, width: 11.4 } },
    { code: "S2-06", fill: { left: 28.2, top: 20.6, width: 4.4, height: 5.7, circle: true }, label: { left: 26.7, top: 27.1, width: 11.4 } },
    { code: "S2-07", fill: { left: 52.4, top: 20.6, width: 4.4, height: 5.7, circle: true }, label: { left: 51.0, top: 27.1, width: 11.4 } },
    { code: "S2-08", fill: { left: 77.5, top: 20.6, width: 4.4, height: 5.7, circle: true }, label: { left: 76.0, top: 27.1, width: 11.4 } },

    { code: "S2-09", fill: { left: 5.2, top: 38.6, width: 4.1, height: 5.4, circle: true }, label: { left: 2.5, top: 55.8, width: 9.6 } },
    { code: "S2-10", fill: { left: 15.7, top: 38.6, width: 4.1, height: 5.4, circle: true }, label: { left: 13.0, top: 55.8, width: 9.6 } },
    { code: "S2-11", fill: { left: 30.8, top: 38.6, width: 4.1, height: 5.4, circle: true }, label: { left: 28.0, top: 55.8, width: 9.6 } },
    { code: "S2-12", fill: { left: 41.0, top: 38.6, width: 4.1, height: 5.4, circle: true }, label: { left: 38.4, top: 55.8, width: 9.6 } },
    { code: "S2-13", fill: { left: 56.2, top: 38.6, width: 4.1, height: 5.4, circle: true }, label: { left: 53.5, top: 55.8, width: 9.6 } },
    { code: "S2-14", fill: { left: 66.4, top: 38.6, width: 4.1, height: 5.4, circle: true }, label: { left: 63.9, top: 55.8, width: 9.6 } },
    { code: "S2-15", fill: { left: 81.4, top: 38.6, width: 4.1, height: 5.4, circle: true }, label: { left: 78.8, top: 55.8, width: 9.6 } },
    { code: "S2-16", fill: { left: 91.8, top: 38.6, width: 4.1, height: 5.4, circle: true }, label: { left: 89.0, top: 55.8, width: 9.6 } },

    { code: "S2-17", fill: { left: 5.2, top: 70.2, width: 4.1, height: 5.4, circle: true }, label: { left: 2.5, top: 86.7, width: 9.6 } },
    { code: "S2-18", fill: { left: 15.7, top: 70.2, width: 4.1, height: 5.4, circle: true }, label: { left: 13.0, top: 86.7, width: 9.6 } },
    { code: "S2-19", fill: { left: 30.8, top: 70.2, width: 4.1, height: 5.4, circle: true }, label: { left: 28.0, top: 86.7, width: 9.6 } },
    { code: "S2-20", fill: { left: 41.0, top: 70.2, width: 4.1, height: 5.4, circle: true }, label: { left: 38.4, top: 86.7, width: 9.6 } },
    { code: "S2-21", fill: { left: 56.2, top: 70.2, width: 4.1, height: 5.4, circle: true }, label: { left: 53.5, top: 86.7, width: 9.6 } },
    { code: "S2-22", fill: { left: 66.4, top: 70.2, width: 4.1, height: 5.4, circle: true }, label: { left: 63.9, top: 86.7, width: 9.6 } },
    { code: "S2-23", fill: { left: 81.4, top: 70.2, width: 4.1, height: 5.4, circle: true }, label: { left: 78.8, top: 86.7, width: 9.6 } },
    { code: "S2-24", fill: { left: 91.8, top: 70.2, width: 4.1, height: 5.4, circle: true }, label: { left: 89.0, top: 86.7, width: 9.6 } }
  ]
};

let config = null;
let baseInventory = [];
let rows = [];
let searchValue = "";
let filterGroup = "Todas";
let storageKey = "juanjo-filaments-layout-v3";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function groupByName(name) {
  return config.groups.find((g) => g.name === name);
}

function slotsFor(groupName) {
  return groupByName(groupName)?.slots || [];
}

function colorStyle(color) {
  if (color === "multicolor") return `background:${COLOR_MAP[color]};`;
  if (color === "transparente") return `background:${COLOR_MAP[color]};border:1px solid rgba(120,120,120,0.35);backdrop-filter:blur(4px);`;
  return `background:${COLOR_MAP[color] || "#d1d5db"};`;
}

function formatUbicacion(grupo, hueco) {
  return hueco ? `${grupo} - ${hueco}` : grupo;
}

function parseUbicacion(rawValue) {
  const raw = String(rawValue || "").trim();
  if (!raw) return { grupo: config.groups[0].name, hueco: config.groups[0].slots?.[0] || "" };
  for (const group of config.groups) {
    if (raw.includes(group.name)) {
      const found = (group.slots || []).find((slot) => raw.includes(slot));
      return { grupo: group.name, hueco: found || (group.slots?.[0] || "") };
    }
  }
  return { grupo: config.groups[0].name, hueco: config.groups[0].slots?.[0] || "" };
}

function variantsFor(materialGeneral) {
  return config.materialVariants[materialGeneral] || ["Standard"];
}

function loadRows() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        rows = parsed;
        return;
      }
    }
  } catch {}
  rows = structuredClone(baseInventory);
}

function saveRows() {
  localStorage.setItem(storageKey, JSON.stringify(rows));
}

function filteredRows() {
  const q = searchValue.trim().toLowerCase();
  return rows.filter((row) => {
    const haystack = Object.values(row).join(" ").toLowerCase();
    const searchMatch = !q || haystack.includes(q);
    const filterMatch = filterGroup === "Todas" || row.grupo === filterGroup;
    return searchMatch && filterMatch;
  });
}

function selectHtml(value, options, field) {
  const html = options.map((opt) => `<option value="${escapeHtml(opt)}" ${opt === value ? "selected" : ""}>${escapeHtml(opt)}</option>`).join("");
  return `<select class="select js-change" data-field="${escapeHtml(field)}">${html}</select>`;
}

function visualLabel(slot, item, compact = false) {
  const mat = item?.materialGeneral || "Libre";
  const color = item?.color || "";
  return `<div class="slot-tag ${compact ? "compact" : ""}">
    <div class="slot-code">${escapeHtml(slot)}</div>
    <div class="slot-meta">${escapeHtml(mat)}${color ? ` · ${escapeHtml(color)}` : ""}</div>
  </div>`;
}

function colorFill(item, extraClass = "") {
  if (!item) return "";
  return `<div class="slot-fill ${extraClass}" style="${colorStyle(item.color)}"></div>`;
}

function renderMachine(groupName) {
  const items = rows.filter((r) => r.grupo === groupName);
  const bySlot = Object.fromEntries(items.map((r) => [r.hueco, r]));
  const layout = SLOT_LAYOUTS[groupName] || [];
  const compact = groupName.startsWith("AMS HT");
  return `
    <section class="card machine-card ${compact ? "machine-compact" : ""}">
      <div class="machine-title">${escapeHtml(groupName)}</div>
      <div class="machine-figure ${compact ? "is-compact" : ""}">
        <img src="${DRAWINGS[groupName]}" alt="${escapeHtml(groupName)}" class="machine-image ${compact ? "ht-image" : ""}" />
        ${layout.map((slot) => {
          const item = bySlot[slot.code];
          return `
            <div class="overlay-box" style="left:${slot.fill.left}%;top:${slot.fill.top}%;width:${slot.fill.width}%;height:${slot.fill.height}%;">
              ${colorFill(item, slot.fill.circle ? "is-circle" : (groupName.startsWith("AMS") ? "is-ams" : ""))}
            </div>
            <div class="overlay-label ${compact ? "compact" : ""}" style="left:${slot.label.left}%;top:${slot.label.top}%;width:${slot.label.width}%;">
              ${visualLabel(slot.code, item, compact)}
            </div>`;
        }).join("")}
      </div>
    </section>`;
}

function renderStats() {
  const shelf1 = rows.filter((r) => r.grupo === "Estantería *1").length;
  const shelf2 = rows.filter((r) => r.grupo === "Estantería *2").length;
  const ams = rows.filter((r) => r.grupo.startsWith("AMS")).length;
  return `
    <div class="stats-grid">
      <div class="stat-card"><span>Total</span><strong>${rows.length}</strong></div>
      <div class="stat-card"><span>AMS</span><strong>${ams}</strong></div>
      <div class="stat-card"><span>Estantería *1</span><strong>${shelf1}</strong></div>
      <div class="stat-card"><span>Estantería *2</span><strong>${shelf2}</strong></div>
    </div>`;
}

function render() {
  const filtered = filteredRows();
  app.innerHTML = `
    <div class="page-shell">
      <section class="card hero-card">
        <div>
          <div class="hero-chip">Inventario visual de filamentos</div>
          <h1>AMS y estanterías coloreadas según el listado</h1>
          <p>Los huecos de AMS HT, AMS 2 Pro y estanterías se tiñen automáticamente según el color elegido en el inventario. El recuadro de cada posición muestra hueco, material general y color.</p>
        </div>
        ${renderStats()}
      </section>

      <section class="visual-layout">
        <div class="ht-stack">
          ${renderMachine("AMS HT *1")}
          ${renderMachine("AMS HT *2")}
        </div>
        <div class="ams-row">
          ${renderMachine("AMS 2 Pro *1")}
          ${renderMachine("AMS 2 Pro *2")}
          ${renderMachine("AMS 2 Pro *3")}
        </div>
      </section>

      <section class="shelf-layout">
        ${renderMachine("Estantería *1")}
        ${renderMachine("Estantería *2")}
      </section>

      <section class="card table-card">
        <div class="table-toolbar">
          <div>
            <div class="section-title">Inventario editable</div>
            <div class="section-subtitle">Fabricante → material general → variante → color → ubicación → hueco → estado → notas</div>
          </div>
          <div class="toolbar-actions">
            <button class="btn primary" id="add-row">Añadir fila</button>
            <button class="btn" id="import-excel">Importar Excel</button>
            <button class="btn" id="export-excel">Exportar Excel</button>
            <button class="btn" id="reset-base">Recargar base</button>
            <input id="file-input" type="file" accept=".xlsx,.xls" hidden />
          </div>
        </div>

        <div class="filters">
          <input class="search" id="search-input" value="${escapeHtml(searchValue)}" placeholder="Buscar por fabricante, material, variante, color, ubicación..." />
          <select class="search" id="filter-group">
            <option value="Todas" ${filterGroup === "Todas" ? "selected" : ""}>Todas</option>
            ${config.groups.map((g) => `<option value="${escapeHtml(g.name)}" ${filterGroup === g.name ? "selected" : ""}>${escapeHtml(g.name)}</option>`).join("")}
          </select>
        </div>

        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Fabricante</th>
                <th>Material general</th>
                <th>Variante</th>
                <th>Color</th>
                <th>Ubicación</th>
                <th>Hueco</th>
                <th>Estado</th>
                <th>Notas</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map((row) => {
                const slotOptions = slotsFor(row.grupo);
                const variants = variantsFor(row.materialGeneral);
                return `
                  <tr data-id="${row.id}">
                    <td>${selectHtml(row.fabricante, config.brands, "fabricante")}</td>
                    <td>${selectHtml(row.materialGeneral, config.materialsGeneral, "materialGeneral")}</td>
                    <td>${selectHtml(row.variante, variants, "variante")}</td>
                    <td>
                      <div class="color-cell">
                        <div class="color-dot" style="${colorStyle(row.color)}"></div>
                        ${selectHtml(row.color, config.colors, "color")}
                      </div>
                    </td>
                    <td>${selectHtml(row.grupo, config.groups.map((g) => g.name), "grupo")}</td>
                    <td>${slotOptions.length ? selectHtml(row.hueco, slotOptions, "hueco") : '<div class="empty-slot">-</div>'}</td>
                    <td>${selectHtml(row.estado, config.states, "estado")}</td>
                    <td><input class="input js-input" data-field="notas" value="${escapeHtml(row.notas)}" /></td>
                    <td><button class="btn danger js-delete">Borrar</button></td>
                  </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
  bindEvents();
}

function updateRow(id, field, value) {
  rows = rows.map((row) => {
    if (row.id !== id) return row;
    const next = { ...row, [field]: value };
    if (field === "materialGeneral") {
      const available = variantsFor(value);
      if (!available.includes(next.variante)) next.variante = available[0] || "Standard";
    }
    if (field === "grupo") {
      next.hueco = slotsFor(value)[0] || "";
    }
    if (field === "hueco") {
      const allowed = slotsFor(next.grupo);
      if (allowed.length && !allowed.includes(value)) next.hueco = allowed[0];
    }
    return next;
  });
  saveRows();
  render();
}

function addRow() {
  const defaultGroup = config.groups.find((g) => g.name.startsWith("Estantería")) || config.groups[0];
  rows = [
    {
      id: Date.now(),
      fabricante: config.brands[0],
      materialGeneral: config.materialsGeneral[0],
      variante: variantsFor(config.materialsGeneral[0])[0] || "Standard",
      color: config.colors[0],
      grupo: defaultGroup.name,
      hueco: defaultGroup.slots?.[0] || "",
      estado: config.states[0],
      notas: "",
    },
    ...rows
  ];
  saveRows();
  render();
}

function deleteRow(id) {
  rows = rows.filter((row) => row.id !== id);
  saveRows();
  render();
}

function exportExcel() {
  const exportRows = rows.map((row) => ({
    Fabricante: row.fabricante,
    "Material general": row.materialGeneral,
    Variante: row.variante,
    Color: row.color,
    Ubicacion: formatUbicacion(row.grupo, row.hueco),
    Estado: row.estado,
    Notas: row.notas,
  }));
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
  XLSX.writeFile(workbook, "inventario_filamentos_visual.xlsx");
}

async function importExcel(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  const imported = data.map((item, index) => {
    const parsed = parseUbicacion(item.Ubicacion || item.Ubicación || item.ubicacion || item.Location || item.UbicacionCompleta || item.Grupo || item.grupo || "");
    const materialGeneral = item["Material general"] || item.materialGeneral || item.Material || config.materialsGeneral[0];
    const variantes = variantsFor(materialGeneral);
    const variante = item.Variante || item.variante || variantes[0] || "Standard";
    return {
      id: Date.now() + index,
      fabricante: item.Fabricante || item.fabricante || item.Marca || config.brands[0],
      materialGeneral,
      variante: variantes.includes(variante) ? variante : (variantes[0] || "Standard"),
      color: String(item.Color || item.color || config.colors[0]).toLowerCase(),
      grupo: parsed.grupo,
      hueco: parsed.hueco,
      estado: item.Estado || item.estado || config.states[0],
      notas: item.Notas || item.notas || "",
    };
  });

  rows = imported.length ? imported : structuredClone(baseInventory);
  saveRows();
  render();
}

function resetToBase() {
  rows = structuredClone(baseInventory);
  saveRows();
  render();
}

function bindEvents() {
  document.getElementById("add-row")?.addEventListener("click", addRow);
  document.getElementById("export-excel")?.addEventListener("click", exportExcel);
  document.getElementById("import-excel")?.addEventListener("click", () => document.getElementById("file-input")?.click());
  document.getElementById("reset-base")?.addEventListener("click", resetToBase);

  document.getElementById("file-input")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) importExcel(file);
    event.target.value = "";
  });

  document.getElementById("search-input")?.addEventListener("input", (event) => {
    searchValue = event.target.value;
    render();
  });

  document.getElementById("filter-group")?.addEventListener("change", (event) => {
    filterGroup = event.target.value;
    render();
  });

  document.querySelectorAll("tbody tr").forEach((tr) => {
    const id = Number(tr.dataset.id);
    tr.querySelectorAll(".js-change").forEach((el) => {
      const field = el.dataset.field;
      el.addEventListener("change", (event) => updateRow(id, field, event.target.value));
    });
    tr.querySelectorAll(".js-input").forEach((el) => {
      const field = el.dataset.field;
      el.addEventListener("change", (event) => updateRow(id, field, event.target.value));
    });
    tr.querySelector(".js-delete")?.addEventListener("click", () => deleteRow(id));
  });
}

async function init() {
  app.innerHTML = `<div class="page-shell"><section class="card loading-card">Cargando proyecto…</section></div>`;
  try {
    const [configRes, inventoryRes] = await Promise.all([
      fetch("data/config.json", { cache: "no-store" }),
      fetch("data/inventario.json", { cache: "no-store" }),
    ]);
    config = await configRes.json();
    baseInventory = await inventoryRes.json();
    storageKey = config.storageKey || storageKey;
    loadRows();
    render();
  } catch (error) {
    console.error(error);
    app.innerHTML = `<div class="page-shell"><section class="card loading-card">No se pudo cargar la app.</section></div>`;
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

init();
