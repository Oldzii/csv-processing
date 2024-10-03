from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import JSONB

from database import Base


class CSVFile(Base):
    __tablename__ = "csvfile"
    id = Column(Integer, primary_key=True)
    file_name = Column(String, unique=True)
    file_content_json = Column(JSONB)
