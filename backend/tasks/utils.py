# tasks/utils.py
from .models import ActivityLog
from datetime import datetime

def log_activity(task, user_id, action, message=""):
    ActivityLog(
        task=task,
        user_id=str(user_id),
        action=action,
        message=message,
        created_at=datetime.utcnow()
    ).save()
