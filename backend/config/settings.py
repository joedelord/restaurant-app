"""
settings.py

Main Django settings for the restaurant management system.

This file contains project configuration for:
- environment variables
- installed apps
- middleware
- database connection
- authentication and JWT
- internationalization
- static files
- CORS and security settings

Environment-specific secrets and deployment values are loaded from the
.env file in the project root.
"""

import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv


# =========================
# PATHS & ENVIRONMENT
# =========================

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")


def get_env_list(key):
    return [
        item.strip()
        for item in os.getenv(key, "").split(",")
        if item.strip()
    ]


# =========================
# CORE SETTINGS
# =========================

SECRET_KEY = os.getenv("SECRET_KEY")
DEBUG = os.getenv("DEBUG", "False") == "True"
ALLOWED_HOSTS = get_env_list("ALLOWED_HOSTS")


# =========================
# APPLICATIONS
# =========================

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "api",
]


# =========================
# MIDDLEWARE
# =========================

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# =========================
# URLS / TEMPLATES / WSGI
# =========================

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# =========================
# DATABASE
# =========================

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST"),
        "PORT": os.getenv("DB_PORT"),
    }
}


# =========================
# AUTHENTICATION
# =========================

AUTH_USER_MODEL = "api.User"

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# =========================
# INTERNATIONALIZATION
# =========================

LANGUAGE_CODE = "fi"
TIME_ZONE = "Europe/Helsinki"
USE_I18N = True
USE_TZ = True

LANGUAGES = [
    ("fi", "Finnish"),
    ("en", "English"),
]

LOCALE_PATHS = [BASE_DIR / "locale"]


# =========================
# STATIC FILES
# =========================

STATIC_URL = "static/"


# =========================
# DEFAULT PRIMARY KEY FIELD TYPE
# =========================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# =========================
# DJANGO REST FRAMEWORK
# =========================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),
}


# =========================
# JWT
# =========================

SIMPLE_JWT = {
    "SIGNING_KEY": os.getenv("JWT_SECRET", SECRET_KEY),
    "ALGORITHM": "HS256",
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "AUTH_HEADER_TYPES": ("Bearer",),
}


# =========================
# CORS
# =========================

CORS_ALLOWED_ORIGINS = get_env_list("CORS_ALLOWED_ORIGINS")
CORS_ALLOW_CREDENTIALS = True


# =========================
# CSRF
# =========================

CSRF_TRUSTED_ORIGINS = get_env_list("CSRF_TRUSTED_ORIGINS")


# =========================
# SECURITY
# =========================

if not DEBUG:
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")