// ============================================
// SCRIPT PRINCIPAL - meowrhino studio
// Grid navegable con minimapa
// ============================================

const app = document.getElementById("content");

// ============================================
// GRID CONFIGURATION
// ============================================

// Grid layout:
// Row 0: [pricing] [politicas] [metodologia] [welcome] [statement]
// Row 1:                                     [portfolio]

const grid = [
  [1, 1, 1, 1, 1],
  [0, 0, 0, 1, 0],
];

const nombresEspeciales = {
  "0_0": "pricing",
  "0_1": "politicas",
  "0_2": "metodologia",
  "0_3": "welcome",
  "0_4": "statement",
  "1_3": "portfolio",
};

// Starting position: welcome
let posY = 0;
let posX = 3;

// Data cache & language
let dataCache = null;
let currentLang = "es";

// ============================================
// DATA LOADING
// ============================================

async function loadData() {
  if (dataCache) return dataCache;
  try {
    const res = await fetch("data.json");
    dataCache = await res.json();
    return dataCache;
  } catch (err) {
    console.error("Error loading data.json:", err);
    return null;
  }
}

function getData() {
  if (!dataCache) return null;
  return dataCache[currentLang] || dataCache["es"];
}

// ============================================
// CREATE PAGES
// ============================================

function crearPantallas() {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 1) {
        const celda = document.createElement("div");
        celda.classList.add("celda", `pos_${y}_${x}`);
        celda.dataset.y = y;
        celda.dataset.x = x;

        const clave = `${y}_${x}`;
        const nombre = nombresEspeciales[clave];
        if (nombre) {
          celda.classList.add(nombre);
          celda.dataset.nombre = nombre;
        }

        app.appendChild(celda);
      }
    }
  }
}

// ============================================
// RENDER PAGE CONTENT
// ============================================

async function renderizarContenido() {
  await loadData();
  const data = getData();
  if (!data) return;

  // WELCOME
  const welcomeEl = document.querySelector(".celda.welcome");
  if (welcomeEl && data.welcome) {
    welcomeEl.innerHTML = `
      <div style="text-align:center;">
        <h1 style="font-size:clamp(1.2rem, 3dvw, 2.5rem); font-weight:400; letter-spacing:0.05em;">
          ${data.welcome.titulo}
        </h1>
      </div>
    `;
  }

  // STATEMENT
  const statementEl = document.querySelector(".celda.statement");
  if (statementEl && data.statement) {
    const lineas = data.statement.lineas.map(l => `<p>${l}</p>`).join("");
    statementEl.innerHTML = `<div class="statement-content">${lineas}</div>`;
  }

  // METODOLOGIA - zigzag on 10-column grid
  // Top row: sem0=cols 1-2, sem2=cols 5-6, sem4=cols 9-10
  // Bottom row: sem1=cols 2-5 (overlaps into sem0 & sem2 space), sem3=cols 6-9
  const metodoEl = document.querySelector(".celda.metodologia");
  if (metodoEl && data.metodologia) {
    const gridPlacements = [
      "grid-row:1; grid-column:1 / span 2;",    // sem 0
      "grid-row:2; grid-column:2 / span 4;",    // sem 1 — expands into 0's right & 2's left
      "grid-row:1; grid-column:5 / span 2;",    // sem 2
      "grid-row:2; grid-column:6 / span 4;",    // sem 3 — expands into 2's right & 4's left
      "grid-row:1; grid-column:9 / span 2;",    // sem 4
    ];

    const pasosHTML = data.metodologia.pasos.map((paso, i) => `
      <div class="metodo-paso" style="${gridPlacements[i]}">
        <span class="metodo-semana">${paso.semana}</span>
        <div class="metodo-texto">
          <h3>${paso.titulo}</h3>
          <p>${paso.descripcion.replace(/\n/g, "<br>")}</p>
        </div>
      </div>
    `).join("");

    const timelineHTML = data.metodologia.pasos.map(paso =>
      `<span>${paso.semana}</span>`
    ).join("");

    metodoEl.innerHTML = `
      <div class="metodologia-content">
        <div class="metodo-zigzag">
          ${pasosHTML}
          <div class="metodo-timeline-bar">${timelineHTML}</div>
        </div>
      </div>
    `;
  }

  // PRICING
  const pricingEl = document.querySelector(".celda.pricing");
  if (pricingEl && data.pricing) {
    const d = data.pricing;
    const incluyeHTML = d.incluye.map(i => `<p class="incluye-item">${i}</p>`).join("");
    pricingEl.innerHTML = `
      <div class="pricing-content">
        <h2>${d.titulo}</h2>
        <p class="precio-rango">${d.rango}</p>
        <p class="precio-nota">${d.nota.replace(/\n/g, "<br>")}</p>
        <p class="incluye-titulo">${d.titulo}</p>
        ${incluyeHTML}
      </div>
    `;
  }

  // POLITICAS
  const politicasEl = document.querySelector(".celda.politicas");
  if (politicasEl && data.politicas) {
    const parrafosHTML = data.politicas.parrafos.map(p =>
      `<p>${p.replace(/\n/g, "<br>")}</p>`
    ).join("");
    politicasEl.innerHTML = `<div class="politicas-content">${parrafosHTML}</div>`;
  }

  // PORTFOLIO
  const portfolioEl = document.querySelector(".celda.portfolio");
  if (portfolioEl && data.portfolio) {
    const items = data.portfolio.proyectos.map(p => `
      <a class="portfolio-item" href="${p.url}" target="_blank" title="${p.nombre}">
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
      </a>
    `).join("");
    portfolioEl.innerHTML = `
      <div class="portfolio-content">
        <div class="portfolio-grid">${items}</div>
      </div>
    `;
  }
}

