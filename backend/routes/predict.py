from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.predict import classify_text

predict_router = APIRouter()

class PredictIn(BaseModel):
    text: str

@predict_router.post("/", tags=["predict"])
def predict(payload: PredictIn):
    text = (payload.text or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")
    label = classify_text(text)
    return {"prediction": label}
