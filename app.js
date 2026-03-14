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
  carbon: "#454b54",
  multicolor: "linear-gradient(135deg,#ff4d4d,#ffcc00,#4cd137,#3498db,#9b59b6)",
};

const DEVICE_LAYOUTS = {
  ams2pro: {
    colorSlots: [
      { left: 5.2, top: 9.5, width: 21.8, height: 68.5, labelLeft: 9.3, labelTop: 54.5, labelWidth: 16.7, labelHeight: 28.5 },
      { left: 26.3, top: 9.5, width: 21.8, height: 68.5, labelLeft: 27.7, labelTop: 54.5, labelWidth: 16.7, labelHeight: 28.5 },
      { left: 47.5, top: 9.5, width: 21.8, height: 68.5, labelLeft: 46.1, labelTop: 54.5, labelWidth: 16.7, labelHeight: 28.5 },
      { left: 68.8, top: 9.5, width: 21.8, height: 68.5, labelLeft: 64.5, labelTop: 54.5, labelWidth: 16.7, labelHeight: 28.5 }
    ]
  },
  amsht: {
    colorSlots: [
      { left: 19.8, top: 8.5, width: 34.5, height: 69.5, labelLeft: 18.7, labelTop: 53.2, labelWidth: 19.5, labelHeight: 28.5 }
    ]
  }
};

let config = null;
let baseInventory = [];
let rows = [];
let searchValue = "";
let filterGroup = "Todas";
let storageKey = "juanjo-filaments-pwa-static-v2";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function colorStyle(color) {
  if (color === "multicolor") return `background:${COLOR_MAP[color]};`;
  if (color === "transparente") {
    return `background:${COLOR_MAP[color]};border:1px solid rgba(120,120,120,0.35);backdrop-filter:blur(4px);`;
  }
  return `background:${COLOR_MAP[color] || "#d1d5db"};`;
}

function tintStyle(color) {
  if (color === "multicolor") return `background:${COLOR_MAP[color]};`;
  return `background:${COLOR_MAP[color] || "#d1d5db"};`;
}

function getGroup(name) {
  return config.groups.find((g) => g.name === name);
}

function getSlots(groupName) {
  return getGroup(groupName)?.slots || [];
}

function formatUbicacion(grupo, hueco) {
  return hueco ? `${grupo} - ${hueco}` : grupo;
}

