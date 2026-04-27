import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PageLoader from "../../../components/ui/PageLoader";
import { getSalesStats } from "../services/salesStatsService";
import { formatCurrency } from "../../../utils/currency";

const AdminSales = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [topItems, setTopItems] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSalesStats = async () => {
      try {
        setError("");
        const data = await getSalesStats();
        setTopItems(data.top_items || []);
        setSalesByCategory(data.sales_by_category || []);
      } catch (err) {
        console.error(err);
        setError(t("admin.sales.messages.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchSalesStats();
  }, [t]);

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => navigate("/admin")}
          className="inline-flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {t("staff.navigation.backToDashboard")}
        </Button>
      </div>
      <h1 className="text-3xl font-bold text-center">
        {t("admin.sales.title")}
      </h1>

      <div className="mx-auto w-full max-w-5xl space-y-6">
        <p className="mt-2 text-center text-gray-500">
          {t("admin.sales.subtitle")}
        </p>

        {message && (
          <div className="rounded-base border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-base border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mx-auto w-full rounded-md border border-black p-5">
            <PageLoader />
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="mx-auto w-full rounded-md border border-black p-5">
              <h2 className="mb-4 text-center text-lg font-semibold text-heading">
                {t("admin.sales.topItems.title", { count: topItems.length })}
              </h2>

              {!topItems.length ? (
                <p className="text-sm text-body">
                  {t("admin.sales.topItems.empty")}
                </p>
              ) : (
                <div className="space-y-2">
                  {topItems.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center justify-between rounded-md border-b border-white/10 px-2 pb-3 last:border-0 hover:bg-white/5 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-brand">
                          {index + 1}.
                        </span>

                        <div>
                          <p className="text-sm font-medium text-heading">
                            {item.name_en} / {item.name_fi}
                          </p>
                          <p className="text-xs text-body">
                            {t("admin.sales.fields.quantitySold")}:{" "}
                            {item.quantity_sold}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-heading">
                        {formatCurrency(item.revenue)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mx-auto w-full rounded-md border border-black p-5">
              <h2 className="mb-4 text-center text-lg font-semibold text-heading">
                {t("admin.sales.categories.title", {
                  count: salesByCategory.length,
                })}
              </h2>

              {!salesByCategory.length ? (
                <p className="text-sm text-body">
                  {t("admin.sales.categories.empty")}
                </p>
              ) : (
                <div className="space-y-2">
                  {salesByCategory.map((category, index) => (
                    <div
                      key={`${category.id}-${index}`}
                      className="flex items-center justify-between rounded-md border-b border-white/10 px-2 pb-3 last:border-0 hover:bg-white/5 transition"
                    >
                      <div>
                        <p className="text-sm font-medium text-heading">
                          {category.name_en} / {category.name_fi}
                        </p>
                        <p className="text-xs text-body">
                          {t("admin.sales.fields.quantitySold")}:{" "}
                          {category.quantity_sold}
                        </p>
                      </div>

                      <p className="text-sm font-medium text-heading">
                        {formatCurrency(category.revenue)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminSales;
