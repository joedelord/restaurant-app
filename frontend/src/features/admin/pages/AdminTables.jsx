/**
 * AdminTables
 *
 * Admin page for managing restaurant tables.
 *
 * Responsibilities:
 * - Displays the table management layout
 * - Uses useTables to handle table data and actions
 * - Shows create and edit form states
 * - Displays table list with edit and delete actions
 * - Handles page-level loading, success and error messages
 * - Provides navigation back to the admin dashboard
 *
 * Notes:
 * - Table API logic and state management are handled in useTables
 * - Form and list rendering are delegated to TableForm and TableList
 */

import { useNavigate } from "react-router-dom";
import { BackButton, PageLoader, FormMessage } from "@/components";
import { useTranslation } from "react-i18next";
import TableForm from "../components/TableForm";
import TableList from "../components/TableList";
import useTables from "../hooks/useTables";

const AdminTables = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <BackButton />
      </div>
      <h1 className="text-center text-3xl font-bold">
        {t("admin.tables.title")}
      </h1>

      <div className="mx-auto w-full max-w-4xl space-y-6">
        <p className="mt-2 text-center text-gray-500">
          {t("admin.tables.subtitle")}
        </p>

        {message && <FormMessage type="success">{message}</FormMessage>}
        {error && <FormMessage type="error">{error}</FormMessage>}

        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-center text-lg font-semibold text-heading">
              {editingTable
                ? t("admin.tables.editTitle")
                : t("admin.tables.addTitle")}
            </h2>

            <TableForm
              key={editingTable?.id ?? "new"}
              initialData={editingTable}
              submitText={
                editingTable
                  ? t("admin.tables.actions.update")
                  : t("admin.tables.actions.add")
              }
              onSubmit={editingTable ? handleUpdate : handleCreate}
              onCancel={editingTable ? cancelEditing : undefined}
            />
          </div>

          <div>
            <h2 className="mb-3 text-center text-lg font-semibold text-heading">
              {t("admin.tables.listTitle", { count: tables.length })}
            </h2>

            {loading ? (
              <div className="mx-auto w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <PageLoader />
              </div>
            ) : (
              <TableList
                items={tables}
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

export default AdminTables;
