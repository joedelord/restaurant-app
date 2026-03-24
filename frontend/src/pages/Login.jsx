import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AuthCard from "../components/auth/AuthCard";
import AuthField from "../components/auth/AuthField";
import AuthSubmitButton from "../components/auth/AuthSubmitButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (!data) return "Kirjautuminen epäonnistui.";
    if (typeof data.detail === "string") return data.detail;
    if (data.email?.[0]) return data.email[0];
    if (data.password?.[0]) return data.password[0];
    if (typeof data.non_field_errors?.[0] === "string")
      return data.non_field_errors[0];

    return "Kirjautuminen epäonnistui.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Kirjaudu"
      footerText="Eikö sinulla ole vielä tiliä?"
      footerLinkText="Rekisteröidy"
      footerLinkTo="/register"
    >
      <form onSubmit={handleSubmit}>
        <AuthField
          id="email"
          label="Sähköposti"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          autoComplete="email"
          required
        />

        <AuthField
          id="password"
          label="Salasana"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />

        <AuthSubmitButton
          loading={loading}
          idleText="Kirjaudu"
          loadingText="Kirjaudutaan..."
        />
      </form>
    </AuthCard>
  );
};

export default Login;
