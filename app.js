
const app = document.getElementById("app");

const COLOR_MAP = {
  blanco: "#f5f5f5",
  negro: "#202124",
  gris: "#8c8c8c",
  plateado: "#bcc3cc",
  transparente: "rgba(235,235,235,0.72)",
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
  multicolor: "linear-gradient(135deg,#ff4d4d,#ffcc00,#4cd137,#3498db,#9b59b6)"
};

const BRAND_ABBR = {
  "Bambu Lab":"BBL","Prusament":"PRU","Polymaker":"POL","eSUN":"ESN","SUNLU":"SUN","Overture":"OVE",
  "HATCHBOX":"HTB","MatterHackers":"MHK","Fiberlogy":"FIB","ColorFabb":"CFB","Fillamentum":"FIL",
  "FormFutura":"FMT","Spectrum Filaments":"SPC","BASF Ultrafuse":"BASF","Proto-pasta":"PRO","3DXTech":"3DX",
  "Taulman3D":"TAU","Ultimaker":"ULT","Creality":"CRE","Anycubic":"ANY","ELEGOO":"ELG","Duramic 3D":"DUR",
  "ERYONE":"ERY","Inland (Micro Center)":"INL","Amazon Basics":"AMZ","Geeetech":"GEE","Kodak":"KOD",
  "Raise3D":"RAI","IC3D":"IC3","Recreus":"REC","SmartMaterials3D":"SM3","AIO Robotics":"AIO","Mika3D":"MIK",
  "Amolen":"AMO","Other / Generic":"GEN"
};

const DRAWINGS = {
  "AMS HT *1": "drawings/ams-ht.png",
  "AMS HT *2": "drawings/ams-ht.png",
  "AMS 2 Pro *1": "drawings/ams-2pro.png",
  "AMS 2 Pro *2": "drawings/ams-2pro.png",
  "AMS 2 Pro *3": "drawings/ams-2pro.png",
  "Estantería *1": "drawings/shelf1.png",
  "Estantería *2": "drawings/shelf2.png",
};

