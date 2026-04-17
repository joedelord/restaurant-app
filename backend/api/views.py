from django.contrib.auth import get_user_model
from datetime import datetime, timedelta, time
from django.utils import timezone
from django.utils.dateparse import parse_date
from django.db.models import Sum, F, DecimalField, ExpressionWrapper

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import RestaurantTable, Reservation, Category, MenuItem, Order, OrderItem
from .permissions import IsAdmin, IsStaffOrAdmin, IsOwnerOrStaffOrAdmin
from .serializers import (
    UserProfileSerializer,
    UserRegisterSerializer,
    LoginSerializer,
    RestaurantTableSerializer,
    ReservationSerializer,
    ReservationStatusUpdateSerializer,
    CategorySerializer,
    MenuItemSerializer,
    AdminMenuItemSerializer,
    OrderSerializer,
    OrderCreateSerializer,
    OrderUpdateSerializer,
    OrderStatusUpdateSerializer,
    AdminUserSerializer,
    ChangePasswordSerializer,
)

User = get_user_model()


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class RestaurantTableListView(generics.ListAPIView):
    queryset = RestaurantTable.objects.filter(is_active=True).order_by("table_number")
    serializer_class = RestaurantTableSerializer
    permission_classes = [AllowAny]


class ReservationListCreateView(generics.ListCreateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        base_queryset = Reservation.objects.select_related("user", "table")

        if getattr(user, "role", None) in ["staff", "admin"]:
            return base_queryset.order_by("-reservation_time")

        return base_queryset.filter(user=user).order_by("-reservation_time")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReservationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaffOrAdmin]

    def get_queryset(self):
        return Reservation.objects.select_related("user", "table").all()
    

class ReservationStatusUpdateView(generics.UpdateAPIView):
    serializer_class = ReservationStatusUpdateSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaffOrAdmin]
    http_method_names = ["patch"]

    def get_queryset(self):
        return Reservation.objects.select_related("user", "table").all()


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        base_queryset = (
            Order.objects.select_related("reservation", "table")
            .prefetch_related("items__menu_item")
        )

        if getattr(user, "role", None) in ["staff", "admin"]:
            return base_queryset.order_by("-created_at")

        return base_queryset.filter(reservation__user=user).order_by("-created_at")


class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer
    permission_classes = [IsAuthenticated, IsStaffOrAdmin]


class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsStaffOrAdmin]

    def get_queryset(self):
        return (
            Order.objects.select_related("reservation", "table")
            .prefetch_related("items__menu_item")
            .all()
        )

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return OrderUpdateSerializer
        return OrderSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        locked_statuses = ["served", "paid"]

        if instance.status in locked_statuses:
            return Response(
                {"detail": "Served or paid orders cannot be deleted."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        self.perform_destroy(instance)
        return Response(
            {"detail": "Order deleted successfully."},
            status=status.HTTP_200_OK,
        )
    
    
class OrderStatusUpdateView(generics.UpdateAPIView):
    serializer_class = OrderStatusUpdateSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaffOrAdmin]
    http_method_names = ["patch"]

    def get_queryset(self):
        return (
            Order.objects.select_related("reservation", "table")
            .prefetch_related("items__menu_item")
            .all()
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        refreshed_instance = (
            Order.objects.select_related("reservation", "table")
            .prefetch_related("items__menu_item")
            .get(pk=instance.pk)
        )

        return Response(OrderSerializer(refreshed_instance).data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"detail": "Successfully logged out."},
                status=status.HTTP_205_RESET_CONTENT,
            )
        except TokenError:
            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )


# CATEGORY VIEWS

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all().order_by("display_order", "name_en")
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
        
class AdminCategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all().order_by("display_order", "name_en")
    serializer_class = CategorySerializer
    permission_classes = [IsAdmin]


class AdminCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdmin]


# MENU-ITEM VIEWS

class MenuItemListView(generics.ListAPIView):
    queryset = (
        MenuItem.objects.filter(is_available=True)
        .select_related("category")
        .order_by("category__display_order", "name_en")
    )
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]


class AdminMenuItemListCreateView(generics.ListCreateAPIView):
    queryset = MenuItem.objects.select_related("category").all().order_by(
        "category__display_order", "category__name_en", "name_en"
    )
    serializer_class = AdminMenuItemSerializer
    permission_classes = [IsAdmin]


class AdminMenuItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = AdminMenuItemSerializer
    permission_classes = [IsAdmin]


class AdminUserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all().order_by("last_name", "first_name", "email")
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdmin]


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdmin]


