from rest_framework.permissions import BasePermission


class IsStaffOrAdmin(BasePermission):
    """
    Sallii pääsyn vain staff- ja admin-käyttäjille.
    """

    message = "You do not have permission to perform this action."

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and getattr(user, "role", None) in ["staff", "admin"]
        )


class IsOwnerOrStaffOrAdmin(BasePermission):
    """
    Sallii pääsyn objektin omistajalle sekä staff/admin-käyttäjille.

    Tukee objekteja, joilla on:
    - user
    - reservation.user
    """

    message = "You do not have permission to access this resource."

    def has_object_permission(self, request, view, obj):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if getattr(user, "role", None) in ["staff", "admin"]:
            return True

        # Esim. Reservation-objekti: obj.user
        if hasattr(obj, "user"):
            return obj.user == user

        # Esim. Order-objekti: obj.reservation.user
        reservation = getattr(obj, "reservation", None)
        if reservation and hasattr(reservation, "user"):
            return reservation.user == user

        return False