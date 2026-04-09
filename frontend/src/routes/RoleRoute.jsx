import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PageLoader from "../components/ui/PageLoader";

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
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
