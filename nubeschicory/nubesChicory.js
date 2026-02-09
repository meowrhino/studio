(() => {
  // ============================================
  // GENERADOR DE NUBES ESTILO CHICORY
  // Inspirado en Chicory: A Colorful Tale
  // ============================================

  // Utilidades
  const qs = (sel) => document.querySelector(sel);
  const randomBetween = (min, max) => Math.random() * (max - min) + min;
  const randomInt = (min, max) => Math.floor(randomBetween(min, max));
  const randomChoice = (arr) => arr[randomInt(0, arr.length)];

  // Configuración
  const config = {
    cloudCount: {
      mobile: [8, 15],
      desktop: [15, 25]
    },
    cloudSize: {
      min: 80,
      max: 250
    },
    animationDuration: [20, 35],
    colorVariants: ['white', 'pink', 'yellow', 'blue', 'purple'],
    patternTypes: ['dots', 'lines', 'none']
  };

  // Gestión de temas
  const themeBtn = qs("#toggleTheme");
  const root = document.documentElement;
  const themes = ["light", "dark", "colorful"];
  const emojis = {
    light: "☀️",
    dark: "🌙",
    colorful: "🎨"
  };

  let currentThemeIndex = 0;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeBtn) {
      themeBtn.textContent = emojis[theme] || "🎛️";
    }
    currentThemeIndex = themes.indexOf(theme);
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      applyTheme(themes[currentThemeIndex]);
    });
  }

  // Generación de formas de nubes SVG
  // Estas son formas orgánicas inspiradas en el estilo cartoon de Chicory
  const cloudShapes = [
    // Nube redondeada clásica
    {
      path: "M 20,50 Q 20,20 50,20 Q 70,20 80,30 Q 100,20 120,30 Q 140,30 140,50 Q 140,70 120,70 Q 100,80 80,70 Q 60,80 40,70 Q 20,70 20,50 Z",
      viewBox: "0 0 160 100",
      dots: [
        { cx: 50, cy: 45 },
        { cx: 70, cy: 40 },
        { cx: 90, cy: 45 },
        { cx: 110, cy: 50 },
        { cx: 60, cy: 55 },
        { cx: 80, cy: 58 },
        { cx: 100, cy: 55 }
      ]
    },
    // Nube más irregular
    {
      path: "M 15,60 Q 15,35 40,30 Q 50,25 65,30 Q 80,20 100,25 Q 120,20 135,35 Q 150,40 145,60 Q 140,75 120,75 Q 100,85 80,75 Q 60,80 40,72 Q 20,75 15,60 Z",
      viewBox: "0 0 160 100",
      dots: [
        { cx: 45, cy: 50 },
        { cx: 65, cy: 48 },
        { cx: 85, cy: 45 },
        { cx: 105, cy: 50 },
        { cx: 125, cy: 52 },
        { cx: 70, cy: 60 },
        { cx: 95, cy: 62 }
      ]
    },
    // Nube pequeña y compacta
    {
      path: "M 25,50 Q 25,30 45,28 Q 60,25 75,30 Q 90,28 105,35 Q 115,40 110,55 Q 105,65 90,65 Q 75,70 60,65 Q 45,68 35,60 Q 25,60 25,50 Z",
      viewBox: "0 0 140 90",
      dots: [
        { cx: 50, cy: 45 },
        { cx: 70, cy: 43 },
        { cx: 85, cy: 48 },
        { cx: 65, cy: 55 }
      ]
    },
    // Nube alargada
    {
      path: "M 20,55 Q 20,35 40,30 Q 60,28 80,32 Q 100,28 120,32 Q 140,30 160,35 Q 180,40 175,55 Q 170,68 150,68 Q 130,72 110,68 Q 90,70 70,66 Q 50,70 30,65 Q 20,65 20,55 Z",
      viewBox: "0 0 200 90",
      dots: [
        { cx: 50, cy: 48 },
        { cx: 80, cy: 46 },
        { cx: 110, cy: 48 },
        { cx: 140, cy: 50 },
        { cx: 70, cy: 56 },
        { cx: 100, cy: 58 },
        { cx: 130, cy: 56 }
      ]
    }
  ];

  // Crear patrón de puntos SVG
  function createDotsPattern(dots) {
    return dots.map(dot => 
      `<circle class="cloud-pattern-dots" cx="${dot.cx}" cy="${dot.cy}" r="2" />`
    ).join('');
  }

  // Crear patrón de líneas diagonales SVG
  function createLinesPattern(viewBox) {
    const [, , width, height] = viewBox.split(' ').map(Number);
    let lines = '';
    for (let i = 0; i < width; i += 10) {
      lines += `<line class="cloud-pattern-lines" x1="${i}" y1="0" x2="${i + height}" y2="${height}" />`;
    }
    return lines;
  }

  // Crear una nube SVG individual
  function createChicoryCloud() {
    const isMobile = window.innerWidth <= 600;
    const shape = randomChoice(cloudShapes);
    const colorVariant = randomChoice(config.colorVariants);
    const patternType = randomChoice(config.patternTypes);
    
    const size = randomBetween(
      config.cloudSize.min,
      isMobile ? config.cloudSize.max * 0.7 : config.cloudSize.max
    );
    
    const top = randomBetween(-5, 95);
    const left = randomBetween(-5, 95);
    
    const duration = randomBetween(...config.animationDuration);
    const delay = randomBetween(0, 8);
    const animationType = randomChoice(['floatChicory', 'floatChicory2', 'floatChicory3']);
    
    // Crear el SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", shape.viewBox);
    svg.setAttribute("width", size);
    svg.setAttribute("height", size * 0.65);
    svg.classList.add("chicory-cloud");
    if (colorVariant !== 'white') {
      svg.classList.add(`cloud-${colorVariant}`);
    }
    
    // Estilo inline
    svg.style.top = `${top}%`;
    svg.style.left = `${left}%`;
    svg.style.animationDuration = `${duration}s`;
    svg.style.animationDelay = `${delay}s`;
    svg.style.animationName = animationType;
    
    // Crear el path de la nube
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", shape.path);
    path.classList.add("cloud-outline");
    svg.appendChild(path);
    
    // Añadir patrón de textura
    if (patternType === 'dots' && shape.dots) {
      const dotsHTML = createDotsPattern(shape.dots);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = dotsHTML;
      Array.from(tempDiv.children).forEach(child => {
        svg.appendChild(child);
      });
    } else if (patternType === 'lines') {
      const linesHTML = createLinesPattern(shape.viewBox);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = linesHTML;
      Array.from(tempDiv.children).forEach(child => {
        svg.appendChild(child);
      });
    }
    
    return svg;
  }

  // Generar todas las nubes
  function generateChicoryClouds() {
    const container = qs("#cloudsContainer");
    if (!container) return;
    
    // Limpiar nubes existentes
    container.innerHTML = '';
    
    // Determinar cantidad de nubes
    const isMobile = window.innerWidth <= 600;
    const [min, max] = isMobile ? config.cloudCount.mobile : config.cloudCount.desktop;
    const count = randomInt(min, max);
    
    // Crear y añadir nubes
    for (let i = 0; i < count; i++) {
      const cloud = createChicoryCloud();
      container.appendChild(cloud);
    }
    
    console.log(`✨ ${count} nubes estilo Chicory generadas`);
  }

  // Botón de regenerar nubes
  const regenerateBtn = qs("#regenerateClouds");
  if (regenerateBtn) {
    regenerateBtn.addEventListener("click", () => {
      generateChicoryClouds();
    });
  }

  // Inicializar
  applyTheme(themes[0]);
  generateChicoryClouds();

  // Regenerar al cambiar tamaño de ventana (con debounce)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      generateChicoryClouds();
    }, 500);
  });

  console.log('🎨 Generador de nubes estilo Chicory iniciado');
})();
