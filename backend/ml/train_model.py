from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
import joblib
from pathlib import Path

# Minimal seed dataset — expand later
data = [
    ("This policy focuses on housing and urban planning", "housing"),
    ("Cybersecurity threats affect global safety", "cybersecurity"),
    ("AI in healthcare improves diagnosis", "healthcare"),
    ("New urban housing development laws inaugurated", "housing"),
    ("Ransomware attacks are increasing globally", "cybersecurity"),
    ("Hospitals adopt AI triage tools", "healthcare"),
]

texts, labels = zip(*data)

model = make_pipeline(TfidfVectorizer(), MultinomialNB())
model.fit(texts, labels)

out_dir = Path(__file__).resolve().parent
joblib.dump(model, out_dir / "model.pkl")
print("✅ Model trained and saved to ml/model.pkl")
