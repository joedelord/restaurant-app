/**
 * useAuth
 *
 * Custom hook for accessing authentication context.
 *
 * Responsibilities:
 * - Provides access to auth state and actions
 * - Ensures the hook is used inside AuthProvider
 */

import { useContext } from "react";
import { AuthContext } from "../context/auth-context";

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export default useAuth;
