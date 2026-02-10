(() => {
  // ============================================
  // NUBES 3 — Nubes suaves procedurales
  //
  // Usa SVG con filtros feTurbulence para crear
  // formas orgánicas tipo acuarela/pintadas.
  // Cada nube es única: su forma se genera con
  // ruido Perlin distorsionando un círculo base.
  // ============================================

  const qs = (sel) => document.querySelector(sel);
  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(rand(min, max));
  const pick = (arr) => arr[randInt(0, arr.length)];

  const config = {
    count: { mobile: [6, 12], desktop: [12, 22] },
    size: { min: 120, max: 350 },
    animations: ['drift', 'drift2', 'drift3'],
    duration: [25, 50],
    colors: [
      'var(--cloud-white)',
      'var(--cloud-cream)',
      'var(--cloud-pink)',
      'var(--cloud-lavender)',
      'var(--cloud-peach)',
    ],
  };

  // Tema
  const root = document.documentElement;
  const themes = ['light', 'dark'];
  const emojis = { light: '☀️', dark: '🌙' };
  let themeIdx = 0;

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    const btn = qs('#toggleTheme');
    if (btn) btn.textContent = emojis[t] || '🎛️';
    themeIdx = themes.indexOf(t);
  }

  const themeBtn = qs('#toggleTheme');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      themeIdx = (themeIdx + 1) % themes.length;
      applyTheme(themes[themeIdx]);
    });
  }

  // ============================================
  // Generar forma de nube con SVG filter
  // Cada nube tiene un filtro feTurbulence único
  // que distorsiona un ellipse base, creando
  // bordes orgánicos e irregulares.
  // ============================================

  let cloudId = 0;

  function createCloud() {
    const id = `cloud-${cloudId++}`;
    const isMobile = window.innerWidth <= 600;
    const w = rand(config.size.min, isMobile ? config.size.max * 0.65 : config.size.max);
    const h = w * rand(0.45, 0.7);
    const color = pick(config.colors);

    // Unique turbulence per cloud
    const baseFreq = rand(0.01, 0.04).toFixed(4);
    const octaves = randInt(2, 5);
    const seed = randInt(1, 9999);
    const displace = randInt(15, 40);
    const blur = rand(2, 5).toFixed(1);

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', Math.round(w));
    svg.setAttribute('height', Math.round(h));
    svg.setAttribute('viewBox', `0 0 ${Math.round(w)} ${Math.round(h)}`);
    svg.classList.add('cloud3');

    // Position
    svg.style.top = `${rand(-8, 85)}%`;
    svg.style.left = `${rand(-10, 95)}%`;
    svg.style.animationName = pick(config.animations);
    svg.style.animationDuration = `${rand(...config.duration)}s`;
    svg.style.animationDelay = `${rand(0, 10)}s`;
    svg.style.opacity = rand(0.6, 0.95).toFixed(2);

    // Build the filter — this is the magic
    svg.innerHTML = `
      <defs>
        <filter id="${id}-f" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="${baseFreq}"
            numOctaves="${octaves}"
            seed="${seed}"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="${displace}"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="${blur}" result="blurred" />
          <feComposite in="blurred" in2="blurred" operator="atop" />
        </filter>
      </defs>
      <ellipse
        cx="${Math.round(w / 2)}"
        cy="${Math.round(h / 2)}"
        rx="${Math.round(w * 0.38)}"
        ry="${Math.round(h * 0.38)}"
        fill="${color}"
        filter="url(#${id}-f)"
      />
    `;

    return svg;
  }

  // ============================================
  // Generar todas las nubes
  // ============================================

  function generate() {
    const container = qs('#cloudsContainer');
    if (!container) return;
    container.innerHTML = '';
    cloudId = 0;

    const isMobile = window.innerWidth <= 600;
    const [min, max] = isMobile ? config.count.mobile : config.count.desktop;
    const count = randInt(min, max);

    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      frag.appendChild(createCloud());
    }
    container.appendChild(frag);

    console.log(`☁️ ${count} nubes suaves generadas`);
  }

  // Regenerar
  const regenBtn = qs('#regenerateClouds');
  if (regenBtn) {
    regenBtn.addEventListener('click', generate);
  }

  // Init
  applyTheme(themes[0]);
  generate();

  // Resize con debounce
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(generate, 500);
  });

  console.log('☁️ nubes3 iniciado');
})();
