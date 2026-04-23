import { useTranslation } from "react-i18next";
import AdminResponsiveList from "./AdminResponsiveList";

const TableList = ({ items, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const columns = [
    { key: "table_number", label: t("admin.tables.fields.tableNumber") },
    { key: "seats", label: t("admin.tables.fields.seats") },
    { key: "status", label: t("admin.tables.fields.status") },
  ];

  return (
    <AdminResponsiveList
      items={items}
      columns={columns}
      emptyText={t("admin.tables.empty")}
      onEdit={onEdit}
      onDelete={onDelete}
      editLabel={t("admin.tables.actions.edit")}
      deleteLabel={t("admin.tables.actions.delete")}
      renderTableRow={(item) => [
        <span className="font-medium">{item.table_number}</span>,
        item.seats,
        item.is_active
          ? t("admin.tables.values.active")
          : t("admin.tables.values.inactive"),
      ]}
      renderMobileCard={(item) => (
        <div className="space-y-1 text-sm">
          <p>
            <strong>{t("admin.tables.fields.tableNumber")}:</strong>{" "}
            {item.table_number}
          </p>
          <p>
            <strong>{t("admin.tables.fields.seats")}:</strong> {item.seats}
          </p>
          <p>
            <strong>{t("admin.tables.fields.status")}:</strong>{" "}
            {item.is_active
              ? t("admin.tables.values.active")
              : t("admin.tables.values.inactive")}
          </p>
        </div>
      )}
    />
  );
};

export default TableList;
