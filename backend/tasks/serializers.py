from rest_framework import serializers
from tasks.models import Task, Board


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
    board_id = serializers.CharField()
    owner_id = serializers.IntegerField()

    def create(self, validated_data):
        task = Task(**validated_data)
        task.save()
        return task

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
