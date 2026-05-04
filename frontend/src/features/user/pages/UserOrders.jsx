/**
 * UserOrders
 *
 * User page for viewing the authenticated user's orders.
 *
 * Responsibilities:
 * - Displays active and past orders in separate sections
 * - Uses useUserOrders to load order data
 * - Handles loading, success and error states
 * - Shows empty states for both order sections
 * - Provides navigation back to the user dashboard
 *
 * Notes:
 * - Order API logic and grouping are handled in useUserOrders
 * - List rendering is delegated to UserOrderList
 */

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BackButton, PageLoader, FormMessage } from "@/components";
import UserOrderList from "../components/UserOrderList";
import useUserOrders from "../hooks/useUserOrders";

const UserOrders = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { loading, message, error, activeOrders, pastOrders } = useUserOrders();

  return (
    <div className="px-4 py-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6">
          <BackButton />
        </div>

        <header className="mb-10 text-center">
          <h1 className="mt-3 text-4xl font-bold text-gray-900">
            {t("user.orders.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            {t("user.orders.subtitle")}
          </p>
        </header>

        <FormMessage message={message} variant="success" />
        <FormMessage message={error} variant="error" />

        {loading ? (
          <div className="mx-auto w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
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
