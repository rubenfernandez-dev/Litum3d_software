# Ejemplos de Uso - Litum3D

## Ejemplo 1: Litofanía Plana Simple

### Caso de Uso
Crear una litofanía plana rectangular básica de una foto de retrato.

### Pasos
1. Cargar imagen (ej: retrato.jpg)
2. Configurar parámetros:
   - Forma: Plano Rectangular
   - Altura mínima: 0.8 mm
   - Altura máxima: 3.2 mm
   - Grosor: 2.0 mm
   - Suavizado: 1
   - Resolución: 200
3. Generar litofanía
4. Exportar como STL

### Código API (curl)
```bash
# 1. Procesar imagen
curl -X POST http://localhost:8000/api/process-image \
  -F "file=@retrato.jpg" \
  -F "contrast=1.2" \
  -F "brightness=1.0"

# Respuesta: {"image_id": "img_abc123", ...}

# 2. Generar heightmap
curl -X POST http://localhost:8000/api/generate-heightmap \
  -H "Content-Type: application/json" \
  -d '{
    "image_id": "img_abc123",
    "min_height": 0.8,
    "max_height": 3.2,
    "invert": false
  }'

# Respuesta: {"heightmap_id": "hmap_def456", ...}

# 3. Generar malla
curl -X POST http://localhost:8000/api/generate-mesh \
  -H "Content-Type: application/json" \
  -d '{
    "heightmap_id": "hmap_def456",
    "shape_type": "plane_rect",
    "thickness": 2.0,
    "smoothing": 1,
    "resolution": 200
  }'

# Respuesta: {"mesh_id": "mesh_ghi789", ...}

# 4. Exportar
curl -X POST http://localhost:8000/api/export \
  -H "Content-Type: application/json" \
  -d '{
    "mesh_id": "mesh_ghi789",
    "format": "stl",
    "filename": "retrato_litofania"
  }'

# Respuesta: {"download_url": "/api/download/retrato_litofania.stl", ...}

# 5. Descargar
curl -O http://localhost:8000/api/download/retrato_litofania.stl
```

## Ejemplo 2: Litofanía Curva (Arco)

### Caso de Uso
Crear una litofanía en forma de arco para un marco curvo.

### Configuración
- Forma: Arco
- Altura mínima: 0.6 mm
- Altura máxima: 3.0 mm
- Grosor: 2.5 mm
- Curvatura: 90°
- Suavizado: 2
- Resolución: 250

### Python Script
```python
import requests

API_URL = "http://localhost:8000/api"

# 1. Cargar y procesar imagen
with open('paisaje.jpg', 'rb') as f:
    files = {'file': f}
    params = {
        'contrast': 1.3,
        'brightness': 1.1,
        'blur': 1
    }
    response = requests.post(f"{API_URL}/process-image", files=files, params=params)
    image_data = response.json()
    image_id = image_data['image_id']

# 2. Generar heightmap
heightmap_data = {
    'image_id': image_id,
    'min_height': 0.6,
    'max_height': 3.0,
    'invert': False
}
response = requests.post(f"{API_URL}/generate-heightmap", json=heightmap_data)
heightmap_id = response.json()['heightmap_id']

# 3. Generar malla con arco
mesh_data = {
    'heightmap_id': heightmap_id,
    'shape_type': 'arc',
    'thickness': 2.5,
    'smoothing': 2,
    'resolution': 250,
    'curvature': 90.0
}
response = requests.post(f"{API_URL}/generate-mesh", json=mesh_data)
mesh_id = response.json()['mesh_id']

# 4. Exportar
export_data = {
    'mesh_id': mesh_id,
    'format': 'stl',
    'filename': 'paisaje_arco'
}
response = requests.post(f"{API_URL}/export", json=export_data)
download_url = response.json()['download_url']

print(f"Archivo disponible en: http://localhost:8000{download_url}")
```

## Ejemplo 3: Torre Hexagonal

### Caso de Uso
Crear una lámpara cilíndrica con forma hexagonal.

### Configuración
- Forma: Torre Hexagonal
- Altura mínima: 0.5 mm
- Altura máxima: 2.5 mm
- Grosor: 1.5 mm
- Altura de torre: 100 mm
- Suavizado: 2
- Resolución: 300

### JavaScript (Frontend)
```javascript
import { apiService } from '$lib/services/apiService';

async function createHexagonalLamp(imageFile) {
    try {
        // 1. Procesar imagen
        const imageResult = await apiService.processImage(imageFile, {
            contrast: 1.5,
            brightness: 1.0,
            blur: 2,
            sharpen: 0.5
        });
        
        // 2. Generar heightmap
        const heightmapResult = await apiService.generateHeightmap(
            imageResult.image_id,
            {
                minHeight: 0.5,
                maxHeight: 2.5,
                invert: false
            }
        );
        
        // 3. Generar malla hexagonal
        const meshResult = await apiService.generateMesh(
            heightmapResult.heightmap_id,
            {
                shapeType: 'tower_hexagon',
                thickness: 1.5,
                smoothing: 2,
                resolution: 300,
                towerHeight: 100.0
            }
        );
        
        // 4. Exportar
        const exportResult = await apiService.exportMesh(
            meshResult.mesh_id,
            'stl',
            'lampara_hexagonal'
        );
        
        // 5. Descargar
        const downloadUrl = apiService.getDownloadUrl(exportResult.download_url);
        window.open(downloadUrl, '_blank');
        
        console.log('Lámpara hexagonal creada exitosamente!');
        
    } catch (error) {
        console.error('Error:', error);
    }
}
```

