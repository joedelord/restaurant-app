/**
 * MenuItemList
 *
 * Displays menu items in the admin dashboard.
 *
 * Responsibilities:
 * - Renders menu items using AdminResponsiveList
 * - Shows name, price and category
 * - Provides edit and delete actions
 */

import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../../utils/currency";
import AdminResponsiveList from "./AdminResponsiveList";

const MenuItemList = ({ items, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const columns = [
    { key: "name", label: t("admin.menuItems.fields.name") },
    { key: "price", label: t("admin.menuItems.fields.price") },
    { key: "category", label: t("admin.menuItems.fields.category") },
  ];

  return (
    <AdminResponsiveList
      items={items}
      columns={columns}
      emptyText={t("admin.menuItems.empty")}
      onEdit={onEdit}
      onDelete={onDelete}
      editLabel={t("admin.menuItems.actions.edit")}
      deleteLabel={t("admin.menuItems.actions.delete")}
      renderTableRow={(item) => [
        <div className="flex flex-col">
          <span className="font-medium">{item.name_en} /</span>
          <span className="font-medium">{item.name_fi}</span>
        </div>,
        formatCurrency(item.price),
        item.category_name,
      ]}
      renderMobileCard={(item) => (
        <div className="space-y-1 text-sm">
          <div className="flex flex-col">
            <span className="font-medium">{item.name_en} /</span>
            <span className="font-medium">{item.name_fi}</span>
          </div>
          <p>
            <strong>{t("admin.menuItems.fields.price")}:</strong>{" "}
            {formatCurrency(item.price)}
          </p>
          <p>
            <strong>{t("admin.menuItems.fields.category")}:</strong>{" "}
            {item.category_name}
          </p>
        </div>
      )}
    />
  );
};

export default MenuItemList;
