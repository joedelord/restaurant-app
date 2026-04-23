"""
admin.py

Django admin configuration for the restaurant management system.

This file registers all core models to the Django Admin interface and
provides basic customization such as list display, search fields,
filters, and inline editing.

The admin panel is mainly used for development, testing, and quick
data management (e.g., creating users, menu items, reservations, and orders).
"""

from django.contrib import admin
from .models import (
    User,
    RestaurantTable,
    Reservation,
    Category,
    MenuItem,
    Order,
    OrderItem,
)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "first_name", "last_name", "role", "is_active")
    search_fields = ("email", "first_name", "last_name")
    list_filter = ("role", "is_active")
    ordering = ("email",)


@admin.register(RestaurantTable)
class TableAdmin(admin.ModelAdmin):
    list_display = ("table_number", "seats", "is_active")
    list_filter = ("is_active",)
    ordering = ("table_number",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name_en", "name_fi", "display_order")
    search_fields = ("name_en", "name_fi")
    ordering = ("display_order",)


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("name_en", "name_fi", "price", "category", "is_available")
    list_filter = ("category", "is_available")
    search_fields = ("name_en", "name_fi")
    ordering = ("category", "name_en")


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "table", "reservation_time", "status")
    list_filter = ("status", "reservation_time")
    search_fields = ("user__email",)
    ordering = ("-reservation_time",)


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("name_en", "name_fi", "price")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "table", "status", "total_price", "created_at")
    list_filter = ("status",)
    search_fields = ("id",)
    ordering = ("-created_at",)
    inlines = [OrderItemInline]