from pydantic import BaseModel, JsonValue
from sqlalchemy import LargeBinary


class CSVFileBase(BaseModel):
    file_name: str


class CSVFileCreate(CSVFileBase):
    file_content_json: JsonValue


class CSVFile(CSVFileBase):
    id: int

    class Config:
        orm_mode = True
