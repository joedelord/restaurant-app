from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import RestaurantTable, Reservation, Category, MenuItem, Order
from .permissions import IsAdmin, IsStaffOrAdmin, IsOwnerOrStaffOrAdmin
from .serializers import (
    UserSerializer,
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
    OrderStatusUpdateSerializer,
    AdminUserSerializer
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


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
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


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrStaffOrAdmin]

    def get_queryset(self):
        return (
            Order.objects.select_related("reservation", "table")
            .prefetch_related("items__menu_item")
            .all()
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