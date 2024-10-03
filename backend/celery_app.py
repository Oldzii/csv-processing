# # app/celery_app.py
import os

from celery.app import Celery

redis_url = os.getenv("REDIS_URL", "redis://redis:6379")

celery_app = Celery(__name__, broker=redis_url, backend=redis_url)
