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

import api from "@/api";

export const getMenuItems = async () => {
  const { data } = await api.get("/menu-items/");
  return data;
};

export const getMenuCategories = async () => {
  const { data } = await api.get("/categories/");
  return data;
};
