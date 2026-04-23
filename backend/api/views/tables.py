"""
tables.py

Restaurant table API views for public listing and admin management.
"""

from rest_framework import generics
from rest_framework.permissions import AllowAny

from api.models import RestaurantTable
from api.permissions import IsAdmin
from api.serializers import RestaurantTableSerializer


class RestaurantTableListView(generics.ListAPIView):
    queryset = RestaurantTable.objects.filter(is_active=True).order_by("table_number")
    serializer_class = RestaurantTableSerializer
    permission_classes = [AllowAny]


class AdminRestaurantTableListCreateView(generics.ListCreateAPIView):
    queryset = RestaurantTable.objects.all().order_by("table_number")
    serializer_class = RestaurantTableSerializer
    permission_classes = [IsAdmin]


class AdminRestaurantTableDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RestaurantTable.objects.all()
    serializer_class = RestaurantTableSerializer
    permission_classes = [IsAdmin]