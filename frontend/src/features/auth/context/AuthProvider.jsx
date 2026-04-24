/**
 * AuthProvider
 *
 * Context provider for managing authentication state across the application.
 *
 * Responsibilities:
 * - Stores the current authenticated user
 * - Handles login and logout actions
 * - Manages JWT tokens (access + refresh)
 * - Fetches the current user from the backend
 * - Provides authentication state to the entire app via AuthContext
 *
 * Usage:
 * - Wrap the application with <AuthProvider> in main.jsx or App.jsx
 * - Access auth state using the useAuth hook
 *
 * Example:
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */

import { useEffect, useState } from "react";
import api from "../../../api";
import { AuthContext } from "./auth-context";
import {
  clearTokens,
  getRefreshToken,
  isAuthenticated,
  setTokens,
} from "../services/authService";

const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [user, setUser] = useState(null);

  const fetchMe = async () => {
    try {
      const res = await api.get("/users/me/");
      setUser(res.data);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      setUser(null);
      throw error;
    }
  };

  const checkAuth = async () => {
    const authenticated = await isAuthenticated();
    setIsAuthorized(authenticated);

    if (!authenticated) {
      setUser(null);
      return false;
    }

    try {
      await fetchMe();
      return true;
    } catch {
      setIsAuthorized(false);
      return false;
    }
  };

  const login = async (email, password) => {
    const res = await api.post("/users/login/", { email, password });

    setTokens({
      access: res.data.access,
      refresh: res.data.refresh,
    });

    setIsAuthorized(true);

    if (res.data.user) {
      setUser(res.data.user);
    } else {
      await fetchMe();
    }

    return res.data;
  };

  const logout = async () => {
    const refresh = getRefreshToken();

    try {
      if (refresh) {
        await api.post("/users/logout/", { refresh });
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      clearTokens();
      setUser(null);
      setIsAuthorized(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        setIsAuthorized(authenticated);

        if (authenticated) {
          await fetchMe();
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        clearTokens();
        setUser(null);
        setIsAuthorized(false);
      }
    };

    initAuth();
  }, []);

  return (
    // Value passed to all consumers via AuthContext
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
