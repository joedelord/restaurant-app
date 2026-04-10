import { useState } from "react";
import { useTranslation } from "react-i18next";
import AuthSubmitButton from "../auth/AuthSubmitButton";
import Button from "../ui/Button";

const getFormValues = (initialData) => ({
  status: initialData?.status ?? "pending",
});

const StaffOrderForm = ({
  onSubmit,
  initialData = null,
  submitText,
  onCancel,
}) => {
  const { t } = useTranslation();

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

    try {
      setLoading(true);
      await onSubmit({
        status: formData.status,
      });
    } catch (err) {
      console.error(err);
      setError(t("staff.orders.messages.saveError"));
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
              htmlFor="status"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              {t("staff.orders.fields.status")}
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand disabled:opacity-50"
            >
              <option value="pending">
                {t("staff.orders.statuses.pending")}
              </option>
              <option value="confirmed">
                {t("staff.orders.statuses.confirmed")}
              </option>
              <option value="preparing">
                {t("staff.orders.statuses.preparing")}
              </option>
              <option value="ready">{t("staff.orders.statuses.ready")}</option>
              <option value="served">
                {t("staff.orders.statuses.served")}
              </option>
              <option value="paid">{t("staff.orders.statuses.paid")}</option>
              <option value="cancelled">
                {t("staff.orders.statuses.cancelled")}
              </option>
            </select>
          </div>

          <div className="flex gap-3">
            <AuthSubmitButton
              loading={loading}
              idleText={submitText}
              loadingText={submitText}
            />

            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                {t("staff.orders.actions.cancel")}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffOrderForm;
