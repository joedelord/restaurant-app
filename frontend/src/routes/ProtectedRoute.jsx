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
