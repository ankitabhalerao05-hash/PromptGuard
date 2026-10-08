#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if [ -d "$ROOT_DIR/.venv" ]; then
  if [ -x "$ROOT_DIR/.venv/bin/python" ]; then
    PYTHON_BIN="$ROOT_DIR/.venv/bin/python"
  elif [ -x "$ROOT_DIR/.venv/Scripts/python.exe" ]; then
    PYTHON_BIN="$ROOT_DIR/.venv/Scripts/python.exe"
  else
    PYTHON_BIN="python3"
  fi
else
  PYTHON_BIN="python3"
fi

if [ ! -d "$ROOT_DIR/frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  cd "$ROOT_DIR/frontend"
  npm install --no-fund --no-audit
  cd "$ROOT_DIR"
fi

if [ "$PYTHON_BIN" = "python3" ] || [ ! -d "$ROOT_DIR/.venv" ]; then
  echo "Ensuring Python dependencies are installed..."
  python3 -m pip install --upgrade pip >/dev/null 2>&1 || true
  python3 -m pip install -r "$ROOT_DIR/requirements.txt" >/dev/null 2>&1 || true
fi

if [ -d "$ROOT_DIR/.venv" ] && [ ! -f "$ROOT_DIR/.venv/pyvenv.cfg" ]; then
  python3 -m venv "$ROOT_DIR/.venv"
fi

if [ -d "$ROOT_DIR/.venv" ]; then
  if [ -x "$ROOT_DIR/.venv/bin/python" ]; then
    PYTHON_BIN="$ROOT_DIR/.venv/bin/python"
  elif [ -x "$ROOT_DIR/.venv/Scripts/python.exe" ]; then
    PYTHON_BIN="$ROOT_DIR/.venv/Scripts/python.exe"
  fi
  "$PYTHON_BIN" -m pip install --upgrade pip >/dev/null 2>&1 || true
  "$PYTHON_BIN" -m pip install -r "$ROOT_DIR/requirements.txt" >/dev/null 2>&1 || true
fi

echo "=========================================================="
echo " PromptGuard AI – Agentic Prompt Injection Firewall"
echo " ET AI Hackathon – Agentic Edition"
echo " Targets: D2 & F3 (9/9 Attack Categories Supported)"
echo "=========================================================="
echo ""

# Ensure samples are generated
"$PYTHON_BIN" backend/data/sample_files_generator.py > /dev/null 2>&1 || true

echo "Starting PromptGuard AI Perimeter Firewall on http://localhost:8000 ..."
echo "API Docs available at: http://localhost:8000/docs"
echo "SOC Dashboard available at: http://localhost:8000"
echo ""

"$PYTHON_BIN" -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
