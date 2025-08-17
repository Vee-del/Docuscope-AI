import psycopg2
import os
from dotenv import load_dotenv

# Load .env variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

def get_conn():
    return psycopg2.connect(DATABASE_URL)
