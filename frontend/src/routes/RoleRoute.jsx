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
