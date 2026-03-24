import { useEffect, useState } from "react";
import CategoryForm from "../../components/admin/CategoryForm";
import CategoryList from "../../components/admin/CategoryList";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../services/categoryService";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      setError("");
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (payload) => {
    const created = await createCategory(payload);

    setCategories((prev) =>
      [...prev, created].sort(
        (a, b) =>
          a.display_order - b.display_order || a.name.localeCompare(b.name),
      ),
    );

    setMessage("Category created successfully.");
    setError("");
    setEditingCategory(null);
  };

  const handleUpdate = async (payload) => {
    if (!editingCategory) return;

    const updated = await updateCategory(editingCategory.id, payload);

    setCategories((prev) =>
      prev
        .map((item) => (item.id === editingCategory.id ? updated : item))
        .sort(
          (a, b) =>
            a.display_order - b.display_order || a.name.localeCompare(b.name),
        ),
    );

    setMessage("Category updated successfully.");
    setError("");
    setEditingCategory(null);
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete category "${item.name}"?`,
    );

    if (!confirmed) return;

    try {
      await deleteCategory(item.id);
      setCategories((prev) => prev.filter((cat) => cat.id !== item.id));

      if (editingCategory?.id === item.id) {
        setEditingCategory(null);
      }

      setMessage("Category deleted successfully.");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to delete category.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Category Management</h1>
          <p className="text-gray-500 mt-1">
            Add, edit and delete menu categories.
          </p>
        </div>
      </div>

      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold mb-3">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h2>

          <CategoryForm
            key={editingCategory?.id ?? "new"}
            initialData={editingCategory}
            submitText={editingCategory ? "Update Category" : "Add Category"}
            onSubmit={editingCategory ? handleUpdate : handleCreate}
            onCancel={
              editingCategory ? () => setEditingCategory(null) : undefined
            }
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">
            Categories ({categories.length})
          </h2>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <p className="text-gray-500">Loading categories...</p>
            </div>
          ) : (
            <CategoryList
              items={categories}
              onEdit={(item) => {
                setEditingCategory(item);
                setMessage("");
                setError("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onDelete={handleDelete}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminCategories;