const SLOT_LAYOUTS = {
  "AMS HT *1": [
    { code: "HT1", fill: { left: 27.0, top: 18.0, width: 27.5, height: 47.0 }, label: { left: 18.2, top: 52.5, width: 28.0 } }
  ],
  "AMS HT *2": [
    { code: "HT2", fill: { left: 27.0, top: 18.0, width: 27.5, height: 47.0 }, label: { left: 18.2, top: 52.5, width: 28.0 } }
  ],
  "AMS 2 Pro *1": [
    { code: "A1", fill: { left: 8.2, top: 13.6, width: 14.5, height: 55.0 }, label: { left: 8.8, top: 59.0, width: 15.0 } },
    { code: "A2", fill: { left: 28.0, top: 13.6, width: 14.5, height: 55.0 }, label: { left: 28.2, top: 59.0, width: 15.0 } },
    { code: "A3", fill: { left: 47.8, top: 13.6, width: 14.5, height: 55.0 }, label: { left: 47.6, top: 59.0, width: 15.0 } },
    { code: "A4", fill: { left: 67.8, top: 13.6, width: 14.5, height: 55.0 }, label: { left: 67.1, top: 59.0, width: 15.0 } }
  ],
  "AMS 2 Pro *2": [
    { code: "B1", fill: { left: 8.2, top: 13.6, width: 14.5, height: 55.0 }, label: { left: 8.8, top: 59.0, width: 15.0 } },
    { code: "B2", fill: { left: 28.0, top: 13.6, width: 14.5, height: 55.0 }, label: { left: 28.2, top: 59.0, width: 15.0 } },
    { code: "B3", fill: { left: 47.8, top: 13.6, width: 14.5, height: 55.0 }, label: { left: 47.6, top: 59.0, width: 15.0 } },
    { code: "B4", fill: { left: 67.8, top: 13.6, width: 14.5, height: 55.0 }, label: { left: 67.1, top: 59.0, width: 15.0 } }
  ],
  "AMS 2 Pro *3": [
    { code: "C1", fill: { left: 8.2, top: 13.6, width: 14.5, height: 55.0 }, label: { left: 8.8, top: 59.0, width: 15.0 } },
    { code: "C2", fill: { left: 28.0, top: 13.6, width: 14.5, height: 55.0 }, label: { left: 28.2, top: 59.0, width: 15.0 } },
    { code: "C3", fill: { left: 47.8, top: 13.6, width: 14.5, height: 55.0 }, label: { left: 47.6, top: 59.0, width: 15.0 } },
    { code: "C4", fill: { left: 67.8, top: 13.6, width: 14.5, height: 55.0 }, label: { left: 67.1, top: 59.0, width: 15.0 } }
  ],
  "Estantería *1": [
    { code: "S1-01", fill: { left: 13.0, top: 6.4, width: 8.4, height: 5.6, circle: true }, label: { left: 7.0, top: 13.5, width: 17.5 } },
    { code: "S1-02", fill: { left: 31.0, top: 6.4, width: 8.4, height: 5.6, circle: true }, label: { left: 25.1, top: 13.5, width: 17.5 } },
    { code: "S1-03", fill: { left: 65.2, top: 6.4, width: 8.4, height: 5.6, circle: true }, label: { left: 59.3, top: 13.5, width: 17.5 } },
    { code: "S1-04", fill: { left: 83.2, top: 6.4, width: 8.4, height: 5.6, circle: true }, label: { left: 77.3, top: 13.5, width: 17.5 } },

    { code: "S1-05", fill: { left: 12.8, top: 35.2, width: 8.4, height: 5.6, circle: true }, label: { left: 6.9, top: 42.2, width: 17.5 } },
    { code: "S1-06", fill: { left: 31.0, top: 35.2, width: 8.4, height: 5.6, circle: true }, label: { left: 25.1, top: 42.2, width: 17.5 } },
    { code: "S1-07", fill: { left: 65.2, top: 35.2, width: 8.4, height: 5.6, circle: true }, label: { left: 59.3, top: 42.2, width: 17.5 } },
    { code: "S1-08", fill: { left: 83.2, top: 35.2, width: 8.4, height: 5.6, circle: true }, label: { left: 77.3, top: 42.2, width: 17.5 } },

    { code: "S1-09", fill: { left: 12.8, top: 64.8, width: 8.4, height: 5.6, circle: true }, label: { left: 6.9, top: 71.8, width: 17.5 } },
    { code: "S1-10", fill: { left: 31.0, top: 64.8, width: 8.4, height: 5.6, circle: true }, label: { left: 25.1, top: 71.8, width: 17.5 } },
    { code: "S1-11", fill: { left: 65.2, top: 64.8, width: 8.4, height: 5.6, circle: true }, label: { left: 59.3, top: 71.8, width: 17.5 } },
    { code: "S1-12", fill: { left: 83.2, top: 64.8, width: 8.4, height: 5.6, circle: true }, label: { left: 77.3, top: 71.8, width: 17.5 } }
  ],
  "Estantería *2": [
    { code: "S2-01", fill: { left: 8.5, top: 6.4, width: 4.6, height: 6.0, circle: true }, label: { left: 3.3, top: 13.2, width: 11.0 } },
    { code: "S2-02", fill: { left: 19.1, top: 6.4, width: 4.6, height: 6.0, circle: true }, label: { left: 13.9, top: 13.2, width: 11.0 } },
    { code: "S2-03", fill: { left: 33.2, top: 6.4, width: 4.6, height: 6.0, circle: true }, label: { left: 28.0, top: 13.2, width: 11.0 } },
    { code: "S2-04", fill: { left: 43.8, top: 6.4, width: 4.6, height: 6.0, circle: true }, label: { left: 38.6, top: 13.2, width: 11.0 } },
    { code: "S2-05", fill: { left: 57.9, top: 6.4, width: 4.6, height: 6.0, circle: true }, label: { left: 52.7, top: 13.2, width: 11.0 } },
    { code: "S2-06", fill: { left: 68.5, top: 6.4, width: 4.6, height: 6.0, circle: true }, label: { left: 63.3, top: 13.2, width: 11.0 } },
    { code: "S2-07", fill: { left: 82.5, top: 6.4, width: 4.6, height: 6.0, circle: true }, label: { left: 77.3, top: 13.2, width: 11.0 } },
    { code: "S2-08", fill: { left: 93.1, top: 6.4, width: 4.6, height: 6.0, circle: true }, label: { left: 87.9, top: 13.2, width: 11.0 } },

    { code: "S2-09", fill: { left: 8.5, top: 38.0, width: 4.6, height: 6.0, circle: true }, label: { left: 3.3, top: 44.8, width: 11.0 } },
    { code: "S2-10", fill: { left: 19.1, top: 38.0, width: 4.6, height: 6.0, circle: true }, label: { left: 13.9, top: 44.8, width: 11.0 } },
    { code: "S2-11", fill: { left: 33.2, top: 38.0, width: 4.6, height: 6.0, circle: true }, label: { left: 28.0, top: 44.8, width: 11.0 } },
    { code: "S2-12", fill: { left: 43.8, top: 38.0, width: 4.6, height: 6.0, circle: true }, label: { left: 38.6, top: 44.8, width: 11.0 } },
    { code: "S2-13", fill: { left: 57.9, top: 38.0, width: 4.6, height: 6.0, circle: true }, label: { left: 52.7, top: 44.8, width: 11.0 } },
    { code: "S2-14", fill: { left: 68.5, top: 38.0, width: 4.6, height: 6.0, circle: true }, label: { left: 63.3, top: 44.8, width: 11.0 } },
    { code: "S2-15", fill: { left: 82.5, top: 38.0, width: 4.6, height: 6.0, circle: true }, label: { left: 77.3, top: 44.8, width: 11.0 } },
    { code: "S2-16", fill: { left: 93.1, top: 38.0, width: 4.6, height: 6.0, circle: true }, label: { left: 87.9, top: 44.8, width: 11.0 } },

    { code: "S2-17", fill: { left: 8.5, top: 69.6, width: 4.6, height: 6.0, circle: true }, label: { left: 3.3, top: 76.4, width: 11.0 } },
    { code: "S2-18", fill: { left: 19.1, top: 69.6, width: 4.6, height: 6.0, circle: true }, label: { left: 13.9, top: 76.4, width: 11.0 } },
    { code: "S2-19", fill: { left: 33.2, top: 69.6, width: 4.6, height: 6.0, circle: true }, label: { left: 28.0, top: 76.4, width: 11.0 } },
    { code: "S2-20", fill: { left: 43.8, top: 69.6, width: 4.6, height: 6.0, circle: true }, label: { left: 38.6, top: 76.4, width: 11.0 } },
    { code: "S2-21", fill: { left: 57.9, top: 69.6, width: 4.6, height: 6.0, circle: true }, label: { left: 52.7, top: 76.4, width: 11.0 } },
    { code: "S2-22", fill: { left: 68.5, top: 69.6, width: 4.6, height: 6.0, circle: true }, label: { left: 63.3, top: 76.4, width: 11.0 } },
    { code: "S2-23", fill: { left: 82.5, top: 69.6, width: 4.6, height: 6.0, circle: true }, label: { left: 77.3, top: 76.4, width: 11.0 } },
    { code: "S2-24", fill: { left: 93.1, top: 69.6, width: 4.6, height: 6.0, circle: true }, label: { left: 87.9, top: 76.4, width: 11.0 } }
  ]
};

