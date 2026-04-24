/**
 * userService
 *
 * API helpers for admin user management.
 *
 * Responsibilities:
 * - Fetches users for admin views
 * - Creates new users
 * - Updates existing users
 * - Deletes users
 */

import api from "../../../api";

export const getUsers = async () => {
  const { data } = await api.get("/admin/users/");
  return data;
};

export const createUser = async (userData) => {
  const { data } = await api.post("/admin/users/", userData);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await api.patch(`/admin/users/${id}/`, userData);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`/admin/users/${id}/`);
  return data;
};
