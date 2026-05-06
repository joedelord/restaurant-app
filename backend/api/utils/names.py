"""
names.py

Name validation helpers.
"""

import re

from django.utils.translation import gettext_lazy as _

from rest_framework import serializers


NAME_PATTERN = r"[A-Za-zÀ-ÖØ-öø-ÿĀ-ž\s'-]+"


def validate_first_name(value):
    """
    Validate first name.
    """

    value = value.strip()

    if not value:
        raise serializers.ValidationError(
            _("First name is required.")
        )

    if len(value) < 2:
        raise serializers.ValidationError(
            _("First name must contain at least 2 characters.")
        )

    if not re.fullmatch(NAME_PATTERN, value):
        raise serializers.ValidationError(
            _("First name can only contain letters, spaces, hyphens and apostrophes.")
        )

    return value


def validate_last_name(value):
    """
    Validate last name.
    """

    value = value.strip()

    if not value:
        raise serializers.ValidationError(
            _("Last name is required.")
        )

    if len(value) < 2:
        raise serializers.ValidationError(
            _("Last name must contain at least 2 characters.")
        )

    if not re.fullmatch(NAME_PATTERN, value):
        raise serializers.ValidationError(
            _("Last name can only contain letters, spaces, hyphens and apostrophes.")
        )

    return value