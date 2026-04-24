/**
 * CategoryList
 *
 * Displays a list of menu categories in the admin dashboard.
 *
 * Responsibilities:
 * - Renders categories using AdminResponsiveList
 * - Provides edit and delete actions for each category
 * - Displays category name, description and display order
 */

import { useTranslation } from "react-i18next";
import AdminResponsiveList from "./AdminResponsiveList";

const CategoryName = ({ category }) => (
  <div className="flex flex-col">
    <span className="font-medium">{category.name_en || "-"}</span>
    <span className="text-gray-500">{category.name_fi || "-"}</span>
  </div>
);

const CategoryDescription = ({ category }) => (
  <div className="flex flex-col">
    <span>{category.description_en || "-"}</span>
    <span className="text-gray-500">{category.description_fi || "-"}</span>
  </div>
);

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
      renderTableRow={(category) => [
        <CategoryName category={category} />,
        <CategoryDescription category={category} />,
        category.display_order,
      ]}
      renderMobileCard={(category) => (
        <div className="space-y-2 text-sm">
          <CategoryName category={category} />

          <div>
            <strong>{t("admin.categories.fields.description")}:</strong>
            <div className="mt-1">
              <CategoryDescription category={category} />
            </div>
          </div>

          <p>
            <strong>{t("admin.categories.fields.order")}:</strong>{" "}
            {category.display_order}
          </p>
        </div>
      )}
    />
  );
};

export default CategoryList;
