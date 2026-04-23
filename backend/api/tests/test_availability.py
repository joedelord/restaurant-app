"""
test_availability.py

Reservation availability API tests.

This file verifies reservation slot availability logic, including
required parameters, valid party sizes, returned slots, and overlap handling.
"""

from __future__ import annotations

from datetime import datetime, time, timedelta
from typing import Any, Mapping, cast

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response

from api.models import Reservation
from .base import BaseAPITestCase


class AvailabilityTests(BaseAPITestCase):
    def test_availability_requires_date(self) -> None:
        url = reverse("reservation-availability")
        response = cast(Response, self.api_client.get(url, {"party_size": 2}))

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_availability_requires_positive_party_size(self) -> None:
        url = reverse("reservation-availability")
        response = cast(
            Response,
            self.api_client.get(url, {"date": "2030-01-01", "party_size": 0}),
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_availability_returns_slots(self) -> None:
        url = reverse("reservation-availability")
        response = cast(
            Response,
            self.api_client.get(url, {"date": "2030-01-01", "party_size": 2}),
        )
        data = cast(Mapping[str, Any], response.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("slots", data)

    def test_reserved_table_is_excluded_from_overlapping_slot(self) -> None:
        selected_date = timezone.localdate() + timedelta(days=5)
        reservation_time = timezone.make_aware(
            datetime.combine(selected_date, time(hour=12, minute=0))
        )

        Reservation.objects.create(
            user=self.customer,
            table=self.table,
            reservation_time=reservation_time,
            party_size=2,
            status="confirmed",
        )

        url = reverse("reservation-availability")
        response = cast(
            Response,
            self.api_client.get(
                url,
                {"date": selected_date.isoformat(), "party_size": 2},
            ),
        )
        data = cast(Mapping[str, Any], response.data)
        slots = cast(list[dict[str, Any]], data["slots"])

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        noon_slot = next(slot for slot in slots if slot["time"] == "12:00")
        available_tables = cast(list[int], noon_slot["available_tables"])

        self.assertNotIn(self.table.pk, available_tables)