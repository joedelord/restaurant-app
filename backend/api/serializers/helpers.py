"""
helpers.py

Shared serializer helpers, constants, and permission-related utility
functions for the restaurant management system API serializers.
"""

def get_request_language(context):
    request = context.get("request")
    if not request:
        return "en"

    lang = request.headers.get("Accept-Language", "en").lower()
    return "fi" if "fi" in lang else "en"


RESERVATION_CUSTOMER_ALLOWED_STATUSES = ["pending", "cancelled"]
RESERVATION_STAFF_ALLOWED_STATUSES = [
    "pending",
    "confirmed",
    "cancelled",
    "completed",
]
ORDER_STAFF_ALLOWED_STATUSES = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "served",
    "paid",
    "cancelled",
]


def is_staff_or_admin(user):
    return bool(
        user
        and user.is_authenticated
        and getattr(user, "role", None) in ["staff", "admin"]
    )