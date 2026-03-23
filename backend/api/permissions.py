from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsStaffOrAdmin(BasePermission):
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
    Sallii:
    - staff/admin: kaiken
    - owner: lukuoikeuden omaan objektiin
    - reservation-status endpointissä owner voi myös perua oman varauksensa
    """

    message = "You do not have permission to access this resource."

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

        # Owner saa lukea omia resurssejaan
        if request.method in SAFE_METHODS:
            return True

        # Owner saa päivittää reservation-status endpointin kautta omaa varaustaan
        if view.__class__.__name__ == "ReservationStatusUpdateView" and request.method == "PATCH":
            return True

        # Muut muokkaukset ownerilta estetään
        return False