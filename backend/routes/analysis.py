from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel

from db_orm import get_db
from utils.nlp import analyze_document
from services.analysis import get_history
from services.predict import classify_text  # reuses your Day 3 sklearn model

import docx2txt
import fitz  # PyMuPDF for PDF reading
import tempfile
import os

router = APIRouter(tags=["analysis"])


# -----------------------------
# Pydantic Models
# -----------------------------
class AnalyzeIn(BaseModel):
    text: str


class AnalyzeOut(BaseModel):
    summary: str | None
    categories: str | None
    sentiment: str | None
    key_phrases: str | None


# -----------------------------
# Document Upload + Analysis
# -----------------------------
@router.post("/analyze-doc/")
async def analyze_doc(file: UploadFile = File(...)):
    try:
        # Save uploaded file temporarily
        suffix = os.path.splitext(file.filename)[1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # Extract text
        text = ""
        if suffix == ".docx":
            text = docx2txt.process(tmp_path)
        elif suffix == ".txt":
            with open(tmp_path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
        elif suffix == ".pdf":
            text = ""
            with fitz.open(tmp_path) as pdf:
                for page in pdf:
                    text += page.get_text("text")
        else:
            return {"error": f"Unsupported file type: {suffix}"}

        # Cleanup temp file
        os.remove(tmp_path)

        # If file was empty
        if not text.strip():
            return {"error": "No text could be extracted from the document."}

        # Run NLP analysis
        summary, categories, sentiment, key_phrases = analyze_document(
            text, classify_text
        )

        return {
            "summary": summary,
            "categories": categories,
            "sentiment": sentiment,
            "key_phrases": key_phrases,
        }

    except Exception as e:
        return {"error": str(e)}


# -----------------------------
# History Endpoint
# -----------------------------
@router.get("/history")
def analysis_history(db: Session = Depends(get_db)):
    rows = get_history(db, limit=100)
    return [
        {
            "id": r.id,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "categories": r.categories,
            "sentiment": r.sentiment,
            "summary": (
                (r.summary[:180] + "…")
                if r.summary and len(r.summary) > 180
                else r.summary
            ),
            "key_phrases": r.key_phrases,
        }
        for r in rows
    ]
