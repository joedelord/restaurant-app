"""
menu.py

Menu-related models for the restaurant management system.

This file defines the Category and MenuItem models used for storing
menu categories, bilingual names and descriptions, pricing, and
availability information.
"""

from django.db import models
from django.utils.translation import get_language


class Category(models.Model):
    name_en = models.CharField(max_length=100, unique=True)
    name_fi = models.CharField(max_length=100, unique=True)

    description_en = models.TextField(blank=True)
    description_fi = models.TextField(blank=True)

    display_order = models.PositiveIntegerField(unique=True)

    class Meta:
        ordering = ["display_order", "name_en"]

    def __str__(self):
        lang = get_language()
        if lang == "fi":
            return self.name_fi or self.name_en
        return self.name_en or self.name_fi


class MenuItem(models.Model):
    name_en = models.CharField(max_length=150, unique=True)
    name_fi = models.CharField(max_length=150, unique=True)

    description_en = models.TextField(blank=True)
    description_fi = models.TextField(blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(blank=True)

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="menu_items",
    )

    is_available = models.BooleanField(default=True)

    class Meta:
        ordering = ["category__display_order", "name_en"]

    def __str__(self):
        lang = get_language()
        if lang == "fi":
            return self.name_fi or self.name_en
        return self.name_en or self.name_fi