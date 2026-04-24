/**
 * StaffOrderList
 *
 * Displays and manages orders for staff users.
 *
 * Responsibilities:
 * - Shows list of orders
 * - Displays table, item count, total price and status
 * - Provides edit and delete actions
 * - Uses AdminResponsiveList for responsive layout
 */

import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../../utils/currency";
import AdminResponsiveList from "../../admin/components/AdminResponsiveList";

const formatDateTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString("fi-FI", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const getStatusStyles = (status) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "preparing":
      return "bg-orange-100 text-orange-700";
    case "ready":
      return "bg-blue-100 text-blue-700";
    case "served":
      return "bg-indigo-100 text-indigo-700";
    case "paid":
      return "bg-emerald-100 text-emerald-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const OrderStatusBadge = ({ status, label }) => (
  <span
    className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${getStatusStyles(
      status,
    )}`}
  >
    {label}
  </span>
);

const getTableLabel = (item, t) => {
  return item.table?.table_number
    ? `${t("staff.orders.values.table")} ${item.table.table_number}`
    : "-";
};

const StaffOrderList = ({ items, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const columns = [
    { key: "id", label: t("staff.orders.fields.orderId") },
    { key: "table", label: t("staff.orders.fields.table") },
    { key: "items", label: t("staff.orders.fields.items") },
    { key: "total", label: t("staff.orders.fields.total") },
    { key: "status", label: t("staff.orders.fields.status") },
    { key: "createdAt", label: t("staff.orders.fields.createdAt") },
  ];

  return (
    <AdminResponsiveList
      items={items}
      columns={columns}
      emptyText={t("staff.orders.empty")}
      onEdit={onEdit}
      onDelete={onDelete}
      editLabel={t("staff.orders.actions.edit")}
      deleteLabel={t("staff.orders.actions.delete")}
      renderTableRow={(item) => [
        `#${item.id}`,
        getTableLabel(item, t),
        item.items?.length || 0,
        formatCurrency(item.total_price || 0),
        <OrderStatusBadge
          key={`status-${item.id}`}
          status={item.status}
          label={t(`staff.orders.statuses.${item.status || "pending"}`)}
        />,
        formatDateTime(item.created_at),
      ]}
      renderMobileCard={(item) => (
        <div className="space-y-2 text-sm">
          <p className="font-medium text-heading">#{item.id}</p>

          <p>
            <strong>{t("staff.orders.fields.table")}:</strong>{" "}
            {getTableLabel(item, t)}
          </p>

          <p>
            <strong>{t("staff.orders.fields.items")}:</strong>{" "}
            {item.items?.length || 0}
          </p>

          <p>
            <strong>{t("staff.orders.fields.total")}:</strong>{" "}
            {formatCurrency(item.total_price || 0)}
          </p>

          <p>
            <strong>{t("staff.orders.fields.status")}:</strong>{" "}
            <OrderStatusBadge
              status={item.status}
              label={t(`staff.orders.statuses.${item.status || "pending"}`)}
            />
          </p>

          <p>
            <strong>{t("staff.orders.fields.createdAt")}:</strong>{" "}
            {formatDateTime(item.created_at)}
          </p>
        </div>
      )}
    />
  );
};

export default StaffOrderList;
