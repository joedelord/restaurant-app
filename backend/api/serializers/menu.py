"""
menu.py

Serializers for menu categories and menu items.
"""

from rest_framework import serializers

from api.models import Category, MenuItem


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name_en",
            "name_fi",
            "description_en",
            "description_fi",
            "display_order",
        ]


class MenuItemSerializer(serializers.ModelSerializer):
    category_name_en = serializers.CharField(source="category.name_en", read_only=True)
    category_name_fi = serializers.CharField(source="category.name_fi", read_only=True)

    class Meta:
        model = MenuItem
        fields = [
            "id",
            "name_en",
            "name_fi",
            "description_en",
            "description_fi",
            "price",
            "image_url",
            "category",
            "category_name_en",
            "category_name_fi",
            "is_available",
        ]