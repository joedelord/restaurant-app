#!/usr/bin/env python
"""
manage.py

Command-line utility for administrative tasks in the restaurant
management system.

This script is used to run Django management commands such as:
- runserver
- makemigrations
- migrate
- createsuperuser

It sets the default settings module and delegates execution to Django's
command-line interface.

For more information:
https://docs.djangoproject.com/en/6.0/ref/django-admin/
"""

import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and available "
            "on your PYTHONPATH? Did you forget to activate a virtual environment?"
        ) from exc

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()