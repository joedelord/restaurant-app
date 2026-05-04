/**
 * AdminTables
 *
 * Admin page for managing restaurant tables.
 *
 * Responsibilities:
 * - Uses AdminCrudPage for shared admin layout
 * - Uses useTables for table CRUD logic
 * - Controls form visibility with useCrudForm
 * - Handles create and update actions through a unified submit handler
 * - Passes form and list rendering to AdminCrudPage
 *
 * Notes:
 * - Form is only shown when adding or editing (not by default)
 * - TableForm handles form UI and validation
 * - TableList handles list rendering and actions
 */

import { useTranslation } from "react-i18next";
import AdminCrudPage from "../components/AdminCrudPage";
import TableForm from "../components/TableForm";
import TableList from "../components/TableList";
import useTables from "../hooks/useTables";
import { useCrudForm } from "../hooks/useCrudForm";

const AdminTables = () => {
  const { t } = useTranslation();

  const {
    tables,
    editingTable,
    loading,
    message,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    startEditing,
    cancelEditing,
  } = useTables();

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

  const handleEditClick = (table) => {
    openEditForm(table, startEditing);
  };

  const handleCancelForm = () => {
    closeForm(cancelEditing);
  };

  const handleSubmit = async (data) => {
    if (editingTable) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }

    closeAfterSubmit();
  };

  return (
    <AdminCrudPage
      title={t("admin.tables.title")}
      subtitle={t("admin.tables.subtitle")}
      listTitle={t("admin.tables.listTitle", {
        count: tables.length,
      })}
      addButtonText={t("admin.tables.actions.add")}
      formTitle={
        editingTable ? t("admin.tables.editTitle") : t("admin.tables.addTitle")
      }
      showForm={showForm}
      loading={loading}
      message={message}
      error={error}
      onAddClick={handleAddClick}
      renderForm={() => (
        <TableForm
          key={editingTable?.id ?? "new"}
          initialData={editingTable}
          submitText={
            editingTable
              ? t("admin.tables.actions.update")
              : t("admin.tables.actions.add")
          }
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
        />
      )}
      renderList={() => (
        <TableList
          items={tables}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      )}
    />
  );
};

export default AdminTables;
