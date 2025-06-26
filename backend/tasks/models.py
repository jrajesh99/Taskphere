import mongoengine as me

class Board(me.Document):
    title = me.StringField(required=True)
    description = me.StringField()
    owner_id = me.IntField(required=True)
    created_at = me.DateTimeField(auto_now_add=True)

    meta = {'collection': 'boards'}

class Task(me.Document):
    title = me.StringField(required=True)
    description = me.StringField()
    status = me.StringField(choices=["todo", "in-progress", "done"], default="todo")
    board_id = me.StringField(required=True)
    owner_id = me.IntField(required=True)
    created_at = me.DateTimeField(auto_now_add=True)

    meta = {'collection': 'tasks'}
