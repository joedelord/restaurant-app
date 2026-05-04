/**
 * AdminCrudPage
 *
 * Reusable layout component for admin CRUD pages.
 *
 * Responsibilities:
 * - Provides a consistent layout for all admin management pages
 * - Displays page title, subtitle, and navigation (BackButton)
 * - Handles global UI states such as loading, success, and error messages
 * - Renders a configurable "Add" button for opening forms
 * - Conditionally displays a form section for create/edit actions
 * - Displays a list section with loading fallback'
 *
 * Notes:
 * - Designed to be used with useCrudForm for form state management
 * - Keeps layout and UI concerns separate from business logic
 * - Enables DRY pattern across admin pages (Users, Tables, Categories, MenuItems)
 * - Uses render props (renderForm, renderList) for maximum flexibility
 * - Ensures consistent spacing, typography, and responsive behavior
 */

import { BackButton, PageLoader, FormMessage, Button } from "@/components/";

const AdminCrudPage = ({
  title,
  subtitle,
  listTitle,
  addButtonText,
  formTitle,
  showForm,
  loading,
  message,
  error,
  onAddClick,
  renderForm,
  renderList,
}) => {
  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <BackButton />
      </div>

      <h1 className="text-center text-3xl font-bold">{title}</h1>

      <div className="mx-auto w-full max-w-4xl space-y-6">
        {subtitle && (
          <p className="mt-2 text-center text-gray-500">{subtitle}</p>
        )}

        {message && <FormMessage type="success">{message}</FormMessage>}
        {error && <FormMessage type="error">{error}</FormMessage>}

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-center text-lg font-semibold text-heading sm:text-left">
              {listTitle}
            </h2>

            <Button type="button" variant="primary" onClick={onAddClick}>
              {addButtonText}
            </Button>
          </div>

          {showForm && (
            <div>
              <h2 className="mb-3 text-center text-lg font-semibold text-heading">
                {formTitle}
              </h2>

              {renderForm()}
            </div>
          )}

          <div>
            {loading ? (
              <div className="mx-auto w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <PageLoader />
              </div>
            ) : (
              renderList()
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminCrudPage;
