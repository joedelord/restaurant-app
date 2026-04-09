import { useTranslation } from "react-i18next";
import Button from "../ui/Button";

const TableList = ({ items, onEdit, onDelete }) => {
  const { t } = useTranslation();

  if (!items.length) {
    return (
      <div className="mx-auto w-full rounded-md border border-black p-5">
        <p className="text-sm text-body">{t("admin.tables.empty")}</p>
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
                {t("admin.tables.fields.tableNumber")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("admin.tables.fields.seats")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("admin.tables.fields.status")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("admin.tables.fields.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-default-medium last:border-b-0"
              >
                <td className="px-3 py-4 font-medium text-heading">
                  {item.table_number}
                </td>

                <td className="px-3 py-4 text-body">{item.seats}</td>

                <td className="px-3 py-4 text-body">
                  {item.is_active
                    ? t("admin.tables.values.active")
                    : t("admin.tables.values.inactive")}
                </td>

                <td className="px-3 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => onEdit(item)}
                    >
                      {t("admin.tables.actions.edit")}
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(item)}
                    >
                      {t("admin.tables.actions.delete")}
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

export default TableList;
