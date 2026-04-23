"""
reservation.py

Reservation model for the restaurant management system.

This file defines the Reservation model used for storing customer table
reservations, including reservation time, party size, status, and
special requests.
"""

from django.conf import settings
from django.db import models

from .table import RestaurantTable


class Reservation(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reservations",
    )
    table = models.ForeignKey(
        RestaurantTable,
        on_delete=models.PROTECT,
        related_name="reservations",
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    reservation_time = models.DateTimeField()
    party_size = models.PositiveIntegerField()
    special_requests = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["reservation_time"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"Reservation {self.pk} - {self.user.email}"