import mongoengine as me
from mongoengine import ReferenceField, ListField

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
    board_id = me.StringField(required=True)
    owner_id = me.IntField(required=True)
    assignees = me.ListField(me.IntField())  # List of Django User IDs
    created_at = me.DateTimeField(auto_now_add=True)

    meta = {'collection': 'tasks'}
