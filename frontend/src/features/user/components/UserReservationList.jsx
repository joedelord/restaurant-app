/**
 * UserReservationList
 *
 * Displays the current user's reservations.
 *
 * Responsibilities:
 * - Shows upcoming and past reservations
 * - Displays reservation date, time, table and status information
 * - Provides a clear empty state when there are no reservations
 */

import { useTranslation } from "react-i18next";
import Button from "../../../components/ui/Button";

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
    case "completed":
      return "bg-blue-100 text-blue-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const ReservationStatusBadge = ({ status, label }) => (
  <span
    className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${getStatusClass(
      status,
    )}`}
  >
    {label}
  </span>
);

const UserReservationList = ({ items, emptyText, onCancel, canCancel }) => {
  const { t } = useTranslation();

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
                {t("user.reservations.fields.table")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("user.reservations.fields.partySize")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("user.reservations.fields.time")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("user.reservations.fields.status")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("user.reservations.fields.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-default-medium last:border-b-0"
              >
                <td className="px-3 py-4 text-body">
                  {item.table?.table_number || "-"}
                </td>

                <td className="px-3 py-4 text-body">{item.party_size}</td>

                <td className="px-3 py-4 text-body">
                  {formatDateTime(item.reservation_time)}
                </td>

                <td className="px-3 py-4 text-body">
                  <ReservationStatusBadge
                    status={item.status}
                    label={t(`user.reservations.statuses.${item.status}`)}
                  />
                </td>

                <td className="px-3 py-4">
                  {canCancel(item) ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() => onCancel(item)}
                    >
                      {t("user.reservations.actions.cancel")}
                    </Button>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
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
            <p className="font-medium text-heading">
              {t("user.reservations.fields.table")}{" "}
              {item.table?.table_number || "-"}
            </p>

            <p className="mt-2">
              <strong>{t("user.reservations.fields.partySize")}:</strong>{" "}
              {item.party_size}
            </p>

            <p className="mt-2">
              <strong>{t("user.reservations.fields.time")}:</strong>{" "}
              {formatDateTime(item.reservation_time)}
            </p>

            <p className="mt-2">
              <strong>{t("user.reservations.fields.status")}:</strong>{" "}
              <ReservationStatusBadge
                status={item.status}
                label={t(`user.reservations.statuses.${item.status}`)}
              />
            </p>

            <div className="mt-4">
              {canCancel(item) ? (
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  onClick={() => onCancel(item)}
                >
                  {t("user.reservations.actions.cancel")}
                </Button>
              ) : (
                <span className="text-sm text-gray-400">-</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReservationList;
