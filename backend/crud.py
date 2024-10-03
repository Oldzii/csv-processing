from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

import models


async def create_csv_file(db: Session, file_name: str, file_content_json):
    """
    Create a new CSV file record in the database.

    Args:
        db (Session): The SQLAlchemy database session.
        file_name (str): The name of the CSV file.
        file_content_json (list): The content of the CSV file in JSON format.

    Raises:
        HTTPException: If a file with the given name already exists.

    Returns:
        models.CSVFile: The created CSV file record.
    """
    db_csv_file = models.CSVFile(
        file_name=file_name, file_content_json=file_content_json
    )

    try:
        db.add(db_csv_file)
        db.commit()
        db.refresh(db_csv_file)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="File with this name already exists"
        )
    return db_csv_file


async def get_csv_files(db: Session, skip: int = 0, limit: int = 100):
    """
    Retrieve a list of CSV files from the database with pagination support.

    Args:
        db (Session): The SQLAlchemy database session.
        skip (int): The number of records to skip (default: 0).
        limit (int): The maximum number of records to return (default: 100).

    Returns:
        List[models.CSVFile]: A list of CSV file records.
    """
    return db.query(models.CSVFile).offset(skip).limit(limit).all()


async def get_csv_file_by_id(db: Session, file_id: int):
    """
    Retrieve a CSV file from the database by its ID.

    Args:
        db (Session): The SQLAlchemy database session.
        file_id (int): The ID of the CSV file to retrieve.

    Returns:
        models.CSVFile: The CSV file record, or None if not found.
    """
    return db.query(models.CSVFile).filter(models.CSVFile.id == file_id).first()
