/**
 * auth index
 *
 * Public exports for the authentication feature.
 *
 * Responsibilities:
 * - Exposes auth components
 * - Exposes auth hooks
 * - Exposes auth context and provider
 * - Exposes auth services
 */

export { default as AuthCard } from "./components/AuthCard";
export { default as AuthField } from "./components/AuthField";
export { default as AuthSubmitButton } from "./components/AuthSubmitButton";
export { default as LogoutButton } from "./components/LogoutButton";

export { default as useAuth } from "./hooks/useAuth";

export { AuthContext } from "./context/auth-context";
export { default as AuthProvider } from "./context/AuthProvider";

export * from "./services/authService";
