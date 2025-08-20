from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from services.predict import classify_text, save_prediction
from db_orm import get_db

predict_router = APIRouter()

class PredictIn(BaseModel):
    text: str

@predict_router.post("/", tags=["predict"])
def predict(payload: PredictIn, db: Session = Depends(get_db)):
    text = (payload.text or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")
    label = classify_text(text)
    save_prediction(db, text, label)
    return {"prediction": label}