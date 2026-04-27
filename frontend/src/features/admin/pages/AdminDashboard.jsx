/**
 * AdminDashboard
 *
 * Main dashboard page for administrator tools.
 *
 * Responsibilities:
 * - Displays admin navigation cards
 * - Provides quick links to user, menu, table and sales management
 * - Uses localized dashboard labels and descriptions
 * - Handles navigation to admin feature pages
 *
 * Notes:
 * - This page only defines dashboard structure and navigation
 * - Actual admin CRUD logic is handled in separate admin pages
 */

import {
  UsersIcon,
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
      title: t("admin.dashboard.tables.title"),
      description: t("admin.dashboard.tables.description"),
      icon: Squares2X2Icon,
      actions: [
        {
          label: t("admin.dashboard.tables.view"),
          path: "/admin/tables",
        },
      ],
    },
    {
      title: t("admin.dashboard.sales.title"),
      description: t("admin.dashboard.sales.description"),
      icon: ChartBarIcon,
      actions: [
        {
          label: t("admin.dashboard.sales.open"),
          path: "/admin/sales",
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
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

              <div
                className={`flex flex-col gap-3 ${
                  card.actions.length > 1 ? "mt-auto" : "mt-2"
                }`}
              >
                {card.actions.map((action) => (
                  <button
                    key={action.path}
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
