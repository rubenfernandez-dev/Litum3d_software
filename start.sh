#!/bin/bash

# Script de inicio para Litum3D (Linux/Mac)

echo "============================================"
echo "      Iniciando Litum3D"
echo "============================================"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 no está instalado${NC}"
    exit 1
fi

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Verificando dependencias del backend...${NC}"
cd backend

# Verificar si existe el entorno virtual
if [ ! -d "venv" ]; then
    echo -e "${BLUE}Creando entorno virtual...${NC}"
    python3 -m venv venv
fi

# Activar entorno virtual
source venv/bin/activate

# Instalar dependencias si es necesario
if [ ! -f "venv/.installed" ]; then
    echo -e "${BLUE}Instalando dependencias del backend...${NC}"
    pip install -r requirements.txt
    touch venv/.installed
fi

echo -e "${GREEN}✅ Backend listo${NC}"
echo ""

# Iniciar backend en segundo plano
echo -e "${BLUE}🚀 Iniciando backend (puerto 8000)...${NC}"
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd ../frontend

echo -e "${BLUE}📦 Verificando dependencias del frontend...${NC}"

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Instalando dependencias del frontend...${NC}"
    npm install
fi

echo -e "${GREEN}✅ Frontend listo${NC}"
echo ""

# Iniciar frontend
echo -e "${BLUE}🚀 Iniciando frontend (puerto 5173)...${NC}"
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   Litum3D está funcionando!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "Frontend: ${BLUE}http://localhost:5173${NC}"
echo -e "Backend:  ${BLUE}http://localhost:8000${NC}"
echo -e "API Docs: ${BLUE}http://localhost:8000/docs${NC}"
echo ""
echo -e "Presiona ${RED}Ctrl+C${NC} para detener ambos servidores"
echo ""

npm run dev

# Cuando se detiene el frontend, también detener el backend
kill $BACKEND_PID
