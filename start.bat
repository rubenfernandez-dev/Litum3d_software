@echo off
REM Script de inicio para Litum3D (Windows)

echo ============================================
echo       Iniciando Litum3D
echo ============================================
echo.

REM Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no esta instalado
    pause
    exit /b 1
)

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no esta instalado
    pause
    exit /b 1
)

echo [*] Verificando dependencias del backend...
cd backend

REM Verificar entorno virtual
if not exist "venv\" (
    echo [*] Creando entorno virtual...
    python -m venv venv
)

REM Activar entorno virtual
call venv\Scripts\activate.bat

REM Instalar dependencias si es necesario
if not exist "venv\.installed" (
    echo [*] Instalando dependencias del backend...
    pip install -r requirements.txt
    echo. > venv\.installed
)

echo [OK] Backend listo
echo.

REM Iniciar backend en segundo plano
echo [*] Iniciando backend (puerto 8000)...
start /B python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

cd ..\frontend

echo [*] Verificando dependencias del frontend...

REM Instalar dependencias si es necesario
if not exist "node_modules\" (
    echo [*] Instalando dependencias del frontend...
    call npm install
)

echo [OK] Frontend listo
echo.

REM Iniciar frontend
echo [*] Iniciando frontend (puerto 5173)...
echo.
echo ============================================
echo    Litum3D esta funcionando!
echo ============================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Presiona Ctrl+C para detener
echo.

call npm run dev
