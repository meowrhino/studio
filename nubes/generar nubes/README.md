# Generador de Nubes de Fondo

Este código genera un fondo dinámico de nubes animadas que se puede utilizar en cualquier proyecto web.

## Archivos incluidos

- **nubes.js**: Contiene la lógica JavaScript para generar y animar las nubes
- **nubes.css**: Contiene los estilos CSS, incluyendo la forma de la nube (clip-path), animaciones y paletas de colores

## Características principales

### JavaScript (nubes.js)

El código JavaScript incluye:

1. **Generación aleatoria de nubes**: Crea múltiples elementos `div.cloud` con posiciones, tamaños y animaciones aleatorias
2. **Parámetros configurables**: 
   - Cantidad de nubes (adaptable a móvil/desktop)
   - Ancho mínimo y máximo
   - Duración de animación
3. **Optimización de rendimiento**: Usa `DocumentFragment` para insertar múltiples nubes de una vez
4. **Botón de randomización**: Permite regenerar las nubes con nuevos parámetros aleatorios
5. **Sistema de temas**: Alterna entre tema claro y oscuro
6. **Detección automática de luz solar**: Cambia el tema según la hora del día en Barcelona

### CSS (nubes.css)

El código CSS incluye:

1. **Forma de nube personalizada**: Definida con `clip-path` en la variable CSS `--nube`
2. **Animaciones flotantes**: 4 variantes de animación (`float1`, `float2`, `float3`, `float4`) que crean movimientos sutiles
3. **Paletas de color**: 
   - Tema claro: nubes color `#DEB887` (burlywood)
   - Tema oscuro: nubes color `#7c5aa8` (púrpura)
4. **Contenedor de fondo fijo**: Las nubes se posicionan en un contenedor fijo que cubre toda la pantalla

## Cómo usar

### 1. HTML básico

```html
<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nubes de fondo</title>
  <link rel="stylesheet" href="nubes.css">
</head>
<body>
  <!-- Contenedor de nubes (fondo dinámico) -->
  <div id="backgroundContainer"></div>
  
  <!-- Botones de control -->
  <nav>
    <button id="randomizeClouds" aria-label="mover nubes">☁️</button>
    <button id="toggleTheme" aria-label="cambiar tema">⚫️</button>
  </nav>
  
  <!-- Tu contenido aquí -->
  <div class="container">
    <h1>Mi contenido</h1>
    <p>El fondo de nubes se genera automáticamente</p>
  </div>
  
  <script src="nubes.js"></script>
</body>
</html>
```

### 2. Personalización

Puedes modificar los parámetros de generación de nubes editando la función `getRandomCloudParams()` en `nubes.js`:

```javascript
function getRandomCloudParams() {
  let minW = randomBetween(40, 250);    // Ancho mínimo de nubes
  let maxW = randomBetween(400, 600);   // Ancho máximo de nubes
  
  const count = isMobile
    ? Math.floor(randomBetween(20, 35))   // Cantidad en móvil
    : Math.floor(randomBetween(50, 120)); // Cantidad en desktop
  
  return {
    count,
    minWidth: minW,
    maxWidth: maxW,
    durationRange: [randomBetween(12, 20), randomBetween(22, 30)],
  };
}
```

### 3. Colores personalizados

Modifica las variables CSS en `nubes.css`:

```css
html[data-theme="light"] {
  --clouds: #DEB887;  /* Color de las nubes en tema claro */
}

html[data-theme="dark"] {
  --clouds: #7c5aa8;  /* Color de las nubes en tema oscuro */
}
```

## Notas técnicas

- El código original proviene del repositorio **becasDigMeow**
- Las nubes se generan con `position: absolute` dentro de un contenedor fijo
- El contenedor tiene `pointer-events: none` para que no interfiera con clics
- Las animaciones usan `transform` para mejor rendimiento
- El código incluye detección de luz solar para Barcelona (requiere archivo `data/sunlight.json`)

## Estructura modular

El código está diseñado de forma modular:

1. **Utilidades**: Funciones helper para selección de elementos y números aleatorios
2. **Gestión de tema**: Sistema de alternancia entre temas claro/oscuro
3. **Gestión de nubes**: Generación, creación y randomización de nubes
4. **Multilenguaje**: Sistema de internacionalización (opcional, se puede eliminar)

Puedes extraer solo las partes que necesites para tu proyecto.
