/**
 * menuService
 *
 * API helpers for menu-related operations.
 *
 * Responsibilities:
 * - Fetches menu items
 * - Fetches menu categories
 * - Provides data for the public menu view
 */

import api from "../../../api";

export const getMenuItems = async () => {
  const response = await api.get("/menu-items/");
  return response.data;
};

export const getMenuCategories = async () => {
  const response = await api.get("/categories/");
  return response.data;
};
