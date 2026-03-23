import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const url = config.url || "";

    const isPublicAuthRoute =
      url.includes("/users/login/") || url.includes("/users/register/");

    if (token && !isPublicAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isLogoutRoute = url.includes("/users/logout/");

    if (error.response?.status === 401 && !isLogoutRoute) {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
