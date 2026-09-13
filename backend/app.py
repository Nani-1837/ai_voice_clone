import os
import uvicorn

# Entry point for Dubzeek AI Backend
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting Dubzeek AI Modular FastAPI Backend Server on port {port}...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)

