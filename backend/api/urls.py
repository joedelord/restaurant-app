from django.urls import path
from . import views

urlpatterns = [
    # AUTH / USERS
    path("users/register/", views.CreateUserView.as_view(), name="user-register"),
    path("users/login/", views.LoginView.as_view(), name="user-login"),
    path("users/me/", views.MeView.as_view(), name="user-me"),
    path("users/logout/", views.LogoutView.as_view(), name="user-logout"),

    # TABLES
    path("tables/", views.RestaurantTableListView.as_view(), name="table-list"),

    # MENU
    path("categories/", views.CategoryListView.as_view(), name="category-list"),
    path("admin/categories/", views.AdminCategoryListCreateView.as_view(), name="admin-category-list-create"),
    path("admin/categories/<int:pk>/", views.AdminCategoryDetailView.as_view(), name="admin-category-detail"),
    path("menu-items/", views.MenuItemListView.as_view(), name="menu-item-list"),

    # RESERVATIONS
    path("reservations/", views.ReservationListCreateView.as_view(), name="reservation-list-create"),
    path("reservations/<int:pk>/", views.ReservationDetailView.as_view(), name="reservation-detail"),
    path("reservations/<int:pk>/status/", views.ReservationStatusUpdateView.as_view(), name="reservation-status-update"),

    # ORDERS
    path("orders/", views.OrderListView.as_view(), name="order-list"),
    path("orders/create/", views.OrderCreateView.as_view(), name="order-create"),
    path("orders/<int:pk>/", views.OrderDetailView.as_view(), name="order-detail"),
    path("orders/<int:pk>/status/", views.OrderStatusUpdateView.as_view(), name="order-status-update"),
]