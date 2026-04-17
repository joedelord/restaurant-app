import { useTranslation } from "react-i18next";
import Button from "../ui/Button";

const formatDateTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString("fi-FI", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const StaffPendingReservationList = ({
  items,
  actionLoadingId,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();

  if (!items.length) {
    return (
      <div className="mx-auto w-full rounded-md border border-black p-5">
        <p className="text-sm text-body">
          {t("staff.pendingReservations.empty")}
        </p>
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
                {t("staff.pendingReservations.fields.customer")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("staff.pendingReservations.fields.table")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("staff.pendingReservations.fields.partySize")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("staff.pendingReservations.fields.time")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("staff.pendingReservations.fields.notes")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("staff.pendingReservations.fields.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const isLoading = actionLoadingId === item.id;

              return (
                <tr
                  key={item.id}
                  className="border-b border-default-medium last:border-b-0"
                >
                  <td className="px-3 py-4 text-body">
                    {item.user
                      ? `${item.user.first_name || ""} ${item.user.last_name || ""}`.trim() ||
                        item.user.email
                      : "-"}
                  </td>

                  <td className="px-3 py-4 text-body">
                    {item.table?.table_number || "-"}
                  </td>

                  <td className="px-3 py-4 text-body">{item.party_size}</td>

                  <td className="px-3 py-4 text-body">
                    {formatDateTime(item.reservation_time)}
                  </td>

                  <td className="max-w-xs px-3 py-4 text-body">
                    {item.special_requests || "-"}
                  </td>

                  <td className="px-3 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        onClick={() => onConfirm(item)}
                        disabled={isLoading}
                      >
                        {t("staff.pendingReservations.actions.confirm")}
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="danger"
                        onClick={() => onCancel(item)}
                        disabled={isLoading}
                      >
                        {t("staff.pendingReservations.actions.cancel")}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {items.map((item) => {
          const isLoading = actionLoadingId === item.id;

          return (
            <div
              key={item.id}
              className="rounded-lg border border-default-medium p-4 text-sm"
            >
              <p className="font-medium text-heading">
                {item.user
                  ? `${item.user.first_name || ""} ${item.user.last_name || ""}`.trim() ||
                    item.user.email
                  : "-"}
              </p>

              <p className="mt-2">
                <strong>{t("staff.pendingReservations.fields.table")}:</strong>{" "}
                {item.table?.table_number || "-"}
              </p>

              <p className="mt-2">
                <strong>
                  {t("staff.pendingReservations.fields.partySize")}:
                </strong>{" "}
                {item.party_size}
              </p>

              <p className="mt-2">
                <strong>{t("staff.pendingReservations.fields.time")}:</strong>{" "}
                {formatDateTime(item.reservation_time)}
              </p>

              <p className="mt-2">
                <strong>{t("staff.pendingReservations.fields.notes")}:</strong>{" "}
                {item.special_requests || "-"}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={() => onConfirm(item)}
                  disabled={isLoading}
                >
                  {t("staff.pendingReservations.actions.confirm")}
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  onClick={() => onCancel(item)}
                  disabled={isLoading}
                >
                  {t("staff.pendingReservations.actions.cancel")}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StaffPendingReservationList;
