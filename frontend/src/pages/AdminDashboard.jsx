import {
  UsersIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Users",
      description: "Manage users, roles and permissions",
      icon: UsersIcon,
      actions: [
        { label: "View users", path: "/admin/users" },
        { label: "Edit roles", path: "/admin/roles" },
      ],
    },
    {
      title: "Menu",
      description: "Manage categories and menu items",
      icon: BookOpenIcon,
      actions: [
        { label: "Categories", path: "/admin/categories" },
        { label: "Menu items", path: "/admin/menu" },
      ],
    },
    {
      title: "Reservations",
      description: "Manage table reservations",
      icon: ClipboardDocumentListIcon,
      actions: [{ label: "All reservations", path: "/admin/reservations" }],
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-2">Manage restaurant system and data</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 p-6 flex flex-col"
            >
              {/* Icon + Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {card.title}
                </h2>
              </div>

              {/* Description */}
              <p className="text-gray-500 mb-6 text-sm">{card.description}</p>

              {/* Actions */}
              <div className="mt-auto flex flex-col gap-2">
                {card.actions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(action.path)}
                    className="w-full text-left px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition text-sm font-medium"
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
