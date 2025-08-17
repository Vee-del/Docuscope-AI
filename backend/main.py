from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.summarizer import summarizer_router
from db import get_conn

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

@app.get("/db-test")
def db_test():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT 1;")
    result = cur.fetchone()
    conn.close()
    return {"db_status": result}