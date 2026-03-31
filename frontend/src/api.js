import axios from "axios";
import i18n from "./i18n";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN);

const getCurrentLanguage = () => {
  const lang = i18n.language || localStorage.getItem("language") || "fi";
  return lang.toLowerCase().includes("fi") ? "fi" : "en";
};

const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN, token);
};

const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
};

const redirectToLogin = () => {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

const refreshAccessToken = async () => {
  const refresh = getRefreshToken();

  if (!refresh) {
    throw new Error("No refresh token available.");
  }

  const response = await axios.post(
    `${API_BASE_URL}/token/refresh/`,
    { refresh },
    {
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": getCurrentLanguage(),
      },
    },
  );

  const newAccessToken = response.data?.access;

  if (!newAccessToken) {
    throw new Error("No access token returned from refresh endpoint.");
  }

  setAccessToken(newAccessToken);
  return newAccessToken;
};

// Lisää access token ja kieli kaikkiin pyyntöihin automaattisesti
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    config.headers = config.headers || {};
    config.headers["Accept-Language"] = getCurrentLanguage();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Jos access token on vanhentunut, yritä refreshata se ja aja pyyntö uudelleen
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response.status === 401;
    const isRefreshRequest = originalRequest?.url?.includes("/token/refresh/");
    const hasAlreadyRetried = originalRequest?._retry;

    if (isUnauthorized && !isRefreshRequest && !hasAlreadyRetried) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
          "Accept-Language": getCurrentLanguage(),
        };

        return api(originalRequest);
      } catch (refreshError) {
        clearTokens();
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    if (isUnauthorized) {
      clearTokens();
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);

export default api;
