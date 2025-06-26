from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from tasks.models import Board, Task
from tasks.serializers import BoardSerializer, TaskSerializer

class BoardListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        boards = Board.objects(owner_id=request.user.id)
        serializer = BoardSerializer(boards, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        data["owner_id"] = request.user.id
        serializer = BoardSerializer(data=data)
        if serializer.is_valid():
            board = serializer.save()
            return Response(BoardSerializer(board).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        tasks = Task.objects(owner_id=request.user.id)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        data["owner_id"] = request.user.id
        serializer = TaskSerializer(data=data)
        if serializer.is_valid():
            task = serializer.save()
            return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
