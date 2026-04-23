"""
table.py

Serializer for restaurant table data.
"""

from rest_framework import serializers

from api.models import RestaurantTable


class RestaurantTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantTable
        fields = ["id", "table_number", "seats", "is_active"]