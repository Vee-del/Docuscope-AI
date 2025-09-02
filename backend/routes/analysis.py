# backend/routes/analysis.py
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import tempfile, os

from db_orm import get_db
from services.analysis import get_history

# Try to import your NLP + classifier pipeline
try:
    from utils.nlp import analyze_document
    from services.predict import classify_text
    PIPELINE_OK = True
except Exception:
    PIPELINE_OK = False

# Optional DOCX support
try:
    import docx2txt
    DOCX_OK = True
except Exception:
    DOCX_OK = False

# Optional PDF support
try:
    import fitz  # PyMuPDF
    PDF_OK = True
except Exception:
    PDF_OK = False

router = APIRouter(tags=["analysis"])


# -----------------------------
# Document Upload + Analysis
# -----------------------------
@router.post("/analyze-doc/")
async def analyze_document(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        text = contents.decode("utf-8", errors="ignore")

        # Dummy analysis (replace with AI/ML later)
        result = {
            "filename": file.filename,
            "summary": text[:200] if text else "No content",
            "categories": ["general"],
            "sentiment": "neutral",
            "key_phrases": ["example", "phrases"]
        }

        return JSONResponse(content=result)  # ✅ always JSON
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))