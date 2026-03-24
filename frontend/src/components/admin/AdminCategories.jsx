import CategoryForm from "../../components/admin/CategoryForm";
import CategoryList from "../../components/admin/CategoryList";
import useCategories from "../../hooks/useCategories";

const AdminCategories = () => {
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

  return (
    <div className="px-4 py-0">
      <h1 className="m-10 text-center text-2xl">Category Management</h1>

      <div className="mx-auto w-full max-w-6xl space-y-6">
        <p className="text-center text-sm text-body">
          Add, edit and delete menu categories.
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

        <section className="grid gap-6 xl:grid-cols-2">
          <div>
            <h2 className="mb-3 text-lg font-semibold text-heading">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>

            <CategoryForm
              key={editingCategory?.id ?? "new"}
              initialData={editingCategory}
              submitText={editingCategory ? "Update Category" : "Add Category"}
              onSubmit={editingCategory ? handleUpdate : handleCreate}
              onCancel={editingCategory ? cancelEditing : undefined}
            />
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-heading">
              Categories ({categories.length})
            </h2>

            {loading ? (
              <div className="mx-auto w-full rounded-md border-2 border-black p-5">
                <p className="text-sm text-body">Loading categories...</p>
              </div>
            ) : (
              <CategoryList
                items={categories}
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

export default AdminCategories;
