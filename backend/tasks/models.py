import mongoengine as me
from mongoengine import ReferenceField, ListField
from django.contrib.auth import get_user_model
import datetime

class Board(me.Document):
    title = me.StringField(required=True)
    description = me.StringField()
    owner_id = me.IntField(required=True)
    members = me.ListField(me.IntField())  # store list of Django User IDs
    created_at = me.DateTimeField(auto_now_add=True)

    meta = {'collection': 'boards'}

class Task(me.Document):
    title = me.StringField(required=True)
    description = me.StringField()
    status = me.StringField(choices=["todo", "in-progress", "done"], default="todo")
    priority = me.StringField(choices=["Low", "Medium", "High"], default="Medium")
    due_date = me.DateTimeField()
    labels = me.ListField(me.StringField(), default=[])
    label_colors = me.MapField(field=me.StringField())  # {"urgent": "#ff0000", "bug": "#ffa500"}
    board_id = me.StringField(required=True)
    owner_id = me.IntField(required=True)
    assignees = me.ListField(me.IntField())  # List of Django User IDs
    created_at = me.DateTimeField(auto_now_add=True)

    meta = {'collection': 'tasks'}

class Comment(me.Document):
    task_id = me.StringField(required=True)
    author = me.StringField(required=False)
    content = me.StringField(required=True)
    created_at = me.DateTimeField(default=datetime.datetime.now())

    meta = {'collection': 'comments'}

