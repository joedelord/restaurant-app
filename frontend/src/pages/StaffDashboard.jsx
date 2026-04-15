import {
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const cards = [
    {
      title: t("staff.dashboard.reservations.title"),
      description: t("staff.dashboard.reservations.description"),
      icon: ClipboardDocumentListIcon,
      actions: [
        {
          label: t("staff.dashboard.reservations.viewAll"),
          path: "/staff/reservations",
        },
        {
          label: t("staff.dashboard.reservations.manage"),
          path: "/staff/reservations/manage",
        },
      ],
    },
    {
      title: t("staff.dashboard.orders.title"),
      description: t("staff.dashboard.orders.description"),
      icon: ShoppingBagIcon,
      actions: [
        {
          label: t("staff.dashboard.orders.viewAll"),
          path: "/staff/orders",
        },
        {
          label: t("staff.dashboard.orders.create"),
          path: "/staff/orders/new",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-center text-3xl font-bold text-gray-900">
          {t("staff.dashboard.title")}
        </h1>
        <p className="mt-2 text-center text-gray-500">
          {t("staff.dashboard.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-lg"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <Icon className="h-6 w-6 text-gray-700" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {card.title}
                </h2>
              </div>

              <p className="mb-6 text-sm text-gray-500">{card.description}</p>

              <div className="mt-auto flex flex-col gap-2">
                {card.actions.map((action, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => navigate(action.path)}
                    className="w-full rounded-lg bg-gray-100 px-4 py-2 text-left text-sm font-medium transition hover:bg-gray-200"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StaffDashboard;
