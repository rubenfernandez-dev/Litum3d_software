# Guía de Instalación Rápida - Litum3D

## Windows

### 1. Instalar Backend

```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Instalar Frontend

```cmd
cd frontend
npm install
```

### 3. Ejecutar

**Terminal 1 - Backend:**
```cmd
cd backend
venv\Scripts\activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```cmd
cd frontend
npm run dev
```

### 4. Acceder

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Documentación: http://localhost:8000/docs

---

## Linux/Mac

### 1. Instalar Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Instalar Frontend

```bash
cd frontend
npm install
```

### 3. Ejecutar

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Acceder

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Documentación: http://localhost:8000/docs

---

## Verificación

Una vez todo esté corriendo:

1. Abre http://localhost:5173 en tu navegador
2. Arrastra una imagen al área de carga
3. Ajusta los parámetros
4. Haz clic en "Generar Litofanía"
5. Exporta como STL o 3MF

¡Listo! 🎉
