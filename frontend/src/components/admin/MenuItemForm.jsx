import { useState } from "react";
import AuthSubmitButton from "../auth/AuthSubmitButton";
import Button from "../ui/Button";

const getFormValues = (initialData) => ({
  name: initialData?.name ?? "",
  description: initialData?.description ?? "",
  price: initialData?.price ?? "",
  image_url: initialData?.image_url ?? "",
  category: initialData?.category ?? "",
  is_available: initialData?.is_available ?? true,
});

const MenuItemForm = ({
  onSubmit,
  categories = [],
  initialData = null,
  submitText = "Save",
  onCancel,
}) => {
  const [formData, setFormData] = useState(() => getFormValues(initialData));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (!formData.name.trim()) {
      setError("Menu item name is required.");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    if (!formData.category) {
      setError("Category is required.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: formData.price,
      image_url: formData.image_url.trim(),
      category: Number(formData.category),
      is_available: formData.is_available,
    };

    try {
      setLoading(true);
      await onSubmit(payload);

      if (!initialData) {
        setFormData(getFormValues(null));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save menu item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full rounded-md border-2 border-black p-5">
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
              Item name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g. Margherita Pizza"
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
              htmlFor="price"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              Price
            </label>
            <input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              disabled={loading}
              min="0"
              step="0.01"
              placeholder="e.g. 12.90"
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="image_url"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              Image URL
            </label>
            <input
              id="image_url"
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              disabled={loading}
              placeholder="https://example.com/image.jpg"
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="category"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand disabled:opacity-50"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5 flex items-center gap-3">
            <input
              id="is_available"
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleChange}
              disabled={loading}
              className="h-4 w-4"
            />
            <label
              htmlFor="is_available"
              className="text-sm font-medium text-heading"
            >
              Available
            </label>
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

export default MenuItemForm;
