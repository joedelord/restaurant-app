from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import RestaurantTable, Reservation, Category, MenuItem, Order
from .serializers import (
    UserSerializer,
    UserRegisterSerializer,
    LoginSerializer,
    RestaurantTableSerializer,
    ReservationSerializer,
    CategorySerializer,
    MenuItemSerializer,
    OrderSerializer,
    OrderCreateSerializer,
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


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all().order_by("display_order", "name")
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class MenuItemListView(generics.ListAPIView):
    queryset = (
        MenuItem.objects.filter(is_available=True)
        .select_related("category")
        .order_by("category__display_order", "name")
    )
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]


class ReservationListCreateView(generics.ListCreateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if getattr(user, "role", None) in ["admin", "staff"]:
            return Reservation.objects.select_related("user", "table").order_by("-reservation_time")

        return (
            Reservation.objects.select_related("user", "table")
            .filter(user=user)
            .order_by("-reservation_time")
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReservationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if getattr(user, "role", None) in ["admin", "staff"]:
            return Reservation.objects.select_related("user", "table").all()

        return Reservation.objects.select_related("user", "table").filter(user=user)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if getattr(user, "role", None) in ["admin", "staff"]:
            return (
                Order.objects.select_related("reservation", "table")
                .prefetch_related("items__menu_item")
                .order_by("-created_at")
            )

        return (
            Order.objects.select_related("reservation", "table")
            .prefetch_related("items__menu_item")
            .filter(reservation__user=user)
            .order_by("-created_at")
        )


class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer
    permission_classes = [IsAuthenticated]


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if getattr(user, "role", None) in ["admin", "staff"]:
            return Order.objects.select_related("reservation", "table").prefetch_related("items__menu_item")

        return (
            Order.objects.select_related("reservation", "table")
            .prefetch_related("items__menu_item")
            .filter(reservation__user=user)
        )
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)