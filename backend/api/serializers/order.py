"""
order.py

Order-related serializers for reading, creating, updating, and changing
order status.
"""

from decimal import Decimal

from django.db import transaction
from django.utils.translation import gettext_lazy as _

from rest_framework import serializers

from api.models import MenuItem, Order, OrderItem, Reservation, RestaurantTable

from .helpers import ORDER_STAFF_ALLOWED_STATUSES, is_staff_or_admin
from .menu import MenuItemSerializer
from .reservation import ReservationSerializer
from .table import RestaurantTableSerializer


class OrderItemReadSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "menu_item",
            "name_en",
            "name_fi",
            "quantity",
            "price",
        ]


class OrderSerializer(serializers.ModelSerializer):
    reservation = ReservationSerializer(read_only=True)
    table = RestaurantTableSerializer(read_only=True)
    items = OrderItemReadSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "reservation",
            "table",
            "status",
            "total_price",
            "created_at",
            "items",
        ]


class OrderItemCreateSerializer(serializers.Serializer):
    menu_item_id = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.all(),
        source="menu_item",
    )
    quantity = serializers.IntegerField(min_value=1)

    def validate_menu_item(self, value):
        if not value.is_available:
            raise serializers.ValidationError(_("Selected menu item is not available."))
        return value


class OrderCreateSerializer(serializers.ModelSerializer):
    reservation_id = serializers.PrimaryKeyRelatedField(
        queryset=Reservation.objects.select_related("user", "table").all(),
        source="reservation",
        required=False,
        allow_null=True,
    )
    table_id = serializers.PrimaryKeyRelatedField(
        queryset=RestaurantTable.objects.all(),
        source="table",
    )
    items = OrderItemCreateSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "reservation_id",
            "table_id",
            "status",
            "items",
            "total_price",
            "created_at",
        ]
        read_only_fields = ["id", "total_price", "created_at"]

    def validate_table(self, value):
        if not value.is_active:
            raise serializers.ValidationError(_("Selected table is not active."))
        return value

    def validate_status(self, value):
        request = self.context.get("request")
        user = getattr(request, "user", None)

        if not user or not user.is_authenticated or not is_staff_or_admin(user):
            raise serializers.ValidationError(_("You are not allowed to set order status."))

        if value not in ORDER_STAFF_ALLOWED_STATUSES:
            raise serializers.ValidationError(_("Invalid order status."))

        return value

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError(_("Order must contain at least one item."))

        seen_ids = set()
        for item in value:
            menu_item = item["menu_item"]

            if menu_item.id in seen_ids:
                raise serializers.ValidationError(_(
                    "Duplicate menu items are not allowed. Combine quantities into one row."
                ))
            seen_ids.add(menu_item.id)

        return value

    def validate(self, attrs):
        reservation = attrs.get("reservation")
        table = attrs.get("table")
        items = attrs.get("items", [])

        if not table:
            raise serializers.ValidationError(
                {"table_id": _("Table is required.")}
                )
        
        if not items:
            raise serializers.ValidationError(
                {"items": _("Order must contain at least one item.")}
            )

        if not attrs.get("status"):
            attrs["status"] = "pending"

        if reservation:
            if reservation.table_id != table.id:
                raise serializers.ValidationError(
                    {"table_id": _("Selected table does not match the reservation table.")}
                )

            if reservation.status in ["cancelled", "completed"]:
                raise serializers.ValidationError(
                    {"reservation_id": _("Cannot create an order for this reservation.")}
                )

            if Order.objects.filter(reservation=reservation).exists():
                raise serializers.ValidationError(
                    {"reservation_id": _("An order already exists for this reservation.")}
                )

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items")
        total_price = Decimal("0.00")

        order = Order.objects.create(total_price=Decimal("0.00"), **validated_data)

        order_items = []
        for item_data in items_data:
            menu_item = item_data["menu_item"]
            quantity = item_data["quantity"]
            item_price = menu_item.price

            total_price += item_price * quantity

            order_items.append(
                OrderItem(
                    order=order,
                    menu_item=menu_item,
                    name_en=menu_item.name_en,
                    name_fi=menu_item.name_fi,
                    quantity=quantity,
                    price=item_price,
                )
            )

        OrderItem.objects.bulk_create(order_items)

        order.total_price = total_price
        order.save(update_fields=["total_price"])

        return order

    def to_representation(self, instance):
        return OrderSerializer(instance).data


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["status"]

    def validate_status(self, value):
        request = self.context.get("request")
        user = getattr(request, "user", None)

        if not user or not user.is_authenticated or not is_staff_or_admin(user):
            raise serializers.ValidationError(_(
                "You are not allowed to update order status."
            ))

        if value not in ORDER_STAFF_ALLOWED_STATUSES:
            raise serializers.ValidationError(_("Invalid order status."))

        return value


class OrderUpdateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = Order
        fields = [
            "status",
            "items",
        ]

    def validate_status(self, value):
        request = self.context.get("request")
        user = getattr(request, "user", None)

        if not user or not user.is_authenticated or not is_staff_or_admin(user):
            raise serializers.ValidationError(_(
                "You are not allowed to update order status."
            ))

        if value not in ORDER_STAFF_ALLOWED_STATUSES:
            raise serializers.ValidationError(_("Invalid order status."))

        return value

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError(_("Order must contain at least one item."))

        seen_ids = set()
        for item in value:
            menu_item = item["menu_item"]

            if menu_item.id in seen_ids:
                raise serializers.ValidationError(_(
                    "Duplicate menu items are not allowed. Combine quantities into one row."
                ))
            seen_ids.add(menu_item.id)

        return value

    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        new_status = validated_data.get("status", instance.status)

        locked_statuses = ["paid", "cancelled"]
        if instance.status in locked_statuses and items_data is not None:
            raise serializers.ValidationError(
                {"items": _("Paid or cancelled orders cannot be edited.")}
            )

        instance.status = new_status
        instance.save(update_fields=["status"])

        if items_data is not None:
            instance.items.all().delete()

            total_price = Decimal("0.00")
            order_items = []

            for item_data in items_data:
                menu_item = item_data["menu_item"]
                quantity = item_data["quantity"]
                item_price = menu_item.price

                total_price += item_price * quantity

                order_items.append(
                    OrderItem(
                        order=instance,
                        menu_item=menu_item,
                        name_en=menu_item.name_en,
                        name_fi=menu_item.name_fi,
                        quantity=quantity,
                        price=item_price,
                    )
                )

            OrderItem.objects.bulk_create(order_items)

            instance.total_price = total_price
            instance.save(update_fields=["total_price"])

        return instance

    def to_representation(self, instance):
        refreshed = (
            Order.objects.select_related("reservation", "table")
            .prefetch_related("items__menu_item")
            .get(pk=instance.pk)
        )
        return OrderSerializer(refreshed).data