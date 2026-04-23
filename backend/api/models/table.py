"""
table.py

Restaurant table model for the restaurant management system.

This file defines the RestaurantTable model used to manage table
information such as table number, seating capacity, and active status.
"""

from django.db import models


class RestaurantTable(models.Model):
    table_number = models.PositiveIntegerField(unique=True)
    seats = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Table {self.table_number}"