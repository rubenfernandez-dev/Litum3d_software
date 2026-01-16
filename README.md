# Litum3D - Generador de Litofanías 3D

![Litum3D](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-green.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)

## 🌟 Descripción

**Litum3D** es una aplicación web completa para generar litofanías 3D a partir de imágenes 2D. Convierte tus fotos en impresionantes piezas que revelan la imagen cuando se iluminan desde atrás.

### ¿Qué es una litofanía?

Una litofanía es una impresión 3D con variaciones de grosor que crea una imagen cuando se ilumina desde atrás. Las zonas más finas permiten pasar más luz, mientras que las más gruesas la bloquean, creando gradientes y detalles asombrosos.

## ✨ Características

### Procesamiento de Imagen
- ✅ Conversión a escala de grises
- ✅ Ajuste de contraste, brillo, desenfoque y nitidez
- ✅ Normalización de valores
- ✅ Filtros avanzados con OpenCV

### Generación de Geometría 3D
Soporte para múltiples formas:
- 📐 **Plano rectangular**
- ⭕ **Plano circular**
- 🌙 **Arco**
- 🥫 **Cilindro**
- 🌍 **Esfera parcial**
- ❤️ **Corazón**
- 🗼 **Torres poligonales**:
  - Triangular (3 lados)
  - Cuadrada (4 lados)
  - Pentagonal (5 lados)
  - Hexagonal (6 lados)
  - Octagonal (8 lados)

### Parámetros Configurables
- 📏 Altura mínima y máxima
- 🔨 Grosor de base
- 🌊 Nivel de suavizado
- 📊 Resolución de malla
- 📐 Curvatura (para formas curvas)
- 🏗️ Altura de torre (para formas extruidas)

### Exportación
- 💾 Exportación a **STL**
- 💾 Exportación a **3MF**
- 🔧 Optimización de malla
- 🛠️ Reparación automática

### Interfaz de Usuario
- 🎨 Diseño moderno con TailwindCSS
- 🖼️ Carga de imágenes con drag & drop
- 🎛️ Controles intuitivos con sliders
- 👁️ Vista previa 3D interactiva con Three.js
- 📱 Diseño responsive

## 🏗️ Arquitectura del Proyecto

```
litum3d_software/
│
├── backend/                    # Backend Python + FastAPI
│   ├── main.py                # Aplicación principal
│   ├── requirements.txt       # Dependencias Python
│   ├── run.bat               # Script de ejecución
│   ├── routes/               # Endpoints de la API
│   │   ├── __init__.py
│   │   └── api.py            # Rutas REST
│   ├── services/             # Lógica de negocio
│   │   ├── __init__.py
│   │   ├── image_processor.py      # Procesamiento de imágenes
│   │   ├── heightmap_generator.py  # Generación de heightmaps
│   │   ├── mesh_generator.py       # Generación de mallas 3D
│   │   └── export_service.py       # Exportación STL/3MF
│   ├── models/               # Modelos de datos
│   │   ├── __init__.py
│   │   └── schemas.py        # Esquemas Pydantic
│   └── utils/                # Utilidades
│       ├── __init__.py
│       └── helpers.py        # Funciones auxiliares
│
├── frontend/                  # Frontend SvelteKit
│   ├── package.json          # Dependencias Node.js
│   ├── svelte.config.js      # Configuración Svelte
│   ├── vite.config.js        # Configuración Vite
│   ├── tailwind.config.js    # Configuración Tailwind
│   ├── postcss.config.js     # Configuración PostCSS
│   └── src/
│       ├── app.html          # Template HTML
│       ├── app.css           # Estilos globales
│       ├── routes/           # Páginas
│       │   └── +page.svelte  # Página principal
│       └── lib/
│           ├── components/   # Componentes Svelte
│           │   ├── ImageUploader.svelte
│           │   ├── ParameterControls.svelte
│           │   ├── ThreeViewer.svelte
│           │   └── ActionButtons.svelte
│           ├── services/     # Servicios API
│           │   └── apiService.js
│           └── stores/       # Estado global
│               └── appStore.js
│
├── shared/                    # Recursos compartidos
│   └── docs/                 # Documentación adicional
│
└── README.md                 # Este archivo
```

