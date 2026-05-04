/**
 * AdminCategories
 *
 * Admin page for managing menu categories.
 *
 * Responsibilities:
 * - Displays the category management layout
 * - Uses useCategories to handle category data and actions
 * - Shows create and edit form states
 * - Displays category list with edit and delete actions
 * - Handles page-level loading, success and error messages
 * - Provides navigation back to the admin dashboard
 *
 * Notes:
 * - Category API logic and state management are handled in useCategories
 * - Form and list rendering are delegated to CategoryForm and CategoryList
 */

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BackButton, PageLoader, FormMessage } from "@/components/";
import CategoryForm from "../components/CategoryForm";
import CategoryList from "../components/CategoryList";
import useCategories from "../hooks/useCategories";

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
        <BackButton />
      </div>

      <h1 className="text-3xl font-bold text-center">
        {t("admin.categories.title")}
      </h1>

      <div className="mx-auto w-full max-w-4xl space-y-6">
        <p className="mt-2 text-center text-gray-500">
          {t("admin.categories.subtitle")}
        </p>

        {message && <FormMessage type="success">{message}</FormMessage>}
        {error && <FormMessage type="error">{error}</FormMessage>}

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
