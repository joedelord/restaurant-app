"""
reservation.py

Reservation-related serializers for creating, reading, updating, and
changing reservation status.
"""

from datetime import timedelta

from django.utils import timezone

from rest_framework import serializers

from api.models import Reservation, RestaurantTable

from .helpers import (
    RESERVATION_CUSTOMER_ALLOWED_STATUSES,
    RESERVATION_STAFF_ALLOWED_STATUSES,
    is_staff_or_admin,
)
from .table import RestaurantTableSerializer
from .user import UserSerializer


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
        reservation_time = attrs.get("reservation_time") or getattr(
            self.instance, "reservation_time", None
        )
        party_size = attrs.get("party_size") or getattr(
            self.instance, "party_size", None
        )
        status_value = attrs.get("status") or getattr(
            self.instance, "status", "pending"
        )

        if not table:
            raise serializers.ValidationError({"table_id": "Table is required."})

        if not table.is_active:
            raise serializers.ValidationError(
                {"table_id": "Selected table is not active."}
            )

        if party_size and party_size > table.seats:
            raise serializers.ValidationError(
                {"party_size": "Party size exceeds the number of seats at this table."}
            )

        if self.instance and user and not is_staff_or_admin(user):
            locked_statuses = ["confirmed", "completed"]

            if self.instance.status in locked_statuses:
                attempted_fields = set(attrs.keys()) - {"status"}
                if attempted_fields:
                    raise serializers.ValidationError(
                        "You cannot modify a confirmed or completed reservation."
                    )

            if "status" in attrs and attrs["status"] != "cancelled":
                current_status = self.instance.status
                if attrs["status"] != current_status:
                    raise serializers.ValidationError(
                        {"status": "You may only cancel your reservation."}
                    )

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
                    {
                        "reservation_time": (
                            "This table is not available at the selected time."
                        )
                    }
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
            raise serializers.ValidationError("You may only cancel your reservation.")

        return value