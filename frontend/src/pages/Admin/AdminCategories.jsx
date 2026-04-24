import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";
import CategoryForm from "../../features/admin/components/CategoryForm";
import CategoryList from "../../features/admin/components/CategoryList";
import useCategories from "../../features/admin/hooks/useCategories";
import PageLoader from "../../components/ui/PageLoader";

const AdminCategories = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        {t("admin.categories.title")}
      </h1>

      <div className="mx-auto w-full max-w-4xl space-y-6">
        <p className="mt-2 text-center text-gray-500">
          {t("admin.categories.subtitle")}
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
              {editingCategory
                ? t("admin.categories.editTitle")
                : t("admin.categories.addTitle")}
            </h2>

            <CategoryForm
              key={editingCategory?.id ?? "new"}
              initialData={editingCategory}
              submitText={
                editingCategory
                  ? t("admin.categories.actions.update")
                  : t("admin.categories.actions.add")
              }
              onSubmit={editingCategory ? handleUpdate : handleCreate}
              onCancel={editingCategory ? cancelEditing : undefined}
            />
          </div>

          <div>
            <h2 className="mb-3 text-center text-lg font-semibold text-heading">
              {t("admin.categories.listTitle", { count: categories.length })}
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