## 🚀 Instalación

### Requisitos Previos

- **Python 3.8+**
- **Node.js 18+**
- **npm o yarn**
- **Git** (opcional)

### 1. Clonar o Descargar el Proyecto

```bash
git clone https://github.com/tuusuario/litum3d.git
cd litum3d_software
```

### 2. Configurar el Backend

```bash
# Ir al directorio del backend
cd backend

# Crear entorno virtual (recomendado)
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### 3. Configurar el Frontend

```bash
# Ir al directorio del frontend
cd ../frontend

# Instalar dependencias
npm install
```

## ▶️ Ejecución

### Opción 1: Ejecución Manual

#### Backend
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

O usar el script:
```bash
cd backend
run.bat
```

El backend estará disponible en: `http://localhost:8000`
- Documentación API: `http://localhost:8000/docs`
- API alternativa: `http://localhost:8000/redoc`

#### Frontend
```bash
cd frontend
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

### Opción 2: Ejecución con Scripts

**Windows:**
```bash
# Backend
cd backend
run.bat

# Frontend (en otra terminal)
cd frontend
npm run dev
```

## 📡 API Endpoints

### Procesamiento de Imagen
```http
POST /api/process-image
Content-Type: multipart/form-data

Parámetros:
- file: archivo de imagen
- contrast: float (0.1-3.0)
- brightness: float (0.1-3.0)
- blur: int (0-20)
- sharpen: float (0.0-2.0)

Respuesta:
{
  "success": true,
  "message": "Imagen procesada correctamente",
  "image_id": "img_abc123",
  "width": 800,
  "height": 600
}
```

### Generar Heightmap
```http
POST /api/generate-heightmap
Content-Type: application/json

Body:
{
  "image_id": "img_abc123",
  "min_height": 0.8,
  "max_height": 3.2,
  "invert": false
}

Respuesta:
{
  "success": true,
  "message": "Mapa de alturas generado correctamente",
  "heightmap_id": "hmap_def456",
  "min_value": 0.8,
  "max_value": 3.2
}
```

### Generar Malla 3D
```http
POST /api/generate-mesh
Content-Type: application/json

Body:
{
  "heightmap_id": "hmap_def456",
  "shape_type": "plane_rect",
  "thickness": 2.0,
  "smoothing": 0,
  "resolution": 200,
  "curvature": 0.0,
  "tower_height": 50.0,
  "tower_sides": 4
}

Respuesta:
{
  "success": true,
  "message": "Malla 3D generada correctamente",
  "mesh_id": "mesh_ghi789",
  "vertex_count": 40000,
  "face_count": 80000,
  "volume": 1234.56
}
```

### Exportar Malla
```http
POST /api/export
Content-Type: application/json

Body:
{
  "mesh_id": "mesh_ghi789",
  "format": "stl",
  "filename": "mi_litofania"
}

Respuesta:
{
  "success": true,
  "message": "Malla exportada correctamente",
  "download_url": "/api/download/mi_litofania.stl",
  "file_size": 2048576
}
```

### Descargar Archivo
```http
GET /api/download/{filename}

