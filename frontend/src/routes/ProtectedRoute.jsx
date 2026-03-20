import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const refreshToken = async () => {
      const refresh = localStorage.getItem(REFRESH_TOKEN);

      if (!refresh) {
        setIsAuthorized(false);
        return;
      }

      try {
        const res = await api.post("/api/token/refresh/", {
          refresh: refresh,
        });

        if (res.status === 200) {
          localStorage.setItem(ACCESS_TOKEN, res.data.access);
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error(error);
        setIsAuthorized(false);
      }
    };

    const auth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
          await refreshToken();
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error(error);
        setIsAuthorized(false);
      }
    };

    auth();
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