let config = null;
let baseInventory = [];
let rows = [];
let searchValue = "";
let filterGroup = "Todas";
let storageKey = "juanjo-filaments-layout-v5";

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
}

function groupByName(name) {
  return config.groups.find((g) => g.name === name);
}
function slotsFor(groupName) {
  return groupByName(groupName)?.slots || [];
}
function colorStyle(color) {
  if (color === "multicolor") return `background:${COLOR_MAP[color]};`;
  if (color === "transparente") return `background:${COLOR_MAP[color]};border:1px solid rgba(120,120,120,.35);`;
  return `background:${COLOR_MAP[color] || "#d1d5db"};`;
}
function variantsFor(materialGeneral) {
  return config.materialVariants[materialGeneral] || ["Standard"];
}
function formatUbicacion(grupo, hueco) {
  return hueco ? `${grupo} - ${hueco}` : grupo;
}
function parseUbicacion(rawValue) {
  const raw = String(rawValue || "").trim();
  if (!raw) {
    const g = config.groups[0];
    return { grupo: g.name, hueco: g.slots[0] || "" };
  }
  for (const group of config.groups) {
    if (raw.includes(group.name)) {
      const found = group.slots.find((slot) => raw.includes(slot));
      return { grupo: group.name, hueco: found || (group.slots[0] || "") };
    }
  }
  return { grupo: config.groups[0].name, hueco: config.groups[0].slots[0] || "" };
}
function brandAbbr(brand){ return BRAND_ABBR[brand] || brand.slice(0,3).toUpperCase(); }

function loadRows() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) { rows = parsed; return; }
    }
  } catch {}
  rows = structuredClone(baseInventory);
}
function saveRows(){ localStorage.setItem(storageKey, JSON.stringify(rows)); }

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
  return `<select class="select js-change" data-field="${escapeHtml(field)}">${options.map((opt)=>`<option value="${escapeHtml(opt)}" ${opt===value?"selected":""}>${escapeHtml(opt)}</option>`).join("")}</select>`;
}

