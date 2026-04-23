"""
menu.py

Menu and category API views for public access and admin management.
"""

from rest_framework import generics
from rest_framework.permissions import AllowAny

from api.models import Category, MenuItem
from api.permissions import IsAdmin
from api.serializers import (
    CategorySerializer,
    MenuItemSerializer,
    AdminMenuItemSerializer,
)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all().order_by("display_order", "name_en")
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class AdminCategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all().order_by("display_order", "name_en")
    serializer_class = CategorySerializer
    permission_classes = [IsAdmin]


class AdminCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdmin]


class MenuItemListView(generics.ListAPIView):
    queryset = (
        MenuItem.objects.filter(is_available=True)
        .select_related("category")
        .order_by("category__display_order", "name_en")
    )
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]


class AdminMenuItemListCreateView(generics.ListCreateAPIView):
    queryset = MenuItem.objects.select_related("category").all().order_by(
        "category__display_order", "category__name_en", "name_en"
    )
    serializer_class = AdminMenuItemSerializer
    permission_classes = [IsAdmin]


class AdminMenuItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = AdminMenuItemSerializer
    permission_classes = [IsAdmin]