import csv
import io
from typing import List

from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

import crud
import models
import schemas
import tasks
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    """
    Dependency function that provides a database session to endpoints.
    Ensures the session is closed after the request is completed.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/csvfile/", response_model=List[schemas.CSVFile])
async def get_all_files(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all CSV files from the database, with optional pagination.

    Args:
        skip (int): Number of records to skip (default: 0).
        limit (int): Maximum number of records to return (default: 100).
        db (Session): Database session provided by dependency injection.

    Returns:
        List[models.CSVFile]: List of CSV files.
    """
    csv_files = await crud.get_csv_files(db, skip=skip, limit=limit)
    return csv_files


@app.post("/csvfile/", response_model=schemas.CSVFile)
async def create_csv_file(
    file_name: str,
    file: UploadFile = File(description="CSV file"),
    db: Session = Depends(get_db),
):
    """
    Upload and create a new CSV file record in the database.
    The CSV content is read and stored as JSON.

    Args:
        file_name (str): Name of the uploaded file.
        file (UploadFile): The CSV file being uploaded.
        db (Session): Database session provided by dependency injection.

    Returns:
        models.CSVFile: The created CSV file record.
    """
    file_content = await file.read()

    csv_reader = csv.DictReader(io.StringIO(file_content.decode("utf-8")))

    file_content_json = list(csv_reader)

    return await crud.create_csv_file(
        db=db, file_name=file_name, file_content_json=file_content_json
    )


@app.get("/csvfile/{file_id}")
async def get_csv_file(file_id: int, db: Session = Depends(get_db)):
    """
    Retrieve the CSV file by its ID from the database.

    Args:
        file_id (int): ID of the CSV file to retrieve.
        db (Session): Database session provided by dependency injection.

    Returns:
        JSONResponse: The content of the CSV file in JSON format.

    Raises:
        HTTPException: If the file is not found.
    """
    csv_file = await crud.get_csv_file_by_id(db=db, file_id=file_id)

    if not csv_file:
        raise HTTPException(status_code=404, detail="File not found")

    data = csv_file.file_content_json

    return JSONResponse(content=data)


@app.post("/csvfile/{file_id}/join/")
async def join_json(
    file_id: int,
    api_address: str,
    new_file_name: str,
    column1: str,
    column2: str,
    db: Session = Depends(get_db),
):
    """
    Trigger a Celery task to join the content of the CSV file with JSON data
    from a remote API based on matching columns.

    Args:
        file_id (int): ID of the CSV file to join.
        api_address (str): The address of the API providing the JSON data.
        new_file_name (str): The name of the new file after the join operation.
        column1 (str): Column in the CSV file to use for the join.
        column2 (str): Column in the JSON data to use for the join.
        db (Session): Database session provided by dependency injection.

    Returns:
        dict: The task ID of the triggered Celery task.

    Raises:
        HTTPException: If there is an error triggering the task.
    """
    try:
        task = tasks.join_json_task.delay(
            file_id, api_address, new_file_name, column1, column2
        )
        return {"task_id": task.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error triggering task: {e}")


@app.get("/task-status/{task_id}")
async def get_task_status(task_id: str):
    """
    Retrieve the status of a Celery background task.

    Args:
        task_id (str): The ID of the task to check.

    Returns:
        dict: The status of the task (Pending, Completed, Failed, etc.).
    """
    task_result = tasks.join_json_task.AsyncResult(task_id)

    if task_result.state == "PENDING":
        return {"task_id": task_id, "status": "Pending"}
    elif task_result.state == "SUCCESS":
        return {"task_id": task_id, "status": "Completed"}
    elif task_result.state == "FAILURE":
        return {"task_id": task_id, "status": "Failed", "error": str(task_result.info)}
    else:
        return {"task_id": task_id, "status": task_result.state}
