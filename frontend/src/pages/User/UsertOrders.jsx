import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";
import PageLoader from "../../components/ui/PageLoader";
import UserOrderList from "../../features/user/UserOrderList";
import useUserOrders from "../../hooks/useUserOrders";

const UserOrders = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { loading, message, error, activeOrders, pastOrders } = useUserOrders();

  return (
    <div className="px-4 py-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => navigate("/user")}
            className="inline-flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {t("user.navigation.backToDashboard")}
          </Button>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-heading">
            {t("user.orders.title")}
          </h1>
          <p className="mt-2 text-gray-500">{t("user.orders.subtitle")}</p>
        </div>

        {message && (
          <div className="mb-6 rounded-base border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-base border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mx-auto w-full rounded-md border border-black p-5">
            <PageLoader />
          </div>
        ) : (
          <div className="space-y-8">
            <section>
              <h2 className="mb-3 text-center text-lg font-semibold text-heading">
                {t("user.orders.sections.active", {
                  count: activeOrders.length,
                })}
              </h2>

              <UserOrderList
                items={activeOrders}
                emptyText={t("user.orders.emptyActive")}
              />
            </section>

            <section>
              <h2 className="mb-3 text-center text-lg font-semibold text-heading">
                {t("user.orders.sections.past", {
                  count: pastOrders.length,
                })}
              </h2>

              <UserOrderList
                items={pastOrders}
                emptyText={t("user.orders.emptyPast")}
              />
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
