# Changelog - Litum3D

## [1.0.0] - 2026-01-16

### Añadido
- ✨ Sistema completo de generación de litofanías 3D
- 🖼️ Procesamiento de imágenes con Pillow y OpenCV
- 📐 Soporte para 11 formas diferentes:
  - Plano rectangular
  - Plano circular
  - Arco
  - Cilindro
  - Esfera parcial
  - Corazón
  - Torres poligonales (triángulo, cuadrado, pentágono, hexágono, octágono)
- 🎨 Interfaz web moderna con SvelteKit
- 🎛️ Controles completos de parámetros
- 👁️ Vista previa 3D interactiva con Three.js
- 💾 Exportación a STL y 3MF
- 📚 Documentación completa
- 🔧 API REST con FastAPI
- ⚡ Procesamiento optimizado con NumPy
- 🛠️ Reparación automática de mallas
- 📊 Estadísticas de malla (vértices, caras, volumen)

### Características de Procesamiento
- Ajuste de contraste (0.1-3.0)
- Ajuste de brillo (0.1-3.0)
- Desenfoque gaussiano (0-20)
- Nitidez (0.0-2.0)
- Suavizado de heightmap (0-5)
- Resolución ajustable (50-500)
- Inversión de heightmap
- Curvatura configurable para formas curvas
- Altura de torre ajustable para formas extruidas

### Documentación
- README.md principal
- Guía de instalación (INSTALL.md)
- Documentación técnica (TECHNICAL_DOCS.md)
- Ejemplos de uso (EXAMPLES.md)
- Licencia MIT

### Próximas Características Planeadas
- [ ] Soporte para más formatos de imagen (TIFF, BMP)
- [ ] Previsualización en tiempo real de la malla
- [ ] Optimización de malla avanzada
- [ ] Soporte para imágenes en color (separación por capas)
- [ ] Batch processing desde UI
- [ ] Guardado de presets
- [ ] Historial de proyectos
- [ ] Sistema de usuario/autenticación
- [ ] API key para acceso programático
- [ ] WebGL viewer mejorado
- [ ] Soporte para formas personalizadas
- [ ] Editor de heightmap manual
- [ ] Simulación de iluminación
