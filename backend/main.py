from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.summarizer import summarizer_router

app = FastAPI(title="DocuScope AI")

# Enable CORS (so frontend can call backend APIs later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(summarizer_router, prefix="/api/summarize")

@app.get("/")
def read_root():
    return {"message": "DocuScope AI backend running"}
