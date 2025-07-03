from rest_framework import serializers
from tasks.models import Task, Board
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
    labels = serializers.ListField(child=serializers.CharField(), required=False)
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
