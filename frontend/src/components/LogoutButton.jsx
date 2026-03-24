import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import useAuth from "../hooks/useAuth";

const LogoutButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { logout } = useAuth();

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

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`text-white bg-black box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none`}
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;
