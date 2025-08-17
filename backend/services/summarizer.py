import fitz  # PyMuPDF
from transformers import pipeline
import pytesseract

# Configure Windows path to Tesseract OCR (make sure it's installed)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Load summarization pipeline
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

async def summarize_pdf(file):
    # Read file
    pdf_bytes = await file.read()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    # Extract text from all pages
    text = " ".join([page.get_text() for page in doc])

    # Chunk text to avoid token limits
    chunks = [text[i:i+1000] for i in range(0, len(text), 1000)]

    summarized = ""
    for chunk in chunks:
        res = summarizer(chunk, max_length=130, min_length=30, do_sample=False)
        summarized += res[0]['summary_text'] + "\n"

    return summarized
