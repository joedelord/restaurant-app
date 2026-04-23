"""
asgi.py

ASGI configuration for the restaurant management system.

This file exposes the ASGI callable as a module-level variable named
"application". It is used by ASGI-compatible web servers to serve the
application, especially in asynchronous environments.

Typical use cases:
- Production deployments with ASGI servers (e.g., Uvicorn, Daphne)
- WebSocket support (if implemented later)

For more information:
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application = get_asgi_application()