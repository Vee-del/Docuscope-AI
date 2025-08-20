from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from db_orm import get_db
from utils.nlp import analyze_document
from services.analysis import save_analysis, get_history
from services.predict import classify_text  # reuses your Day 3 sklearn model

router = APIRouter(tags=["analysis"])

class AnalyzeIn(BaseModel):
    text: str

class AnalyzeOut(BaseModel):
    id: int
    summary: str | None
    categories: str | None
    sentiment: str | None
    key_phrases: str | None

@router.post("/", response_model=AnalyzeOut)
def analyze(payload: AnalyzeIn, db: Session = Depends(get_db)):
    t = (payload.text or "").strip()
    if not t:
        raise HTTPException(status_code=400, detail="Text is required")

    summary, categories, sentiment, key_phrases = analyze_document(t, classify_text)
    rec = save_analysis(
        db,
        document_text=t,
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