// ============================================
// HEADER: page name + small minimap + langs
// ============================================

let headerEl = null;
let overlayEl = null;

function getNombrePagina() {
  const clave = `${posY}_${posX}`;
  return nombresEspeciales[clave] || "";
}

function crearHeader() {
  headerEl = document.createElement("div");
  headerEl.classList.add("header-topleft");

  // Page name button (opens minimap overlay)
  const pageBtn = document.createElement("button");
  pageBtn.classList.add("header-pagename");
  pageBtn.addEventListener("click", () => abrirMinimapExpandido());
  headerEl.appendChild(pageBtn);

  // Lang switcher below
  const langsDiv = document.createElement("div");
  langsDiv.classList.add("header-langs");
  headerEl.appendChild(langsDiv);

  document.body.appendChild(headerEl);
  actualizarHeader();
}

function actualizarHeader() {
  if (!headerEl) return;

  // Update page name + inline minimap
  const pageBtn = headerEl.querySelector(".header-pagename");
  const nombre = getNombrePagina();

  pageBtn.textContent = nombre;

  // Update langs
  const langsDiv = headerEl.querySelector(".header-langs");
  const langs = ["es", "en", "cat"];
  langsDiv.innerHTML = langs.map((lang, i) => {
    const active = lang === currentLang ? ' class="active"' : '';
    const sep = i < langs.length - 1 ? '<span class="lang-sep">/</span>' : '';
    return `<span${active} data-lang="${lang}">${lang}</span>${sep}`;
  }).join("");

  langsDiv.querySelectorAll("span[data-lang]").forEach(el => {
    el.addEventListener("click", () => {
      currentLang = el.dataset.lang;
      renderizarContenido().then(() => actualizarVista());
    });
  });
}

// ============================================
// EXPANDED MINIMAP (overlay)
// ============================================

