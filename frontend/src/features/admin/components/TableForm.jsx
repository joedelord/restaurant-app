/**
 * TableForm
 *
 * Form component for creating and editing restaurant tables.
 *
 * Responsibilities:
 * - Handles table form state
 * - Validates input before submission
 * - Supports both create and edit modes
 * - Submits data via provided onSubmit handler
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SubmitButton, Button } from "@/components";

const getFormValues = (initialData) => ({
  table_number: initialData?.table_number ?? "",
  seats: initialData?.seats ?? "",
  is_active: initialData?.is_active ?? true,
});

const TableForm = ({ onSubmit, initialData = null, submitText, onCancel }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState(() => getFormValues(initialData));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(getFormValues(initialData));
    setError("");
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

    if (formData.table_number === "" || Number(formData.table_number) <= 0) {
      setError(t("admin.tables.validation.tableNumberRequired"));
      return;
    }

    if (formData.seats === "" || Number(formData.seats) <= 0) {
      setError(t("admin.tables.validation.seatsRequired"));
      return;
    }

    const payload = {
      table_number: Number(formData.table_number),
      seats: Number(formData.seats),
      is_active: Boolean(formData.is_active),
    };

    try {
      setLoading(true);
      await onSubmit(payload);

      if (!initialData) {
        setFormData(getFormValues(null));
      }
    } catch (err) {
      console.error(err);
      setError(t("admin.tables.messages.saveError"));
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
              htmlFor="table_number"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              {t("admin.tables.fields.tableNumber")}
            </label>
            <input
              id="table_number"
              type="number"
              name="table_number"
              value={formData.table_number}
              onChange={handleChange}
              disabled={loading}
              min="1"
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="seats"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              {t("admin.tables.fields.seats")}
            </label>
            <input
              id="seats"
              type="number"
              name="seats"
              value={formData.seats}
              onChange={handleChange}
              disabled={loading}
              min="1"
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="mb-5 flex items-center gap-3">
            <input
              id="is_active"
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              disabled={loading}
              className="h-4 w-4 rounded border-default-medium"
            />
            <label
              htmlFor="is_active"
              className="text-sm font-medium text-heading"
            >
              {t("admin.tables.fields.active")}
            </label>
          </div>

          <div className="flex gap-3">
            <SubmitButton
              loading={loading}
              idleText={submitText || t("admin.tables.actions.save")}
              loadingText={
                initialData
                  ? t("admin.tables.actions.update") + "..."
                  : t("admin.tables.actions.add") + "..."
              }
            />

            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                {t("admin.tables.actions.cancel")}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableForm;
