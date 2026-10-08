import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.api.routes import router

app = FastAPI(
    title="PromptGuard AI - Prompt Injection Firewall",
    description="Agentic Cybersecurity Perimeter Firewall defending AI agents against Direct & Indirect Prompt Injections",
    version="1.0.0"
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

# Serve sample files
sample_data_dir = os.path.join(os.path.dirname(__file__), "data")
if os.path.exists(sample_data_dir):
    app.mount("/static/samples", StaticFiles(directory=sample_data_dir), name="samples")

@app.get("/api/health")
async def health_check():
    return {
        "status": "active",
        "system": "PromptGuard AI Firewall",
        "mode": "SOC Perimeter Defense",
        "supported_attacks": 9,
        "targets": ["D2 (High Reliability)", "F3 (7+ Categories Supported)"]
    }

# Production frontend SPA serving
dist_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(dist_dir, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
