from sqlalchemy.orm import Session
from models.prediction import Prediction

def get_history(db: Session, limit: int = 50):
    return (
        db.query(Prediction)
          .order_by(Prediction.created_at.desc())
          .limit(limit)
          .all()
    )
