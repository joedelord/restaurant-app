"""
test_admin_views.py

Admin view API tests.

This file verifies admin-only endpoints for managing users, tables,
categories, menu items, and viewing sales statistics.
"""

from __future__ import annotations

from typing import cast

from django.urls import reverse
from rest_framework import status
from rest_framework.response import Response

from api.models import Category, MenuItem, RestaurantTable
from .base import BaseAPITestCase


class AdminViewTests(BaseAPITestCase):
    def test_admin_can_list_users(self) -> None:
        self.authenticate(self.admin)
        url = reverse("admin-user-list-create")

        response = cast(Response, self.api_client.get(url))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_customer_cannot_list_users(self) -> None:
        self.authenticate(self.customer)
        url = reverse("admin-user-list-create")

        response = cast(Response, self.api_client.get(url))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_table(self) -> None:
        self.authenticate(self.admin)
        url = reverse("admin-table-list-create")
        payload = {
            "table_number": 10,
            "seats": 6,
            "is_active": True,
        }

        response = cast(Response, self.api_client.post(url, payload, format="json"))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(RestaurantTable.objects.filter(table_number=10).exists())

    def test_staff_cannot_create_table(self) -> None:
        self.authenticate(self.staff)
        url = reverse("admin-table-list-create")
        payload = {
            "table_number": 11,
            "seats": 4,
            "is_active": True,
        }

        response = cast(Response, self.api_client.post(url, payload, format="json"))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_category(self) -> None:
        self.authenticate(self.admin)
        url = reverse("admin-category-list-create")
        payload = {
            "name_en": "Desserts",
            "name_fi": "Jälkiruoat",
            "description_en": "Sweet dishes",
            "description_fi": "Makeat annokset",
            "display_order": 2,
        }

        response = cast(Response, self.api_client.post(url, payload, format="json"))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Category.objects.filter(name_en="Desserts").exists())

    def test_customer_cannot_create_category(self) -> None:
        self.authenticate(self.customer)
        url = reverse("admin-category-list-create")
        payload = {
            "name_en": "Soups",
            "name_fi": "Keitot",
            "description_en": "Soup category",
            "description_fi": "Keittokategoria",
            "display_order": 3,
        }

        response = cast(Response, self.api_client.post(url, payload, format="json"))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_menu_item(self) -> None:
        self.authenticate(self.admin)
        url = reverse("admin-menu-item-list-create")
        payload = {
            "name_en": "Cheesecake",
            "name_fi": "Juustokakku",
            "description_en": "Creamy cheesecake",
            "description_fi": "Kermainen juustokakku",
            "price": "7.50",
            "image_url": "",
            "category": self.category.pk,
            "is_available": True,
        }

        response = cast(Response, self.api_client.post(url, payload, format="json"))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(MenuItem.objects.filter(name_en="Cheesecake").exists())

    def test_staff_cannot_create_menu_item(self) -> None:
        self.authenticate(self.staff)
        url = reverse("admin-menu-item-list-create")
        payload = {
            "name_en": "Ice Cream",
            "name_fi": "Jäätelö",
            "description_en": "Vanilla ice cream",
            "description_fi": "Vaniljajäätelö",
            "price": "5.50",
            "image_url": "",
            "category": self.category.pk,
            "is_available": True,
        }

        response = cast(Response, self.api_client.post(url, payload, format="json"))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_update_table(self) -> None:
        self.authenticate(self.admin)
        url = reverse("admin-table-detail", kwargs={"pk": self.table.pk})
        payload = {
            "table_number": self.table.table_number,
            "seats": 8,
            "is_active": True,
        }

        response = cast(Response, self.api_client.put(url, payload, format="json"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.table.refresh_from_db()
        self.assertEqual(self.table.seats, 8)

    def test_admin_can_delete_category(self) -> None:
        category = Category.objects.create(
            name_en="Starters",
            name_fi="Alkuruoat",
            description_en="Starter dishes",
            description_fi="Alkuruoat",
            display_order=99,
        )

        self.authenticate(self.admin)
        url = reverse("admin-category-detail", kwargs={"pk": category.pk})

        response = cast(Response, self.api_client.delete(url))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Category.objects.filter(pk=category.pk).exists())

    def test_admin_can_view_sales_stats(self) -> None:
        self.authenticate(self.admin)
        url = reverse("admin-sales-stats")

        response = cast(Response, self.api_client.get(url))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_customer_cannot_view_sales_stats(self) -> None:
        self.authenticate(self.customer)
        url = reverse("admin-sales-stats")

        response = cast(Response, self.api_client.get(url))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)