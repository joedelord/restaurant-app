import { useEffect, useState } from "react";
import AuthSubmitButton from "../components/auth/AuthSubmitButton";
import { getMyProfile, updateMyProfile } from "../services/userProfileService";

const UserProfile = () => {
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
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-0">
        <div className="rounded-md border border-black p-5">
          <p className="text-sm text-body">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-0">
      <h1 className="text-center text-3xl font-bold">My Profile</h1>

      <div className="mx-auto mt-6 w-full max-w-3xl space-y-6">
        <p className="text-center text-gray-500">
          View and update your personal information.
        </p>

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
                <label className="mb-2.5 block text-sm font-medium text-heading">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="block w-full rounded-base border border-default-medium bg-gray-100 px-3 py-2.5 text-sm text-heading shadow-xs"
                />
              </div>

              <div className="mb-5">
                <label className="mb-2.5 block text-sm font-medium text-heading">
                  First name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs"
                />
              </div>

              <div className="mb-5">
                <label className="mb-2.5 block text-sm font-medium text-heading">
                  Last name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs"
                />
              </div>

              <div className="mb-5">
                <label className="mb-2.5 block text-sm font-medium text-heading">
                  Phone number
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs"
                />
              </div>

              <div className="mb-5">
                <label className="mb-2.5 block text-sm font-medium text-heading">
                  Role
                </label>
                <input
                  type="text"
                  value={formData.role}
                  disabled
                  className="block w-full rounded-base border border-default-medium bg-gray-100 px-3 py-2.5 text-sm text-heading shadow-xs capitalize"
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
                  Marketing consent
                </label>
              </div>

              <AuthSubmitButton
                loading={saving}
                idleText="Save changes"
                loadingText="Saving..."
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
