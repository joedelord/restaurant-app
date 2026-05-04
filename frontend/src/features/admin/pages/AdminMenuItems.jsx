/**
 * AdminMenuItems
 *
 * Admin page for managing restaurant menu items.
 *
 * Responsibilities:
 * - Displays the menu item management layout
 * - Uses useMenuItems to handle menu item data and actions
 * - Fetches categories for the menu item form
 * - Shows create and edit form states
 * - Displays menu item list with edit and delete actions
 * - Handles page-level loading, success and error messages
 * - Provides navigation back to the admin dashboard
 *
 * Notes:
 * - Menu item CRUD logic is handled in useMenuItems
 * - Category data is fetched separately because it is needed for the form select field
 * - Form and list rendering are delegated to MenuItemForm and MenuItemList
 */

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { BackButton, PageLoader, FormMessage } from "@/components/";
import MenuItemForm from "../components/MenuItemForm";
import MenuItemList from "../components/MenuItemList";
import useMenuItems from "../hooks/useMenuItems";
import { getCategories } from "../services/categoryService";

const AdminMenuItems = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    menuItems,
    editingMenuItem,
    loading,
    message,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    startEditing,
    cancelEditing,
  } = useMenuItems();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories for menu items form:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <BackButton />
      </div>

      <h1 className="text-3xl font-bold text-center">
        {t("admin.menuItems.title")}
      </h1>

      <div className="mx-auto w-full max-w-4xl space-y-6">
        <p className="mt-2 text-center text-gray-500">
          {t("admin.menuItems.subtitle")}
        </p>

        {message && <FormMessage type="success">{message}</FormMessage>}
        {error && <FormMessage type="error">{error}</FormMessage>}

        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-center text-lg font-semibold text-heading">
              {editingMenuItem
                ? t("admin.menuItems.editTitle")
                : t("admin.menuItems.addTitle")}
            </h2>

            <MenuItemForm
              key={editingMenuItem?.id ?? "new"}
              categories={categories}
              initialData={editingMenuItem}
              submitText={
                editingMenuItem
                  ? t("admin.menuItems.actions.update")
                  : t("admin.menuItems.actions.add")
              }
              onSubmit={editingMenuItem ? handleUpdate : handleCreate}
              onCancel={editingMenuItem ? cancelEditing : undefined}
            />
          </div>

          <div>
            <h2 className="mb-3 text-center text-lg font-semibold text-heading">
              {t("admin.menuItems.listTitle", { count: menuItems.length })}
            </h2>

            {loading ? (
              <div className="mx-auto w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <PageLoader />
              </div>
            ) : (
              <MenuItemList
                items={menuItems}
                onEdit={startEditing}
                onDelete={handleDelete}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminMenuItems;
