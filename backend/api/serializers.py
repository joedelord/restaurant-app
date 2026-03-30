from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import authenticate, get_user_model
from django.db import transaction
from django.utils import timezone

from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    RestaurantTable,
    Reservation,
    Category,
    MenuItem,
    Order,
    OrderItem,
)

User = get_user_model()

def get_request_language(context):
        request = context.get("request")
        if not request:
            return "en"

        lang = request.headers.get("Accept-Language", "en").lower()

        return "fi" if "fi" in lang else "en"

# =========================
# USER SERIALIZERS
# =========================

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "role",
            "marketing_consent",
        ]
        read_only_fields = ["id", "role"]


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "first_name",
            "last_name",
            "phone_number",
            "marketing_consent",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(
            request=self.context.get("request"),
            username=email,
            password=password,
        )

        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        refresh = RefreshToken.for_user(user)

        return {
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }


# =========================
# BASIC SERIALIZERS
# =========================

class RestaurantTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantTable
        fields = ["id", "table_number", "seats", "is_active"]


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
    category_name = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = [
            "id",
            "name",
            "description",
            "price",
            "image_url",
            "category",
            "category_name",
            "is_available",
        ]


    def get_category_name(self, obj):
        lang = get_request_language(self.context)

        if "fi" in lang:
            return obj.category.name_fi

        return obj.category.name_en

    def get_name(self, obj):
        lang = get_request_language(self.context)

        if "fi" in lang:
            return obj.name_fi

        return obj.name_en

    def get_description(self, obj):
        lang = get_request_language(self.context)

        if "fi" in lang:
            return obj.description_fi

        return obj.description_en


# =========================
# RESERVATION SERIALIZER
# =========================

RESERVATION_CUSTOMER_ALLOWED_STATUSES = ["pending", "cancelled"]
RESERVATION_STAFF_ALLOWED_STATUSES = ["pending", "confirmed", "cancelled", "completed"]

ORDER_STAFF_ALLOWED_STATUSES = ["pending", "confirmed", "preparing", "ready", "served", "paid", "cancelled"]


def is_staff_or_admin(user):
    return bool(
        user
        and user.is_authenticated
        and getattr(user, "role", None) in ["staff", "admin"]
    )

class ReservationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    table = RestaurantTableSerializer(read_only=True)
    table_id = serializers.PrimaryKeyRelatedField(
        queryset=RestaurantTable.objects.all(),
        source="table",
        write_only=True,
    )

    class Meta:
        model = Reservation
        fields = [
            "id",
            "user",
            "table",
            "table_id",
            "reservation_time",
            "party_size",
            "status",
            "special_requests",
            "created_at",
        ]
        read_only_fields = ["id", "user", "created_at"]

    def validate_party_size(self, value):
        if value <= 0:
            raise serializers.ValidationError("Party size must be greater than zero.")
        return value

    def validate_reservation_time(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("Reservation time cannot be in the past.")
        return value

    def validate_status(self, value):
        request = self.context.get("request")
        user = getattr(request, "user", None)

        if not user or not user.is_authenticated:
            return value

        if is_staff_or_admin(user):
            if value not in RESERVATION_STAFF_ALLOWED_STATUSES:
                raise serializers.ValidationError("Invalid reservation status.")
            return value

        if value not in RESERVATION_CUSTOMER_ALLOWED_STATUSES:
            raise serializers.ValidationError(
                "You are not allowed to set this reservation status."
            )

        return value

    def validate(self, attrs):
        request = self.context.get("request")
        user = getattr(request, "user", None)

        table = attrs.get("table") or getattr(self.instance, "table", None)
        reservation_time = attrs.get("reservation_time") or getattr(self.instance, "reservation_time", None)
        party_size = attrs.get("party_size") or getattr(self.instance, "party_size", None)
        status_value = attrs.get("status") or getattr(self.instance, "status", "pending")

        if not table:
            raise serializers.ValidationError({"table_id": "Table is required."})

        if not table.is_active:
            raise serializers.ValidationError({"table_id": "Selected table is not active."})

        if party_size and party_size > table.seats:
            raise serializers.ValidationError(
                {"party_size": "Party size exceeds the number of seats at this table."}
            )

        # Customer ei saa muuttaa vahvistettua/päättynyttä varausta vapaasti
        if self.instance and user and not is_staff_or_admin(user):
            locked_statuses = ["confirmed", "completed"]
            if self.instance.status in locked_statuses:
                attempted_fields = set(attrs.keys()) - {"status"}
                if attempted_fields:
                    raise serializers.ValidationError(
                        "You cannot modify a confirmed or completed reservation."
                    )

            # Customer saa käytännössä vain perua oman varauksen
            if "status" in attrs and attrs["status"] != "cancelled":
                current_status = self.instance.status
                if attrs["status"] != current_status:
                    raise serializers.ValidationError(
                        {"status": "You may only cancel your reservation."}
                    )

        # Uutta varausta luodessa customer ei saa syöttää muuta kuin pending/cancelled
        if not self.instance and user and not is_staff_or_admin(user):
            if "status" in attrs and attrs["status"] != "pending":
                raise serializers.ValidationError(
                    {"status": "New reservations are created with pending status only."}
                )

        blocking_statuses = ["pending", "confirmed"]

        if reservation_time and status_value in blocking_statuses:
            start_time = reservation_time
            end_time = reservation_time + timedelta(hours=2)

            overlapping = Reservation.objects.filter(
                table=table,
                status__in=blocking_statuses,
                reservation_time__lt=end_time,
                reservation_time__gt=start_time - timedelta(hours=2),
            )

            if self.instance:
                overlapping = overlapping.exclude(pk=self.instance.pk)

            if overlapping.exists():
                raise serializers.ValidationError(
                    {"reservation_time": "This table is not available at the selected time."}
                )

        return attrs

class ReservationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ["status"]

    def validate_status(self, value):
        request = self.context.get("request")
        user = getattr(request, "user", None)

        if not user or not user.is_authenticated:
            raise serializers.ValidationError("Authentication required.")

        if is_staff_or_admin(user):
            if value not in RESERVATION_STAFF_ALLOWED_STATUSES:
                raise serializers.ValidationError("Invalid reservation status.")
            return value

        if value != "cancelled":
            raise serializers.ValidationError(
                "You may only cancel your reservation."
            )

        return value

# =========================
# ORDER SERIALIZERS
# =========================

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
            raise serializers.ValidationError("Selected menu item is not available.")
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
            raise serializers.ValidationError("Selected table is not active.")
        return value

    def validate_status(self, value):
        request = self.context.get("request")
        user = getattr(request, "user", None)

        if not user or not user.is_authenticated or not is_staff_or_admin(user):
            raise serializers.ValidationError("You are not allowed to set order status.")

        if value not in ORDER_STAFF_ALLOWED_STATUSES:
            raise serializers.ValidationError("Invalid order status.")

        return value

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Order must contain at least one item.")

        seen_ids = set()
        for item in value:
            menu_item = item["menu_item"]

            if menu_item.id in seen_ids:
                raise serializers.ValidationError(
                    "Duplicate menu items are not allowed. Combine quantities into one row."
                )
            seen_ids.add(menu_item.id)

        return value

    def validate(self, attrs):
        reservation = attrs.get("reservation")
        table = attrs.get("table")
        items = attrs.get("items", [])

        if not table:
            raise serializers.ValidationError({"table_id": "Table is required."})

        if not items:
            raise serializers.ValidationError({"items": "Order must contain at least one item."})

        # Jos statusia ei anneta create-vaiheessa, oletetaan pending
        if not attrs.get("status"):
            attrs["status"] = "pending"

        if reservation:
            if reservation.table_id != table.id:
                raise serializers.ValidationError(
                    {"table_id": "Selected table does not match the reservation table."}
                )

            if reservation.status in ["cancelled", "completed"]:
                raise serializers.ValidationError(
                    {"reservation_id": "Cannot create an order for this reservation."}
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
            raise serializers.ValidationError("You are not allowed to update order status.")

        if value not in ORDER_STAFF_ALLOWED_STATUSES:
            raise serializers.ValidationError("Invalid order status.")

        return value
    

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