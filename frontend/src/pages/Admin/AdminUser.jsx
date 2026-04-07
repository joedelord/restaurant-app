import UserForm from "../../components/admin/UserForm";
import UserList from "../../components/admin/UserList";
import useUsers from "../../hooks/useUsers";

const AdminUsers = () => {
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
    <div className="px-4 py-0">
      <h1 className="text-3xl font-bold text-center">User Management</h1>

      <div className="mx-auto w-full max-w-4xl space-y-6">
        <p className="mt-2 text-center text-gray-500">
          Add, edit and manage system users.
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
              {editingUser ? "Edit User" : "Add New User"}
            </h2>

            <UserForm
              key={editingUser?.id ?? "new"}
              initialData={editingUser}
              submitText={editingUser ? "Update User" : "Add User"}
              onSubmit={editingUser ? handleUpdate : handleCreate}
              onCancel={editingUser ? cancelEditing : undefined}
            />
          </div>

          <div>
            <h2 className="mb-3 text-center text-lg font-semibold text-heading">
              Users ({users.length})
            </h2>

            {loading ? (
              <div className="mx-auto w-full rounded-md border border-black p-5">
                <p className="text-sm text-body">Loading users...</p>
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