class ReservationAvailabilityView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        date_str = request.query_params.get("date")
        party_size = request.query_params.get("party_size")

        if not date_str:
            return Response({"detail": "date is required."}, status=400)

        if not party_size:
            return Response({"detail": "party_size is required."}, status=400)

        try:
            party_size = int(party_size)
            if party_size <= 0:
                raise ValueError
        except ValueError:
            return Response({"detail": "party_size must be a positive integer."}, status=400)

        selected_date = parse_date(date_str)
        if not selected_date:
            return Response({"detail": "Invalid date format."}, status=400)

        opening_hour = 12
        closing_hour = 22
        slot_minutes = 30
        reservation_duration = timedelta(hours=2)

        eligible_tables = RestaurantTable.objects.filter(
            is_active=True,
            seats__gte=party_size,
        ).order_by("table_number")

        blocking_statuses = ["pending", "confirmed"]

        day_start = timezone.make_aware(datetime.combine(selected_date, time(hour=0, minute=0)))
        day_end = timezone.make_aware(datetime.combine(selected_date, time(hour=23, minute=59, second=59)))

        reservations = Reservation.objects.filter(
            table__in=eligible_tables,
            status__in=blocking_statuses,
            reservation_time__gte=day_start - reservation_duration,
            reservation_time__lte=day_end + reservation_duration,
        ).select_related("table")

        slots = []
        current = timezone.make_aware(datetime.combine(selected_date, time(hour=opening_hour, minute=0)))
        end = timezone.make_aware(datetime.combine(selected_date, time(hour=closing_hour, minute=0)))

        while current < end:
            slot_end = current + reservation_duration
            free_tables = []

            for table in eligible_tables:
                overlapping_exists = reservations.filter(
                    table=table,
                    reservation_time__lt=slot_end,
                    reservation_time__gt=current - reservation_duration,
                ).exists()

                if not overlapping_exists:
                    free_tables.append(table.pk)

            slots.append({
                "time": current.strftime("%H:%M"),
                "available": len(free_tables) > 0,
                "available_tables": free_tables,
            })

            current += timedelta(minutes=slot_minutes)

        return Response({
            "date": selected_date.isoformat(),
            "party_size": party_size,
            "slots": slots,
        })
    

class AdminRestaurantTableListCreateView(generics.ListCreateAPIView):
    queryset = RestaurantTable.objects.all().order_by("table_number")
    serializer_class = RestaurantTableSerializer
    permission_classes = [IsAdmin]


class AdminRestaurantTableDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RestaurantTable.objects.all()
    serializer_class = RestaurantTableSerializer
    permission_classes = [IsAdmin]


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        validated_data: dict = serializer.validated_data # type: ignore
        new_password = validated_data["new_password"]

        user = request.user
        user.set_password(new_password)
        user.save()

        return Response(
            {"detail": "Password changed successfully."},
            status=status.HTTP_200_OK,
        )

class AdminSalesStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        revenue_expression = ExpressionWrapper(
            F("quantity") * F("price"),
            output_field=DecimalField(max_digits=12, decimal_places=2),
        )

        paid_items = OrderItem.objects.filter(order__status="paid").select_related(
            "menu_item__category"
        )

        top_items_queryset = (
            paid_items.values("menu_item_id", "name_en", "name_fi")
            .annotate(
                quantity_sold=Sum("quantity"),
                revenue=Sum(revenue_expression),
            )
            .order_by("-quantity_sold", "-revenue")[:5]
        )

        category_sales_queryset = (
            paid_items.values(
                "menu_item__category_id",
                "menu_item__category__name_en",
                "menu_item__category__name_fi",
            )
            .annotate(
                quantity_sold=Sum("quantity"),
                revenue=Sum(revenue_expression),
            )
            .order_by("-revenue", "-quantity_sold")
        )

        top_items = [
            {
                "id": item["menu_item_id"],
                "name_en": item["name_en"],
                "name_fi": item["name_fi"],
                "quantity_sold": item["quantity_sold"] or 0,
                "revenue": item["revenue"] or 0,
            }
            for item in top_items_queryset
        ]

        sales_by_category = [
            {
                "id": item["menu_item__category_id"],
                "name_en": item["menu_item__category__name_en"],
                "name_fi": item["menu_item__category__name_fi"],
                "quantity_sold": item["quantity_sold"] or 0,
                "revenue": item["revenue"] or 0,
            }
            for item in category_sales_queryset
        ]

        return Response(
            {
                "top_items": top_items,
                "sales_by_category": sales_by_category,
            }
        )