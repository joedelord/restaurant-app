import CategoryForm from "../../components/admin/CategoryForm";
import CategoryList from "../../components/admin/CategoryList";
import useCategories from "../../hooks/useCategories";
import PageLoader from "../../components/ui/PageLoader";

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
      <h1 className="text-3xl font-bold text-center">Category Management</h1>

      <div className="mx-auto w-full max-w-4xl space-y-6">
        <p className="text-gray-500 mt-2 text-center">
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

        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-lg font-semibold text-heading text-center">
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
            <h2 className="mb-3 text-lg font-semibold text-heading text-center">
              Categories ({categories.length})
            </h2>

            {loading ? (
              <div className="mx-auto w-full rounded-md border border-black p-5">
                <PageLoader />
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
