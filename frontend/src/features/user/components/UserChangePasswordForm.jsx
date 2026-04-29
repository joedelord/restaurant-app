/**
 * ChangePasswordForm
 *
 * Password change form for authenticated users.
 *
 * Responsibilities:
 * - Manages password form state
 * - Validates required fields
 * - Checks password confirmation
 * - Sends password change request
 * - Displays success and error messages
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import AuthSubmitButton from "../../auth/components/AuthSubmitButton";
import FormMessage from "../../../components/ui/FormMessage";
import { changeMyPassword } from "@/features/user";

const initialFormData = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

const UserChangePasswordForm = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getPasswordErrorMessage = (data) => {
    if (data?.current_password?.[0]) return data.current_password[0];
    if (data?.confirm_password?.[0]) return data.confirm_password[0];
    if (data?.new_password?.[0]) return data.new_password[0];
    if (data?.detail) return data.detail;

    return t("user.password.messages.error");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setError("");
    setMessage("");

    if (
      !formData.current_password ||
      !formData.new_password ||
      !formData.confirm_password
    ) {
      setError(t("user.password.messages.required"));
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError(t("user.password.messages.mismatch"));
      return;
    }

    try {
      setSaving(true);

      await changeMyPassword(formData);

      setMessage(t("user.password.messages.success"));
      setFormData(initialFormData);
    } catch (err) {
      console.error(err);
      setError(getPasswordErrorMessage(err?.response?.data));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <FormMessage message={message} variant="success" />
      <FormMessage message={error} variant="error" />

      <div className="mx-auto w-full max-w-xl rounded-md border border-black p-5">
        <div className="mx-auto max-w-sm">
          <form onSubmit={handleSubmit}>
            <PasswordInput
              id="current_password"
              name="current_password"
              label={t("user.password.fields.currentPassword")}
              value={formData.current_password}
              onChange={handleChange}
              disabled={saving}
            />

            <PasswordInput
              id="new_password"
              name="new_password"
              label={t("user.password.fields.newPassword")}
              value={formData.new_password}
              onChange={handleChange}
              disabled={saving}
            />

            <PasswordInput
              id="confirm_password"
              name="confirm_password"
              label={t("user.password.fields.confirmPassword")}
              value={formData.confirm_password}
              onChange={handleChange}
              disabled={saving}
            />

            <AuthSubmitButton
              loading={saving}
              idleText={t("user.password.buttons.save")}
              loadingText={t("user.password.buttons.saving")}
            />
          </form>
        </div>
      </div>
    </>
  );
};

const PasswordInput = ({ id, name, label, value, onChange, disabled }) => {
  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="mb-2.5 block text-sm font-medium text-heading"
      >
        {label}
      </label>

      <input
        id={id}
        type="password"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand disabled:opacity-50"
      />
    </div>
  );
};

export default UserChangePasswordForm;
