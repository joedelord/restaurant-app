import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import StaffOrderCreateForm from "../../components/staff/StaffOrderCreateForm";
import Button from "../../components/ui/Button";

const StaffCreateOrder = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="px-4 py-0">
      <h1 className="text-center text-3xl font-bold">
        {t("staff.orders.createTitle")}
      </h1>

      <div className="mx-auto w-full max-w-5xl space-y-6">
        <p className="mt-2 text-center text-gray-500">
          {t("staff.orders.createSubtitle")}
        </p>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/staff/orders")}
          >
            {t("staff.orders.actions.backToOrders")}
          </Button>
        </div>

        <StaffOrderCreateForm
          onCreated={(createdOrder) => {
            navigate("/staff/orders", {
              state: {
                createdOrderId: createdOrder.id,
              },
            });
          }}
        />
      </div>
    </div>
  );
};

export default StaffCreateOrder;
