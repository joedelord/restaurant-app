"""
reservations.py

Reservation API views for listing, creating, updating, status changes,
and availability search.
"""

from datetime import datetime, timedelta, time

from django.utils import timezone
from django.utils.dateparse import parse_date

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Reservation, RestaurantTable
from api.permissions import IsOwnerOrStaffOrAdmin
from api.serializers import ReservationSerializer, ReservationStatusUpdateSerializer


class ReservationListCreateView(generics.ListCreateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        base_queryset = Reservation.objects.select_related("user", "table")

        if getattr(user, "role", None) in ["staff", "admin"]:
            return base_queryset.order_by("-reservation_time")

        return base_queryset.filter(user=user).order_by("-reservation_time")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReservationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaffOrAdmin]

    def get_queryset(self):
        return Reservation.objects.select_related("user", "table").all()


class ReservationStatusUpdateView(generics.UpdateAPIView):
    serializer_class = ReservationStatusUpdateSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaffOrAdmin]
    http_method_names = ["patch"]

    def get_queryset(self):
        return Reservation.objects.select_related("user", "table").all()


class ReservationAvailabilityView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        date_str = request.query_params.get("date")
        party_size = request.query_params.get("party_size")

        if not date_str:
            return Response({"detail": "date is required."}, status=400)

        if not party_size:
            return Response({"detail": "party_size is required."}, status=400)

        try:
            party_size = int(party_size)
            if party_size <= 0:
                raise ValueError
        except ValueError:
            return Response(
                {"detail": "party_size must be a positive integer."},
                status=400,
            )

        selected_date = parse_date(date_str)
        if not selected_date:
            return Response({"detail": "Invalid date format."}, status=400)

        opening_hour = 12
        closing_hour = 22
        slot_minutes = 30
        reservation_duration = timedelta(hours=2)

        eligible_tables = RestaurantTable.objects.filter(
            is_active=True,
            seats__gte=party_size,
        ).order_by("table_number")

        blocking_statuses = ["pending", "confirmed"]

        day_start = timezone.make_aware(
            datetime.combine(selected_date, time(hour=0, minute=0))
        )
        day_end = timezone.make_aware(
            datetime.combine(selected_date, time(hour=23, minute=59, second=59))
        )

        reservations = Reservation.objects.filter(
            table__in=eligible_tables,
            status__in=blocking_statuses,
            reservation_time__gte=day_start - reservation_duration,
            reservation_time__lte=day_end + reservation_duration,
        ).select_related("table")

        now = timezone.localtime()
        is_today = selected_date == now.date()

        slots = []
        current = timezone.make_aware(
            datetime.combine(selected_date, time(hour=opening_hour, minute=0))
        )
        end = timezone.make_aware(
            datetime.combine(selected_date, time(hour=closing_hour, minute=0))
        )

        while current < end:
            if is_today and current <= now:
                current += timedelta(minutes=slot_minutes)
                continue

            slot_end = current + reservation_duration
            free_tables = []

            for table in eligible_tables:
                overlapping_exists = reservations.filter(
                    table=table,
                    reservation_time__lt=slot_end,
                    reservation_time__gt=current - reservation_duration,
                ).exists()

                if not overlapping_exists:
                    free_tables.append(table.pk)

            slots.append(
                {
                    "time": current.strftime("%H:%M"),
                    "available": len(free_tables) > 0,
                    "available_tables": free_tables,
                }
            )

            current += timedelta(minutes=slot_minutes)

        return Response(
            {
                "date": selected_date.isoformat(),
                "party_size": party_size,
                "slots": slots,
            }
        )