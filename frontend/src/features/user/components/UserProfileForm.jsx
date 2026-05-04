/**
 * UserProfileForm
 *
 * Form component for viewing and updating authenticated user's profile.
 *
 * Responsibilities:
 * - Fetches authenticated user's profile data
 * - Manages profile form state
 * - Keeps email as read-only account data
 * - Allows updating editable profile fields
 * - Handles loading, saving, success and error states
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageLoader, FormMessage, SubmitButton } from "@/components";
import { getMyProfile, updateMyProfile } from "@/features/user";

const initialFormData = {
  email: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  marketing_consent: false,
};

const UserProfileForm = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError("");

        const data = await getMyProfile();

        setFormData({
          email: data.email || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone_number: data.phone_number || "",
          marketing_consent: data.marketing_consent || false,
        });
      } catch (err) {
        console.error(err);
        setError(t("profile.messages.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [t]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone_number: formData.phone_number.trim(),
        marketing_consent: formData.marketing_consent,
      };

      const updated = await updateMyProfile(payload);

      setFormData((prev) => ({
        ...prev,
        first_name: updated.first_name || "",
        last_name: updated.last_name || "",
        phone_number: updated.phone_number || "",
        marketing_consent: updated.marketing_consent || false,
      }));

      setMessage(t("profile.messages.success"));
    } catch (err) {
      console.error(err);
      setError(t("profile.messages.saveError"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <FormMessage message={message} variant="success" />
      <FormMessage message={error} variant="error" />

      <div className="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mx-auto max-w-sm">
          <form onSubmit={handleSubmit}>
            <ProfileInput
              id="email"
              type="email"
              label={t("profile.fields.email")}
              value={formData.email}
              disabled
              readOnly
            />

            <ProfileInput
              id="first_name"
              name="first_name"
              label={t("profile.fields.firstName")}
              value={formData.first_name}
              onChange={handleChange}
            />

            <ProfileInput
              id="last_name"
              name="last_name"
              label={t("profile.fields.lastName")}
              value={formData.last_name}
              onChange={handleChange}
            />

            <ProfileInput
              id="phone_number"
              name="phone_number"
              label={t("profile.fields.phone")}
              value={formData.phone_number}
              onChange={handleChange}
            />

            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm text-heading">
                <input
                  type="checkbox"
                  name="marketing_consent"
                  checked={formData.marketing_consent}
                  onChange={handleChange}
                />
                {t("profile.fields.marketing")}
              </label>
            </div>

            <SubmitButton
              loading={saving}
              idleText={t("profile.buttons.save")}
              loadingText={t("profile.buttons.saving")}
            />
          </form>
        </div>
      </div>
    </>
  );
};

const ProfileInput = ({
  id,
  name,
  type = "text",
  label,
  value,
  onChange,
  disabled = false,
  readOnly = false,
}) => {
  const inputClassName = disabled
    ? "block w-full rounded-base border border-default-medium bg-gray-100 px-3 py-2.5 text-sm text-heading shadow-xs"
    : "block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand";

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
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        className={inputClassName}
      />
    </div>
  );
};

export default UserProfileForm;
