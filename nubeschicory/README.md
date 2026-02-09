# Nubes Estilo Chicory

Generador de nubes de fondo inspirado en el estilo visual del videojuego **Chicory: A Colorful Tale**.

## Características del estilo Chicory

Este generador recrea las características visuales distintivas del juego:

### Estilo visual

El juego Chicory presenta un estilo artístico único que combina elementos de libros para colorear con una estética cartoon acogedora. Las nubes en este generador capturan ese espíritu mediante:

**Formas orgánicas**: Las nubes tienen contornos irregulares y redondeados, dibujados a mano, que recuerdan al estilo de ilustración del juego. Cada nube es única y tiene una personalidad propia.

**Contornos gruesos**: Siguiendo la estética del juego, todas las nubes tienen bordes negros gruesos (3-5px) que les dan un aspecto de dibujo a tinta, similar a los cómics o ilustraciones infantiles.

**Texturas internas**: Algunas nubes incluyen patrones de puntos o líneas diagonales en su interior, imitando las técnicas de sombreado y texturización que se ven en el juego (hatching, cross-hatching, dot patterns).

**Paleta colorida**: Además del blanco clásico, las nubes pueden aparecer en colores pastel vibrantes (rosa, amarillo, azul, púrpura), reflejando la naturaleza coloreable del mundo de Chicory.

**Fondos con gradiente**: El cielo usa gradientes suaves que van de tonos claros a medios, con un patrón sutil de puntos que añade textura al fondo.

### Animación

Las animaciones son sutiles y suaves, creando un efecto de flotación tranquilo que no distrae del contenido principal. Se usan tres variantes de animación que combinan traslación y rotación mínima.

## Archivos incluidos

- **nubesChicory.js**: Lógica JavaScript para generar nubes SVG con formas orgánicas
- **nubesChicory.css**: Estilos CSS con paletas de color, animaciones y efectos visuales
- **README.md**: Este archivo de documentación
- **verNubes.html**: Demo interactiva para visualizar solo el fondo de nubes

## Cómo usar

### HTML básico

```html
<!DOCTYPE html>
<html lang="es" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nubes Chicory</title>
  <link rel="stylesheet" href="nubesChicory.css">
</head>
<body>
  <!-- Contenedor de fondo con patrón -->
  <div id="backgroundContainer"></div>
  
  <!-- Contenedor de nubes SVG -->
  <div id="cloudsContainer"></div>
  
  <!-- Botones de control -->
  <nav>
    <button id="regenerateClouds" aria-label="regenerar nubes">☁️</button>
    <button id="toggleTheme" aria-label="cambiar tema">☀️</button>
  </nav>
  
  <!-- Tu contenido aquí -->
  <div class="container">
    <h1>Mi contenido</h1>
  </div>
  
  <script src="nubesChicory.js"></script>
</body>
</html>
```

## Personalización

### Configuración de nubes

Puedes modificar la configuración en `nubesChicory.js`:

```javascript
const config = {
  cloudCount: {
    mobile: [8, 15],      // Cantidad en móvil [min, max]
    desktop: [15, 25]     // Cantidad en desktop [min, max]
  },
  cloudSize: {
    min: 80,              // Tamaño mínimo en píxeles
    max: 250              // Tamaño máximo en píxeles
  },
  animationDuration: [20, 35],  // Duración de animación en segundos
  colorVariants: ['white', 'pink', 'yellow', 'blue', 'purple'],
  patternTypes: ['dots', 'lines', 'none']  // Tipos de textura interna
};
```

### Paleta de colores

Modifica las variables CSS en `nubesChicory.css`:

```css
:root {
  --chicory-sky-light: #e8f4f8;
  --chicory-sky-medium: #b8d8e8;
  --chicory-cloud-fill: #ffffff;
  --chicory-cloud-stroke: #1a1a1a;
  --chicory-cloud-pink: #ffb3d9;
  --chicory-cloud-yellow: #fff4b3;
  --chicory-cloud-blue: #b3d9ff;
  --chicory-cloud-purple: #d9b3ff;
}
```

### Temas disponibles

El generador incluye tres temas predefinidos:

- **light**: Cielo azul claro con nubes blancas (estilo día)
- **dark**: Cielo oscuro con nubes grises (estilo noche)
- **colorful**: Cielo rosa/púrpura con nubes de colores pastel

Cambia entre temas haciendo clic en el botón de tema o programáticamente:

```javascript
document.documentElement.setAttribute("data-theme", "colorful");
```

## Diferencias con las nubes originales

Las nubes originales de `generar nubes/` usan:
- Forma de nube única definida con `clip-path` CSS
- Elementos `div` con color de fondo
- Estilo más realista y suave

Las nubes estilo Chicory usan:
- Múltiples formas de nubes dibujadas con SVG paths
- Contornos gruesos y estilo cartoon
- Texturas internas con patrones
- Paleta de colores más vibrante y juguetona
- Estilo más ilustrativo y expresivo

## Notas técnicas

- Las nubes se generan dinámicamente como elementos SVG
- Cada nube tiene una forma, tamaño, posición y animación aleatoria
- Los patrones de textura se añaden como elementos SVG adicionales
- El código es completamente vanilla JavaScript (sin dependencias)
- Compatible con navegadores modernos que soporten SVG

## Inspiración

Este generador está inspirado en el videojuego **Chicory: A Colorful Tale** (2021), desarrollado por Greg Lobanov y publicado por Finji. El juego presenta un mundo en blanco y negro que los jugadores pueden colorear con un pincel mágico, con un estilo artístico que recuerda a los libros para colorear y las ilustraciones infantiles.

## Créditos

- Código original: meowrhino.studio
- Inspiración visual: Chicory: A Colorful Tale (Finji, 2021)
- Diseño de personajes del juego original: Alexis Dean-Jones
