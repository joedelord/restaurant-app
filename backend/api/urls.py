"""
urls.py

API route definitions for the restaurant management system.

This file maps HTTP endpoints to their corresponding view classes.
Routes are grouped by feature areas such as authentication, users,
tables, menu, reservations, orders, and admin functionality.

All views are imported via the views package, which re-exports
domain-specific view modules (e.g., auth, menu, orders).
"""

from django.urls import path
from . import views


urlpatterns = [

    # AUTH
    path(
        "users/register/",
        views.CreateUserView.as_view(),
        name="user-register",
    ),
    path(
        "users/login/",
        views.LoginView.as_view(),
        name="user-login",
    ),
    path(
        "users/me/",
        views.MeView.as_view(),
        name="user-me",
    ),
    path(
        "users/logout/",
        views.LogoutView.as_view(),
        name="user-logout",
    ),


    # USERS (ADMIN + PROFILE)
    path(
        "admin/users/",
        views.AdminUserListCreateView.as_view(),
        name="admin-user-list-create",
    ),
    path(
        "admin/users/<int:pk>/",
        views.AdminUserDetailView.as_view(),
        name="admin-user-detail",
    ),
    path(
        "users/change-password/",
        views.ChangePasswordView.as_view(),
        name="user-change-password",
    ),


    # TABLES
    path(
        "tables/",
        views.RestaurantTableListView.as_view(),
        name="table-list",
    ),
    path(
        "admin/tables/",
        views.AdminRestaurantTableListCreateView.as_view(),
        name="admin-table-list-create",
    ),
    path(
        "admin/tables/<int:pk>/",
        views.AdminRestaurantTableDetailView.as_view(),
        name="admin-table-detail",
    ),


    # CATEGORIES
    path(
        "categories/",
        views.CategoryListView.as_view(),
        name="category-list",
    ),
    path(
        "admin/categories/",
        views.AdminCategoryListCreateView.as_view(),
        name="admin-category-list-create",
    ),
    path(
        "admin/categories/<int:pk>/",
        views.AdminCategoryDetailView.as_view(),
        name="admin-category-detail",
    ),


    # MENU ITEMS
    path(
        "menu-items/",
        views.MenuItemListView.as_view(),
        name="menu-item-list",
    ),
    path(
        "admin/menu-items/",
        views.AdminMenuItemListCreateView.as_view(),
        name="admin-menu-item-list-create",
    ),
    path(
        "admin/menu-items/<int:pk>/",
        views.AdminMenuItemDetailView.as_view(),
        name="admin-menu-item-list-detail",
    ),


    # SALES
    path(
        "admin/sales/",
        views.AdminSalesStatsView.as_view(),
        name="admin-sales-stats",
    ),


    # RESERVATIONS
    path(
        "reservations/",
        views.ReservationListCreateView.as_view(),
        name="reservation-list-create",
    ),
    path(
        "reservations/<int:pk>/",
        views.ReservationDetailView.as_view(),
        name="reservation-detail",
    ),
    path(
        "reservations/<int:pk>/status/",
        views.ReservationStatusUpdateView.as_view(),
        name="reservation-status-update",
    ),
    path(
        "reservations/availability/",
        views.ReservationAvailabilityView.as_view(),
        name="reservation-availability",
    ),


    # ORDERS
    path(
        "orders/",
        views.OrderListView.as_view(),
        name="order-list",
    ),
    path(
        "orders/create/",
        views.OrderCreateView.as_view(),
        name="order-create",
    ),
    path(
        "orders/<int:pk>/",
        views.OrderDetailView.as_view(),
        name="order-detail",
    ),
    path(
        "orders/<int:pk>/status/",
        views.OrderStatusUpdateView.as_view(),
        name="order-status-update",
    ),
]