function buildSlotTag(code, item, compact=false) {
  if (!item) {
    return `<div class="slot-tag ${compact?"compact":""}"><div class="slot-code">${escapeHtml(code)}</div><div class="slot-brand">Libre</div><div class="slot-meta">Sin filamento</div></div>`;
  }
  return `<div class="slot-tag ${compact?"compact":""}">
    <div class="slot-code">${escapeHtml(code)}</div>
    <div class="slot-brand">${escapeHtml(brandAbbr(item.fabricante))}</div>
    <div class="slot-meta">${escapeHtml(item.materialGeneral)} · ${escapeHtml(item.color)}</div>
  </div>`;
}

function renderVisualCard(groupName) {
  const items = rows.filter((r) => r.grupo === groupName);
  const bySlot = Object.fromEntries(items.map((r) => [r.hueco, r]));
  const layout = SLOT_LAYOUTS[groupName];
  const compact = groupName.startsWith("AMS HT");
  const klass = groupName.startsWith("Estantería") ? "shelf-card" : "machine-card";
  return `<section class="${klass} ${compact ? "ht": ""}">
      <div class="${groupName.startsWith("Estantería")?"shelf-title":"machine-title"}">${escapeHtml(groupName)}</div>
      <div class="${groupName.startsWith("Estantería")?"shelf-figure":"machine-figure"}">
        <img src="${DRAWINGS[groupName]}" alt="${escapeHtml(groupName)}" />
        ${layout.map((slot) => {
          const item = bySlot[slot.code];
          return `
          <div class="overlay-fill ${slot.fill.circle ? "circle" : "ams"}" style="left:${slot.fill.left}%;top:${slot.fill.top}%;width:${slot.fill.width}%;height:${slot.fill.height}%;${item ? colorStyle(item.color) : 'background:transparent;'}"></div>
          <div class="overlay-label" style="left:${slot.label.left}%;top:${slot.label.top}%;width:${slot.label.width}%;">${buildSlotTag(slot.code,item,compact)}</div>`;
        }).join("")}
      </div>
    </section>`;
}

