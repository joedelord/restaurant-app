import { Navigate } from "react-router-dom";
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

  if (isAuthorized === null) {
    return <PageLoader />;
  }

  if (isAuthorized && !user) {
    return <PageLoader />;
  }

  if (isAuthorized) {
    return <Navigate to={getDashboardByRole(user?.role)} replace />;
  }

  return children;
};

export default PublicRoute;
