/**
 * AuthContext
 *
 * React context for authentication state and actions.
 *
 * Responsibilities:
 * - Provides a shared authentication state across the application
 * - Stores current user information and authentication status
 * - Exposes auth-related actions (login, logout, etc.) via AuthProvider
 *
 * Notes:
 * - This file only defines the context
 * - Actual logic is implemented in AuthProvider
 */

import { createContext } from "react";

export const AuthContext = createContext(null);
