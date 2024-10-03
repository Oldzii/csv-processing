import os

import httpx
from celery.app import Celery
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

import models
from database import SessionLocal

redis_url = os.getenv("REDIS_URL", "redis://redis:6379")

app = Celery(__name__, broker=redis_url, backend=redis_url)


def join_jsons(database_json: list, in_memory_json: list, column1: str, column2: str):
    """
    Join two lists of JSON objects based on matching values from specified columns.

    Args:
        database_json (list): JSON list from the database.
        in_memory_json (list): JSON list from an external API or source.
        column1 (str): Column in the database JSON to match.
        column2 (str): Column in the in-memory JSON to match.

    Returns:
        list: A new list of JSON objects where records are joined by matching `column1` and `column2`.
              Unmatched database records are appended at the end.
    """
    joined_data = []
    new_joined_data = []
    for db_record in database_json:
        match_found = False
        for mem_record in in_memory_json:
            if str(db_record.get(column1)) == str(mem_record.get(column2)):
                joined_record = {**db_record, **mem_record}
                new_joined_data.append(joined_record)
                match_found = True
        if not match_found:
            joined_data.append(db_record)
    final_data = new_joined_data + joined_data
    return final_data


@app.task
def join_json_task(
    file_id: int, api_address: str, new_file_name: str, column1: str, column2: str
):
    """
    Celery task to join JSON data from a CSV file with external JSON data from an API.

    Args:
        file_id (int): The ID of the CSV file in the database.
        api_address (str): The API address to fetch JSON data from.
        new_file_name (str): The name for the newly created CSV file.
        column1 (str): Column in the database CSV file's JSON to match on.
        column2 (str): Column in the external API's JSON to match on.

    Raises:
        ValueError: If the CSV file with the given file_id is not found.
        ValueError: If there is an error fetching the external JSON data.
        HTTPException: If a file with the `new_file_name` already exists.

    Returns:
        list: The joined JSON data combining records from the database CSV file and the external API.
    """
    db: Session = SessionLocal()

    csv_file = db.query(models.CSVFile).filter(models.CSVFile.id == file_id).first()

    if not csv_file:
        raise ValueError(f"CSVFile with id {file_id} not found")

    database_json = csv_file.file_content_json

    try:
        response = httpx.get(api_address)
        response.raise_for_status()
        in_mem_json = response.json()
    except Exception as e:
        raise ValueError(f"Failed to fetch JSON from {api_address}: {e}")

    result_new_json = join_jsons(database_json, in_mem_json, column1, column2)

    db_csv_file = models.CSVFile(
        file_name=new_file_name, file_content_json=result_new_json
    )

    try:
        db.add(db_csv_file)
        db.commit()
        db.refresh(db_csv_file)
    except IntegrityError:
        raise HTTPException(
            status_code=400, detail="File with this name already exists"
        )
    return result_new_json
