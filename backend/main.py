from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.summarizer import summarizer_router
# Database + Models
from db_orm import Base, engine
from models.prediction import Prediction  # Ensure models are imported so tables are created

# Routers
from routes.predict import predict_router
from routes.history import history_router

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

# --- Routers ---
app.include_router(predict_router, prefix="/api/predict")
app.include_router(history_router, prefix="/api/history")

@app.get("/")
def root():
    return {"message": "DocuscopeAI API is running 🚀"}