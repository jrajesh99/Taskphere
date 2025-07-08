from rest_framework import serializers
from tasks.models import Task, Board, Comment
from accounts.models import User
from accounts.serializers import UserSerializer

class BoardSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    title = serializers.CharField()
    description = serializers.CharField(allow_blank=True, required=False)
    owner_id = serializers.IntegerField()

    def create(self, validated_data):
        board = Board(**validated_data)
        board.save()
        return board


class TaskSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    title = serializers.CharField()
    description = serializers.CharField(allow_blank=True, required=False)
    status = serializers.ChoiceField(choices=["todo", "in-progress", "done"], default="todo")
    priority = serializers.ChoiceField(choices=["Low", "Medium", "High"], default="Medium")
    due_date = serializers.DateTimeField()
    labels = serializers.ListField(child=serializers.CharField(), required=False, allow_empty=True)
    label_colors = serializers.DictField(child=serializers.CharField(), required=False, allow_null=True, default=dict)
    board_id = serializers.CharField()
    owner_id = serializers.IntegerField()
    assignees = serializers.ListField(child=serializers.IntegerField(), required=False)

    def create(self, validated_data):
        print("Creating task with data:", validated_data)
        # Pop out the assignees list
        assignee_ids = validated_data.pop("assignees", [])
        task = Task(**validated_data)
        task.assignees = assignee_ids
        task.save()
        return task

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class CommentSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    task_id = serializers.CharField()
    author = serializers.CharField()
    content = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        return Comment(**validated_data).save()

    def to_representation(self, instance):
        return {
            "id": str(instance.id),
            "task_id": instance.task_id,
            "author": instance.author,
            "content": instance.content,
            "created_at": instance.created_at,
        }
