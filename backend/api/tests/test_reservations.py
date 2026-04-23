"""
test_reservations.py

Reservation-related API tests.

This file contains tests for reservation creation, validation,
ownership restrictions, and staff access to reservation data.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any, Mapping, cast

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response

from api.models import Reservation
from .base import BaseAPITestCase


class ReservationTests(BaseAPITestCase):
    def test_customer_can_create_reservation(self) -> None:
        self.authenticate(self.customer)

        url = reverse("reservation-list-create")
        payload = {
            "table_id": self.table.pk,
            "reservation_time": self.future_time().isoformat(),
            "party_size": 2,
            "status": "pending",
            "special_requests": "Window seat",
        }

        response = cast(Response, self.api_client.post(url, payload, format="json"))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Reservation.objects.count(), 1)

    def test_customer_cannot_create_reservation_in_past(self) -> None:
        self.authenticate(self.customer)

        url = reverse("reservation-list-create")
        payload = {
            "table_id": self.table.pk,
            "reservation_time": (timezone.now() - timedelta(hours=1)).isoformat(),
            "party_size": 2,
            "status": "pending",
        }

        response = cast(Response, self.api_client.post(url, payload, format="json"))
        data = cast(Mapping[str, Any], response.data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("reservation_time", data)

    def test_customer_cannot_access_other_users_reservation(self) -> None:
        reservation = Reservation.objects.create(
            user=self.customer2,
            table=self.table,
            reservation_time=self.future_time(),
            party_size=2,
            status="pending",
        )

        self.authenticate(self.customer)

        url = reverse("reservation-detail", kwargs={"pk": reservation.pk})
        response = cast(Response, self.api_client.get(url))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_can_view_all_reservations(self) -> None:
        Reservation.objects.create(
            user=self.customer,
            table=self.table,
            reservation_time=self.future_time(),
            party_size=2,
            status="pending",
        )

        self.authenticate(self.staff)

        url = reverse("reservation-list-create")
        response = cast(Response, self.api_client.get(url))

        self.assertEqual(response.status_code, status.HTTP_200_OK)