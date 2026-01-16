"""
GUÍA RÁPIDA DE USO - EDITOR DE IMAGEN AVANZADO
===============================================

## 1. ACCESO AL EDITOR

En la página principal, después de cargar una imagen en "Cargador de Imagen", 
verás la sección "🖼️ Editor de Imagen (Opcional)" con el botón:
  "📷 Cargar imagen para editar"

Puedes:
- Cargar una imagen directamente aquí (opcional)
- O usar la imagen ya cargada en ImageUploader


## 2. INTERFAZ DEL EDITOR

El editor se divide en 3 tabs:


### TAB 1: AJUSTES
Controles para modificar tonos y propiedades:

- Brillo: -100 (muy oscuro) → 0 (original) → +100 (muy claro)
- Contraste: -100 (gris) → 0 (original) → +100 (máximo contraste)
- Exposición: -2 (muy oscuro) → 0 (original) → +2 (muy claro)
- Gamma: 0.5 (más claro) → 1.0 (original) → 2.5 (más oscuro)
- Nitidez: 0 (sin nitidez) → 1.0 (máximo)
- Suavizado: 0 (sin suavizado) → 1.0 (suavizado fuerte)
- Invertir colores: checkbox para modo negativo

Botón "🔄 Restablecer ajustes" vuelve todo a 0/original.


### TAB 2: RECORTE
Para cortar áreas específicas:

1. Dibuja un rectángulo en la imagen haciendo drag
2. El área seleccionada se marca con línea amarilla
3. Opciones:
   - Modo libre: recorte sin restricciones
   - Mantener proporción: mantiene aspecto original
   - Ajustar al área: fuerza proporción de pantalla

Botón "Limpiar recorte" elimina la selección.


### TAB 3: TRANSFORMAR
Cambios geométricos:

- Rotación: botones 0°, 90°, 180°, 270°
- Zoom: 0.5x (alejar) → 1.0 (normal) → 4.0x (acercar)
  * También funciona con rueda del mouse sobre la previsualización
- Pan X: -1 (izquierda) → 0 (centro) → +1 (derecha)
- Pan Y: -1 (arriba) → 0 (centro) → +1 (abajo)
  * También puedes arrastrar con Shift + click en la previsualización


## 3. PREVISUALIZACIÓN

La previsualización en tiempo real muestra:
- Tu imagen con todos los ajustes aplicados
- Rectángulo amarillo si tienes recorte activo
- Actualiza mientras cambias los sliders


## 4. APLICAR EDICIONES

Cuando estés satisfecho:
1. Haz click en "✓ Aplicar ediciones"
2. El editor se cierra
3. Los ajustes se guardan automáticamente
4. La imagen editada se usará en la generación de litofanía


## 5. DESCARTAR CAMBIOS

Para empezar de cero:
1. Haz click en "✕ Descartar"
2. O abre el editor nuevamente y carga otra imagen


## 6. FLUJO COMPLETO

1. Cargador de Imagen → carga tu foto
2. Editor de Imagen → (opcional) ajusta la imagen:
   - Mejora contraste para más detalle
   - Recorta áreas innecesarias
   - Rota si es necesario
   - Aplica ediciones
3. Controles de Litofanía → ajusta parámetros (altura, forma, etc.)
4. Vista Previa 3D → visualiza el resultado
5. Generar → crea el STL para imprimir


## 7. CASOS DE USO COMUNES

### Foto oscura o con mala iluminación
1. Aumento Exposición +1 o +2
2. Aumento Contraste +30 a +50
3. Reduce Brillo un poco si es necesario

### Foto con mucho ruido
1. Suavizado (Blur) 0.3 a 0.5
2. Reduce Contraste un poco para suavizar transiciones

### Foto muy clara (sobreexpuesta)
1. Reduce Exposición -1 a -2
2. Aumenta Contraste +20 a +40

### Foto de baja calidad
1. Nitidez 0.5 a 1.0
2. Aumento Contraste +30 a +50

### Usar solo parte de la imagen
1. Tab Recorte
2. Dibuja rectángulo sobre área deseada
3. Aplica


## 8. CONSEJOS PROFESIONALES

✓ Imágenes con ALTO CONTRASTE generan litofanías mejor
✓ Retratos funcionan mejor que fondos complejos
✓ Ajusta gamma para controlar tonos medios sin afectar blancos/negros
✓ La nitidez ayuda con detalles finos
✓ Prueba primero en pequeño antes de imprimir grande
✓ Los colores se pierden (es blanco y negro), así que contraste es clave


## 9. TROUBLESHOOTING

**"No veo cambios en la previsualización"**
→ Los cambios se actualizan cuando sueltas el slider. Si usas valores muy pequeños, 
  prueba con valores más grandes.

**"La imagen se ve pixelada después de aplicar ediciones"**
→ Normal en previsualización canvas. El PNG descargado tendrá mejor calidad.

**"Quiero deshacer un cambio"**
→ Mueve el slider de vuelta o usa "Restablecer ajustes" para empezar.

**"¿Puedo usar ambas imágenes (original + editada)?"**
→ Solo se genera con una. Pero puedes cargar ambas por separado 
  y generar dos litofanías si quieres compararlas.


## 10. RENDIMIENTO

- Previsualización: rápida (canvas GPU)
- Sin límite de tamaño de imagen
- Cambios en tiempo real sin lag
- Aplica ediciones: instantáneo
"""
