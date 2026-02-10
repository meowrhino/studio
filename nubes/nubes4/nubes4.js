(() => {
  // ============================================
  // NUBES 4 — Nubes grandes y agrupadas
  //
  // Genera nubes más grandes y reduce el total.
  // Además, si varias “semillas” caen cerca,
  // se agrupan en una sola nube compuesta por
  // múltiples elipses dentro de un mismo SVG.
  // ============================================

  const qs = (sel) => document.querySelector(sel);
  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(rand(min, max));
  const pick = (arr) => arr[randInt(0, arr.length)];

  const config = {
    count: { mobile: [1, 1], desktop: [1, 1] },
    size: { min: 220, max: 700 },
    animations: ['drift', 'drift2', 'drift3'],
    duration: [30, 60],
    colors: [
      'var(--cloud-white)',
      'var(--cloud-cream)',
      'var(--cloud-pink)',
      'var(--cloud-lavender)',
      'var(--cloud-peach)',
    ],
    lobes: {
      min: 8,
      max: 12,
      offset: [0.08, 0.22],
      size: [0.75, 1.15],
    },
    superCloud: {
      seeds: { mobile: [8, 12], desktop: [12, 18] },
      spread: { x: 0.18, y: 0.12 },
      centerX: [0.3, 0.7],
      centerY: [0.2, 0.6],
    },
    merge: {
      factor: 0.9,
      padding: [14, 28],
    },
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

  let cloudId = 0;

  function createSeed(isMobile, vw, vh, center, spread) {
    const max = isMobile ? config.size.max * 0.7 : config.size.max;
    const w = rand(config.size.min, max);
    const h = w * rand(0.45, 0.7);
    const cx = center?.x ?? rand(-0.08, 1.08) * vw;
    const cy = center?.y ?? rand(-0.1, 0.9) * vh;
    const sx = spread?.x ?? 0;
    const sy = spread?.y ?? 0;
    const x = cx + rand(-sx, sx) * vw;
    const y = cy + rand(-sy, sy) * vh;
    return { x, y, w, h };
  }

  function shouldMerge(a, b) {
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    const size = (a.w + b.w + a.h + b.h) / 4;
    return dist < size * config.merge.factor;
  }

  function clusterSeeds(seeds) {
    const used = new Array(seeds.length).fill(false);
    const clusters = [];

    for (let i = 0; i < seeds.length; i++) {
      if (used[i]) continue;
      const queue = [i];
      used[i] = true;
      const cluster = [];

      while (queue.length) {
        const idx = queue.pop();
        const base = seeds[idx];
        cluster.push(base);

        for (let j = 0; j < seeds.length; j++) {
          if (used[j]) continue;
          if (shouldMerge(base, seeds[j])) {
            used[j] = true;
            queue.push(j);
          }
        }
      }

      clusters.push(cluster);
    }

    return clusters;
  }

  function buildLobes(cluster) {
    const desired = randInt(config.lobes.min, config.lobes.max + 1);
    const avgW = cluster.reduce((sum, s) => sum + s.w, 0) / cluster.length;
    const avgH = cluster.reduce((sum, s) => sum + s.h, 0) / cluster.length;
    const centerX = cluster.reduce((sum, s) => sum + s.x, 0) / cluster.length;
    const centerY = cluster.reduce((sum, s) => sum + s.y, 0) / cluster.length;

    const lobes = cluster.map((s) => ({ ...s }));

    if (lobes.length > desired) {
      for (let i = lobes.length - 1; i > 0; i--) {
        const j = randInt(0, i + 1);
        [lobes[i], lobes[j]] = [lobes[j], lobes[i]];
      }
      return lobes.slice(0, desired);
    }

    while (lobes.length < desired) {
      const angle = rand(0, Math.PI * 2);
      const radius = avgW * rand(...config.lobes.offset);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius * 0.6;
      const w = avgW * rand(...config.lobes.size);
      const h = Math.max(20, w * rand(0.45, 0.7));
      lobes.push({ x, y, w, h });
    }

    return lobes;
  }

  function createCloudFromCluster(cluster) {
    const id = `cloud-${cloudId++}`;
    const color = pick(config.colors);

    // Unique turbulence per cloud
    const baseFreq = rand(0.01, 0.04).toFixed(4);
    const octaves = randInt(2, 5);
    const seed = randInt(1, 9999);
    const displace = randInt(18, 44);
    const blur = rand(2.5, 5.5).toFixed(1);

    const lobes = buildLobes(cluster);
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const s of lobes) {
      minX = Math.min(minX, s.x - s.w / 2);
      minY = Math.min(minY, s.y - s.h / 2);
      maxX = Math.max(maxX, s.x + s.w / 2);
      maxY = Math.max(maxY, s.y + s.h / 2);
    }

    const pad = rand(...config.merge.padding);
    const width = Math.max(1, Math.round(maxX - minX + pad * 2));
    const height = Math.max(1, Math.round(maxY - minY + pad * 2));

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.classList.add('cloud4');

    // Position (px para facilitar el agrupado)
    svg.style.top = `${Math.round(minY - pad)}px`;
    svg.style.left = `${Math.round(minX - pad)}px`;
    svg.style.animationName = pick(config.animations);
    svg.style.animationDuration = `${rand(...config.duration)}s`;
    svg.style.animationDelay = `${rand(0, 10)}s`;
    svg.style.opacity = rand(0.62, 0.95).toFixed(2);

    const ellipses = lobes
      .map((s) => {
        const cx = s.x - minX + pad;
        const cy = s.y - minY + pad;
        const rx = s.w * rand(0.45, 0.55);
        const ry = s.h * rand(0.45, 0.55);
        return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${color}" />`;
      })
      .join('');

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
      <g filter="url(#${id}-f)">
        ${ellipses}
      </g>
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
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const seeds = [];
    const [minSeeds, maxSeeds] = isMobile
      ? config.superCloud.seeds.mobile
      : config.superCloud.seeds.desktop;
    const seedCount = randInt(minSeeds, maxSeeds);
    const center = {
      x: rand(...config.superCloud.centerX) * vw,
      y: rand(...config.superCloud.centerY) * vh,
    };
    const spread = config.superCloud.spread;
    for (let i = 0; i < seedCount; i++) {
      seeds.push(createSeed(isMobile, vw, vh, center, spread));
    }

    const clusters = [seeds];
    const frag = document.createDocumentFragment();
    for (const cluster of clusters) {
      frag.appendChild(createCloudFromCluster(cluster));
    }
    container.appendChild(frag);

    console.log(`☁️ ${count} supernube generada (de ${seedCount} semillas)`);
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

  console.log('☁️ nubes4 iniciado');
})();
