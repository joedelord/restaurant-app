"""
urls.py

Main URL configuration for the restaurant management system.

This file routes incoming HTTP requests to the appropriate application
modules and includes:
- Django admin panel
- JWT authentication endpoints
- DRF browsable API login
- Application API routes

For more information:
https://docs.djangoproject.com/en/6.0/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "api/token/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "api/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
]