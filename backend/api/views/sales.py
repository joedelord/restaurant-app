"""
sales.py

Admin sales statistics API views.
"""

from django.db.models import Sum, F, DecimalField, ExpressionWrapper

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import OrderItem
from api.permissions import IsAdmin


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