/**
 * MenuItemForm
 *
 * Form component for creating and editing menu items.
 *
 * Responsibilities:
 * - Handles menu item form state
 * - Validates input before submission
 * - Supports both create and edit modes
 * - Submits data via provided onSubmit handler
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AuthSubmitButton from "../../auth/components/AuthSubmitButton";
import Button from "../../../components/ui/Button";

const getFormValues = (initialData) => ({
  name_en: initialData?.name_en ?? "",
  name_fi: initialData?.name_fi ?? "",
  description_en: initialData?.description_en ?? "",
  description_fi: initialData?.description_fi ?? "",
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
  const { t } = useTranslation();
  const [formData, setFormData] = useState(() => getFormValues(initialData));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(getFormValues(initialData));
  }, [initialData]);

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

    if (!formData.name_en.trim()) {
      setError(t("admin.menuItems.validation.nameEnRequired"));
      return;
    }

    if (!formData.name_fi.trim()) {
      setError(t("admin.menuItems.validation.nameFiRequired"));
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setError(t("admin.menuItems.validation.priceRequired"));
      return;
    }

    if (!formData.category) {
      setError(t("admin.menuItems.validation.categoryRequired"));
      return;
    }

    const payload = {
      name_en: formData.name_en.trim(),
      name_fi: formData.name_fi.trim(),
      description_en: formData.description_en.trim(),
      description_fi: formData.description_fi.trim(),
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
      setError(t("admin.menuItems.messages.saveError"));
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
              {t("admin.menuItems.fields.nameEn")}
            </label>
            <input
              id="name_en"
              type="text"
              name="name_en"
              value={formData.name_en}
              onChange={handleChange}
              disabled={loading}
              placeholder={t("admin.menuItems.placeholders.nameEn")}
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="name_fi"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              {t("admin.menuItems.fields.nameFi")}
            </label>
            <input
              id="name_fi"
              type="text"
              name="name_fi"
              value={formData.name_fi}
              onChange={handleChange}
              disabled={loading}
              placeholder={t("admin.menuItems.placeholders.nameFi")}
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="description_en"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              {t("admin.menuItems.fields.descriptionEn")}
            </label>
            <textarea
              id="description_en"
              name="description_en"
              value={formData.description_en}
              onChange={handleChange}
              disabled={loading}
              rows="4"
              placeholder={t("admin.menuItems.placeholders.descriptionEn")}
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="description_fi"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              {t("admin.menuItems.fields.descriptionFi")}
            </label>
            <textarea
              id="description_fi"
              name="description_fi"
              value={formData.description_fi}
              onChange={handleChange}
              disabled={loading}
              rows="4"
              placeholder={t("admin.menuItems.placeholders.descriptionFi")}
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="price"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              {t("admin.menuItems.fields.price")}
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
              placeholder={t("admin.menuItems.placeholders.price")}
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="image_url"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              {t("admin.menuItems.fields.imageUrl")}
            </label>
            <input
              id="image_url"
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              disabled={loading}
              placeholder={t("admin.menuItems.placeholders.imageUrl")}
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="category"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              {t("admin.menuItems.fields.category")}
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand disabled:opacity-50"
            >
              <option value="">
                {t("admin.menuItems.placeholders.category")}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name_en} / {category.name_fi}
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
              {t("admin.menuItems.fields.available")}
            </label>
          </div>

          <div className="flex gap-3">
            <AuthSubmitButton
              loading={loading}
              idleText={submitText}
              loadingText={
                initialData
                  ? `${t("admin.menuItems.actions.update")}...`
                  : `${t("admin.menuItems.actions.add")}...`
              }
            />

            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                {t("admin.menuItems.actions.cancel")}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemForm;
