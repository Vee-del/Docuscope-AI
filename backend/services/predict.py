from ml.model_loader import load_model
from sqlalchemy.orm import Session
from models.prediction import Prediction

def classify_text(text: str) -> str:
    model = load_model()
    return model.predict([text])[0]

def save_prediction(db: Session, input_text: str, label: str) -> int:
    rec = Prediction(input_text=input_text, label=label)
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec.id
