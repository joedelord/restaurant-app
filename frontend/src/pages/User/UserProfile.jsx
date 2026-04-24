import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PageLoader from "../../components/ui/PageLoader";
import AuthSubmitButton from "../../features/auth/components/AuthSubmitButton";
import Button from "../../components/ui/Button";
import { getMyProfile, updateMyProfile } from "@/features/user";

const UserProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    marketing_consent: false,
    role: "",
  });

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
          role: data.role || "",
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

        <h1 className="text-center text-3xl font-bold">{t("profile.title")}</h1>

        <div className="mx-auto mt-6 w-full max-w-3xl space-y-6">
          <p className="text-center text-gray-500">{t("profile.subtitle")}</p>

          {message && (
            <div className="rounded-base border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-base border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mx-auto w-full max-w-xl rounded-md border border-black p-5">
            <div className="mx-auto max-w-sm">
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="mb-2.5 block text-sm font-medium text-heading"
                  >
                    {t("profile.fields.email")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="block w-full rounded-base border border-default-medium bg-gray-100 px-3 py-2.5 text-sm text-heading shadow-xs"
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="first_name"
                    className="mb-2.5 block text-sm font-medium text-heading"
                  >
                    {t("profile.fields.firstName")}
                  </label>
                  <input
                    id="first_name"
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand"
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="last_name"
                    className="mb-2.5 block text-sm font-medium text-heading"
                  >
                    {t("profile.fields.lastName")}
                  </label>
                  <input
                    id="last_name"
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand"
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="phone_number"
                    className="mb-2.5 block text-sm font-medium text-heading"
                  >
                    {t("profile.fields.phone")}
                  </label>
                  <input
                    id="phone_number"
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand"
                  />
                </div>

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

                <div className="flex gap-3">
                  <AuthSubmitButton
                    loading={saving}
                    idleText={t("profile.buttons.save")}
                    loadingText={t("profile.buttons.saving")}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
