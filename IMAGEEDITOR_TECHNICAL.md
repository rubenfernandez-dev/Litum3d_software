"""
REFERENCIA TÉCNICA - EDITOR DE IMAGEN AVANZADO
===============================================

## ARQUITECTURA BACKEND


### Módulo: adjustments.py

apply_brightness(image, factor: float) -> Image
  - Factor: -100 a +100 → 0.0 a 2.0 internamente
  - Usa PIL.ImageEnhance.Brightness
  - RGB procesado por canal

apply_contrast(image, factor: float) -> Image
  - Factor: -100 a +100 → 0.0 a 2.0 internamente
  - Usa PIL.ImageEnhance.Contrast
  - Centra en 128 con fórmula lineal

apply_exposure(image, factor: float) -> Image
  - Factor: -2 a +2
  - Usa fórmula física: I' = I * 2^factor
  - Clipping a [0, 1] después
  - Simula entrada de luz de cámara

apply_gamma(image, gamma: float) -> Image
  - Gamma: 0.5 a 2.5
  - Inversa aplicada: I' = I^(1/gamma)
  - Corrección no lineal de tones

apply_invert(image) -> Image
  - 255 - valor para cada canal RGB
  - O usa PIL ImageEnhance si es PIL


### Módulo: filters.py

apply_sharpen(image, factor: float) -> Image
  - Factor: 0 a 1.0
  - Usa PIL.ImageEnhance.Sharpness
  - Kernel Laplacian bajo el hood
  - Factor mapea a multiplier 1.0 a 3.0

apply_blur(image, factor: float) -> Image
  - Factor: 0 a 1.0
  - Usa cv2.GaussianBlur(kernel_size, sigma)
  - kernel_size: 1 a 31 (impar)
  - Preserva color RGB


### Módulo: crop.py

apply_rotation(image, angle: int) -> Image
  - Angle: 0, 90, 180, 270 (solo múltiplos 90°)
  - Usa PIL.Image.transpose(ROTATE_*)
  - No interpola (preserva píxeles)

apply_crop(image, crop_box: tuple, maintain_aspect: bool) -> Image
  - crop_box: (left, top, right, bottom) en píxeles
  - maintain_aspect: si True, ajusta box para mantener aspecto original
  - Clipping a límites de imagen

apply_zoom(image, zoom_level: float, pan_x, pan_y, output_size) -> Image
  - zoom_level: 0.5 a 4.0
    * < 1: zoom out (imagen pequeña en canvas gris)
    * > 1: zoom in (crop + scale)
  - pan_x, pan_y: -1.0 a 1.0 (offset relativo)
  - output_size: (width, height) final
  - Usa Resampling.LANCZOS para calidad


### Módulo: pipeline.py

class ImageProcessingParams:
  Almacena todos los 12 parámetros editoriales
  Campos: brightness, contrast, exposure, gamma, sharpen, blur, 
          invert, rotation, zoom, pan_x, pan_y, crop_box, maintain_aspect

combine_adjustments(image, params) -> Image:
  Aplica en orden específico para estabilidad:
    1. Crop (opera en coords originales)
    2. Zoom + pan (reescala a output_size)
    3. Rotación (gira resultado)
    4-10. Ajustes tonales (brillo, contraste, etc.)
    11-12. Filtros (sharpen luego blur)

  Ventajas:
    - Orden determinístico (predecible)
    - Minimiza interpolación (crop/rotate primero)
    - Preserva quality (sharpen antes blur)
    - No repite procesamiento

params_from_dict(dict) -> ImageProcessingParams:
  Convierte JSON del frontend a objeto Python
  Validación de rangos integrada
  Valores por defecto si faltan campos


## ARQUITECTURA FRONTEND


### Componente: ImageEditor.svelte

Estado local:
  - originalImage: HTMLImageElement (cargada)
  - previewImage: HTMLImageElement (resultado)
  - editorState: object con 13 parámetros (debe coincidir con backend)
  - activeTab: 'Ajustes' | 'Recorte' | 'Transformar'
  - isCropping, isDraggingPan: booleans para eventos

Canvas:
  - 600x400px para previsualización
  - Procesamiento en CPU (JavaScript)
  - Actualización cada frame si necesario

Funciones clave:
  updatePreview(): aplica editorState a canvas
  handleFileSelect(): carga archivo
  resetAdjustments(): restaura todos a 0
  applyEdits(): guarda en processingParams.imageEdits + hasImageEdits=true
  handleCanvasMouseDown/Move/Up(): eventos dibujo recorte
  handleCanvasWheel(): zoom con rueda


### API Service

applyImageFilters(file, adjustments):
  POST /api/apply-image-filters
  FormData: file + adjustments (JSON stringified)
  Retorna: {success, image_base64, width, height, format}
  Base64 para fácil display en <img src="data:...">


### Store Integration

processingParams.imageEdits:
  Se usa si hasImageEdits === true
  Puede ser pasado a backend si se necesita
  Actualmente solo usado en frontend


## FLUJOS DE DATOS


### Flujo 1: Editor Frontend → Store

1. Usuario cambia slider en ImageEditor.svelte
2. updatePreview() ejecuta JavaScript image processing
3. Canvas actualiza en tiempo real
4. Usuario hace click "Aplicar ediciones"
5. applyEdits() hace processingParams.update() con:
   - imageEdits: {...editorState}
   - hasImageEdits: true
6. Store se propaga a otros componentes (pero opcional)


### Flujo 2: Backend Processing (futuro)

Si se agrega procesamiento backend:
1. ImageEditor guarda archivo original en FormData
2. POST /api/apply-image-filters con adjustments
3. Backend:
   - Carga imagen
   - params_from_dict(adjustments)
   - combine_adjustments(image, params)
   - Convierte a base64
   - Retorna JSON
4. Frontend recibe base64 y muestra


### Flujo 3: Mesh Generation (interacción)

1. Usuario hace click "Generar"
2. ActionButtons.svelte verifica hasImageEdits
3. Si true: incluye imageEdits en payload (para futuro)
4. Actual: solo usa imagen original
5. Backend genera malla normalmente


## CONSIDERACIONES DE RENDIMIENTO


Frontend Canvas Processing:
  - Pros: instantáneo, respuesta inmediata, sin network delay
  - Contras: limitado a canvas capabilities, precisión limitada
  - Óptimo para: UI responsivo, previsualización

Backend Processing:
  - Pros: precisión PIL/NumPy, mejor para grande, puede cachearse
  - Contras: network latency, requiere upload
  - Óptimo para: generación final, batch processing

Actual (híbrida):
  - Canvas para previsualización (rápido)
  - Backend ready si se necesita precisión


## EXTENSIONES FUTURAS


Sin cambios de arquitectura:

1. Histograma
   - Mostrar en tab 4 "Histograma"
   - Canvas 1D con barras RGB
   - Función: analyzeHistogram(image) en filters.py

2. Presets
   - Botones: Sepia, B&N, Vintage, Vivido
   - Cada preset = dict de parámetros predefinido
   - Carga en editorState

3. Curvas avanzadas
   - Canvas interactivo con curva ajustable
   - Editor de puntos
   - Función: apply_curve(image, control_points) en adjustments.py

4. Auto-enhance (IA)
   - Botón "✨ Auto-mejorar"
   - Llamada a backend con imagen
   - Backend analiza y retorna parámetros óptimos
   - Frontend carga en editorState

5. Batch processing
   - Cargar múltiples imágenes
   - Aplicar mismo preset a todas
   - Descargar ZIP

6. Comparación antes/después
   - Slider para ver original vs editada lado a lado
   - Canvas con superposición


## VALIDACIÓN DE DATOS


Frontend:
  - Sliders con min/max (navegador valida)
  - Valores numéricos parseados como float/int
  - Checkboxes fuerzan boolean

Backend:
  - params_from_dict valida rangos:
    * brightness: clamped a -100 a +100
    * contrast: clamped a -100 a +100
    * exposure: clamped a -2 a +2
    * gamma: clamped a 0.5 a 2.5
    * zoom: clamped a 0.5 a 4.0
  - crop_box: verificado que left < right, top < bottom
  - Valores missing usan defaults


## TESTING

Backend (test_adjustments.py):
  def test_brightness_range():
    assert combine_adjustments(img, params(-100)) != combine_adjustments(img, params(0))
  
  def test_crop_maintains_aspect():
    assert output.width / output.height == input.width / input.height

Frontend (ImageEditor.test.js):
  describe('ImageEditor', () => {
    test('brightness slider updates canvas', () => {
      slider.value = 50
      updatePreview()
      assert(canvas appears brighter)
    })
  })


## DEBUGGING

Common Issues:

1. Canvas no muestra nada
   → Verificar originalImage cargó correctamente
   → Verificar canvas context no es null
   → Verificar canvas width/height > 0

2. Procesamiento muy lento
   → Si frontend: reducir resolución canvas
   → Si backend: usar threading/async

3. Colores incorrectos
   → Verificar conversión RGB vs BGR (OpenCV usa BGR)
   → Verificar range [0, 255] vs [0, 1] en cálculos

4. Recorte impreciso
   → Crop box se calcula en coords canvas
   → Necesita transformación a coords imagen original
   → Usar matriz de transformación si hay rotación/zoom
"""