## Ejemplo 4: Litofanía en Forma de Corazón

### Caso de Uso
Regalo personalizado en forma de corazón.

### Configuración
- Forma: Corazón
- Altura mínima: 1.0 mm
- Altura máxima: 4.0 mm
- Grosor: 3.0 mm
- Suavizado: 1
- Resolución: 200
- Contraste alto para mejor definición

### cURL Commands
```bash
# Procesar con alto contraste
curl -X POST http://localhost:8000/api/process-image \
  -F "file=@foto_pareja.jpg" \
  -F "contrast=1.5" \
  -F "brightness=1.0" \
  -F "sharpen=1.0"

# Generar heightmap con mayor rango
curl -X POST http://localhost:8000/api/generate-heightmap \
  -H "Content-Type: application/json" \
  -d '{
    "image_id": "img_xyz",
    "min_height": 1.0,
    "max_height": 4.0,
    "invert": false
  }'

# Generar malla corazón
curl -X POST http://localhost:8000/api/generate-mesh \
  -H "Content-Type: application/json" \
  -d '{
    "heightmap_id": "hmap_xyz",
    "shape_type": "heart",
    "thickness": 3.0,
    "smoothing": 1,
    "resolution": 200
  }'
```

## Ejemplo 5: Cilindro Completo (Lámpara)

### Caso de Uso
Pantalla de lámpara cilíndrica de 360°.

### Configuración
- Forma: Cilindro
- Altura mínima: 0.4 mm
- Altura máxima: 2.0 mm
- Grosor: 1.2 mm
- Suavizado: 3 (más suave para luz uniforme)
- Resolución: 400 (alta para mejor calidad)

### Python Script Completo
```python
#!/usr/bin/env python3
"""
Script para crear una pantalla de lámpara cilíndrica
"""
import requests
import sys

def create_cylindrical_lamp(image_path, output_name):
    API_URL = "http://localhost:8000/api"
    
    print(f"Procesando: {image_path}")
    
    # 1. Procesar imagen
    print("1/4 - Procesando imagen...")
    with open(image_path, 'rb') as f:
        files = {'file': f}
        params = {
            'contrast': 1.2,
            'brightness': 1.0,
            'blur': 1,
            'sharpen': 0.0
        }
        r = requests.post(f"{API_URL}/process-image", files=files, params=params)
        r.raise_for_status()
        image_id = r.json()['image_id']
    
    # 2. Generar heightmap
    print("2/4 - Generando mapa de alturas...")
    heightmap_data = {
        'image_id': image_id,
        'min_height': 0.4,
        'max_height': 2.0,
        'invert': False
    }
    r = requests.post(f"{API_URL}/generate-heightmap", json=heightmap_data)
    r.raise_for_status()
    heightmap_id = r.json()['heightmap_id']
    
    # 3. Generar malla cilíndrica
    print("3/4 - Generando geometría 3D...")
    mesh_data = {
        'heightmap_id': heightmap_id,
        'shape_type': 'cylinder',
        'thickness': 1.2,
        'smoothing': 3,
        'resolution': 400
    }
    r = requests.post(f"{API_URL}/generate-mesh", json=mesh_data)
    r.raise_for_status()
    mesh_result = r.json()
    mesh_id = mesh_result['mesh_id']
    
    print(f"   Vértices: {mesh_result['vertex_count']:,}")
    print(f"   Caras: {mesh_result['face_count']:,}")
    print(f"   Volumen: {mesh_result['volume']:.2f} mm³")
    
    # 4. Exportar
    print("4/4 - Exportando STL...")
    export_data = {
        'mesh_id': mesh_id,
        'format': 'stl',
        'filename': output_name
    }
    r = requests.post(f"{API_URL}/export", json=export_data)
    r.raise_for_status()
    export_result = r.json()
    
    download_url = f"http://localhost:8000{export_result['download_url']}"
    file_size_kb = export_result['file_size'] / 1024
    
    print(f"\n✅ ¡Completado!")
    print(f"   Tamaño: {file_size_kb:.2f} KB")
    print(f"   Descargar: {download_url}")
    
    return download_url

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Uso: python create_lamp.py <imagen.jpg> <nombre_salida>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    output_name = sys.argv[2]
    
    create_cylindrical_lamp(image_path, output_name)
```

