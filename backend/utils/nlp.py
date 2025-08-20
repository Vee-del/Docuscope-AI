import re
from collections import Counter

# very light stopword list to keep things simple
_STOP = set("""
the a an of and to in for on with at from as by it is are was were be been
this that these those into over under about against between within without
or not no yes you your our their his her its will would can could should
""".split())

_SENT_POS = {"good","great","excellent","positive","benefit","improve","success","clear","easy"}
_SENT_NEG = {"bad","poor","negative","risk","problem","issue","fail","difficult","hard"}

def simple_summary(text: str, max_sentences: int = 3) -> str:
    # split on . ! ? and keep the first few sentences
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return " ".join(sentences[:max_sentences]).strip()

def simple_sentiment(text: str) -> str:
    words = re.findall(r"[a-zA-Z']+", text.lower())
    pos = sum(1 for w in words if w in _SENT_POS)
    neg = sum(1 for w in words if w in _SENT_NEG)
    if pos > neg: return "positive"
    if neg > pos: return "negative"
    return "neutral"

def extract_key_phrases(text: str, top_k: int = 8) -> list[str]:
    words = [w for w in re.findall(r"[a-zA-Z']+", text.lower()) if w not in _STOP and len(w) > 3]
    freq = Counter(words)
    return [w for w,_ in freq.most_common(top_k)]

def analyze_document(text: str, categorize_fn) -> tuple[str,str,str,str]:
    """
    Returns: summary, categories, sentiment, key_phrases_csv
    categorize_fn: callable that takes text -> label (reuses your sklearn model)
    """
    summary = simple_summary(text)
    sentiment = simple_sentiment(text)
    category = categorize_fn(text)  # reuse your Day 3 model
    key_phrases = ", ".join(extract_key_phrases(text))
    return summary, category, sentiment, key_phrases
