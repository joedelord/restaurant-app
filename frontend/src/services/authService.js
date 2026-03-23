import { jwtDecode } from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN);

export const setTokens = ({ access, refresh }) => {
  if (access) localStorage.setItem(ACCESS_TOKEN, access);
  if (refresh) localStorage.setItem(REFRESH_TOKEN, refresh);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch (error) {
    console.error(error);
    return true;
  }
};

export const refreshAccessToken = async () => {
  const refresh = getRefreshToken();

  if (!refresh) {
    clearTokens();
    throw new Error("No refresh token found");
  }

  try {
    const res = await api.post("/api/token/refresh/", { refresh });

    if (res.status === 200 && res.data.access) {
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      return res.data.access;
    }

    clearTokens();
    throw new Error("Failed to refresh access token");
  } catch (error) {
    clearTokens();
    throw error;
  }
};

export const getValidAccessToken = async () => {
  const access = getAccessToken();

  if (!access) {
    throw new Error("No access token found");
  }

  if (!isTokenExpired(access)) {
    return access;
  }

  return await refreshAccessToken();
};

export const isAuthenticated = async () => {
  try {
    await getValidAccessToken();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