Ejecución:
```bash
python create_lamp.py mi_imagen.jpg lampara_personalizada
```

## Ejemplo 6: Batch Processing (Múltiples Imágenes)

### Caso de Uso
Procesar múltiples imágenes con la misma configuración.

### Python Script
```python
import requests
import os
from pathlib import Path

def batch_process_lithophanes(image_folder, output_folder):
    """
    Procesa todas las imágenes en una carpeta
    """
    API_URL = "http://localhost:8000/api"
    
    # Configuración común
    config = {
        'min_height': 0.8,
        'max_height': 3.2,
        'thickness': 2.0,
        'smoothing': 1,
        'resolution': 200,
        'shape_type': 'plane_rect'
    }
    
    # Obtener todas las imágenes
    image_files = list(Path(image_folder).glob('*.jpg')) + \
                  list(Path(image_folder).glob('*.png'))
    
    print(f"Encontradas {len(image_files)} imágenes")
    
    for idx, img_path in enumerate(image_files, 1):
        print(f"\n[{idx}/{len(image_files)}] Procesando: {img_path.name}")
        
        try:
            # 1. Procesar imagen
            with open(img_path, 'rb') as f:
                files = {'file': f}
                r = requests.post(f"{API_URL}/process-image", files=files)
                r.raise_for_status()
                image_id = r.json()['image_id']
            
            # 2. Heightmap
            data = {
                'image_id': image_id,
                'min_height': config['min_height'],
                'max_height': config['max_height'],
                'invert': False
            }
            r = requests.post(f"{API_URL}/generate-heightmap", json=data)
            r.raise_for_status()
            heightmap_id = r.json()['heightmap_id']
            
            # 3. Mesh
            data = {
                'heightmap_id': heightmap_id,
                'shape_type': config['shape_type'],
                'thickness': config['thickness'],
                'smoothing': config['smoothing'],
                'resolution': config['resolution']
            }
            r = requests.post(f"{API_URL}/generate-mesh", json=data)
            r.raise_for_status()
            mesh_id = r.json()['mesh_id']
            
            # 4. Export
            output_name = img_path.stem + "_lithophane"
            data = {
                'mesh_id': mesh_id,
                'format': 'stl',
                'filename': output_name
            }
            r = requests.post(f"{API_URL}/export", json=data)
            r.raise_for_status()
            
            print(f"   ✅ Completado: {output_name}.stl")
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
            continue

if __name__ == "__main__":
    batch_process_lithophanes("./imagenes", "./output")
```

## Ejemplo 7: Configuración Avanzada

### Caso de Uso
Imagen de baja calidad que necesita procesamiento intensivo.

### Configuración
```javascript
const advancedConfig = {
    // Procesamiento de imagen
    contrast: 1.8,        // Alto contraste
    brightness: 1.2,      // Más brillante
    blur: 0,             // Sin blur
    sharpen: 1.5,        // Alta nitidez
    
    // Heightmap
    minHeight: 0.6,
    maxHeight: 3.5,
    invert: false,
    
    // Malla
    shapeType: 'plane_rect',
    thickness: 2.5,
    smoothing: 2,        // Suavizado medio
    resolution: 350      // Alta resolución
};
```

## Tips de Optimización

### Para Imágenes Grandes
- Usar resolución más baja (150-200)
- Aplicar blur moderado para reducir detalle
- Incrementar smoothing

### Para Impresoras Lentas
- Reducir resolución a 100-150
- Grosor mínimo de 2mm
- Suavizado alto (3-5)

### Para Mejor Detalle
- Resolución 300-500
- Sin smoothing (0)
- Sharpen moderado (0.5-1.0)
- Grosor fino (1.5-2.0mm)

## Troubleshooting Común

### Malla muy pesada
```python
# Reducir resolución
'resolution': 100  # En lugar de 400
```

### Resultado muy oscuro
```python
# Invertir heightmap o ajustar brillo
'invert': True,
'brightness': 1.5
```

### Detalles perdidos
```python
# Incrementar contraste y sharpen
'contrast': 2.0,
'sharpen': 1.5,
'smoothing': 0
```

## Integración con Otros Sistemas

### Integrar con Telegram Bot
```python
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters

async def handle_image(update: Update, context):
    # Descargar imagen
    file = await update.message.photo[-1].get_file()
    await file.download_to_drive('temp.jpg')
    
    # Procesar con Litum3D
    url = create_cylindrical_lamp('temp.jpg', 'telegram_litho')
    
    # Enviar resultado
    await update.message.reply_text(f"Tu litofanía: {url}")
```

### Integrar con Discord Bot
```python
import discord

@bot.command()
async def litho(ctx, shape='plane_rect'):
    if ctx.message.attachments:
        await ctx.message.attachments[0].save('temp.jpg')
        url = create_lithophane('temp.jpg', 'discord_litho', shape)
        await ctx.send(f"Litofanía generada: {url}")
```

---

¿Necesitas más ejemplos? Consulta la documentación de la API en `/docs`
