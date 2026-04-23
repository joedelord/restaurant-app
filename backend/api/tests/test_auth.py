"""
test_auth.py

Authentication-related API tests.

This file contains tests for user login and password change flows,
including both successful and failing authentication scenarios.
"""

from __future__ import annotations

from typing import Any, Mapping, cast

from django.urls import reverse
from rest_framework import status
from rest_framework.response import Response

from .base import BaseAPITestCase


class AuthTests(BaseAPITestCase):
    def test_login_returns_tokens(self) -> None:
        url = reverse("user-login")
        payload = {
            "email": "customer@test.com",
            "password": "Testpass123!",
        }

        response = cast(Response, self.api_client.post(url, payload, format="json"))
        data = cast(Mapping[str, Any], response.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", data)
        self.assertIn("refresh", data)
        self.assertIn("user", data)

    def test_login_fails_with_wrong_password(self) -> None:
        url = reverse("user-login")
        payload = {
            "email": "customer@test.com",
            "password": "wrong-password",
        }

        response = cast(Response, self.api_client.post(url, payload, format="json"))

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_password_success(self) -> None:
        self.authenticate(self.customer)
        url = reverse("user-change-password")
        payload = {
            "current_password": "Testpass123!",
            "new_password": "Newpass123!",
            "confirm_password": "Newpass123!",
        }

        response = cast(Response, self.api_client.post(url, payload, format="json"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.customer.refresh_from_db()
        self.assertTrue(self.customer.check_password("Newpass123!"))

    def test_change_password_fails_with_wrong_current_password(self) -> None:
        self.authenticate(self.customer)
        url = reverse("user-change-password")
        payload = {
            "current_password": "wrong-password",
            "new_password": "Newpass123!",
            "confirm_password": "Newpass123!",
        }

        response = cast(Response, self.api_client.post(url, payload, format="json"))

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)