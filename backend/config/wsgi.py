"""
wsgi.py

WSGI configuration for the restaurant management system.

This file exposes the WSGI callable as a module-level variable named
"application". It is used by WSGI-compatible web servers to serve the
application in synchronous environments.

Typical use cases:
- Production deployments with WSGI servers (e.g., Gunicorn, uWSGI)
- Standard Django hosting setups

For more information:
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application = get_wsgi_application()