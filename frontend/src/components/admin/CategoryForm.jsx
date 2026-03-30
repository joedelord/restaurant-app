import { useState } from "react";
import AuthSubmitButton from "../auth/AuthSubmitButton";
import Button from "../ui/Button";

const getFormValues = (initialData) => ({
  name_en: initialData?.name_en ?? "",
  name_fi: initialData?.name_fi ?? "",
  description_en: initialData?.description_en ?? "",
  description_fi: initialData?.description_fi ?? "",
  display_order: initialData?.display_order ?? "",
});

const CategoryForm = ({
  onSubmit,
  initialData = null,
  submitText = "Save",
  onCancel,
}) => {
  const [formData, setFormData] = useState(() => getFormValues(initialData));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (!formData.name_en.trim()) {
      setError("English category name is required.");
      return;
    }

    if (!formData.name_fi.trim()) {
      setError("Finnish category name is required.");
      return;
    }

    if (formData.display_order === "" || Number(formData.display_order) < 0) {
      setError("Display order must be 0 or greater.");
      return;
    }

    const payload = {
      name_en: formData.name_en.trim(),
      name_fi: formData.name_fi.trim(),
      description_en: formData.description_en.trim(),
      description_fi: formData.description_fi.trim(),
      display_order: Number(formData.display_order),
    };

    try {
      setLoading(true);
      await onSubmit(payload);

      if (!initialData) {
        setFormData(getFormValues(null));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-md border border-black p-5">
      <div className="mx-auto max-w-sm">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-5 rounded-base border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label
              htmlFor="name_en"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              Category name (EN)
            </label>
            <input
              id="name_en"
              type="text"
              name="name_en"
              value={formData.name_en}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g. Starters"
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="name_fi"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              Category name (FI)
            </label>
            <input
              id="name_fi"
              type="text"
              name="name_fi"
              value={formData.name_fi}
              onChange={handleChange}
              disabled={loading}
              placeholder="esim. Alkuruoat"
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="description_en"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              Description (EN)
            </label>
            <textarea
              id="description_en"
              name="description_en"
              value={formData.description_en}
              onChange={handleChange}
              disabled={loading}
              rows="4"
              placeholder="Write a short description"
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="description_fi"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              Description (FI)
            </label>
            <textarea
              id="description_fi"
              name="description_fi"
              value={formData.description_fi}
              onChange={handleChange}
              disabled={loading}
              rows="4"
              placeholder="Kirjoita lyhyt kuvaus"
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="display_order"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              Display order
            </label>
            <input
              id="display_order"
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
              disabled={loading}
              min="0"
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="flex gap-3">
            <AuthSubmitButton
              loading={loading}
              idleText={submitText}
              loadingText={initialData ? "Updating..." : "Creating..."}
            />

            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
