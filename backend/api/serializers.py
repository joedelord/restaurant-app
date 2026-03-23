from decimal import Decimal
from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    User,
    RestaurantTable,
    Reservation,
    Category,
    MenuItem,
    Order,
    OrderItem,
)

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
            "date_joined",
        ]
        read_only_fields = ["id", "role", "date_joined"]


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "password",
            "first_name",
            "last_name",
            "phone_number",
            "marketing_consent",
        ]
        read_only_fields = ["id"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(    #type:ignore
            password=password,
            role="customer",
            **validated_data,
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Virheellinen sähköposti tai salasana.")

        if not user.check_password(password):
            raise serializers.ValidationError("Virheellinen sähköposti tai salasana.")

        if not user.is_active:
            raise serializers.ValidationError("Käyttäjätili ei ole aktiivinen.")

        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,      #type:ignore
                "email": user.email,
                "role": user.role,
            },
        }


class RestaurantTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantTable
        fields = [
            "id",
            "table_number",
            "seats",
            "is_active",
        ]


class ReservationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="user",
        write_only=True,
        required=False,
    )

    table = RestaurantTableSerializer(read_only=True)
    table_id = serializers.PrimaryKeyRelatedField(
        queryset=RestaurantTable.objects.filter(is_active=True),
        source="table",
        write_only=True,
    )

    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Reservation
        fields = [
            "id",
            "user",
            "user_id",
            "table",
            "table_id",
            "status",
            "status_display",
            "reservation_time",
            "party_size",
            "special_requests",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_party_size(self, value):
        if value <= 0:
            raise serializers.ValidationError("Party size must be greater than 0.")
        return value

    def validate(self, attrs):
        table = attrs.get("table", getattr(self.instance, "table", None))
        party_size = attrs.get("party_size", getattr(self.instance, "party_size", None))

        if table and party_size and party_size > table.seats:
            raise serializers.ValidationError(
                {"party_size": "Party size cannot exceed the number of seats at the selected table."}
            )

        return attrs


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "description",
            "display_order",
        ]


class MenuItemSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
    )

    class Meta:
        model = MenuItem
        fields = [
            "id",
            "name",
            "description",
            "price",
            "image_url",
            "category",
            "category_id",
            "is_available",
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer(read_only=True)
    menu_item_id = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.filter(is_available=True),
        source="menu_item",
        write_only=True,
    )

    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "order",
            "menu_item",
            "menu_item_id",
            "quantity",
            "price",
            "subtotal",
        ]
        read_only_fields = ["id", "order", "price", "subtotal"]

    def get_subtotal(self, obj):
        return obj.price * obj.quantity

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        return value


class OrderItemCreateSerializer(serializers.ModelSerializer):
    menu_item_id = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.filter(is_available=True),
        source="menu_item",
    )

    class Meta:
        model = OrderItem
        fields = [
            "menu_item_id",
            "quantity",
        ]

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        return value


class OrderSerializer(serializers.ModelSerializer):
    reservation_id = serializers.PrimaryKeyRelatedField(
        queryset=Reservation.objects.all(),
        source="reservation",
        allow_null=True,
        required=False,
    )
    table_id = serializers.PrimaryKeyRelatedField(
        queryset=RestaurantTable.objects.filter(is_active=True),
        source="table",
    )

    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "reservation_id",
            "table_id",
            "status",
            "status_display",
            "total_price",
            "created_at",
            "items",
        ]
        read_only_fields = ["id", "total_price", "created_at", "items"]


class OrderCreateSerializer(serializers.ModelSerializer):
    reservation_id = serializers.PrimaryKeyRelatedField(
        queryset=Reservation.objects.all(),
        source="reservation",
        allow_null=True,
        required=False,
    )
    table_id = serializers.PrimaryKeyRelatedField(
        queryset=RestaurantTable.objects.filter(is_active=True),
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

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        order = Order.objects.create(
            total_price=Decimal("0.00"),
            **validated_data,
        )

        total = Decimal("0.00")

        for item_data in items_data:
            menu_item = item_data["menu_item"]
            quantity = item_data["quantity"]
            price = menu_item.price

            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                quantity=quantity,
                price=price,
            )

            total += price * quantity

        order.total_price = total
        order.save()

        return order

    def validate(self, attrs):
        reservation = attrs.get("reservation")
        table = attrs.get("table")

        if reservation and table and reservation.table != table:
            raise serializers.ValidationError(
                {"table_id": "Selected table does not match the reservation table."}
            )

        return attrs