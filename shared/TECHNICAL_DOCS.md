# Documentación Técnica - Litum3D

## Arquitectura General

Litum3D sigue una arquitectura cliente-servidor con separación clara entre frontend y backend.

```
┌─────────────┐         HTTP/REST API        ┌─────────────┐
│             │ ◄──────────────────────────► │             │
│  Frontend   │                              │   Backend   │
│  SvelteKit  │    JSON + FormData           │   FastAPI   │
│             │                              │             │
└─────────────┘                              └─────────────┘
      │                                             │
      ▼                                             ▼
 Three.js                                    ┌─────────────┐
 (Vista 3D)                                  │  Services   │
                                             ├─────────────┤
                                             │ • Image     │
                                             │ • Heightmap │
                                             │ • Mesh      │
                                             │ • Export    │
                                             └─────────────┘
```

## Backend (Python + FastAPI)

### Estructura de Módulos

#### 1. `main.py`
Punto de entrada de la aplicación FastAPI. Configura:
- Middlewares (CORS)
- Rutas
- Archivos estáticos
- Configuración del servidor

#### 2. `routes/api.py`
Define los endpoints REST:
- `POST /api/process-image` - Procesa imagen inicial
- `POST /api/generate-heightmap` - Genera mapa de alturas
- `POST /api/generate-mesh` - Genera malla 3D
- `POST /api/export` - Exporta a STL/3MF
- `GET /api/download/{filename}` - Descarga archivos
- `GET /api/health` - Health check

#### 3. `services/image_processor.py`
Procesamiento de imágenes:
- Conversión a escala de grises
- Ajustes de contraste y brillo
- Filtros: blur, sharpen
- Normalización
- Cache de imágenes procesadas

**Métodos principales:**
```python
process_image(image_data, image_id, contrast, brightness, blur, sharpen)
get_processed_image(image_id)
apply_opencv_filters(img_array, denoise, adaptive_threshold)
normalize_for_heightmap(img_array)
```

#### 4. `services/heightmap_generator.py`
Generación de mapas de alturas:
- Mapeo de valores de píxeles a alturas
- Inversión opcional
- Suavizado gaussiano
- Redimensionamiento
- Ajustes de curva gamma

**Métodos principales:**
```python
generate_heightmap(img_array, heightmap_id, min_height, max_height, invert)
get_heightmap(heightmap_id)
apply_smoothing(heightmap, sigma)
resize_heightmap(heightmap, target_resolution)
apply_curve_adjustment(heightmap, gamma)
```

#### 5. `services/mesh_generator.py`
Generación de mallas 3D:
- Conversión de heightmap a geometría
- Soporte para múltiples formas
- Generación de caras y vértices
- Optimización

**Formas soportadas:**
- `_generate_plane_rect()` - Plano rectangular
- `_generate_plane_circle()` - Plano circular con máscara
- `_generate_arc()` - Arco con curvatura
- `_generate_cylinder()` - Cilindro 360°
- `_generate_sphere_partial()` - Segmento esférico
- `_generate_heart()` - Forma de corazón con ecuación paramétrica
- `_generate_tower()` - Torres poligonales extruidas

**Algoritmo de generación:**
1. Redimensionar heightmap según resolución
2. Crear grid de vértices (superficie superior + inferior)
3. Generar caras triangulares (top + bottom + sides)
4. Construir objeto trimesh
5. Retornar estadísticas

#### 6. `services/export_service.py`
Exportación de mallas:
- Exportación a STL binario
- Exportación a 3MF
- Optimización de malla (decimation)
- Reparación automática

**Métodos de reparación:**
- Llenar huecos
- Arreglar normales
- Remover duplicados
- Merge de vértices

#### 7. `models/schemas.py`
Modelos de datos Pydantic:
- Request/Response schemas
- Validación de parámetros
- Enumeraciones (ShapeType, ExportFormat)

#### 8. `utils/helpers.py`
Funciones auxiliares:
- Generación de IDs únicos
- Clamp de valores
- Normalización de arrays

## Frontend (SvelteKit + Three.js)