function crearOverlay() {
  overlayEl = document.createElement("div");
  overlayEl.classList.add("minimap-overlay");

  const expanded = document.createElement("div");
  expanded.classList.add("minimap-expanded");
  expanded.style.gridTemplateColumns = `repeat(5, 1fr)`;
  expanded.style.gridTemplateRows = `repeat(2, 1fr)`;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const cell = document.createElement("button");
      cell.classList.add("minimap-expanded-cell");
      cell.dataset.y = y;
      cell.dataset.x = x;

      // Match device aspect ratio: wider on landscape, taller on portrait
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const aspect = vw / vh;
      const base = Math.min(vw * 0.12, 120);
      cell.style.width = `${Math.round(base)}px`;
      cell.style.height = `${Math.round(base / aspect)}px`;

      if (grid[y][x] === 0) {
        cell.classList.add("invisible");
      } else {
        const clave = `${y}_${x}`;
        const nombre = nombresEspeciales[clave] || "";
        cell.textContent = nombre;

        cell.addEventListener("click", () => {
          posY = y;
          posX = x;
          actualizarVista();
          actualizarMinimapExpandido();
          setTimeout(() => {
            cerrarMinimapExpandido();
          }, 650);
        });
      }

      expanded.appendChild(cell);
    }
  }

  overlayEl.appendChild(expanded);

  overlayEl.addEventListener("click", (e) => {
    if (e.target === overlayEl) {
      cerrarMinimapExpandido();
    }
  });

  document.body.appendChild(overlayEl);
}

function abrirMinimapExpandido() {
  actualizarMinimapExpandido();
  overlayEl.classList.add("visible");
}

function cerrarMinimapExpandido() {
  overlayEl.classList.remove("visible");
}

function actualizarMinimapExpandido() {
  if (!overlayEl) return;
  const cells = overlayEl.querySelectorAll(".minimap-expanded-cell");
  cells.forEach(cell => {
    const cy = parseInt(cell.dataset.y);
    const cx = parseInt(cell.dataset.x);
    cell.classList.toggle("activa", cy === posY && cx === posX);
  });
}

// ============================================
// NAVIGATION LABELS
// ============================================

function getVecinos() {
  const vecinos = {};
  const direcciones = [
    { dy: -1, dx: 0, pos: "top" },
    { dy: 1, dx: 0, pos: "bottom" },
    { dy: 0, dx: -1, pos: "left" },
    { dy: 0, dx: 1, pos: "right" },
  ];

  direcciones.forEach(dir => {
    const ny = posY + dir.dy;
    const nx = posX + dir.dx;
    if (grid[ny] && grid[ny][nx] === 1) {
      const clave = `${ny}_${nx}`;
      vecinos[dir.pos] = {
        y: ny,
        x: nx,
        nombre: nombresEspeciales[clave] || "",
      };
    }
  });

  return vecinos;
}

function crearNavLabels(celda) {
  celda.querySelectorAll(".nav-label").forEach(l => l.remove());

  const vecinos = getVecinos();

  Object.entries(vecinos).forEach(([pos, info]) => {
    const label = document.createElement("button");
    label.classList.add("nav-label", pos);
    label.textContent = info.nombre;

    label.addEventListener("click", () => {
      posY = info.y;
      posX = info.x;
      actualizarVista();
    });

    celda.appendChild(label);
  });
}

// ============================================
// VIEW UPDATE
// ============================================

function actualizarVista() {
  const todas = document.querySelectorAll(".celda");
  todas.forEach(c => c.classList.remove("activa"));

  const activa = document.querySelector(`.pos_${posY}_${posX}`);
  if (activa) {
    activa.classList.add("activa");
    crearNavLabels(activa);
  }

  actualizarHeader();
  actualizarMinimapExpandido();
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlayEl && overlayEl.classList.contains("visible")) {
    cerrarMinimapExpandido();
    return;
  }

  let newY = posY;
  let newX = posX;

  switch (e.key) {
    case "ArrowUp": newY--; break;
    case "ArrowDown": newY++; break;
    case "ArrowLeft": newX--; break;
    case "ArrowRight": newX++; break;
    default: return;
  }

  if (grid[newY] && grid[newY][newX] === 1) {
    posY = newY;
    posX = newX;
    actualizarVista();
  }
});

// ============================================
// INIT
// ============================================

crearPantallas();
crearHeader();
crearOverlay();
renderizarContenido().then(() => {
  actualizarVista();
});
