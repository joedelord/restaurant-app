"""
apps.py

Application configuration for the API module.

This file defines the Django AppConfig for the "api" application,
including default settings such as the primary key field type
and a human-readable name for the Django Admin interface.

It is automatically used by Django when the application is loaded.
"""

from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"
    verbose_name = "Restaurant API"