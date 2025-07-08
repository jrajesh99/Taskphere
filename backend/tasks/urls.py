from django.urls import path
from tasks.views import *

urlpatterns = [
    path('boards/', BoardListCreateAPIView.as_view(), name='board-list-create'),
    path('tasks/', TaskListCreateAPIView.as_view(), name='task-list-create'),
    path("tasks/<str:pk>/", TaskDetailAPIView.as_view()),
    path('tasks/<str:id>/', TaskDetailUpdateView.as_view(), name='task-detail'),
    path('tasks/<str:task_id>/comments/', TaskCommentsView.as_view(), name='task-comments'),

]
