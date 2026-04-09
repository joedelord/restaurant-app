import {
  UsersIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
  Squares2X2Icon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const cards = [
    {
      title: t("admin.dashboard.users.title"),
      description: t("admin.dashboard.users.description"),
      icon: UsersIcon,
      actions: [
        {
          label: t("admin.dashboard.users.view"),
          path: "/admin/users",
        },
        {
          label: t("admin.dashboard.users.roles"),
          path: "/admin/roles",
        },
      ],
    },
    {
      title: t("admin.dashboard.menu.title"),
      description: t("admin.dashboard.menu.description"),
      icon: BookOpenIcon,
      actions: [
        {
          label: t("admin.dashboard.menu.categories"),
          path: "/admin/categories",
        },
        {
          label: t("admin.dashboard.menu.items"),
          path: "/admin/menu",
        },
      ],
    },
    {
      title: t("admin.dashboard.reservations.title"),
      description: t("admin.dashboard.reservations.description"),
      icon: ClipboardDocumentListIcon,
      actions: [
        {
          label: t("admin.dashboard.reservations.all"),
          path: "/admin/reservations",
        },
        {
          label: t("admin.dashboard.reservations.edit"),
          path: "/admin/edit-reservations",
        },
      ],
    },
    {
      title: t("admin.dashboard.tables.title"),
      description: t("admin.dashboard.tables.description"),
      icon: Squares2X2Icon,
      actions: [
        {
          label: t("admin.dashboard.tables.view"),
          path: "/admin/tables",
        },
        {
          label: t("admin.dashboard.tables.layout"),
          path: "/admin/tables/layout",
        },
      ],
    },
    {
      title: t("admin.dashboard.analytics.title"),
      description: t("admin.dashboard.analytics.description"),
      icon: ChartBarIcon,
      actions: [
        {
          label: t("admin.dashboard.analytics.overview"),
          path: "/admin/analytics",
        },
        {
          label: t("admin.dashboard.analytics.popular"),
          path: "/admin/analytics/popular",
        },
      ],
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          {t("admin.dashboard.title")}
        </h1>
        <p className="text-gray-500 mt-2 text-center">
          {t("admin.dashboard.subtitle")}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 p-6 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Icon className="h-6 w-6 text-gray-700" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {card.title}
                </h2>
              </div>

              <p className="text-gray-500 mb-6 text-sm">{card.description}</p>

              <div className="mt-auto flex flex-col gap-2">
                {card.actions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(action.path)}
                    className="w-full text-left px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-sm font-medium"
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

export default AdminDashboard;
