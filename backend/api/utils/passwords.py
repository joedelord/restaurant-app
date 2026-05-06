"""
passwords.py

Password validation helpers.
"""

import re

from django.utils.translation import gettext_lazy as _

from rest_framework import serializers


def validate_password_strength(password):
    """
    Validate password strength requirements.

    Rules:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one number
    """

    if len(password) < 8:
        raise serializers.ValidationError(
            _("Password must contain at least 8 characters.")
        )

    if not re.search(r"[A-Z]", password):
        raise serializers.ValidationError(
            _("Password must contain at least one uppercase letter.")
        )

    if not re.search(r"\d", password):
        raise serializers.ValidationError(
            _("Password must contain at least one number.")
        )