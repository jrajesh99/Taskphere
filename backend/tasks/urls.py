from django.urls import path
from tasks.views import BoardListCreateAPIView, TaskListCreateAPIView, TaskDetailAPIView

urlpatterns = [
    path('boards/', BoardListCreateAPIView.as_view(), name='board-list-create'),
    path('tasks/', TaskListCreateAPIView.as_view(), name='task-list-create'),
    path("tasks/<str:pk>/", TaskDetailAPIView.as_view()),
]
