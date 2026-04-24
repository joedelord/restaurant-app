/**
 * UserList
 *
 * Displays users in the admin dashboard.
 *
 * Responsibilities:
 * - Renders users using AdminResponsiveList
 * - Shows user name, email, phone, active status and role
 * - Provides edit and delete actions for each user
 */

import { useTranslation } from "react-i18next";
import AdminResponsiveList from "./AdminResponsiveList";

const getUserFullName = (user) => {
  return [user.first_name, user.last_name].filter(Boolean).join(" ") || "-";
};

const getActiveStatusLabel = (user, t) => {
  return user.is_active
    ? t("admin.users.values.yes")
    : t("admin.users.values.no");
};

const UserList = ({ items, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const columns = [
    { key: "name", label: t("admin.users.fields.name") },
    { key: "email", label: t("admin.users.fields.email") },
    { key: "phone", label: t("admin.users.fields.phone") },
    { key: "active", label: t("admin.users.fields.active") },
    { key: "role", label: t("admin.users.fields.role") },
  ];

  return (
    <AdminResponsiveList
      items={items}
      columns={columns}
      emptyText={t("admin.users.empty")}
      onEdit={onEdit}
      onDelete={onDelete}
      editLabel={t("admin.users.actions.edit")}
      deleteLabel={t("admin.users.actions.delete")}
      renderTableRow={(user) => [
        getUserFullName(user),
        user.email,
        user.phone_number || "-",
        getActiveStatusLabel(user, t),
        user.role,
      ]}
      renderMobileCard={(user) => (
        <div className="space-y-1 text-sm">
          <p>
            <strong>{t("admin.users.fields.name")}:</strong>{" "}
            {getUserFullName(user)}
          </p>
          <p>
            <strong>{t("admin.users.fields.email")}:</strong> {user.email}
          </p>
          <p>
            <strong>{t("admin.users.fields.phone")}:</strong>{" "}
            {user.phone_number || "-"}
          </p>
          <p>
            <strong>{t("admin.users.fields.active")}:</strong>{" "}
            {getActiveStatusLabel(user, t)}
          </p>
          <p>
            <strong>{t("admin.users.fields.role")}:</strong> {user.role}
          </p>
        </div>
      )}
    />
  );
};

export default UserList;
