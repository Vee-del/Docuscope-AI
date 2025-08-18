from pathlib import Path
import joblib
from functools import lru_cache

@lru_cache(maxsize=1)
def load_model():
    model_path = Path(__file__).resolve().parent / "model.pkl"
    if not model_path.exists():
        raise FileNotFoundError("Model not found. Train it via ml/train_model.py")
    return joblib.load(model_path)
