import { useState } from "react";
import AuthSubmitButton from "../auth/AuthSubmitButton";
import Button from "../ui/Button";

const getFormValues = (initialData) => ({
  name: initialData?.name ?? "",
  description: initialData?.description ?? "",
  display_order: initialData?.display_order ?? 0,
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

    if (!formData.name.trim()) {
      setError("Category name is required.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      display_order: Number(formData.display_order) || 0,
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
              htmlFor="name"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              Category name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g. Starters"
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="description"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              rows="4"
              placeholder="Write a short description"
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
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand disabled:opacity-50"
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
