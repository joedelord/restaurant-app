import { useEffect, useState } from "react";
import MenuItemForm from "../../components/admin/MenuItemForm";
import MenuItemList from "../../components/admin/MenuItemList";
import useMenuItems from "../../hooks/useMenuItems";
import { getCategories } from "../../services/categoryService";

const AdminMenuItems = () => {
  const {
    menuItems,
    editingMenuItem,
    loading,
    message,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    startEditing,
    cancelEditing,
  } = useMenuItems();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories for menu items form:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="px-4 py-0">
      <h1 className="text-3xl font-bold text-center">Menu Item Management</h1>

      <div className="mx-auto w-full max-w-4xl space-y-6">
        <p className="text-gray-500 mt-2 text-center">
          Add, edit and delete menu items.
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
              {editingMenuItem ? "Edit Menu Item" : "Add New Menu Item"}
            </h2>

            <MenuItemForm
              key={editingMenuItem?.id ?? "new"}
              categories={categories}
              initialData={editingMenuItem}
              submitText={
                editingMenuItem ? "Update Menu Item" : "Add Menu Item"
              }
              onSubmit={editingMenuItem ? handleUpdate : handleCreate}
              onCancel={editingMenuItem ? cancelEditing : undefined}
            />
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-heading text-center">
              Menu Items ({menuItems.length})
            </h2>

            {loading ? (
              <div className="mx-auto w-full rounded-md border-2 border-black p-5">
                <p className="text-sm text-body">Loading menu items...</p>
              </div>
            ) : (
              <MenuItemList
                items={menuItems}
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

export default AdminMenuItems;