function parseUbicacion(rawValue) {
  const raw = String(rawValue || "").trim();
  if (!raw) return { grupo: config.groups[0]?.name || "Otro", hueco: "" };

  const match = config.groups.find((g) => raw.includes(g.name));
  if (match) {
    const foundSlot = (match.slots || []).find((slot) => raw.includes(slot));
    return { grupo: match.name, hueco: foundSlot || match.slots?.[0] || "" };
  }

  const ams2 = raw.match(/AMS 2 Pro #([123])/i);
  if (ams2) {
    const groupName = `AMS 2 Pro #${ams2[1]}`;
    const foundSlot = raw.match(/A[1-4]/i)?.[0]?.toUpperCase() || "A1";
    return { grupo: groupName, hueco: foundSlot };
  }

  const amsHt = raw.match(/AMS HT(?: #([12]))?/i);
  if (amsHt) {
    const idx = amsHt[1] || "1";
    return { grupo: `AMS HT #${idx}`, hueco: "HT-A" };
  }

  if (raw.includes("Estantería Izquierda")) return { grupo: "Estantería Izquierda", hueco: "" };
  if (raw.includes("Exterior")) return { grupo: "Exterior", hueco: "" };
  if (raw.includes("Otro")) return { grupo: "Otro", hueco: "" };
  return { grupo: "Estantería Derecha", hueco: "" };
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

function cellSelect(value, options, onChange) {
  const opts = [`<option value="">-</option>`]
    .concat(options.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`))
    .join("");
  return `<select class="select js-change" data-change="${onChange}">${opts}</select>`;
}

function renderDeviceLabel(slot, item, variant, layout) {
  const lines = [];
  lines.push(`<span class="ams-label-slot">${escapeHtml(slot)}</span>`);
  if (item) {
    if (variant === "ams2pro") {
      if (item.material) lines.push(`<span>${escapeHtml(item.material)}</span>`);
      if (item.color) lines.push(`<span>${escapeHtml(String(item.color).toUpperCase())}</span>`);
    } else {
      if (item.color) lines.push(`<span>${escapeHtml(String(item.color).toUpperCase())}</span>`);
    }
  }
  return `<div class="ams-label" style="left:${layout.labelLeft}%;top:${layout.labelTop}%;width:${layout.labelWidth}%;height:${layout.labelHeight}%;">${lines.join("")}</div>`;
}

function renderAms(group) {
  const variant = group.variant || "ams2pro";
  const layout = DEVICE_LAYOUTS[variant];
  const items = rows.filter((r) => r.grupo === group.name);
  const bySlot = Object.fromEntries(items.filter((i) => i.hueco).map((i) => [i.hueco, i]));

  return `
    <section class="card visual-card device-card ${variant === "amsht" ? "ht-card" : "pro-card"}">
      <div class="visual-title">${escapeHtml(group.name)}</div>
      <div class="device-stage ${variant}">
        <img src="${escapeHtml(group.drawing)}" alt="${escapeHtml(group.name)}" class="device-template" />
        ${layout.colorSlots.map((pos, index) => {
          const slot = group.slots[index];
          const item = bySlot[slot];
          return item ? `
            <div class="device-color ${variant}" style="left:${pos.left}%;top:${pos.top}%;width:${pos.width}%;height:${pos.height}%;${tintStyle(item.color)}"></div>
            ${renderDeviceLabel(slot, item, variant, pos)}
          ` : `
            ${renderDeviceLabel(slot, null, variant, pos)}
          `;
        }).join("")}
      </div>
    </section>`;
}

function render() {
  const filtered = filteredRows();
  const htGroups = config.groups.filter((g) => g.variant === "amsht");
  const proGroups = config.groups.filter((g) => g.variant === "ams2pro");

  app.innerHTML = `
    <div class="page">
      <div class="top-visuals">
        <section class="ht-column">
          ${htGroups.map((group) => renderAms(group)).join("")}
        </section>

        <section class="ams-pro-grid">
          ${proGroups.map((group) => renderAms(group)).join("")}
        </section>
      </div>

      <section class="card section full-width-section">
        <div class="toolbar">
          <div class="toolbar-top">
            <div class="title">Inventario editable</div>
            <div class="actions">
              <button class="btn primary" id="add-row">Añadir fila</button>
              <button class="btn" id="import-excel">Importar Excel</button>
              <button class="btn" id="export-excel">Exportar Excel</button>
              <button class="btn" id="reset-base">Recargar base</button>
              <input id="file-input" type="file" accept=".xlsx,.xls" hidden />
            </div>
          </div>
          <div class="filters">
            <input class="search" id="search-input" placeholder="Buscar por fabricante, modelo, material, color o ubicación" value="${escapeHtml(searchValue)}" />
            <select class="search" id="filter-group">
              <option value="Todas" ${filterGroup === "Todas" ? "selected" : ""}>Todas</option>
              ${config.groups.map((group) => `<option value="${escapeHtml(group.name)}" ${filterGroup === group.name ? "selected" : ""}>${escapeHtml(group.name)}</option>`).join("")}
            </select>
          </div>
        </div>

        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Fabricante</th>
                <th>Modelo</th>
                <th>Material</th>
                <th>Color</th>
                <th>Grupo</th>
                <th>Hueco</th>
                <th>Estado</th>
                <th>Notas</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map((row) => {
                const slots = getSlots(row.grupo);
                return `
                  <tr data-id="${row.id}">
                    <td>${cellSelect(row.fabricante, config.brands, "fabricante")}</td>
                    <td><input class="input js-input" data-field="modelo" value="${escapeHtml(row.modelo)}" /></td>
                    <td>${cellSelect(row.material, config.materials, "material")}</td>
                    <td>
                      <div class="color-cell">
                        <div class="color-dot" style="${colorStyle(row.color)}"></div>
                        ${cellSelect(row.color, config.colors, "color")}
                      </div>
                    </td>
                    <td>${cellSelect(row.grupo, config.groups.map((g) => g.name), "grupo")}</td>
                    <td>${slots.length ? cellSelect(row.hueco, slots, "hueco") : `<div class="empty-slot">-</div>`}</td>
                    <td>${cellSelect(row.estado, config.states, "estado")}</td>
                    <td><input class="input js-input" data-field="notas" value="${escapeHtml(row.notas)}" /></td>
                    <td><button class="btn danger js-delete">Borrar</button></td>
                  </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
      </section>
    </div>`;

  bindEvents();
}

function updateRow(id, field, value) {
  rows = rows.map((row) => {
    if (row.id !== id) return row;
    const next = { ...row, [field]: value };
    if (field === "grupo") {
      const slots = getSlots(value);
      next.hueco = slots.length ? slots[0] : "";
    }
    if (field === "hueco") {
      const slots = getSlots(next.grupo);
      if (!slots.length) next.hueco = "";
      if (slots.length && !slots.includes(value)) next.hueco = slots[0];
    }
    return next;
  });
  saveRows();
  render();
}

function addRow() {
  const defaultGroup = config.groups.find((g) => g.type !== "ams")?.name || config.groups[0].name;
  rows = [
    {
      id: Date.now(),
      fabricante: config.brands[0] || "Otro",
      modelo: "",
      material: config.materials[0] || "PLA",
      color: config.colors.includes("negro") ? "negro" : (config.colors[0] || "gris"),
      grupo: defaultGroup,
      hueco: getSlots(defaultGroup)[0] || "",
      estado: config.states[0] || "Nuevo",
      notas: "",
    },
    ...rows,
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
    Modelo: row.modelo,
    Material: row.material,
    Color: row.color,
    Ubicacion: formatUbicacion(row.grupo, row.hueco),
    Estado: row.estado,
    Notas: row.notas,
  }));
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
  XLSX.writeFile(workbook, "inventario_filamentos_pwa.xlsx");
}

async function importExcel(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  rows = data.map((item, index) => {
    const ubicacionRaw = item.ubicacion || item.Ubicacion || item.Ubicación || item.Location || item.UbicacionCompleta || item.Grupo || item.grupo || config.groups[0]?.name || "Otro";
    const parsed = parseUbicacion(ubicacionRaw);
    return {
      id: Date.now() + index,
      fabricante: item.fabricante || item.Fabricante || item.Marca || "Otro",
      modelo: item.modelo || item.Modelo || item.Descripcion || item.Variante || "",
      material: item.material || item.Material || item["Material general"] || "PLA",
      color: String(item.color || item.Color || "negro").toLowerCase(),
      grupo: parsed.grupo,
      hueco: parsed.hueco,
      estado: item.estado || item.Estado || "Nuevo",
      notas: item.notas || item.Notas || "",
    };
  });

  if (!rows.length) rows = structuredClone(baseInventory);
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
      const field = el.dataset.change;
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
  app.innerHTML = `<div class="page"><div class="card loading">Cargando proyecto…</div></div>`;

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
    app.innerHTML = `
      <div class="page">
        <div class="card loading">
          <h2>No se pudo cargar la app</h2>
          <p class="muted">Revisa que existan los archivos <strong>data/config.json</strong> y <strong>data/inventario.json</strong>.</p>
        </div>
      </div>`;
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

init();
