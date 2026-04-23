"""
views package

This package organizes API views into domain-specific modules such as
auth, users, tables, menu, reservations, orders, admin, and sales.

The __init__.py file re-exports all views so they can still be imported
through:
    from . import views
"""

from .auth import CreateUserView, LoginView, LogoutView
from .users import MeView, ChangePasswordView
from .tables import (
    RestaurantTableListView,
    AdminRestaurantTableListCreateView,
    AdminRestaurantTableDetailView,
)
from .menu import (
    CategoryListView,
    AdminCategoryListCreateView,
    AdminCategoryDetailView,
    MenuItemListView,
    AdminMenuItemListCreateView,
    AdminMenuItemDetailView,
)
from .reservations import (
    ReservationListCreateView,
    ReservationDetailView,
    ReservationStatusUpdateView,
    ReservationAvailabilityView,
)
from .orders import (
    OrderListView,
    OrderCreateView,
    OrderDetailView,
    OrderStatusUpdateView,
)
from .admin import AdminUserListCreateView, AdminUserDetailView
from .sales import AdminSalesStatsView

__all__ = [
    "CreateUserView",
    "LoginView",
    "LogoutView",
    "MeView",
    "ChangePasswordView",
    "RestaurantTableListView",
    "AdminRestaurantTableListCreateView",
    "AdminRestaurantTableDetailView",
    "CategoryListView",
    "AdminCategoryListCreateView",
    "AdminCategoryDetailView",
    "MenuItemListView",
    "AdminMenuItemListCreateView",
    "AdminMenuItemDetailView",
    "ReservationListCreateView",
    "ReservationDetailView",
    "ReservationStatusUpdateView",
    "ReservationAvailabilityView",
    "OrderListView",
    "OrderCreateView",
    "OrderDetailView",
    "OrderStatusUpdateView",
    "AdminUserListCreateView",
    "AdminUserDetailView",
    "AdminSalesStatsView",
]