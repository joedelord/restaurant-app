import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../../api";
import AuthCard from "../components/AuthCard";
import AuthField from "../components/AuthField";
import AuthSubmitButton from "../components/AuthSubmitButton";
import FormMessage from "../../../components/ui/FormMessage";

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    marketingConsent: false,
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const mapRegisterErrors = (error) => {
    const data = error?.response?.data || {};

    const nextFieldErrors = {};
    let nextFormError = "";

    if (data.email?.[0]) nextFieldErrors.email = data.email[0];
    if (data.password?.[0]) nextFieldErrors.password = data.password[0];
    if (data.first_name?.[0]) nextFieldErrors.firstName = data.first_name[0];
    if (data.last_name?.[0]) nextFieldErrors.lastName = data.last_name[0];
    if (data.phone_number?.[0])
      nextFieldErrors.phoneNumber = data.phone_number[0];

    if (typeof data.detail === "string") {
      nextFormError = data.detail;
    } else if (typeof data.non_field_errors?.[0] === "string") {
      nextFormError = data.non_field_errors[0];
    }

    if (!nextFormError && Object.keys(nextFieldErrors).length === 0) {
      nextFormError = t("auth.register.errors.default");
    }

    return { nextFieldErrors, nextFormError };
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));

    setFormError("");

    setFieldErrors((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setFormError("");
    setFieldErrors({});

    const nextFieldErrors = {};

    if (!formData.email.trim()) {
      nextFieldErrors.email = t("auth.register.errors.emailRequired");
    }

    if (!formData.firstName.trim()) {
      nextFieldErrors.firstName = t("auth.register.errors.firstNameRequired");
    }

    if (!formData.lastName.trim()) {
      nextFieldErrors.lastName = t("auth.register.errors.lastNameRequired");
    }

    if (!formData.password) {
      nextFieldErrors.password = t("auth.register.errors.passwordRequired");
    }

    if (!formData.confirmPassword) {
      nextFieldErrors.confirmPassword = t(
        "auth.register.errors.confirmPasswordRequired",
      );
    }

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      nextFieldErrors.confirmPassword = t(
        "auth.register.errors.passwordMismatch",
      );
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setLoading(true);

    try {
      await api.post("/users/register/", {
        email: formData.email.trim(),
        password: formData.password,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone_number: formData.phoneNumber.trim(),
        marketing_consent: formData.marketingConsent,
      });

      navigate("/login", {
        replace: true,
        state: {
          successMessage: t("auth.register.success"),
        },
      });
    } catch (error) {
      console.error(error);
      const { nextFieldErrors, nextFormError } = mapRegisterErrors(error);
      setFieldErrors(nextFieldErrors);
      setFormError(nextFormError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title={t("auth.register.title")}
      footerText={t("auth.register.footerText")}
      footerLinkText={t("auth.register.footerLinkText")}
      footerLinkTo="/login"
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormMessage message={formError} variant="error" />

        <AuthField
          id="email"
          label={t("auth.register.email")}
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@example.com"
          autoComplete="email"
          required
          disabled={loading}
          error={fieldErrors.email}
        />

        <AuthField
          id="firstName"
          label={t("auth.register.firstName")}
          value={formData.firstName}
          onChange={handleChange}
          placeholder={t("auth.register.firstName")}
          autoComplete="given-name"
          required
          disabled={loading}
          error={fieldErrors.firstName}
        />

        <AuthField
          id="lastName"
          label={t("auth.register.lastName")}
          value={formData.lastName}
          onChange={handleChange}
          placeholder={t("auth.register.lastName")}
          autoComplete="family-name"
          required
          disabled={loading}
          error={fieldErrors.lastName}
        />

        <AuthField
          id="phoneNumber"
          label={t("auth.register.phone")}
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="+358 40 123 4567"
          autoComplete="tel"
          disabled={loading}
          error={fieldErrors.phoneNumber}
        />

        <AuthField
          id="password"
          label={t("auth.register.password")}
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={t("auth.register.passwordPlaceholder")}
          autoComplete="new-password"
          required
          disabled={loading}
          error={fieldErrors.password}
        />

        <AuthField
          id="confirmPassword"
          label={t("auth.register.confirmPassword")}
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder={t("auth.register.confirmPassword")}
          autoComplete="new-password"
          required
          disabled={loading}
          error={fieldErrors.confirmPassword}
        />

        <label htmlFor="marketingConsent" className="mb-5 flex items-center">
          <input
            id="marketingConsent"
            type="checkbox"
            checked={formData.marketingConsent}
            onChange={handleChange}
            disabled={loading}
            className="h-4 w-4 rounded-xs border border-default-medium bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
          />
          <p className="ms-2 select-none text-sm font-medium text-heading">
            {t("auth.register.marketing")}
          </p>
        </label>

        <AuthSubmitButton
          loading={loading}
          idleText={t("auth.register.submit")}
          loadingText={t("auth.register.submitting")}
        />
      </form>
    </AuthCard>
  );
};

export default Register;
