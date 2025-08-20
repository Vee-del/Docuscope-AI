from sqlalchemy import Column, Integer, Text, String, DateTime, func
from db_orm import Base

class DocumentAnalysis(Base):
    __tablename__ = "document_analysis"

    id = Column(Integer, primary_key=True, index=True)
    document_text = Column(Text, nullable=False)

    # Analysis fields
    summary = Column(Text, nullable=True)
    categories = Column(String(256), nullable=True)  # e.g. "housing, policy"
    sentiment = Column(String(32), nullable=True)    # e.g. "positive | neutral | negative"
    key_phrases = Column(Text, nullable=True)        # comma-separated phrases

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)