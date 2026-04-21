from __future__ import annotations

from datetime import timedelta
from typing import cast

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient

from api.models import Category, MenuItem, RestaurantTable

User = get_user_model()


class BaseAPITestCase(APITestCase):
    def create_test_user(
        self,
        *,
        email: str,
        password: str,
        first_name: str,
        last_name: str,
        role: str = "customer",
        is_staff: bool = False,
    ):
        user = User.objects.create(
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=role,
            is_staff=is_staff,
        )
        user.set_password(password)
        user.save()
        return user

    def setUp(self) -> None:
        self.customer = self.create_test_user(
            email="customer@test.com",
            password="Testpass123!",
            first_name="Test",
            last_name="Customer",
            role="customer",
        )
        self.customer2 = self.create_test_user(
            email="customer2@test.com",
            password="Testpass123!",
            first_name="Test",
            last_name="CustomerTwo",
            role="customer",
        )
        self.staff = self.create_test_user(
            email="staff@test.com",
            password="Testpass123!",
            first_name="Test",
            last_name="Staff",
            role="staff",
        )
        self.admin = self.create_test_user(
            email="admin@test.com",
            password="Testpass123!",
            first_name="Test",
            last_name="Admin",
            role="admin",
            is_staff=True,
        )

        self.table = RestaurantTable.objects.create(
            table_number=1,
            seats=4,
            is_active=True,
        )
        self.table2 = RestaurantTable.objects.create(
            table_number=2,
            seats=2,
            is_active=True,
        )
        self.inactive_table = RestaurantTable.objects.create(
            table_number=3,
            seats=6,
            is_active=False,
        )

        self.category = Category.objects.create(
            name_en="Main courses",
            name_fi="Pääruoat",
            description_en="Main dishes",
            description_fi="Pääruoat",
            display_order=1,
        )

        self.menu_item = MenuItem.objects.create(
            name_en="Burger",
            name_fi="Burgeri",
            description_en="Beef burger",
            description_fi="Naudanlihaburgeri",
            price="12.50",
            category=self.category,
            is_available=True,
        )
        self.menu_item_2 = MenuItem.objects.create(
            name_en="Pasta",
            name_fi="Pasta",
            description_en="Creamy pasta",
            description_fi="Kermainen pasta",
            price="15.00",
            category=self.category,
            is_available=True,
        )
        self.unavailable_menu_item = MenuItem.objects.create(
            name_en="Soup",
            name_fi="Keitto",
            description_en="Daily soup",
            description_fi="Päivän keitto",
            price="8.00",
            category=self.category,
            is_available=False,
        )

    @property
    def api_client(self) -> APIClient:
        return cast(APIClient, self.client)

    def authenticate(self, user) -> None:
        self.api_client.force_authenticate(user=user)

    def future_time(self, days: int = 1, hours: int = 0):
        return timezone.now() + timedelta(days=days, hours=hours)