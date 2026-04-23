import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { useTranslation } from "react-i18next";
import TableForm from "../../features/admin/TableForm";
import TableList from "../../features/admin/TableList";
import useTables from "../../hooks/useTables";

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
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => navigate("/admin")}
          className="inline-flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {t("staff.navigation.backToDashboard")}
        </Button>
      </div>
      <h1 className="text-center text-3xl font-bold">
        {t("admin.tables.title")}
      </h1>

      <div className="mx-auto w-full max-w-4xl space-y-6">
        <p className="mt-2 text-center text-gray-500">
          {t("admin.tables.subtitle")}
        </p>

        {message && (
          <div className="rounded-base border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-base border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

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
              <div className="mx-auto w-full rounded-md border border-black p-5">
                <p className="text-sm text-body">{t("admin.tables.loading")}</p>
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
