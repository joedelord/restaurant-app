"""
permissions.py

Custom permission classes for the restaurant management system API.

This file defines role-based and object-level access control rules used
across the application.

Permission classes:
- IsAdmin: Allows access only to admin users.
- IsStaffOrAdmin: Allows access to staff and admin users.
- IsOwnerOrStaffOrAdmin:
    - Staff/Admin: Full access
    - Owner: Read-only access to their own resources
    - Special case: Owner may cancel their own reservation via
      ReservationStatusUpdateView (PATCH request)

These permissions are applied in API views to enforce business rules
and protect resources.
"""

from django.utils.translation import gettext_lazy as _
from rest_framework.permissions import BasePermission, SAFE_METHODS


# ROLE-BASED PERMISSIONS
class IsAdmin(BasePermission):
    message = _("You do not have permission to perform this action.")

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and getattr(user, "role", None) == "admin"
        )


class IsStaffOrAdmin(BasePermission):
    message = _("You do not have permission to perform this action.")

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and getattr(user, "role", None) in ["staff", "admin"]
        )


# OBJECT-LEVEL PERMISSIONS
class IsOwnerOrStaffOrAdmin(BasePermission):
    """
    Allows:
    - staff/admin: full access
    - owner: read access to own resource
    - owner: can cancel own reservation via ReservationStatusUpdateView
    """

    message = _("You do not have permission to access this resource.")

    def has_object_permission(self, request, view, obj):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if getattr(user, "role", None) in ["staff", "admin"]:
            return True

        owner_match = False

        if hasattr(obj, "user"):
            owner_match = obj.user == user
        else:
            reservation = getattr(obj, "reservation", None)
            if reservation and hasattr(reservation, "user"):
                owner_match = reservation.user == user

        if not owner_match:
            return False

        if request.method in SAFE_METHODS:
            return True

        if (
            view.__class__.__name__ == "ReservationStatusUpdateView"
            and request.method == "PATCH"
        ):
            return True

        return False