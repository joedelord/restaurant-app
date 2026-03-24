import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ACCESS_TOKEN_KEY = "access";
const REFRESH_TOKEN_KEY = "refresh";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
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

// Lisää access token kaikkiin pyyntöihin automaattisesti
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

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

    // Jos ei responsea, kyse voi olla verkko-ongelmasta
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
        };

        return api(originalRequest);
      } catch (refreshError) {
        clearTokens();
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    // Jos refresh itse epäonnistui tai retrykin epäonnistui
    if (isUnauthorized) {
      clearTokens();
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);

export default api;