### Estructura de Componentes

#### 1. `+page.svelte`
Página principal que orquesta todos los componentes:
- Layout principal
- Header y footer
- Grid responsivo
- Información y tips

#### 2. `ImageUploader.svelte`
Componente de carga de imágenes:
- Drag & drop
- Selector de archivos
- Preview de imagen
- Procesamiento automático al cargar

**Funcionalidades:**
```javascript
handleFile(file)          // Procesa archivo seleccionado
handleDrop(e)            // Maneja drop event
handleFileSelect(e)      // Maneja file input
```

#### 3. `ParameterControls.svelte`
Panel de controles:
- Selector de forma
- Sliders para parámetros
- Configuración avanzada colapsable
- Actualización reactiva del store

**Parámetros:**
- Forma, altura min/max
- Grosor, suavizado, resolución
- Curvatura (condicional)
- Altura de torre (condicional)
- Contraste, brillo, blur, sharpen (avanzado)
- Invertir heightmap (avanzado)

#### 4. `ThreeViewer.svelte`
Visualizador 3D interactivo:
- Inicialización de Three.js
- Rendering loop
- Controles de cámara (rotate, zoom)
- Display de estadísticas

**Setup Three.js:**
```javascript
initThree()              // Configura scene, camera, renderer
createExampleMesh()      // Crea geometría de ejemplo
animate()                // Loop de renderizado
handleResize()           // Maneja cambio de tamaño
onMouseDown/onWheel()    // Controles de cámara
```

#### 5. `ActionButtons.svelte`
Botones de acción principales:
- Generar litofanía (workflow completo)
- Exportar STL
- Exportar 3MF
- Feedback visual (loading, progress)

**Workflow de generación:**
1. Validar que hay imagen cargada
2. Generar heightmap (API call)
3. Generar mesh (API call)
4. Actualizar stores
5. Mostrar feedback

### Stores (Estado Global)

#### `appStore.js`
Estado reactivo centralizado usando Svelte stores:

```javascript
imageState          // file, imageId, width, height, preview
heightmapState      // heightmapId, minValue, maxValue
meshState           // meshId, vertexCount, faceCount, volume
processingParams    // Todos los parámetros ajustables
loadingState        // isLoading, message, progress
exportState         // downloadUrl, fileSize
```

### Servicios

#### `apiService.js`
Cliente HTTP para comunicación con backend:
- `processImage()` - Upload y procesar imagen
- `generateHeightmap()` - Crear heightmap
- `generateMesh()` - Crear malla 3D
- `exportMesh()` - Exportar archivo
- `getDownloadUrl()` - Construir URL de descarga
- `healthCheck()` - Verificar backend

## Flujo de Datos

### 1. Carga de Imagen
```
Usuario → ImageUploader → File
                        ↓
                   FileReader (preview)
                        ↓
                   apiService.processImage()
                        ↓
                   Backend: ImageProcessor
                        ↓
                   Response (image_id)
                        ↓
                   Update imageState
```

### 2. Generación de Litofanía
```
Usuario → ActionButtons.generateLithophane()
                        ↓
          apiService.generateHeightmap(imageId, params)
                        ↓
          Backend: HeightmapGenerator
                        ↓
          Response (heightmap_id)
                        ↓
          apiService.generateMesh(heightmapId, params)
                        ↓
          Backend: MeshGenerator
                        ↓
          Response (mesh_id, stats)
                        ↓
          Update meshState
```

### 3. Exportación
```
Usuario → ActionButtons.exportSTL()
                        ↓
          apiService.exportMesh(meshId, format)
                        ↓
          Backend: ExportService
                        ↓
          File saved to exports/
                        ↓
          Response (download_url)
                        ↓
          window.open(downloadUrl)
```

## Algoritmos Clave

### Generación de Malla Rectangular

1. **Crear vértices superiores:**
   ```python
   for i in range(height):
       for j in range(width):
           vertices.append([j, i, heightmap[i, j]])
   ```

2. **Crear vértices inferiores:**
   ```python
   for i in range(height):
       for j in range(width):
           vertices.append([j, i, -thickness])
   ```

