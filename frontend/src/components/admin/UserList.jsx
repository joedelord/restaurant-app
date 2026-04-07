import { useTranslation } from "react-i18next";
import Button from "../ui/Button";

const UserList = ({ items, onEdit, onDelete }) => {
  const { t } = useTranslation();

  if (!items.length) {
    return (
      <div className="mx-auto w-full rounded-md border border-black p-5">
        <p className="text-sm text-body">{t("admin.users.empty")}</p>
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
                {t("admin.users.fields.name")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("admin.users.fields.email")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("admin.users.fields.phone")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("admin.users.fields.role")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("admin.users.fields.active")}
              </th>
              <th className="px-3 py-3 font-medium">
                {t("admin.users.fields.actions")}
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
                  {item.first_name} {item.last_name}
                </td>

                <td className="px-3 py-4 text-body">{item.email}</td>

                <td className="px-3 py-4 text-body">
                  {item.phone_number || "-"}
                </td>

                <td className="px-3 py-4 text-body">
                  {t(`admin.users.roles.${item.role}`)}
                </td>

                <td className="px-3 py-4 text-body">
                  {item.is_active
                    ? t("admin.users.values.yes")
                    : t("admin.users.values.no")}
                </td>

                <td className="px-3 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => onEdit(item)}
                    >
                      {t("admin.users.actions.edit")}
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(item)}
                    >
                      {t("admin.users.actions.delete")}
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

export default UserList;
