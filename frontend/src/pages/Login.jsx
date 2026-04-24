import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../features/auth/hooks/useAuth";
import AuthCard from "../features/auth/components/AuthCard";
import AuthField from "../features/auth/components/AuthField";
import AuthSubmitButton from "../features/auth/components/AuthSubmitButton";
import FormMessage from "../components/ui/FormMessage";

const getDashboardByRole = (role) => {
  switch (role) {
    case "admin":
      return "/admin";
    case "staff":
      return "/staff";
    case "customer":
    default:
      return "/user";
  }
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    location.state?.from?.pathname || location.state?.redirectTo || null;

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location.pathname, location.state, navigate]);

  const mapLoginErrors = (error) => {
    const data = error?.response?.data || {};

    const nextFieldErrors = {};
    let nextFormError = "";

    if (data.email?.[0]) {
      nextFieldErrors.email = data.email[0];
    }

    if (data.password?.[0]) {
      nextFieldErrors.password = data.password[0];
    }

    if (typeof data.detail === "string") {
      nextFormError = data.detail;
    } else if (typeof data.non_field_errors?.[0] === "string") {
      nextFormError = data.non_field_errors[0];
    } else if (typeof data.error === "string") {
      nextFormError = data.error;
    }

    if (!nextFormError && Object.keys(nextFieldErrors).length === 0) {
      nextFormError = t("auth.login.errors.default");
    }

    return { nextFieldErrors, nextFormError };
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    setFormError("");
    setSuccessMessage("");

    setFieldErrors((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setFormError("");
    setSuccessMessage("");
    setFieldErrors({});

    const nextFieldErrors = {};

    if (!formData.email.trim()) {
      nextFieldErrors.email = t("auth.login.errors.emailRequired");
    }

    if (!formData.password) {
      nextFieldErrors.password = t("auth.login.errors.passwordRequired");
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await login(formData.email.trim(), formData.password);
      const role = response?.user?.role;
      const targetPath = from || getDashboardByRole(role);

      navigate(targetPath, { replace: true });
    } catch (error) {
      console.error(error);
      const { nextFieldErrors, nextFormError } = mapLoginErrors(error);
      setFieldErrors(nextFieldErrors);
      setFormError(nextFormError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title={t("auth.login.title")}
      footerText={t("auth.login.footerText")}
      footerLinkText={t("auth.login.footerLinkText")}
      footerLinkTo="/register"
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormMessage message={successMessage} variant="success" />
        <FormMessage message={formError} variant="error" />

        <AuthField
          id="email"
          label={t("auth.login.emailLabel")}
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
          id="password"
          label={t("auth.login.passwordLabel")}
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder=""
          autoComplete="current-password"
          required
          disabled={loading}
          error={fieldErrors.password}
        />

        <AuthSubmitButton
          loading={loading}
          idleText={t("auth.login.submit")}
          loadingText={t("auth.login.submitting")}
        />
      </form>
    </AuthCard>
  );
};

export default Login;
