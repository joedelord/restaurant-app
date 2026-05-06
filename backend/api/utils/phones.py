"""
phones.py

Phone number validation helpers.
"""

import re

from django.utils.translation import gettext_lazy as _
from rest_framework import serializers


def validate_phone_number(value):
    """
    Validate optional phone number.

    Rules:
    - Empty value is allowed
    - Allows numbers, spaces, +, -, (, )
    - Must contain 7-15 digits if provided
    """

    if not value:
        return value

    value = value.strip()

    if not re.fullmatch(r"[\d\s+\-()]+", value):
        raise serializers.ValidationError(
            _("Phone number can only contain numbers, spaces, +, -, ( and ).")
        )

    digits_only = re.sub(r"\D", "", value)

    if len(digits_only) < 7 or len(digits_only) > 15:
        raise serializers.ValidationError(
            _("Phone number must contain 7-15 digits.")
        )

    return value