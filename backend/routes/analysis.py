# backend/routes/analysis.py
from fastapi import APIRouter, Depends, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import tempfile, os

from db_orm import get_db
from services.analysis import get_history

# Try to import your NLP + classifier pipeline
try:
    from utils.nlp import analyze_document
    from services.predict import classify_text
    PIPELINE_OK = True
except Exception:
    PIPELINE_OK = False

# Optional DOCX support
try:
    import docx2txt
    DOCX_OK = True
except Exception:
    DOCX_OK = False

# Optional PDF support
try:
    import fitz  # PyMuPDF
    PDF_OK = True
except Exception:
    PDF_OK = False

router = APIRouter(tags=["analysis"])


# -----------------------------
# Document Upload + Analysis
# -----------------------------
@router.post("/analyze-doc/")
async def analyze_doc(file: UploadFile = File(...)):
    """
    Accepts a single uploaded file (.txt, .docx, .pdf).
    Always returns JSON (success OR error).
    """
    tmp_path = None
    try:
        # Save uploaded file to a temp path
        suffix = os.path.splitext(file.filename or "")[1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # Extract text depending on file type
        text = ""
        if suffix == ".txt":
            with open(tmp_path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
        elif suffix == ".docx":
            if not DOCX_OK:
                return JSONResponse(
                    status_code=400,
                    content={"error": "DOCX support not available. Install 'docx2txt'."},
                )
            text = docx2txt.process(tmp_path)
        elif suffix == ".pdf":
            if not PDF_OK:
                return JSONResponse(
                    status_code=400,
                    content={"error": "PDF support not available. Install 'PyMuPDF'."},
                )
            text = ""
            with fitz.open(tmp_path) as pdf:
                for page in pdf:
                    text += page.get_text("text")
        else:
            return JSONResponse(
                status_code=400,
                content={"error": f"Unsupported file type '{suffix}'. Use .txt, .docx, or .pdf."},
            )

        # Remove temp file
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)

        # Empty file check
        if not text.strip():
            return JSONResponse(
                status_code=400,
                content={"error": "No readable text found in the uploaded document."},
            )

        # Run NLP pipeline if available, otherwise fallback
        if PIPELINE_OK:
            try:
                summary, categories, sentiment, key_phrases = analyze_document(
                    text, classify_text
                )
            except Exception:
                summary = text[:600]
                categories = "general"
                sentiment = "neutral"
                key_phrases = ""
        else:
            summary = text[:600]
            categories = "general"
            sentiment = "neutral"
            key_phrases = ""

        return JSONResponse(
            content={
                "filename": file.filename,
                "summary": summary,
                "categories": categories,
                "sentiment": sentiment,
                "key_phrases": key_phrases,
            }
        )

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass


# -----------------------------
# History Endpoint
# -----------------------------
@router.get("/history")
def analysis_history(db: Session = Depends(get_db)):
    rows = get_history(db, limit=100)
    return [
        {
            "id": r.id,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "categories": r.categories,
            "sentiment": r.sentiment,
            "summary": (
                (r.summary[:180] + "…")
                if r.summary and len(r.summary) > 180
                else r.summary
            ),
            "key_phrases": r.key_phrases,
        }
        for r in rows
    ]
