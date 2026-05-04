/**
 * AdminCategories
 *
 * Admin page for managing menu categories.
 *
 * Responsibilities:
 * - Uses AdminCrudPage for shared admin layout
 * - Uses useCategories for category CRUD logic
 * - Controls form visibility with useCrudForm
 * - Handles create and update actions through a unified submit handler
 * - Passes form and list rendering to AdminCrudPage
 *
 * Notes:
 * - Form is only shown when adding or editing (not by default)
 * - CategoryForm handles form UI and validation
 * - CategoryList handles list rendering and actions
 */

import { useTranslation } from "react-i18next";
import AdminCrudPage from "../components/AdminCrudPage";
import CategoryForm from "../components/CategoryForm";
import CategoryList from "../components/CategoryList";
import useCategories from "../hooks/useCategories";
import { useCrudForm } from "../hooks/useCrudForm";

const AdminCategories = () => {
  const { t } = useTranslation();

  const {
    categories,
    editingCategory,
    loading,
    message,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    startEditing,
    cancelEditing,
  } = useCategories();

  const {
    showForm,
    openCreateForm,
    openEditForm,
    closeForm,
    closeAfterSubmit,
  } = useCrudForm();

  const handleAddClick = () => {
    openCreateForm(cancelEditing);
  };

  const handleEditClick = (category) => {
    openEditForm(category, startEditing);
  };

  const handleCancelForm = () => {
    closeForm(cancelEditing);
  };

  const handleSubmit = async (data) => {
    if (editingCategory) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }

    closeAfterSubmit();
  };

  return (
    <AdminCrudPage
      title={t("admin.categories.title")}
      subtitle={t("admin.categories.subtitle")}
      listTitle={t("admin.categories.listTitle", {
        count: categories.length,
      })}
      addButtonText={t("admin.categories.actions.add")}
      formTitle={
        editingCategory
          ? t("admin.categories.editTitle")
          : t("admin.categories.addTitle")
      }
      showForm={showForm}
      loading={loading}
      message={message}
      error={error}
      onAddClick={handleAddClick}
      renderForm={() => (
        <CategoryForm
          key={editingCategory?.id ?? "new"}
          initialData={editingCategory}
          submitText={
            editingCategory
              ? t("admin.categories.actions.update")
              : t("admin.categories.actions.add")
          }
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
        />
      )}
      renderList={() => (
        <CategoryList
          items={categories}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      )}
    />
  );
};

export default AdminCategories;
