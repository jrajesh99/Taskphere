from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.generics import RetrieveUpdateAPIView

from tasks.models import Board, Task, Comment, ActivityLog
from tasks.serializers import BoardSerializer, TaskSerializer, CommentSerializer, ActivityLogSerializer
from tasks.utils import log_activity  # ✅ Activity log function


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
        board_id = request.query_params.get('board')
        query = {"owner_id": request.user.id}

        if board_id:
            query["board_id"] = board_id

        tasks = Task.objects(**query)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        data["owner_id"] = request.user.id
        serializer = TaskSerializer(data=data)
        if not serializer.is_valid():
            print(serializer.errors)
        if serializer.is_valid():
            task = serializer.save()

            log_activity(
                task=task,
                user_id=request.user.id,
                action="created",
                message=f"Task '{task.title}' created"
            )

            return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        task_id = request.data.get("id")
        if not task_id:
            return Response({"error": "Task ID required"}, status=400)

        task = Task.objects(id=task_id, owner_id=request.user.id).first()
        if not task:
            return Response({"error": "Task not found"}, status=404)

        old_status = task.status
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            updated_task = serializer.save()

            log_activity(
                task=updated_task,
                user_id=request.user.id,
                action="updated",
                message=f"Task '{updated_task.title}' updated"
            )

            if 'status' in request.data and old_status != request.data['status']:
                log_activity(
                    task=updated_task,
                    user_id=request.user.id,
                    action="status_changed",
                    message=f"Status changed from {old_status} to {request.data['status']}"
                )

            return Response(TaskSerializer(updated_task).data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user_id):
        try:
            return Task.objects.get(id=pk, owner_id=user_id)
        except Task.DoesNotExist:
            return None

    def put(self, request, pk):
        task = self.get_object(pk, request.user.id)
        if not task:
            return Response({'error': 'Task not found'}, status=404)

        data = request.data.copy()
        old_status = task.status
        serializer = TaskSerializer(task, data=data, partial=True)

        if serializer.is_valid():
            updated_task = serializer.save()

            log_activity(
                task=updated_task,
                user_id=request.user.id,
                action="updated",
                message=f"Task '{updated_task.title}' updated"
            )

            if 'status' in data and old_status != data['status']:
                log_activity(
                    task=updated_task,
                    user_id=request.user.id,
                    action="status_changed",
                    message=f"Status changed from {old_status} to {data['status']}"
                )

            return Response(TaskSerializer(updated_task).data)
        return Response(serializer.errors, status=400)

    def patch(self, request, pk):
        try:
            task = Task.objects.get(id=pk)
            old_status = task.status
            new_status = request.data.get('status')

            if new_status:
                task.status = new_status
                task.save()

                log_activity(
                    task=task,
                    user_id=request.user.id,
                    action="status_changed",
                    message=f"Status changed from {old_status} to {new_status}"
                )

            return Response({'message': 'Status updated'}, status=200)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=404)

    def delete(self, request, pk):
        task = self.get_object(pk, request.user.id)
        if not task:
            return Response({'error': 'Task not found'}, status=404)

        log_activity(
            task=task,
            user_id=request.user.id,
            action="deleted",
            message=f"Task '{task.title}' deleted"
        )

        task.delete()
        return Response(status=204)


class TaskDetailUpdateView(RetrieveUpdateAPIView):
    serializer_class = TaskSerializer
    lookup_field = "id"
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.all()


class TaskCommentsView(APIView):
    def get(self, request, task_id):
        comments = Comment.objects(task_id=task_id).order_by('-created_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, task_id):
        data = request.data.copy()
        data['task_id'] = task_id
        serializer = CommentSerializer(data=data)

        if not serializer.is_valid():
            print(serializer.errors, data)

        if serializer.is_valid():
            comment = serializer.save()

            task = Task.objects(id=task_id).first()
            if task:
                log_activity(
                    task=task,
                    user_id=request.user.id,
                    action="commented",
                    message=f"Commented: {comment.content[:30]}..."
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskActivityLogAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, task_id):
        logs = ActivityLog.objects(task=task_id).order_by("-created_at")
        serializer = ActivityLogSerializer(logs, many=True)
        return Response(serializer.data)
