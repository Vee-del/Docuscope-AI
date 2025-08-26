from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from db_orm import get_db
from utils.nlp import analyze_document
from services.analysis import save_analysis, get_history
from services.predict import classify_text  # reuses your Day 3 sklearn model

from fastapi import UploadFile, File
import docx2txt
import fitz  # PyMuPDF for PDF reading

router = APIRouter(tags=["analysis"])

class AnalyzeIn(BaseModel):
    text: str

class AnalyzeOut(BaseModel):
    id: int
    summary: str | None
    categories: str | None
    sentiment: str | None
    key_phrases: str | None

@router.post("/upload", response_model=AnalyzeOut)
async def analyze_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # 1️⃣ Read file contents
    contents = await file.read()
    text = ""

    # 2️⃣ Detect file type & extract text
    if file.filename.endswith(".txt"):
        text = contents.decode("utf-8", errors="ignore")
    elif file.filename.endswith(".docx"):
        with open("temp.docx", "wb") as f:
            f.write(contents)
        text = docx2txt.process("temp.docx")
    elif file.filename.endswith(".pdf"):
        with open("temp.pdf", "wb") as f:
            f.write(contents)
        doc = fitz.open("temp.pdf")
        for page in doc:
            text += page.get_text()
        doc.close()
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    text = text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="No readable text in file")

    summary, categories, sentiment, key_phrases = analyze_document(text, classify_text)
    rec = save_analysis(
        db,
        document_text=text,
        summary=summary,
        categories=categories,
        sentiment=sentiment,
        key_phrases=key_phrases,
    )

    return AnalyzeOut(
        id=rec.id,
        summary=rec.summary,
        categories=rec.categories,
        sentiment=rec.sentiment,
        key_phrases=rec.key_phrases,
    )

@router.get("/history")
def analysis_history(db: Session = Depends(get_db)):
    rows = get_history(db, limit=100)
    return [
        {
            "id": r.id,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "categories": r.categories,
            "sentiment": r.sentiment,
            "summary": (r.summary[:180] + "…") if r.summary and len(r.summary) > 180 else r.summary,
            "key_phrases": r.key_phrases,
        }
        for r in rows
    ]
