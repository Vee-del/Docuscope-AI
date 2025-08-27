from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
import docx2txt
import tempfile

from db_orm import get_db
from utils.nlp import analyze_document
from services.analysis import save_analysis
from services.predict import classify_text

router = APIRouter(tags=["upload-analysis"])

@router.post("/analyze-doc/")
async def analyze_doc(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        # Save file temporarily
        suffix = file.filename.split(".")[-1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{suffix}") as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name

        # Extract text depending on file type
        text = ""
        if suffix in ["docx", "doc"]:
            text = docx2txt.process(tmp_path)
        elif suffix == "txt":
            text = contents.decode("utf-8", errors="ignore")
        elif suffix == "pdf":
            # TODO: use PyPDF2 or pdfplumber for PDF extraction
            text = "PDF extraction not yet implemented"
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        if not text.strip():
            raise HTTPException(status_code=400, detail="No readable text in document")

        # Run analysis
        summary, categories, sentiment, key_phrases = analyze_document(text, classify_text)

        rec = save_analysis(
            db,
            document_text=text,
            summary=summary,
            categories=categories,
            sentiment=sentiment,
            key_phrases=key_phrases,
        )

        return {
            "message": "Document analyzed successfully",
            "summary": rec.summary,
            "categories": rec.categories,
            "sentiment": rec.sentiment,
            "key_phrases": rec.key_phrases,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
