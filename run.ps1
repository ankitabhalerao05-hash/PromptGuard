$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $RootDir

$Python = if (Test-Path (Join-Path $RootDir ".venv\Scripts\python.exe")) {
    Join-Path $RootDir ".venv\Scripts\python.exe"
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    (Get-Command python).Source
} else {
    "python"
}

if (-not (Test-Path (Join-Path $RootDir "frontend\node_modules"))) {
    Write-Host "Installing frontend dependencies..."
    Set-Location (Join-Path $RootDir "frontend")
    & npm install --no-fund --no-audit
    Set-Location $RootDir
}

if (-not (Test-Path (Join-Path $RootDir ".venv\pyvenv.cfg"))) {
    Write-Host "Creating local Python virtual environment..."
    & python -m venv .venv
    $Python = Join-Path $RootDir ".venv\Scripts\python.exe"
}

if (Test-Path (Join-Path $RootDir ".venv\Scripts\python.exe")) {
    $Python = Join-Path $RootDir ".venv\Scripts\python.exe"
}

& $Python -m pip install --upgrade pip | Out-Null
& $Python -m pip install -r (Join-Path $RootDir "requirements.txt") | Out-Null

Write-Host "=========================================================="
Write-Host " PromptGuard AI – Agentic Prompt Injection Firewall"
Write-Host " ET AI Hackathon – Agentic Edition"
Write-Host " Targets: D2 & F3 (9/9 Attack Categories Supported)"
Write-Host "=========================================================="
Write-Host ""

& $Python backend/data/sample_files_generator.py *>$null

Write-Host "Starting PromptGuard AI Perimeter Firewall on http://localhost:8000 ..."
Write-Host "API Docs available at: http://localhost:8000/docs"
Write-Host "SOC Dashboard available at: http://localhost:8000"
Write-Host ""

& $Python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
