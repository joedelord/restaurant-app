"""
test_permissions.py

Permission-related API tests.

This file verifies role-based and object-level access control for
customers, staff, and admin users across protected endpoints.
"""

from __future__ import annotations

from typing import cast

from django.urls import reverse
from rest_framework import status
from rest_framework.response import Response

from api.models import Reservation
from .base import BaseAPITestCase


class PermissionTests(BaseAPITestCase):
    def test_customer_cannot_access_admin_users_endpoint(self) -> None:
        self.authenticate(self.customer)
        url = reverse("admin-user-list-create")

        response = cast(Response, self.api_client.get(url))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_access_admin_users_endpoint(self) -> None:
        self.authenticate(self.admin)
        url = reverse("admin-user-list-create")

        response = cast(Response, self.api_client.get(url))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_customer_cannot_access_other_customers_reservation(self) -> None:
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

    def test_staff_can_access_other_customers_reservation(self) -> None:
        reservation = Reservation.objects.create(
            user=self.customer2,
            table=self.table,
            reservation_time=self.future_time(),
            party_size=2,
            status="pending",
        )

        self.authenticate(self.staff)
        url = reverse("reservation-detail", kwargs={"pk": reservation.pk})

        response = cast(Response, self.api_client.get(url))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthenticated_user_cannot_access_reservations(self) -> None:
        reservation = Reservation.objects.create(
            user=self.customer,
            table=self.table,
            reservation_time=self.future_time(),
            party_size=2,
            status="pending",
        )

        url = reverse("reservation-detail", kwargs={"pk": reservation.pk})
        response = cast(Response, self.api_client.get(url))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)