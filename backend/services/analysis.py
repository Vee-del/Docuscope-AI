from sqlalchemy.orm import Session
from models.analysis import DocumentAnalysis

def save_analysis(
    db: Session, *, document_text: str, summary: str, categories: str, sentiment: str, key_phrases: str
) -> DocumentAnalysis:
    rec = DocumentAnalysis(
        document_text=document_text,
        summary=summary,
        categories=categories,
        sentiment=sentiment,
        key_phrases=key_phrases,
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec

def get_history(db: Session, limit: int = 100) -> list[DocumentAnalysis]:
    return (
        db.query(DocumentAnalysis)
        .order_by(DocumentAnalysis.created_at.desc())
        .limit(limit)
        .all()
    )