3. **Crear caras superiores (triángulos):**
   ```python
   for i in range(height - 1):
       for j in range(width - 1):
           v0, v1, v2, v3 = calcular_indices()
           faces.append([v0, v2, v1])
           faces.append([v1, v2, v3])
   ```

4. **Crear caras laterales (paredes):**
   - Lado izquierdo, derecho, superior, inferior

5. **Construir malla:**
   ```python
   mesh = trimesh.Trimesh(vertices=vertices, faces=faces)
   ```

### Generación de Cilindro

1. **Calcular radio:** `radius = width / (2 * pi)`
2. **Para cada punto del heightmap:**
   ```python
   angle = 2 * pi * j / width
   r = radius + heightmap[i, j]
   x = r * cos(angle)
   z = r * sin(angle)
   y = i
   ```
3. **Conectar vértices formando superficie cerrada**

### Suavizado de Heightmap

Usa filtro gaussiano de scipy:
```python
from scipy.ndimage import gaussian_filter
smoothed = gaussian_filter(heightmap, sigma=smoothing)
```

## Optimizaciones

### Backend
- Cache de imágenes procesadas en memoria
- Cache de heightmaps generados
- Cache de mallas generadas
- Uso de NumPy para operaciones vectorizadas

### Frontend
- Svelte stores reactivos (no re-renders innecesarios)
- Three.js con requestAnimationFrame
- Lazy loading de configuración avanzada
- Debouncing implícito en sliders

## Seguridad

### CORS
Configurado para permitir todos los orígenes en desarrollo:
```python
allow_origins=["*"]
```
⚠️ En producción, especificar dominios permitidos.

### Validación
- Pydantic valida todos los inputs del backend
- Límites en rangos de parámetros
- Validación de tipos de archivo en frontend

### Sanitización
- Generación de IDs únicos con hash MD5
- No se ejecutan comandos del sistema con input del usuario

## Testing

### Backend
```bash
pytest tests/
```

### Frontend
```bash
npm run test
```

## Performance

### Métricas Esperadas
- Procesamiento de imagen: < 1s
- Generación de heightmap: < 500ms
- Generación de malla (res 200): 2-5s
- Exportación STL: < 1s

### Bottlenecks
- Generación de malla con alta resolución (>400)
- Smoothing con sigma alto (>3)
- Imágenes muy grandes (>4000x4000)

## Extensibilidad

### Agregar Nueva Forma

1. **Backend:**
   ```python
   # models/schemas.py
   class ShapeType(str, Enum):
       MI_FORMA = "mi_forma"
   
   # services/mesh_generator.py
   def _generate_mi_forma(self, heightmap, thickness):
       # Implementación
       pass
   ```

2. **Frontend:**
   ```javascript
   // ParameterControls.svelte
   const shapes = [
       // ...
       { value: 'mi_forma', label: 'Mi Forma' }
   ];
   ```

### Agregar Nuevo Filtro

1. **Backend:**
   ```python
   # services/image_processor.py
   def apply_mi_filtro(self, img_array, param):
       # Implementación
       return filtered_array
   ```

2. **Agregar a schemas y endpoint**

3. **Frontend:**
   ```javascript
   // appStore.js - agregar parámetro
   // ParameterControls.svelte - agregar slider
   ```

## Debugging

### Backend
```python
# Agregar logs
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
logger.debug("Debug info")
```

### Frontend
```javascript
// En cualquier componente
console.log($imageState);
console.log($processingParams);
```

### API
Usar la documentación interactiva:
http://localhost:8000/docs

## Deployment

### Backend (Producción)
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

O con Gunicorn:
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Frontend (Producción)
```bash
npm run build
npm run preview
```

O servir con un servidor web (nginx, apache).

## Referencias

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [SvelteKit Docs](https://kit.svelte.dev/)
- [Three.js Docs](https://threejs.org/docs/)
- [trimesh Docs](https://trimesh.org/)
- [Pillow Docs](https://pillow.readthedocs.io/)
