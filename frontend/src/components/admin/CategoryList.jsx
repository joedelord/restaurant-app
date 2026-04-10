import { useTranslation } from "react-i18next";
import AdminResponsiveList from "./AdminResponsiveList";

const CategoryList = ({ items, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const columns = [
    { key: "name", label: t("admin.categories.fields.name") },
    { key: "description", label: t("admin.categories.fields.description") },
    { key: "order", label: t("admin.categories.fields.order") },
  ];

  return (
    <AdminResponsiveList
      items={items}
      columns={columns}
      emptyText={t("admin.categories.empty")}
      onEdit={onEdit}
      onDelete={onDelete}
      editLabel={t("admin.categories.actions.edit")}
      deleteLabel={t("admin.categories.actions.delete")}
      renderTableRow={(cat) => [
        <div className="flex flex-col">
          <span className="font-medium">{cat.name_en} /</span>
          <span className="font-medium">{cat.name_fi}</span>
        </div>,
        <div className="flex flex-col">
          <span>{cat.description_en} /</span>
          <span>{cat.description_fi}</span>
        </div>,
        cat.display_order,
      ]}
      renderMobileCard={(cat) => (
        <div className="space-y-1 text-sm">
          <p>
            <strong>{t("admin.categories.fields.name")}:</strong> {cat.name}
          </p>
          <p>
            <strong>{t("admin.categories.fields.order")}:</strong>{" "}
            {cat.display_order}
          </p>
        </div>
      )}
    />
  );
};

export default CategoryList;
