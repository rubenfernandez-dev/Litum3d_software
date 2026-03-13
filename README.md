<div align="center">

<img src="https://img.shields.io/badge/Litum3D-v1.0.0-6366f1?style=for-the-badge" alt="Litum3D" />

# Litum3D — 3D Lithophane Generator

**Transform your photos into stunning 3D-printed art pieces that come alive when backlit.**
A full-stack web application powered by Python, FastAPI, SvelteKit, and Three.js.

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.128-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Svelte](https://img.shields.io/badge/SvelteKit-5-FF3E00?style=flat-square&logo=svelte&logoColor=white)](https://kit.svelte.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r171-black?style=flat-square&logo=threedotjs&logoColor=white)](https://threejs.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## What is a Lithophane?

A **lithophane** is a 3D-printed piece with varying wall thickness that creates a photographic image when backlit. Thinner areas let more light pass through (bright zones), while thicker areas block the light (dark zones), producing stunning depth and detail from an ordinary photo.

---

## ✨ Features

### 🖼️ Image Processing
| Feature | Details |
|---|---|
| Grayscale conversion | Automatic with luminosity weighting |
| Contrast / Brightness | Adjustable 0.1x–3.0x |
| Blur / Sharpen | Gaussian blur + unsharp mask |
| Auto-Enhance | One-click CLAHE + histogram equalization |
| Invert heightmap | Swap light/dark for negative effect |

### 🔷 3D Shape Library
- **Flat Rectangular** — classic wall piece
- **Flat Circular** — round medallion
- **Arc** — curved panel
- **Cylinder** — wrap-around lamp shade
- **Partial Sphere** — bowl shape
- **Heart** — gift & romantic pieces
- **Polygonal Towers**: Triangle · Square · Pentagon · Hexagon · Octagon

### 🎨 Advanced Shape Controls
- **Torsion** — progressive twist from base to top (0°–180°)
- **Progressive Scale** — taper or flare the cylinder along its height
- **Scale Curve Editor** — custom control points for non-linear scaling
- **Interpolation modes** — linear or smooth curve

### 🖼️ Multi-Image 360° Collage ✨
Upload multiple photos and have them automatically distributed around a cylindrical lithophane. Seamless edge blending produces smooth transitions between photos — perfect for lamp shades showcasing several images when rotating.

### 💡 Preview Enhancements
- **Lamp mode** — simulate internal backlighting with warm / neutral / cool color temperature
- **Auto-rotate** — continuous rotation preview
- **Adjustable light intensity**

### 🖥️ Interactive 3D Viewer (Three.js)
- Real-time geometry preview
- Mouse drag to orbit · Scroll wheel to zoom
- Live update on parameter changes
- Texture mapping from uploaded image
- Shadow mapping with ambient + directional + point lights

### 💾 Export
- Export to **STL** (universal slicer format)
- Export to **3MF** (richer metadata for modern slicers)
- Automatic mesh optimization and repair via trimesh

---

## 🏗️ Architecture

```
litum3d_software/
├── backend/
│   ├── main.py                        # FastAPI app entry point
│   ├── requirements.txt
│   ├── routes/
│   │   └── api.py                     # All REST endpoints
│   ├── services/
│   │   ├── image_processor.py         # OpenCV / Pillow pipeline
│   │   ├── heightmap_generator.py     # Grayscale → height values
│   │   ├── mesh_generator.py          # Height values → 3D mesh
│   │   └── export_service.py          # STL / 3MF writer
│   ├── image_processing/
│   │   ├── auto_enhance.py            # CLAHE auto-enhancement
│   │   ├── filters.py                 # Image filter helpers
│   │   └── multi_projection.py        # Multi-image 360° collage ✨
│   ├── models/
│   │   └── schemas.py                 # Pydantic request/response models
│   └── utils/
│       └── helpers.py
│
└── frontend/
    └── src/
        ├── routes/
        │   └── +page.svelte           # Main page
        └── lib/
            ├── components/
            │   ├── ImageUploader.svelte
            │   ├── MultiImageUploader.svelte    # ✨ New
            │   ├── ImageEditor.svelte
            │   ├── ParameterControls.svelte
            │   ├── AdvancedShapeControls.svelte
            │   ├── Lithophane360Controls.svelte
            │   ├── ScaleCurveEditor.svelte
            │   ├── PreviewEnhancements.svelte
            │   ├── ThreeViewer.svelte
            │   └── ActionButtons.svelte
            ├── services/
            │   └── apiService.js              # Axios API client
            └── stores/
                └── appStore.js                # Svelte global state stores
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 18+**
- **npm**

### 1 — Clone

```bash
git clone https://github.com/your-username/litum3d.git
cd litum3d_software
```

### 2 — Backend

```bash
# Create and activate virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate
# Linux / macOS
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Start the server
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Backend available at → **http://localhost:8000**
Interactive API docs → **http://localhost:8000/docs**

### 3 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend available at → **http://localhost:5173**

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/process-image` | Upload and process an image |
| `POST` | `/api/apply-filters` | Apply manual adjustments |
| `POST` | `/api/auto-enhance` | Auto-enhance image quality |
| `POST` | `/api/generate-heightmap` | Convert image to heightmap |
| `POST` | `/api/generate-mesh` | Generate 3D mesh from heightmap |
| `POST` | `/api/export` | Export mesh to STL or 3MF |
| `GET`  | `/api/download/{file}` | Download exported file |
| `POST` | `/api/multi-image-projection` | 360° multi-image collage ✨ |
| `GET`  | `/api/health` | Health check |

<details>
<summary><b>POST /api/process-image</b></summary>

```http
POST /api/process-image
Content-Type: multipart/form-data

file: <image>
```
```json
{ "success": true, "image_id": "img_abc123", "width": 800, "height": 600 }
```
</details>

<details>
<summary><b>POST /api/generate-mesh</b></summary>

```json
{
  "heightmap_id": "hmap_def456",
  "shape_type": "cylinder",
  "thickness": 2.0,
  "smoothing": 0,
  "resolution": 200
}
```
```json
{
  "success": true,
  "mesh_id": "mesh_ghi789",
  "vertex_count": 40000,
  "face_count": 80000,
  "volume": 1234.56
}
```
</details>

<details>
<summary><b>POST /api/multi-image-projection ✨</b></summary>

```http
POST /api/multi-image-projection
Content-Type: multipart/form-data

images: <file1>, <file2>, <file3>
params: {"target_height": 512, "blend_width": 20}
```
```json
{
  "success": true,
  "heightmap_id": "hmap_multi_xyz",
  "preview_base64": "data:image/png;base64,...",
  "metadata": { "num_images": 3, "segments": [...] }
}
```
</details>

---

## 🎯 Workflow

```
1. Upload Image(s)   →  drag & drop a photo (or multiple for 360° mode)
2. Edit & Enhance    →  adjust contrast, brightness, or use Auto-Enhance
3. Choose Shape      →  plane, cylinder, tower, heart…
4. Set Parameters    →  height range, base thickness, resolution
5. Advanced          →  torsion, progressive scale, scale curve editor
6. Preview           →  interactive 3D viewer with lamp simulation
7. Generate          →  click "Generate Lithophane"
8. Export            →  download STL or 3MF → slice → print
```

---

## 🖨️ Printing Tips

**Material:** White or natural PLA / PETG (translucent gives best light diffusion)

| Setting | Recommended Value |
|---|---|
| Layer height | 0.10 – 0.15 mm |
| Perimeters/walls | 2–3 |
| Infill | 100% |
| Print speed | 30–50 mm/s |
| Supports | Not needed for flat/vertical pieces |

> Print vertically (standing up) for maximum surface detail.
> Backlight with a white LED strip or bulb for the best effect.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | SvelteKit 5 + Vite |
| 3D rendering | Three.js |
| Styling | TailwindCSS 3 |
| HTTP client | Axios |
| State management | Svelte writable stores |
| Backend framework | FastAPI |
| Image processing | Pillow, OpenCV |
| Numerical computing | NumPy, SciPy |
| 3D mesh generation | trimesh |
| Data validation | Pydantic v2 |
| ASGI server | Uvicorn |

---

## 🐛 Troubleshooting

<details>
<summary>Backend won't start — ModuleNotFoundError</summary>

Make sure the virtual environment is active and run from the project root:
```bash
.venv\Scripts\activate         # Windows
python -m uvicorn backend.main:app --reload --port 8000
```
</details>

<details>
<summary>Frontend shows ERR_CONNECTION_REFUSED</summary>

Start the dev server:
```bash
cd frontend && npm run dev
```
The port is typically `5173` or `5174` depending on what is available.
</details>

<details>
<summary>3MF export fails</summary>

Some trimesh builds have limited 3MF support. Use STL as a reliable alternative.
</details>

---

## 🤝 Contributing

1. Fork the project
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with SvelteKit · Three.js · FastAPI · Python

**If you find this useful, give it a ⭐ on GitHub!**

</div>
