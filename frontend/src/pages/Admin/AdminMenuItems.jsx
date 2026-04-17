import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import MenuItemForm from "../../components/admin/MenuItemForm";
import MenuItemList from "../../components/admin/MenuItemList";
import useMenuItems from "../../hooks/useMenuItems";
import { getCategories } from "../../services/categoryService";
import PageLoader from "../../components/ui/PageLoader";

const AdminMenuItems = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        {t("admin.menuItems.title")}
      </h1>

      <div className="mx-auto w-full max-w-4xl space-y-6">
        <p className="mt-2 text-center text-gray-500">
          {t("admin.menuItems.subtitle")}
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
              {editingMenuItem
                ? t("admin.menuItems.editTitle")
                : t("admin.menuItems.addTitle")}
            </h2>

            <MenuItemForm
              key={editingMenuItem?.id ?? "new"}
              categories={categories}
              initialData={editingMenuItem}
              submitText={
                editingMenuItem
                  ? t("admin.menuItems.actions.update")
                  : t("admin.menuItems.actions.add")
              }
              onSubmit={editingMenuItem ? handleUpdate : handleCreate}
              onCancel={editingMenuItem ? cancelEditing : undefined}
            />
          </div>

          <div>
            <h2 className="mb-3 text-center text-lg font-semibold text-heading">
              {t("admin.menuItems.listTitle", { count: menuItems.length })}
            </h2>

            {loading ? (
              <div className="mx-auto w-full rounded-md border border-black p-5">
                <PageLoader />
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
