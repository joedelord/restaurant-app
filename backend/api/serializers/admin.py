"""
admin.py

Admin-focused serializers for managing users and menu items in the
restaurant management system.
"""

from django.contrib.auth import get_user_model

from rest_framework import serializers

from api.models import MenuItem

User = get_user_model()


class AdminMenuItemSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()

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
            "category_name",
            "is_available",
        ]

    def get_category_name(self, obj):
        return f"{obj.category.name_en} / {obj.category.name_fi}"


class AdminUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "password",
            "first_name",
            "last_name",
            "phone_number",
            "role",
            "marketing_consent",
            "is_active",
        ]
        read_only_fields = ["id"]

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance