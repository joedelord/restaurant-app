"""
serializers package

This package organizes API serializers into domain-specific modules such
as user, menu, reservation, order, and admin.

The __init__.py file re-exports serializers for simple imports like:
    from api.serializers import UserSerializer, ReservationSerializer
"""

from .user import (
    UserSerializer,
    UserRegisterSerializer,
    LoginSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
)
from .table import RestaurantTableSerializer
from .menu import CategorySerializer, MenuItemSerializer
from .reservation import ReservationSerializer, ReservationStatusUpdateSerializer
from .order import (
    OrderItemReadSerializer,
    OrderSerializer,
    OrderItemCreateSerializer,
    OrderCreateSerializer,
    OrderStatusUpdateSerializer,
    OrderUpdateSerializer,
)
from .admin import AdminMenuItemSerializer, AdminUserSerializer

__all__ = [
    "UserSerializer",
    "UserRegisterSerializer",
    "LoginSerializer",
    "UserProfileSerializer",
    "ChangePasswordSerializer",
    "RestaurantTableSerializer",
    "CategorySerializer",
    "MenuItemSerializer",
    "ReservationSerializer",
    "ReservationStatusUpdateSerializer",
    "OrderItemReadSerializer",
    "OrderSerializer",
    "OrderItemCreateSerializer",
    "OrderCreateSerializer",
    "OrderStatusUpdateSerializer",
    "OrderUpdateSerializer",
    "AdminMenuItemSerializer",
    "AdminUserSerializer",
]