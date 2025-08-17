from fastapi import APIRouter, UploadFile
from services.summarizer import summarize_pdf

summarizer_router = APIRouter()

@summarizer_router.post("/")
async def summarize(file: UploadFile):
    result = await summarize_pdf(file)
    return {"summary": result}
