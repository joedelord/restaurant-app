/**
 * UserOrderList
 *
 * Displays the current user's orders.
 *
 * Responsibilities:
 * - Shows the user's order history
 * - Displays order status, related reservation and order items
 * - Provides a clear empty state when there are no orders
 */

import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../../utils/currency";

const formatDateTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString("fi-FI", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const getStatusClass = (status) => {
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
    className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${getStatusClass(
      status,
    )}`}
  >
    {label}
  </span>
);

const getItemSummary = (items = [], language = "fi") => {
  if (!items.length) return "-";

  return items
    .map((item) => {
      const name =
        language === "fi"
          ? item.name_fi || item.name_en
          : item.name_en || item.name_fi;

      return `${name} x ${item.quantity}`;
    })
    .join(", ");
};

const UserOrderList = ({ items, emptyText }) => {
  const { t, i18n } = useTranslation();

  if (!items.length) {
    return (
      <div className="mx-auto w-full rounded-md border border-black p-5">
        <p className="text-sm text-body">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full rounded-md border border-black p-5">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-default-medium">
            <tr className="text-heading">
              <th className="px-3 py-3 font-medium">
                {t("user.orders.fields.orderId")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("user.orders.fields.table")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("user.orders.fields.items")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("user.orders.fields.total")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("user.orders.fields.status")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("user.orders.fields.createdAt")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-default-medium last:border-b-0"
              >
                <td className="px-3 py-4 text-body">#{item.id}</td>

                <td className="px-3 py-4 text-body">
                  {item.table?.table_number
                    ? `${t("user.orders.values.table")} ${item.table.table_number}`
                    : "-"}
                </td>

                <td className="max-w-md px-3 py-4 text-body">
                  {getItemSummary(item.items, i18n.language)}
                </td>

                <td className="px-3 py-4 text-body">
                  {formatCurrency(item.total_price)}
                </td>

                <td className="px-3 py-4 text-body">
                  <OrderStatusBadge
                    status={item.status}
                    label={t(`user.orders.statuses.${item.status}`)}
                  />
                </td>

                <td className="px-3 py-4 text-body">
                  {formatDateTime(item.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-default-medium p-4 text-sm"
          >
            <p className="font-medium text-heading">#{item.id}</p>

            <p className="mt-2">
              <strong>{t("user.orders.fields.table")}:</strong>{" "}
              {item.table?.table_number
                ? `${t("user.orders.values.table")} ${item.table.table_number}`
                : "-"}
            </p>

            <p className="mt-2">
              <strong>{t("user.orders.fields.items")}:</strong>{" "}
              {getItemSummary(item.items, i18n.language)}
            </p>

            <p className="mt-2">
              <strong>{t("user.orders.fields.total")}:</strong>{" "}
              {formatCurrency(item.total_price)}
            </p>

            <p className="mt-2">
              <strong>{t("user.orders.fields.status")}:</strong>{" "}
              <OrderStatusBadge
                status={item.status}
                label={t(`user.orders.statuses.${item.status}`)}
              />
            </p>

            <p className="mt-2">
              <strong>{t("user.orders.fields.createdAt")}:</strong>{" "}
              {formatDateTime(item.created_at)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrderList;
