from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from accounts.serializers import UserSerializer  # ✅ Make sure this exists

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_list(request):
    User = get_user_model()
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)
