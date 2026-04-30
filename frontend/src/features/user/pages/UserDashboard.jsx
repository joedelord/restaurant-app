/**
 * UserDashboard
 *
 * Main dashboard page for end users.
 *
 * Responsibilities:
 * - Displays user navigation cards
 * - Provides access to profile management and user activity
 * - Uses localized labels and descriptions
 * - Handles navigation to user feature pages
 *
 * Notes:
 * - This page only defines dashboard structure and navigation
 * - Profile, reservations and order logic are handled in their respective pages
 */

import {
  UserCircleIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const cards = [
    {
      title: t("user.dashboard.profile.title"),
      description: t("user.dashboard.profile.description"),
      icon: UserCircleIcon,
      actions: [
        {
          label: t("user.dashboard.profile.edit"),
          path: "/user/profile",
        },
        {
          label: t("user.dashboard.profile.password"),
          path: "/user/change-password",
        },
      ],
    },
    {
      title: t("user.dashboard.activity.title"),
      description: t("user.dashboard.activity.description"),
      icon: ClipboardDocumentListIcon,
      actions: [
        {
          label: t("user.dashboard.activity.viewReservations"),
          path: "/user/reservations",
        },
        {
          label: t("user.dashboard.activity.viewOrders"),
          path: "/user/orders",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-10 text-center">
        <h1 className="mt-3 text-4xl font-bold text-gray-900">
          {t("user.dashboard.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          {t("user.dashboard.subtitle")}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
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
                {card.actions.map((action) => (
                  <button
                    key={action.path}
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

export default UserDashboard;
