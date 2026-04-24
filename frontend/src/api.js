/**
 * api
 *
 * Central Axios client for backend API requests.
 *
 * Responsibilities:
 * - Defines the base API URL
 * - Adds the current language to outgoing requests
 * - Adds JWT access token to authenticated requests
 * - Refreshes expired access tokens and retries failed requests
 * - Clears tokens and redirects to login when authentication fails
 */

import axios from "axios";

import i18n from "./i18n";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./features/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getCurrentLanguage = () => {
  const lang = i18n.language || localStorage.getItem("language") || "fi";
  return lang.toLowerCase().includes("fi") ? "fi" : "en";
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

  setTokens({ access: newAccessToken });
  return newAccessToken;
};

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
