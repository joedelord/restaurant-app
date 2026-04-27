/**
 * AdminUsers
 *
 * Admin page for managing application users.
 *
 * Responsibilities:
 * - Displays the user management layout
 * - Uses useUsers to handle user data and actions
 * - Shows create and edit form states
 * - Displays user list with edit and delete actions
 * - Handles page-level loading, success and error messages
 * - Provides navigation back to the admin dashboard
 *
 * Notes:
 * - User API logic and state management are handled in useUsers
 * - Form and list rendering are delegated to UserForm and UserList
 */

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import PageLoader from "../../../components/ui/PageLoader";
import FormMessage from "../../../components/ui/FormMessage";
import { useTranslation } from "react-i18next";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";
import useUsers from "../hooks/useUsers";

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
          {t("admin.navigation.backToDashboard")}
        </Button>
      </div>
      <h1 className="text-3xl font-bold text-center">
        {t("admin.users.title")}
      </h1>

      <div className="mx-auto w-full max-w-4xl space-y-6">
        <p className="mt-2 text-center text-gray-500">
          {t("admin.users.subtitle")}
        </p>

        {message && <FormMessage type="success">{message}</FormMessage>}
        {error && <FormMessage type="error">{error}</FormMessage>}

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
                <PageLoader />
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
