from django.db import models
from django.db.models import Q
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils.translation import get_language
from decimal import Decimal


# USER MANAGER
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "admin")

        return self.create_user(email, password, **extra_fields)


# USER MODEL
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ("customer", "Customer"),
        ("staff", "Staff"),
        ("admin", "Admin"),
    )

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=30, blank=True)

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="customer")
    marketing_consent = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


# TABLES
class RestaurantTable(models.Model):
    table_number = models.PositiveIntegerField(unique=True)
    seats = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Table {self.table_number}"


# RESERVATIONS
class Reservation(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reservations",
    )

    table = models.ForeignKey(
        RestaurantTable,
        on_delete=models.PROTECT,
        related_name="reservations",
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    reservation_time = models.DateTimeField()
    party_size = models.PositiveIntegerField()
    special_requests = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["reservation_time"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"Reservation {self.pk} - {self.user.email}"


# MENU
class Category(models.Model):
    name_en = models.CharField(max_length=100, unique=True)
    name_fi = models.CharField(max_length=100, unique=True)

    description_en = models.TextField(blank=True)
    description_fi = models.TextField(blank=True)

    display_order = models.PositiveIntegerField(unique=True)

    class Meta:
        ordering = ["display_order", "name_en"]

    def __str__(self):
        lang = get_language()

        if lang == "fi":
            return self.name_fi or self.name_en

        return self.name_en or self.name_fi


class MenuItem(models.Model):
    name_en = models.CharField(max_length=150, unique=True)
    name_fi = models.CharField(max_length=150, unique=True)

    description_en = models.TextField(blank=True)
    description_fi = models.TextField(blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(blank=True)

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="menu_items",
    )

    is_available = models.BooleanField(default=True)

    class Meta:
        ordering = ["category__display_order", "name_en"]

    def __str__(self):
        lang = get_language()

        if lang == "fi":
            return self.name_fi or self.name_en

        return self.name_en or self.name_fi


# ORDERS
class Order(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("preparing", "Preparing"),
        ("ready", "Ready"),
        ("served", "Served"),
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
    )

    reservation = models.ForeignKey(
        Reservation,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders",
    )

    table = models.ForeignKey(
        RestaurantTable,
        on_delete=models.PROTECT,
        related_name="orders",
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["reservation"],
                condition=Q(reservation__isnull=False),
                name="unique_order_per_reservation",
            )
        ]

    def __str__(self):
        return f"Order {self.pk}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
    )

    menu_item = models.ForeignKey(
        MenuItem,
        on_delete=models.PROTECT,
    )

    # snapshot tilaushetkeltä
    name_en = models.CharField(max_length=150)
    name_fi = models.CharField(max_length=150, blank=True)

    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        lang = get_language()

        if lang == "fi":
            return f"{self.name_fi or self.name_en} x {self.quantity}"

        return f"{self.name_en or self.name_fi} x {self.quantity}"