/**
 * RoleRoute
 *
 * Route guard for pages that require both authentication and a specific user role.
 *
 * Responsibilities:
 * - Shows a loader while authentication state is being resolved
 * - Redirects unauthenticated users to the login page
 * - Waits until the authenticated user data is available
 * - Checks whether the user's role is allowed for the route
 * - Redirects users without access to their own role-based dashboard
 *
 * Notes:
 * - Used for admin, staff and role-specific user routes
 * - allowedRoles defines which roles can access the wrapped route
 * - getDashboardByRole provides a safe fallback redirect based on the user's role
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

const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthorized, user } = useAuth();
  const location = useLocation();

  if (isAuthorized === null) {
    return <PageLoader />;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user) {
    return <PageLoader />;
  }

  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    return <Navigate to={getDashboardByRole(user.role)} replace />;
  }

  return children;
};

export default RoleRoute;
