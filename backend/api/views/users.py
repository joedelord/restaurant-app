"""
users.py

User profile and account management API views.
"""

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.utils.translation import gettext_lazy as _

from api.serializers import UserProfileSerializer, ChangePasswordSerializer


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        validated_data: dict = serializer.validated_data  # type: ignore
        new_password = validated_data["new_password"]

        user = request.user
        user.set_password(new_password)
        user.save()

        return Response(
            {"detail": _("Password changed successfully.")},
            status=status.HTTP_200_OK,
        )