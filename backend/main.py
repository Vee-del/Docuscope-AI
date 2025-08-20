from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# existing imports...
from routes.summarizer import summarizer_router
from routes.predict import predict_router
from routes.history import history_router  # optional, can remove later

# NEW:
from routes.analysis import router as analysis_router

# Ensure models are imported so Alembic sees them
from db_orm import Base, engine
from models.prediction import Prediction          # existing
from models.analysis import DocumentAnalysis      # NEW


# --- App Init ---
app = FastAPI(
    title="DocuscopeAI",
    description="AI-powered document intelligence API",
    version="0.5.0"
)

# Allow frontend (adjust origins if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this later for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DB Init (auto-create tables if not exist) ---
Base.metadata.create_all(bind=engine)

# --- Existing routes ---
app.include_router(summarizer_router, prefix="/api/summarize")
app.include_router(predict_router, prefix="/api/predict")
app.include_router(history_router, prefix="/api/history") #legacy
app.include_router(analysis_router, prefix="/api/analyze")

@app.get("/")
def root():
    return {"message": "DocuscopeAI API is running 🚀"}