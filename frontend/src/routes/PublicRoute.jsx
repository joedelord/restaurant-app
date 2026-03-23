import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
  const { isAuthorized } = useAuth();

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
