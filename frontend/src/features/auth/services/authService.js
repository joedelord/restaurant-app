/**
 * authService
 *
 * Authentication helper service for token handling.
 *
 * Responsibilities:
 * - Reads and stores JWT access and refresh tokens
 * - Clears authentication tokens on logout or failed refresh
 * - Checks whether a token has expired
 * - Refreshes the access token using the refresh token
 * - Provides a valid access token for authenticated API requests
 */

import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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

    return decoded.exp <= now;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true;
  }
};

export const refreshAccessToken = async () => {
  const refresh = getRefreshToken();

  if (!refresh) {
    clearTokens();
    throw new Error("No refresh token found.");
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/token/refresh/`,
      { refresh },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 200 && response.data.access) {
      setTokens({ access: response.data.access });
      return response.data.access;
    }

    clearTokens();
    throw new Error("Failed to refresh access token.");
  } catch (error) {
    clearTokens();
    throw error;
  }
};

export const getValidAccessToken = async () => {
  const access = getAccessToken();

  if (!access) {
    throw new Error("No access token found.");
  }

  if (!isTokenExpired(access)) {
    return access;
  }

  return refreshAccessToken();
};

export const isAuthenticated = async () => {
  try {
    await getValidAccessToken();
    return true;
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
};
