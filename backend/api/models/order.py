"""
order.py

Order-related models for the restaurant management system.

This file defines the Order and OrderItem models used for storing
restaurant orders, linked reservations or walk-in table orders, order
status, total price, and item-level price snapshots.
"""

from decimal import Decimal

from django.db import models
from django.db.models import Q
from django.utils.translation import get_language

from .menu import MenuItem
from .reservation import Reservation
from .table import RestaurantTable


class Order(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("preparing", "Preparing"),
        ("ready", "Ready"),
        ("served", "Served"),
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
    )

    reservation = models.ForeignKey(
        Reservation,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders",
    )
    table = models.ForeignKey(
        RestaurantTable,
        on_delete=models.PROTECT,
        related_name="orders",
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["reservation"],
                condition=Q(reservation__isnull=False),
                name="unique_order_per_reservation",
            )
        ]

    def __str__(self):
        return f"Order {self.pk}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
    )
    menu_item = models.ForeignKey(
        MenuItem,
        on_delete=models.PROTECT,
    )

    name_en = models.CharField(max_length=150)
    name_fi = models.CharField(max_length=150, blank=True)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        lang = get_language()
        if lang == "fi":
            return f"{self.name_fi or self.name_en} x {self.quantity}"
        return f"{self.name_en or self.name_fi} x {self.quantity}"