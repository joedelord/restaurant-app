"""
orders.py

Order API views for listing, creating, updating, deleting, and changing
order status.
"""

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.utils.translation import gettext_lazy as _

from api.models import Order
from api.permissions import IsStaffOrAdmin
from api.serializers import (
    OrderSerializer,
    OrderCreateSerializer,
    OrderUpdateSerializer,
    OrderStatusUpdateSerializer,
)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        base_queryset = (
            Order.objects.select_related("reservation", "table")
            .prefetch_related("items__menu_item")
        )

        if getattr(user, "role", None) in ["staff", "admin"]:
            return base_queryset.order_by("-created_at")

        return base_queryset.filter(reservation__user=user).order_by("-created_at")


class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer
    permission_classes = [IsAuthenticated, IsStaffOrAdmin]


class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsStaffOrAdmin]

    def get_queryset(self):
        return (
            Order.objects.select_related("reservation", "table")
            .prefetch_related("items__menu_item")
            .all()
        )

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return OrderUpdateSerializer
        return OrderSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        locked_statuses = ["served", "paid"]

        if instance.status in locked_statuses:
            return Response(
                {"detail": _("Served or paid orders cannot be deleted.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        self.perform_destroy(instance)
        return Response(
            {"detail": _("Order deleted successfully.")},
            status=status.HTTP_200_OK,
        )


class OrderStatusUpdateView(generics.UpdateAPIView):
    serializer_class = OrderStatusUpdateSerializer
    permission_classes = [IsAuthenticated, IsStaffOrAdmin]
    http_method_names = ["patch"]

    def get_queryset(self):
        return (
            Order.objects.select_related("reservation", "table")
            .prefetch_related("items__menu_item")
            .all()
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        refreshed_instance = (
            Order.objects.select_related("reservation", "table")
            .prefetch_related("items__menu_item")
            .get(pk=instance.pk)
        )

        return Response(OrderSerializer(refreshed_instance).data)