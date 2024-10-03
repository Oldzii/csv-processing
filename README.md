# FastAPI Application with Celery, Redis, and PostgreSQL

This project is a FastAPI web application that utilizes Celery for background tasks, Redis as a message broker, and PostgreSQL for data storage. ReactJS was used for frontend side.

## Features

- Upload and manage CSV files.
- Background processing of tasks using Celery.
- Integration with Redis for task management.
- Persistent data storage with PostgreSQL.

## How to run
**To run all the services**

```
docker compose up --build
```

## Usage

### API Endpoints

#### CSV File Management

- **Get all CSV files**: `GET /csvfile/`  
  Retrieve a list of all uploaded CSV files.

- **Upload a new CSV file**: `POST /csvfile/`  
  Upload a CSV file to the server. Requires `file_name` and the actual file as form-data.

- **Get CSV file by ID**: `GET /csvfile/{file_id}`  
  Retrieve a specific CSV file by its ID.

- **Join JSON with CSV data**: `POST /csvfile/{file_id}/join/`  
  Join data from an external API with the CSV file data.

  #### Celery Task Management

- **Check task status**: `GET /task-status/{task_id}`  
  Retrieve the status of a Celery task by its ID.


