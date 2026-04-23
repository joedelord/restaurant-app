"""
admin.py

Admin-only API views for managing users.
"""

from django.contrib.auth import get_user_model

from rest_framework import generics

from api.permissions import IsAdmin
from api.serializers import AdminUserSerializer

User = get_user_model()


class AdminUserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all().order_by("last_name", "first_name", "email")
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdmin]


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdmin]