/**
 * StaffReservationForm
 *
 * Form component for editing staff reservation details.
 *
 * Responsibilities:
 * - Handles reservation edit form state
 * - Supports updating reservation time, party size, status and notes
 * - Validates required fields before submission
 * - Submits reservation changes through the provided onSubmit handler
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SubmitButton, Button } from "@/components";

const getLocalDateTimeValue = (value) => {
  if (!value) return "";

  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const getFormValues = (initialData) => ({
  reservation_time: getLocalDateTimeValue(initialData?.reservation_time),
  party_size: initialData?.party_size ?? 2,
  status: initialData?.status ?? "pending",
  special_requests: initialData?.special_requests ?? "",
});

const StaffReservationForm = ({
  onSubmit,
  initialData = null,
  submitText,
  onCancel,
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState(() => getFormValues(initialData));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(getFormValues(initialData));
    setError("");
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "party_size" ? Number(value) : value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (!formData.reservation_time) {
      setError(t("staff.reservations.validation.timeRequired"));
      return;
    }

    if (!formData.party_size || Number(formData.party_size) <= 0) {
      setError(t("staff.reservations.validation.partySizeRequired"));
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        reservation_time: formData.reservation_time,
        party_size: Number(formData.party_size),
        status: formData.status,
        special_requests: formData.special_requests.trim(),
      });
    } catch (err) {
      console.error(err);
      setError(t("staff.reservations.messages.saveError"));
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
              htmlFor="reservation_time"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              {t("staff.reservations.fields.time")}
            </label>
            <input
              id="reservation_time"
              type="datetime-local"
              name="reservation_time"
              value={formData.reservation_time}
              onChange={handleChange}
              disabled={loading}
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="party_size"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              {t("staff.reservations.fields.partySize")}
            </label>
            <input
              id="party_size"
              type="number"
              name="party_size"
              value={formData.party_size}
              onChange={handleChange}
              disabled={loading}
              min="1"
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="status"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              {t("staff.reservations.fields.status")}
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
                {t("staff.reservations.statuses.pending")}
              </option>
              <option value="confirmed">
                {t("staff.reservations.statuses.confirmed")}
              </option>
              <option value="cancelled">
                {t("staff.reservations.statuses.cancelled")}
              </option>
              <option value="completed">
                {t("staff.reservations.statuses.completed")}
              </option>
            </select>
          </div>

          <div className="mb-5">
            <label
              htmlFor="special_requests"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              {t("staff.reservations.fields.notes")}
            </label>
            <textarea
              id="special_requests"
              name="special_requests"
              rows="4"
              value={formData.special_requests}
              onChange={handleChange}
              disabled={loading}
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand disabled:opacity-50"
            />
          </div>

          <div className="flex gap-3">
            <SubmitButton
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
                {t("staff.reservations.actions.cancel")}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffReservationForm;
