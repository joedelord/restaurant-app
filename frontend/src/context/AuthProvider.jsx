import { useEffect, useState } from "react";
import api from "../api";
import { AuthContext } from "./auth-context";
import {
  clearTokens,
  isAuthenticated,
  setTokens,
} from "../services/authService";

const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [user, setUser] = useState(null);

  const checkAuth = async () => {
    const authenticated = await isAuthenticated();
    setIsAuthorized(authenticated);

    if (!authenticated) {
      setUser(null);
    }
  };

  const login = async (email, password) => {
    const res = await api.post("/api/token/", { email, password });

    setTokens({
      access: res.data.access,
      refresh: res.data.refresh,
    });

    setIsAuthorized(true);

    try {
      const meRes = await api.get("/api/users/me/");
      setUser(meRes.data);
    } catch (error) {
      console.error(error);
      setUser(null);
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    setIsAuthorized(false);
  };

  const fetchMe = async () => {
    try {
      const res = await api.get("/api/users/me/");
      setUser(res.data);
    } catch (error) {
      console.error(error);
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsAuthorized(authenticated);

      if (authenticated) {
        await fetchMe();
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthorized,
        user,
        login,
        logout,
        checkAuth,
        fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
