import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
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
