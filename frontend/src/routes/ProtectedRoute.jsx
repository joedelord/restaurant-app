/**
 * ProtectedRoute
 *
 * Route guard for pages that require authentication.
 *
 * Responsibilities:
 * - Shows a loader while authentication state is being resolved
 * - Redirects unauthenticated users to the login page
 * - Preserves the originally requested route for post-login redirect
 * - Allows access to authenticated users
 *
 * Notes:
 * - Used for all protected pages (admin, staff, user)
 * - Redirect state enables returning to the requested page after login
 */

import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../features/auth/hooks/useAuth";
import PageLoader from "../components/ui/PageLoader";

const ProtectedRoute = ({ children }) => {
  const { isAuthorized } = useAuth();
  const location = useLocation();

  if (isAuthorized === null) {
    return <PageLoader />;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
