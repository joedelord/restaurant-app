import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AuthSubmitButton from "../../components/auth/AuthSubmitButton";
import Button from "../../components/ui/Button";
import { changeMyPassword } from "../../services/userProfileService";

const ChangePassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

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

      await changeMyPassword({
        current_password: formData.current_password,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      });

      setMessage(t("user.password.messages.success"));

      setFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      console.error(err);

      const data = err?.response?.data;

      if (data?.current_password?.[0]) {
        setError(data.current_password[0]);
      } else if (data?.confirm_password?.[0]) {
        setError(data.confirm_password[0]);
      } else if (data?.new_password?.[0]) {
        setError(data.new_password[0]);
      } else if (data?.detail) {
        setError(data.detail);
      } else {
        setError(t("user.password.messages.error"));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => navigate("/user")}
            className="inline-flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {t("user.navigation.backToDashboard")}
          </Button>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-heading">
            {t("user.password.title")}
          </h1>
          <p className="mt-2 text-gray-500">{t("user.password.subtitle")}</p>
        </div>

        {message && (
          <div className="mb-6 rounded-base border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-base border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mx-auto w-full max-w-xl rounded-md border border-black p-5">
          <div className="mx-auto max-w-sm">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label
                  htmlFor="current_password"
                  className="mb-2.5 block text-sm font-medium text-heading"
                >
                  {t("user.password.fields.currentPassword")}
                </label>
                <input
                  id="current_password"
                  type="password"
                  name="current_password"
                  value={formData.current_password}
                  onChange={handleChange}
                  disabled={saving}
                  className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand disabled:opacity-50"
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="new_password"
                  className="mb-2.5 block text-sm font-medium text-heading"
                >
                  {t("user.password.fields.newPassword")}
                </label>
                <input
                  id="new_password"
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  disabled={saving}
                  className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand disabled:opacity-50"
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="confirm_password"
                  className="mb-2.5 block text-sm font-medium text-heading"
                >
                  {t("user.password.fields.confirmPassword")}
                </label>
                <input
                  id="confirm_password"
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  disabled={saving}
                  className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand disabled:opacity-50"
                />
              </div>

              <div className="flex gap-3">
                <AuthSubmitButton
                  loading={saving}
                  idleText={t("user.password.buttons.save")}
                  loadingText={t("user.password.buttons.saving")}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
