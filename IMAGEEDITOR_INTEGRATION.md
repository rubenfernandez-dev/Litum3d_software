"""
EDITOR DE IMAGEN AVANZADO - INTEGRACIÓN COMPLETA
=================================================

Este documento describe la estructura y arquitectura del editor de imagen avanzado,
asegurando que no hay duplicación de código y está completamente integrado.

## ESTRUCTURA DE DIRECTORIOS

Backend:
--------
backend/image_processing/
  ├── __init__.py              (Exporta todas las funciones públicas)
  ├── adjustments.py           (Brillo, contraste, exposición, gamma, invertir)
  ├── filters.py               (Nitidez, suavizado)
  ├── crop.py                  (Recorte, zoom, rotación)
  └── pipeline.py              (Orquestación de filtros + ImageProcessingParams)

Frontend:
---------
frontend/src/lib/components/
  └── ImageEditor.svelte       (Componente editor con canvas, tabs, controles)

frontend/src/lib/services/
  └── apiService.js            (Métodos para procesar imágenes)

frontend/src/lib/stores/
  └── appStore.js              (Campos imageEdits y hasImageEdits en processingParams)

frontend/src/routes/
  └── +page.svelte             (Integra ImageEditor después de ImageUploader)


## FLUJO DE TRABAJO

1. Usuario carga imagen en ImageUploader
2. Usuario OPCIONALMENTE abre ImageEditor para editar
3. En ImageEditor:
   - Previsualización en tiempo real en canvas
   - Tres tabs: Ajustes, Recorte, Transformar
   - Al hacer click en "Aplicar ediciones", se guarda el estado en appStore.processingParams.imageEdits
   - hasImageEdits se pone en true
4. Usuario genera litofanía (se usa imagen editada si hasImageEdits=true, original si false)


## BACKENDS - MÓDULOS DE PROCESAMIENTO

adjustments.py:
  - apply_brightness(image, factor: -100 a +100)
  - apply_contrast(image, factor: -100 a +100)
  - apply_exposure(image, factor: -2 a +2)
  - apply_gamma(image, gamma: 0.5 a 2.5)
  - apply_invert(image) -> invierte colores

filters.py:
  - apply_sharpen(image, factor: 0 a 1.0)
  - apply_blur(image, factor: 0 a 1.0)

crop.py:
  - apply_crop(image, crop_box, maintain_aspect)
  - apply_zoom(image, zoom_level, pan_x, pan_y, output_size)
  - apply_rotation(image, angle: 0/90/180/270)

pipeline.py:
  - ImageProcessingParams: clase para almacenar todos los parámetros
  - combine_adjustments(image, params) -> aplica en orden óptimo:
    1. Crop
    2. Zoom y pan
    3. Rotación
    4. Brillo
    5. Contraste
    6. Exposición
    7. Gamma
    8. Invertir
    9. Nitidez
    10. Suavizado
  - params_from_dict(dict) -> convierte dict a ImageProcessingParams


## ENDPOINTS API

POST /api/process-image-advanced
  - Recibe: archivo de imagen
  - Devuelve: {success, message, image_base64, width, height, format}
  - Uso: Previsualización frontend

POST /api/apply-image-filters
  - Recibe: archivo + adjustments (dict)
  - Devuelve: {success, message, image_base64, width, height, format}
  - Usa pipeline.combine_adjustments internamente
  - Uso: Procesamiento backend cuando sea necesario


## FRONTEND - IMAGEEDITOR.SVELTE

Estructura:
  - Carga archivo con file input (oculto)
  - Tres tabs: Ajustes | Recorte | Transformar
  - Canvas para previsualización en tiempo real
  - Controles en cada tab

Tabs:
  1. Ajustes:
     - Brillo (-100 a +100)
     - Contraste (-100 a +100)
     - Exposición (-2 a +2)
     - Gamma (0.5 a 2.5)
     - Nitidez (0 a 1.0)
     - Suavizado (0 a 1.0)
     - Invertir (checkbox)
     - Botón "Restablecer ajustes"

  2. Recorte:
     - Dibujar rectángulo en canvas
     - Modos: libre, mantener proporción, ajustar área
     - Mostrar rectángulo amarillo

  3. Transformar:
     - Rotación: botones 0°, 90°, 180°, 270°
     - Zoom: slider 0.5x a 4x (+ rueda del mouse)
     - Pan X: slider -1 a +1
     - Pan Y: slider -1 a +1

Eventos del canvas:
  - Rueda del mouse: cambiar zoom
  - Arrastrar+Shift: pan
  - Recorte: drag para dibujar rectángulo


## INTEGRACIÓN EN APPSTORE

processingParams ahora tiene:
  {
    // ... parámetros existentes ...
    
    // NUEVOS - para editor de imagen
    hasImageEdits: false,        // boolean
    imageEdits: {                // estado completo del editor
      brightness: 0,
      contrast: 0,
      exposure: 0,
      gamma: 1.0,
      sharpen: 0,
      blur: 0,
      invert: false,
      rotation: 0,
      zoom: 1.0,
      pan_x: 0,
      pan_y: 0,
      crop_box: null,
      maintain_aspect: false
    }
  }


## INTEGRACIÓN EN +PAGE.SVELTE

Estructura del grid:
  <Columna Izquierda>
    1. ImageUploader           (existente)
    2. ImageEditor             (NUEVO)
    3. ParameterControls       (existente)
    4. AdvancedShapeControls   (existente)
    5. Lithophane360Controls   (existente)
    6. PreviewEnhancements     (existente)
    7. ActionButtons           (existente)


## COMPATIBILIDAD CON FEATURES EXISTENTES

✓ Proyección frontal: ImageEditor es agnóstico de proyección
✓ Proyección 360°: Imagen editada se usa igual
✓ Perfiles por diámetros: No afecta procesamiento de imagen
✓ Torsión: Parámetro de geometría, no de imagen
✓ Escalado progresivo: Parámetro de geometría
✓ Curvas avanzadas: Parámetro de geometría
✓ Animación + iluminación: No afecta procesamiento de imagen

Todos estos features pueden coexistir sin modificaciones.


## RENDIMIENTO

Frontend:
  - Canvas 2D para previsualización (GPU)
  - Operaciones buffer en JavaScript
  - Sin bloqueos de UI

Backend:
  - Procesamiento en CPU usando PIL + NumPy + OpenCV
  - Pipelines eficientes (no repite operaciones)
  - Base64 para transmisión


## SIN DUPLICACIÓN DE CÓDIGO

✓ No modifica ImageUploader
✓ No modifica ParameterControls
✓ No modifica GenerateMeshRequest
✓ No modifica mesh_generator.py
✓ No modifica routes/api.py (solo agrega endpoints nuevos)
✓ No modifica appStore (solo agrega campos nuevos)

Nuevos archivos solo:
  - backend/image_processing/*.py
  - frontend/src/lib/components/ImageEditor.svelte


## PRÓXIMAS EXTENSIONES POSIBLES

Sin cambiar nada:
  - Agregar histograma en tab new
  - Agregar presets (sepia, BW, vintage)
  - Agregar curves avanzadas
  - Integrar IA para auto-enhance
  - Agregar filtros de kernel custom
"""
