import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { useTranslation } from "react-i18next";
import UserForm from "../../features/admin/UserForm";
import UserList from "../../features/admin/UserList";
import useUsers from "../../hooks/useUsers";

const AdminUsers = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      <h1 className="text-3xl font-bold text-center">
        {t("admin.users.title")}
      </h1>

      <div className="mx-auto w-full max-w-4xl space-y-6">
        <p className="mt-2 text-center text-gray-500">
          {t("admin.users.subtitle")}
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
              {editingUser
                ? t("admin.users.editTitle")
                : t("admin.users.addTitle")}
            </h2>

            <UserForm
              key={editingUser?.id ?? "new"}
              initialData={editingUser}
              submitText={
                editingUser
                  ? t("admin.users.actions.update")
                  : t("admin.users.actions.add")
              }
              onSubmit={editingUser ? handleUpdate : handleCreate}
              onCancel={editingUser ? cancelEditing : undefined}
            />
          </div>

          <div>
            <h2 className="mb-3 text-center text-lg font-semibold text-heading">
              {t("admin.users.listTitle", { count: users.length })}
            </h2>

            {loading ? (
              <div className="mx-auto w-full rounded-md border border-black p-5">
                <p className="text-sm text-body">{t("admin.users.loading")}</p>
              </div>
            ) : (
              <UserList
                items={users}
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

export default AdminUsers;
