import { useTranslation } from "react-i18next";
import Button from "../../../components/ui/Button";

const formatDateTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString("fi-FI", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const StaffReservationList = ({ items, onEdit, onDelete, emptyText }) => {
  const { t } = useTranslation();

  if (!items.length) {
    return (
      <div className="mx-auto w-full rounded-md border border-black p-5">
        <p className="text-sm text-body">
          {emptyText || t("staff.reservations.empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full rounded-md border border-black p-5">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-default-medium">
            <tr className="text-heading">
              <th className="px-3 py-3 font-medium">
                {t("staff.reservations.fields.customer")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("staff.reservations.fields.table")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("staff.reservations.fields.partySize")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("staff.reservations.fields.time")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("staff.reservations.fields.status")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("staff.reservations.fields.actions")}
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

                <td className="px-3 py-4 text-body">
                  {t(`staff.reservations.statuses.${item.status || "pending"}`)}
                </td>

                <td className="px-3 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => onEdit(item)}
                    >
                      {t("staff.reservations.actions.edit")}
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(item)}
                    >
                      {t("staff.reservations.actions.delete")}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffReservationList;
