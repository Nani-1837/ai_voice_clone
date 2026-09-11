import os
import uvicorn
from main import app

if __name__ == "__main__":
    # Fetch PORT from environment variable (for Render / cloud host) or default to 8000
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting Dubzeek AI FastAPI Backend Server on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
