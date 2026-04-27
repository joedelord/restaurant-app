/**
 * userProfileService
 *
 * API helpers for managing the current user's profile.
 *
 * Responsibilities:
 * - Fetches the current authenticated user's profile
 * - Updates user profile information
 * - Handles password change requests
 */

import api from "@/api";

export const getMyProfile = async () => {
  const { data } = await api.get("/users/me/");
  return data;
};

export const updateMyProfile = async (payload) => {
  const { data } = await api.patch("/users/me/", payload);
  return data;
};

export const changeMyPassword = async (payload) => {
  const { data } = await api.post("/users/change-password/", payload);
  return data;
};
