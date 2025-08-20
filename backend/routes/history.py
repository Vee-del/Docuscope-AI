from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db_orm import get_db
from services.history import get_history

history_router = APIRouter()

@history_router.get("/", tags=["history"])
def history(db: Session = Depends(get_db)):
    rows = get_history(db, limit=100)
    return [
        {
            "id": r.id,
            "label": r.label,
            "created_at": r.created_at.isoformat(),
            "input_text": (r.input_text[:160] + "…") if len(r.input_text) > 160 else r.input_text,
        }
        for r in rows
    ]