function renderTable() {
  const filtered = filteredRows();
  return `<details class="editor-card">
    <summary>Inventario editable</summary>
    <div class="editor-inner">
      <div class="toolbar">
        <div>
          <div class="toolbar-title">Inventario editable</div>
          <div class="toolbar-sub">Fabricante · Material general · Variante · Color · Ubicación · Hueco · Estado · Notas · Acción</div>
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
        <input class="search" id="search-input" placeholder="Buscar por fabricante, material, variante, color o ubicación" value="${escapeHtml(searchValue)}" />
        <select class="search" id="filter-group">
          <option value="Todas" ${filterGroup==="Todas"?"selected":""}>Todas</option>
          ${config.groups.map((g)=>`<option value="${escapeHtml(g.name)}" ${filterGroup===g.name?"selected":""}>${escapeHtml(g.name)}</option>`).join("")}
        </select>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Fabricante</th><th>Material general</th><th>Variante</th><th>Color</th><th>Ubicación</th><th>Hueco</th><th>Estado</th><th>Notas</th><th>Acción</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map((row) => {
              const variants = variantsFor(row.materialGeneral);
              const slotOptions = slotsFor(row.grupo);
              return `<tr data-id="${row.id}">
                <td>${selectHtml(row.fabricante, config.brands, "fabricante")}</td>
                <td>${selectHtml(row.materialGeneral, config.materialsGeneral, "materialGeneral")}</td>
                <td>${selectHtml(row.variante, variants, "variante")}</td>
                <td><div class="color-cell"><div class="color-dot" style="${colorStyle(row.color)}"></div>${selectHtml(row.color, config.colors, "color")}</div></td>
                <td>${selectHtml(row.grupo, config.groups.map((g)=>g.name), "grupo")}</td>
                <td>${slotOptions.length ? selectHtml(row.hueco, slotOptions, "hueco") : '<div class="empty-slot">-</div>'}</td>
                <td>${selectHtml(row.estado, config.states, "estado")}</td>
                <td><input class="input js-input" data-field="notas" value="${escapeHtml(row.notas)}" /></td>
                <td><button class="btn danger js-delete">Borrar</button></td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
      <div class="note">La vista visual de arriba se actualiza automáticamente cuando cambias color, material, ubicación o hueco.</div>
    </div>
  </details>`;
}

function render() {
  app.innerHTML = `<div class="page">
    <div class="title-chip">Inventario visual de filamentos</div>
    <section class="visual-grid">
      ${renderVisualCard("AMS HT *1")}
      ${renderVisualCard("AMS HT *2")}
      ${renderVisualCard("AMS 2 Pro *1")}
      ${renderVisualCard("AMS 2 Pro *2")}
      ${renderVisualCard("AMS 2 Pro *3")}
    </section>
    <section class="shelf-grid">
      ${renderVisualCard("Estantería *1")}
      ${renderVisualCard("Estantería *2")}
    </section>
    ${renderTable()}
  </div>`;
  bindEvents();
}

function updateRow(id, field, value) {
  rows = rows.map((row)=>{
    if (row.id !== id) return row;
    const next = {...row,[field]:value};
    if (field === "materialGeneral") {
      const vs = variantsFor(value);
      if (!vs.includes(next.variante)) next.variante = vs[0] || "Standard";
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
  const g = config.groups.find((x)=>x.name==="Estantería *1") || config.groups[0];
  rows = [{
    id: Date.now(),
    fabricante: config.brands[0],
    materialGeneral: config.materialsGeneral[0],
    variante: variantsFor(config.materialsGeneral[0])[0] || "Standard",
    color: config.colors[0],
    grupo: g.name,
    hueco: g.slots[0] || "",
    estado: config.states[0],
    notas: ""
  }, ...rows];
  saveRows(); render();
}
function deleteRow(id) { rows = rows.filter((row)=>row.id!==id); saveRows(); render(); }

function exportExcel() {
  const exportRows = rows.map((row)=>({
    Fabricante: row.fabricante,
    "Material general": row.materialGeneral,
    Variante: row.variante,
    Color: row.color,
    Ubicacion: formatUbicacion(row.grupo, row.hueco),
    Estado: row.estado,
    Notas: row.notas
  }));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportRows);
  XLSX.utils.book_append_sheet(wb, ws, "Inventario");
  XLSX.writeFile(wb, "inventario_filamentos_visual.xlsx");
}
async function importExcel(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, {type:"array"});
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, {defval:""});
  const imported = data.map((item,index)=>{
    const parsed = parseUbicacion(item.Ubicacion || item.Ubicación || item.ubicacion || item.Location || "");
    const materialGeneral = item["Material general"] || item.materialGeneral || item.Material || config.materialsGeneral[0];
    const vs = variantsFor(materialGeneral);
    const variante = item.Variante || item.variante || vs[0] || "Standard";
    return {
      id: Date.now()+index,
      fabricante: item.Fabricante || item.fabricante || item.Marca || config.brands[0],
      materialGeneral,
      variante: vs.includes(variante) ? variante : (vs[0] || "Standard"),
      color: String(item.Color || item.color || config.colors[0]).toLowerCase(),
      grupo: parsed.grupo,
      hueco: parsed.hueco,
      estado: item.Estado || item.estado || config.states[0],
      notas: item.Notas || item.notas || ""
    };
  });
  rows = imported.length ? imported : structuredClone(baseInventory);
  saveRows(); render();
}
function resetBase(){ rows = structuredClone(baseInventory); saveRows(); render(); }

function bindEvents() {
  document.getElementById("add-row")?.addEventListener("click", addRow);
  document.getElementById("export-excel")?.addEventListener("click", exportExcel);
  document.getElementById("import-excel")?.addEventListener("click", ()=>document.getElementById("file-input")?.click());
  document.getElementById("reset-base")?.addEventListener("click", resetBase);
  document.getElementById("file-input")?.addEventListener("change", (event)=>{
    const file = event.target.files?.[0];
    if (file) importExcel(file);
    event.target.value = "";
  });
  document.getElementById("search-input")?.addEventListener("input", (e)=>{ searchValue = e.target.value; render(); });
  document.getElementById("filter-group")?.addEventListener("change", (e)=>{ filterGroup = e.target.value; render(); });
  document.querySelectorAll("tbody tr").forEach((tr)=>{
    const id = Number(tr.dataset.id);
    tr.querySelectorAll(".js-change").forEach((el)=>{
      const field = el.dataset.field;
      el.addEventListener("change", (e)=>updateRow(id, field, e.target.value));
    });
    tr.querySelectorAll(".js-input").forEach((el)=>{
      const field = el.dataset.field;
      el.addEventListener("change", (e)=>updateRow(id, field, e.target.value));
    });
    tr.querySelector(".js-delete")?.addEventListener("click", ()=>deleteRow(id));
  });
}

async function init() {
  app.innerHTML = '<div class="page"><div class="title-chip">Inventario visual de filamentos</div></div>';
  const [configRes, inventoryRes] = await Promise.all([
    fetch("data/config.json", {cache:"no-store"}),
    fetch("data/inventario.json", {cache:"no-store"})
  ]);
  config = await configRes.json();
  baseInventory = await inventoryRes.json();
  storageKey = config.storageKey || storageKey;
  loadRows();
  render();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", ()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
}

init();
