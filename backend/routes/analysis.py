# backend/routes/analysis.py
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
# from sqlalchemy.orm import Session
import tempfile, os

# from db_orm import get_db
# from services.analysis import get_history

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
    import docx2txt
    DOCX_OK = True
except Exception:
    DOCX_OK = False

try:
    import fitz  # PyMuPDF
    PDF_OK = True
except Exception:
    PDF_OK = False

router = APIRouter(tags=["analysis"])

@router.post("/analyze/")
async def analyze(file: UploadFile = File(...)):
    """
    Receives a file and returns a JSON with a summary, categories, key_phrases.
    Robust to .txt, .docx, .pdf. Falls back to a naive summary if NLP pipeline
    is not wired yet.
    """
    tmp_path = None
    try:
        # save upload
        suffix = os.path.splitext(file.filename or "")[1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # extract text
        if suffix == ".txt":
            with open(tmp_path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
        elif suffix == ".docx":
            if not DOCX_OK:
                raise HTTPException(400, "DOCX support not available. Install 'docx2txt'.")
            text = docx2txt.process(tmp_path)
        elif suffix == ".pdf":
            if not PDF_OK:
                raise HTTPException(400, "PDF support not available. Install 'PyMuPDF'.")
            text = ""
            with fitz.open(tmp_path) as pdf:
                for page in pdf:
                    text += page.get_text("text")
        else:
            raise HTTPException(400, f"Unsupported file type '{suffix}'. Use .txt, .docx or .pdf.")

        if not text.strip():
            raise HTTPException(400, "No readable text found in the uploaded document.")

        # TODO: plug in your real AI summarizer here
        # For now: a simple deterministic payload so the frontend shows results
        result = {
            "filename": file.filename,
            "summary": (text[:600] + "…") if len(text) > 600 else text,
            "categories": ["General"],
            "key_phrases": ["document", "analysis", "summary"]
        }

        # IMPORTANT: no trailing comma here!
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass