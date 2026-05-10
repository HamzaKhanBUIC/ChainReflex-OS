#!/bin/bash

# --- ChainReflex OS Setup & Start Script for AMD Cloud ---

echo "===================================================="
echo "  Setting up ChainReflex OS on AMD Cloud"
echo "===================================================="

# Ensure we are in the project root
# (Assuming the script is run from the root)

# 1. Update system and install dependencies
sudo apt-get update
sudo apt-get install -y python3-venv nodejs npm unzip

# 2. Setup Python Virtual Environment
if [ ! -d "venv" ]; then
    echo "[*] Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "[*] Installing Python dependencies..."
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r requirements.txt

# 3. Setup Backend Environment
cd backend
if [ ! -f ".env" ]; then
    echo "[*] Creating default .env for backend..."
    cp .env.example .env
fi
cd ..

# 4. Setup Frontend
cd frontend
echo "[*] Installing Frontend dependencies..."
npm install
echo "[*] Building Frontend..."
npm run build
cd ..

# 5. Start Services
echo "===================================================="
echo "  Starting Services"
echo "===================================================="

# Start Backend on port 8001 (to avoid conflict with vLLM on 8000)
echo "[*] Starting Backend API on port 8001..."
cd backend
export PORT=8001
nohup ../venv/bin/python3 api.py > backend.log 2>&1 &
cd ..

# Start Streamlit Dashboard on port 8501
echo "[*] Starting Streamlit Dashboard on port 8501..."
cd dashboard
nohup ../venv/bin/streamlit run soc_dashboard.py --server.port 8501 --server.address 0.0.0.0 > dashboard.log 2>&1 &
cd ..

# Start Frontend on port 3000
echo "[*] Starting Frontend on port 3000..."
cd frontend
nohup npm run start -- -p 3000 > frontend.log 2>&1 &
cd ..

echo "===================================================="
echo "  All services started in background!"
echo "  Backend: http://localhost:8001"
echo "  Dashboard: http://localhost:8501"
echo "  Frontend: http://localhost:3000"
echo "===================================================="
echo "Check logs in respective directories (backend.log, dashboard.log, frontend.log)"
