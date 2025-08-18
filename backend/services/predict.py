from ml.model_loader import load_model

def classify_text(text: str) -> str:
    model = load_model()
    return model.predict([text])[0]
