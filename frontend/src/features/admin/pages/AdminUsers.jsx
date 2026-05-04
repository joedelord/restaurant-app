/**
 * AdminUsers
 *
 * Admin page for managing application users.
 *
 * Responsibilities:
 * - Uses AdminCrudPage for shared admin layout
 * - Uses useUsers for user CRUD logic
 * - Controls form visibility with useCrudForm
 * - Handles create and update actions through a unified submit handler
 * - Passes form and list rendering to AdminCrudPage
 *
 * Notes:
 * - Form is only shown when adding or editing (not by default)
 * - UserForm handles form UI and validation
 * - UserList handles list rendering and actions
 */

import { useTranslation } from "react-i18next";
import AdminCrudPage from "../components/AdminCrudPage";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";
import useUsers from "../hooks/useUsers";
import { useCrudForm } from "../hooks/useCrudForm";

const AdminUsers = () => {
  const { t } = useTranslation();

  const {
    users,
    editingUser,
    loading,
    message,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    startEditing,
    cancelEditing,
  } = useUsers();

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

  const handleEditClick = (user) => {
    openEditForm(user, startEditing);
  };

  const handleCancelForm = () => {
    closeForm(cancelEditing);
  };

  const handleSubmit = async (data) => {
    if (editingUser) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }

    closeAfterSubmit();
  };

  return (
    <AdminCrudPage
      title={t("admin.users.title")}
      subtitle={t("admin.users.subtitle")}
      listTitle={t("admin.users.listTitle", {
        count: users.length,
      })}
      addButtonText={t("admin.users.actions.add")}
      formTitle={
        editingUser ? t("admin.users.editTitle") : t("admin.users.addTitle")
      }
      showForm={showForm}
      loading={loading}
      message={message}
      error={error}
      onAddClick={handleAddClick}
      renderForm={() => (
        <UserForm
          key={editingUser?.id ?? "new"}
          initialData={editingUser}
          submitText={
            editingUser
              ? t("admin.users.actions.update")
              : t("admin.users.actions.add")
          }
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
        />
      )}
      renderList={() => (
        <UserList
          items={users}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      )}
    />
  );
};

export default AdminUsers;
