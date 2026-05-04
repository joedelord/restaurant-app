/**
 * AdminMenuItems
 *
 * Admin page for managing restaurant menu items.
 *
 * Responsibilities:
 * - Uses AdminCrudPage for shared admin layout
 * - Uses useMenuItems for menu item CRUD logic
 * - Fetches categories for the form select field
 * - Controls form visibility with useCrudForm
 * - Handles create and update actions through a unified submit handler
 * - Passes form and list rendering to AdminCrudPage
 *
 * Notes:
 * - Form is only shown when adding or editing (not by default)
 * - MenuItemForm handles form UI and validation
 * - MenuItemList handles list rendering and actions
 * - Category data is required for menu item creation/editing
 */

/**
 * AdminMenuItems
 *
 * Admin page for managing restaurant menu items.
 */

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import AdminCrudPage from "../components/AdminCrudPage";
import MenuItemForm from "../components/MenuItemForm";
import MenuItemList from "../components/MenuItemList";
import useMenuItems from "../hooks/useMenuItems";
import { getCategories } from "../services/categoryService";
import { useCrudForm } from "../hooks/useCrudForm";

const AdminMenuItems = () => {
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

  const {
    showForm,
    openCreateForm,
    openEditForm,
    closeForm,
    closeAfterSubmit,
  } = useCrudForm();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleAddClick = () => {
    openCreateForm(cancelEditing);
  };

  const handleEditClick = (item) => {
    openEditForm(item, startEditing);
  };

  const handleCancelForm = () => {
    closeForm(cancelEditing);
  };

  const handleSubmit = async (data) => {
    if (editingMenuItem) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }

    closeAfterSubmit();
  };

  return (
    <AdminCrudPage
      title={t("admin.menuItems.title")}
      subtitle={t("admin.menuItems.subtitle")}
      listTitle={t("admin.menuItems.listTitle", {
        count: menuItems.length,
      })}
      addButtonText={t("admin.menuItems.actions.add")}
      formTitle={
        editingMenuItem
          ? t("admin.menuItems.editTitle")
          : t("admin.menuItems.addTitle")
      }
      showForm={showForm}
      loading={loading}
      message={message}
      error={error}
      onAddClick={handleAddClick}
      renderForm={() => (
        <MenuItemForm
          key={editingMenuItem?.id ?? "new"}
          categories={categories}
          initialData={editingMenuItem}
          submitText={
            editingMenuItem
              ? t("admin.menuItems.actions.update")
              : t("admin.menuItems.actions.add")
          }
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
        />
      )}
      renderList={() => (
        <MenuItemList
          items={menuItems}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      )}
    />
  );
};

export default AdminMenuItems;
