import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants";
import useAuth from "../../../hooks/useAuth";

const LogoutButton = ({ variant = "link", className = "" }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);

    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    try {
      if (refreshToken) {
        await api.post("/users/logout/", {
          refresh: refreshToken,
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      await logout();
      navigate("/login");
    }
  };

  // 🔹 NAVBAR STYLE
  if (variant === "link") {
    return (
      <button
        onClick={handleLogout}
        disabled={loading}
        className={`text-sm font-medium text-white/80 transition hover:text-white ${className}`}
      >
        {loading ? t("auth.logout.loading") : t("auth.logout.label")}
      </button>
    );
  }

  // 🔹 DEFAULT BUTTON (fallback)
  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`rounded-base border border-transparent bg-black px-4 py-2.5 text-sm font-medium text-white shadow-xs hover:bg-brand-strong focus:outline-none focus:ring-4 focus:ring-brand-medium ${className}`}
    >
      {loading ? t("auth.logout.loading") : t("auth.logout.label")}
    </button>
  );
};

export default LogoutButton;
