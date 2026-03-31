import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api";
import AuthCard from "../components/auth/AuthCard";
import AuthField from "../components/auth/AuthField";
import AuthSubmitButton from "../components/auth/AuthSubmitButton";

const Register = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (!data) return t("auth.register.errors.default");
    if (typeof data.detail === "string") return data.detail;
    if (data.email?.[0]) return data.email[0];
    if (data.password?.[0]) return data.password[0];
    if (data.first_name?.[0]) return data.first_name[0];
    if (data.last_name?.[0]) return data.last_name[0];
    if (data.phone_number?.[0]) return data.phone_number[0];
    if (typeof data.non_field_errors?.[0] === "string") {
      return data.non_field_errors[0];
    }

    return t("auth.register.errors.default");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert(t("auth.register.errors.passwordMismatch"));
      return;
    }

    setLoading(true);

    try {
      await api.post("/users/register/", {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        marketing_consent: marketingConsent,
      });

      alert(t("auth.register.success"));
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error));
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
      <form onSubmit={handleSubmit}>
        <AuthField
          id="email"
          label={t("auth.register.email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          autoComplete="email"
          required
        />

        <AuthField
          id="firstName"
          label={t("auth.register.firstName")}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={t("auth.register.firstName")}
          autoComplete="given-name"
          required
        />

        <AuthField
          id="lastName"
          label={t("auth.register.lastName")}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder={t("auth.register.lastName")}
          autoComplete="family-name"
          required
        />

        <AuthField
          id="phoneNumber"
          label={t("auth.register.phone")}
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+358 40 123 4567"
          autoComplete="tel"
        />

        <AuthField
          id="password"
          label={t("auth.register.password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("auth.register.passwordPlaceholder")}
          autoComplete="new-password"
          required
        />

        <AuthField
          id="confirmPassword"
          label={t("auth.register.confirmPassword")}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t("auth.register.confirmPassword")}
          autoComplete="new-password"
          required
        />

        <label htmlFor="marketingConsent" className="mb-5 flex items-center">
          <input
            id="marketingConsent"
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
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