Respuesta: Archivo binario (STL o 3MF)
```

## 🎯 Uso de la Aplicación

### Paso 1: Cargar Imagen
1. Arrastra una imagen al área de carga o haz clic para seleccionar
2. Formatos soportados: PNG, JPG, GIF
3. La imagen se procesará automáticamente

### Paso 2: Configurar Parámetros
1. **Forma**: Elige entre plano, arco, cilindro, torre, etc.
2. **Alturas**: Define altura mínima y máxima (recomendado: 0.8-3.2 mm)
3. **Grosor**: Ajusta el grosor base (recomendado: 2.0 mm)
4. **Suavizado**: Aplica suavizado para reducir detalles
5. **Resolución**: Mayor resolución = más detalle (50-500)

**Configuración Avanzada:**
- Contraste
- Brillo
- Desenfoque
- Nitidez
- Invertir mapa de alturas

### Paso 3: Vista Previa 3D
- La vista 3D muestra un preview de la geometría
- **Arrastrar**: Rotar vista
- **Rueda del mouse**: Zoom

### Paso 4: Generar
1. Haz clic en "🚀 Generar Litofanía"
2. Espera a que se procese (puede tardar según resolución)
3. Verás las estadísticas de la malla generada

### Paso 5: Exportar
1. Elige formato: **STL** o **3MF**
2. Haz clic en el botón de exportación
3. El archivo se descargará automáticamente

## 🖨️ Impresión 3D

### Configuración Recomendada

**Material:**
- PLA blanco o translúcido
- PETG blanco (mayor translucidez)

**Configuración de Laminado:**
- Altura de capa: 0.1-0.2 mm
- Perímetros: 2-3
- Relleno: 100%
- Velocidad: 30-50 mm/s
- Temperatura: Según material
- Soporte: No necesario para planos

**Orientación:**
- Colocar la litofanía de pie (vertical)
- La superficie con relieves hacia afuera

### Consejos
- Imprime SIN relleno (100% perímetros)
- Usa capas finas para mejor detalle
- Calibra bien tu impresora
- Ilumina desde atrás con LED blanco

## 🛠️ Desarrollo

### Agregar Nuevas Formas

1. Edita `backend/models/schemas.py` y agrega el tipo de forma:
```python
class ShapeType(str, Enum):
    # ... formas existentes
    MI_NUEVA_FORMA = "mi_nueva_forma"
```

2. Implementa la generación en `backend/services/mesh_generator.py`:
```python
def _generate_mi_nueva_forma(self, heightmap, thickness):
    # Tu lógica aquí
    pass
```

3. Actualiza el selector en `frontend/src/lib/components/ParameterControls.svelte`

### Agregar Nuevos Filtros

1. Implementa el filtro en `backend/services/image_processor.py`
2. Agrega parámetros en `backend/models/schemas.py`
3. Actualiza la UI en el frontend

## 🐛 Solución de Problemas

### Backend no inicia
```bash
# Verificar que las dependencias estén instaladas
pip list

# Reinstalar dependencias
pip install -r requirements.txt --force-reinstall
```

### Frontend no compila
```bash
# Limpiar node_modules
rm -rf node_modules
npm install

# O con yarn
rm -rf node_modules
yarn install
```

### Error de CORS
- Verifica que el backend esté corriendo en el puerto 8000
- Revisa la configuración de CORS en `backend/main.py`

### Error al exportar 3MF
- El formato 3MF puede no estar soportado en algunas versiones de trimesh
- Usa STL como alternativa

## 📚 Tecnologías Utilizadas

### Backend
- **FastAPI**: Framework web moderno y rápido
- **Pillow**: Procesamiento de imágenes
- **NumPy**: Cálculos numéricos
- **OpenCV**: Filtros avanzados de imagen
- **trimesh**: Generación y manipulación de mallas 3D
- **scipy**: Algoritmos de suavizado

### Frontend
- **SvelteKit**: Framework web reactivo
- **Three.js**: Visualización 3D en el navegador
- **TailwindCSS**: Framework CSS utility-first
- **Axios**: Cliente HTTP

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 👨‍💻 Autor

**Ruben**
- GitHub: [@ruben](https://github.com/ruben)

## 🙏 Agradecimientos

- Comunidad de impresión 3D
- Comunidad de código abierto
- ItsLitho por la inspiración

## 📞 Soporte

Si tienes problemas o preguntas:
- Abre un issue en GitHub
- Consulta la documentación de la API en `/docs`

---

**¡Disfruta creando litofanías increíbles! 🌟**
