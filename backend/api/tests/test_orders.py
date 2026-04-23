"""
test_orders.py

Order-related API tests.

This file contains tests for order creation and order status updates,
including role restrictions and invalid status handling.
"""

from __future__ import annotations

from typing import Any, Mapping, cast

from django.urls import reverse
from rest_framework import status
from rest_framework.response import Response

from api.models import Order, Reservation
from .base import BaseAPITestCase


class OrderTests(BaseAPITestCase):
    def create_reservation(self) -> Reservation:
        return Reservation.objects.create(
            user=self.customer,
            table=self.table,
            reservation_time=self.future_time(),
            party_size=2,
            status="confirmed",
        )

    def test_staff_can_create_order(self) -> None:
        reservation = self.create_reservation()

        self.authenticate(self.staff)

        url = reverse("order-create")
        payload = {
            "reservation_id": reservation.pk,
            "table_id": self.table.pk,
            "items": [
                {"menu_item_id": self.menu_item.pk, "quantity": 2},
                {"menu_item_id": self.menu_item_2.pk, "quantity": 1},
            ],
        }

        response = cast(Response, self.api_client.post(url, payload, format="json"))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        order = Order.objects.first()
        assert order is not None  # 👈 tärkeä Pylancea varten

        self.assertEqual(str(order.total_price), "40.00")

    def test_customer_cannot_create_order(self) -> None:
        reservation = self.create_reservation()

        self.authenticate(self.customer)

        url = reverse("order-create")
        payload = {
            "reservation_id": reservation.pk,
            "table_id": self.table.pk,
            "items": [
                {"menu_item_id": self.menu_item.pk, "quantity": 1},
            ],
        }

        response = cast(Response, self.api_client.post(url, payload, format="json"))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_customer_cannot_update_order_status(self) -> None:
        reservation = self.create_reservation()

        order = Order.objects.create(
            reservation=reservation,
            table=self.table,
            status="pending",
            total_price="12.50",
        )

        self.authenticate(self.customer)

        url = reverse("order-status-update", kwargs={"pk": order.pk})
        response = cast(
            Response,
            self.api_client.patch(url, {"status": "cancelled"}, format="json"),
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_can_update_order_status(self) -> None:
        reservation = self.create_reservation()

        order = Order.objects.create(
            reservation=reservation,
            table=self.table,
            status="pending",
            total_price="12.50",
        )

        self.authenticate(self.staff)

        url = reverse("order-status-update", kwargs={"pk": order.pk})
        response = cast(
            Response,
            self.api_client.patch(url, {"status": "confirmed"}, format="json"),
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        order.refresh_from_db()
        self.assertEqual(order.status, "confirmed")

    def test_staff_cannot_update_order_status_to_invalid_value(self) -> None:
        reservation = self.create_reservation()

        order = Order.objects.create(
            reservation=reservation,
            table=self.table,
            status="pending",
            total_price="12.50",
        )

        self.authenticate(self.staff)

        url = reverse("order-status-update", kwargs={"pk": order.pk})
        response = cast(
            Response,
            self.api_client.patch(url, {"status": "completed"}, format="json"),
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)