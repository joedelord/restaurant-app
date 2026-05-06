"""
emails.py

Email validation helpers.
"""

from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

from rest_framework import serializers

User = get_user_model()


def validate_email_address(value):
    """
    Validate and normalize email address.
    """

    email = value.strip().lower()

    if User.objects.filter(email__iexact=email).exists():
        raise serializers.ValidationError(
            _("A user with this email already exists.")
        )

    return email