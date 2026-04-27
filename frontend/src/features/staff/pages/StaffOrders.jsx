/**
 * StaffOrders
 *
 * Staff page for viewing and managing restaurant orders.
 *
 * Responsibilities:
 * - Displays the staff order management layout
 * - Uses useStaffOrders to handle order data and actions
 * - Shows edit form state for the selected order
 * - Displays order list with edit and delete actions
 * - Handles page-level loading, success and error messages
 * - Provides navigation back to the staff dashboard
 *
 * Notes:
 * - Order API logic and state management are handled in useStaffOrders
 * - Form and list rendering are delegated to StaffOrderForm and StaffOrderList
 */

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import { useTranslation } from "react-i18next";
import PageLoader from "../../../components/ui/PageLoader";
import StaffOrderForm from "../components/StaffOrderForm";
import StaffOrderList from "../components/StaffOrderList";
import useStaffOrders from "../hooks/useStaffOrders";

const StaffOrders = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    orders,
    editingOrder,
    loading,
    message,
    error,
    handleUpdate,
    handleDelete,
    startEditing,
    cancelEditing,
  } = useStaffOrders();

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => navigate("/staff")}
          className="inline-flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {t("staff.navigation.backToDashboard")}
        </Button>
      </div>
      <h1 className="text-center text-3xl font-bold">
        {t("staff.orders.title")}
      </h1>

      <div className="mx-auto w-full max-w-5xl space-y-6">
        <p className="mt-2 text-center text-gray-500">
          {t("staff.orders.subtitle")}
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

        <section className="space-y-6">
          {editingOrder && (
            <div>
              <h2 className="mb-3 text-center text-lg font-semibold text-heading">
                {t("staff.orders.editTitle")}
              </h2>

              <StaffOrderForm
                key={editingOrder.id}
                initialData={editingOrder}
                submitText={t("staff.orders.actions.update")}
                onSubmit={handleUpdate}
                onCancel={cancelEditing}
              />
            </div>
          )}

          <div>
            <h2 className="mb-3 text-center text-lg font-semibold text-heading">
              {t("staff.orders.listTitle", { count: orders.length })}
            </h2>

            {loading ? (
              <div className="mx-auto w-full rounded-md border border-black p-5">
                <PageLoader />
              </div>
            ) : (
              <StaffOrderList
                items={orders}
                onEdit={startEditing}
                onDelete={handleDelete}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StaffOrders;
