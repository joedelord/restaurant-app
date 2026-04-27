/**
 * PublicRoute
 *
 * Route guard for pages that should only be available to unauthenticated users.
 *
 * Responsibilities:
 * - Shows a loader while authentication state is being resolved
 * - Redirects authenticated users away from public auth pages
 * - Sends users back to the originally requested route when available
 * - Falls back to a role-based dashboard route
 *
 * Notes:
 * - Used mainly for login and register pages
 * - Role-based dashboard paths are resolved with getDashboardByRole
 */

import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../features/auth/hooks/useAuth";
import PageLoader from "../components/ui/PageLoader";

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

const PublicRoute = ({ children }) => {
  const { isAuthorized, user } = useAuth();
  const location = useLocation();

  if (isAuthorized === null) {
    return <PageLoader />;
  }

  if (isAuthorized && !user) {
    return <PageLoader />;
  }

  if (isAuthorized) {
    const redirectTarget =
      location.state?.from?.pathname ||
      location.state?.redirectTo ||
      getDashboardByRole(user?.role);

    return <Navigate to={redirectTarget} replace />;
  }

  return children;
};

export default PublicRoute;
