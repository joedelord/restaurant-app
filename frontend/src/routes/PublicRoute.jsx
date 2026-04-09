import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PageLoader from "../components/ui/PageLoader";

const PublicRoute = ({ children }) => {
  const { isAuthorized } = useAuth();

  if (isAuthorized === null) {
    return <PageLoader />;
  }

  if (isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
