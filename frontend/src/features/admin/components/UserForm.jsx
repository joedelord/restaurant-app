/**
 * UserForm
 *
 * Form component for creating and editing users in the admin dashboard.
 *
 * Responsibilities:
 * - Handles user form state
 * - Supports both create and edit modes
 * - Validates required user fields before submission
 * - Submits user data through the provided onSubmit handler
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SubmitButton, Button, FormMessage } from "@/components";
import { AuthField, PasswordField } from "@/features/auth";

const getFormValues = (initialData) => ({
  email: initialData?.email ?? "",
  first_name: initialData?.first_name ?? "",
  last_name: initialData?.last_name ?? "",
  phone_number: initialData?.phone_number ?? "",
  role: initialData?.role ?? "customer",
  marketing_consent: initialData?.marketing_consent ?? false,
  is_active: initialData?.is_active ?? true,
  password: "",
});

const UserForm = ({
  onSubmit,
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
    setError("");
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (!formData.email.trim()) {
      setError(t("admin.users.validation.emailRequired"));
      return;
    }

    if (!formData.first_name.trim()) {
      setError(t("admin.users.validation.firstNameRequired"));
      return;
    }

    if (!formData.last_name.trim()) {
      setError(t("admin.users.validation.lastNameRequired"));
      return;
    }

    if (!initialData && !formData.password.trim()) {
      setError(t("admin.users.validation.passwordRequired"));
      return;
    }

    const payload = {
      email: formData.email.trim(),
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      phone_number: formData.phone_number.trim(),
      role: formData.role,
      marketing_consent: formData.marketing_consent,
      is_active: formData.is_active,
    };

    if (!initialData) {
      payload.password = formData.password.trim();
    }

    try {
      setLoading(true);
      await onSubmit(payload);

      if (!initialData) {
        setFormData(getFormValues(null));
      }
    } catch (err) {
      console.error(err);
      setError(t("admin.users.messages.saveError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mx-auto max-w-sm">
        <form onSubmit={handleSubmit}>
          <FormMessage message={error} variant="error" />

          <AuthField
            id="email"
            name="email"
            type="email"
            label={t("admin.users.fields.email")}
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            disabled={loading}
            required
          />

          <AuthField
            id="first_name"
            name="first_name"
            label={t("admin.users.fields.firstName")}
            value={formData.first_name}
            onChange={handleChange}
            autoComplete="given-name"
            disabled={loading}
            required
          />

          <AuthField
            id="last_name"
            name="last_name"
            label={t("admin.users.fields.lastName")}
            value={formData.last_name}
            onChange={handleChange}
            autoComplete="family-name"
            disabled={loading}
            required
          />

          <AuthField
            id="phone_number"
            name="phone_number"
            type="tel"
            label={t("admin.users.fields.phone")}
            value={formData.phone_number}
            onChange={handleChange}
            autoComplete="tel"
            disabled={loading}
          />

          {!initialData && (
            <PasswordField
              id="password"
              name="password"
              label={t("admin.users.fields.password")}
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={loading}
              required
            />
          )}

          <div className="mb-5">
            <label
              htmlFor="role"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              {t("admin.users.fields.role")}
            </label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand disabled:opacity-50"
            >
              <option value="customer">
                {t("admin.users.roles.customer")}
              </option>
              <option value="staff">{t("admin.users.roles.staff")}</option>
              <option value="admin">{t("admin.users.roles.admin")}</option>
            </select>
          </div>

          <div className="mb-5 flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm text-heading">
              <input
                type="checkbox"
                name="marketing_consent"
                checked={formData.marketing_consent}
                onChange={handleChange}
                disabled={loading}
                className="h-4 w-4 rounded border-default-medium text-brand focus:ring-brand disabled:opacity-50"
              />
              {t("admin.users.fields.marketing")}
            </label>

            <label className="flex items-center gap-2 text-sm text-heading">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                disabled={loading}
                className="h-4 w-4 rounded border-default-medium text-brand focus:ring-brand disabled:opacity-50"
              />
              {t("admin.users.fields.active")}
            </label>
          </div>

          <div className="flex gap-3">
            <SubmitButton
              loading={loading}
              idleText={submitText}
              loadingText={
                initialData
                  ? `${t("admin.users.actions.update")}...`
                  : `${t("admin.users.actions.add")}...`
              }
            />

            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                {t("admin.users.actions.cancel")}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
