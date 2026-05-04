/**
 * AdminCrudPage
 *
 * Reusable admin CRUD page layout.
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
