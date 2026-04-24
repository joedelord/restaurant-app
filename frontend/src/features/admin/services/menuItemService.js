/**
 * menuItemService
 *
 * API helpers for admin menu item management.
 *
 * Responsibilities:
 * - Fetches menu items for admin views
 * - Creates new menu items
 * - Updates existing menu items
 * - Deletes menu items
 */

import api from "../../../api";

export const getMenuItems = async () => {
  const { data } = await api.get("/admin/menu-items/");
  return data;
};

export const createMenuItem = async (menuData) => {
  const { data } = await api.post("/admin/menu-items/", menuData);
  return data;
};

export const updateMenuItem = async (id, menuData) => {
  const { data } = await api.patch(`/admin/menu-items/${id}/`, menuData);
  return data;
};

export const deleteMenuItem = async (id) => {
  const { data } = await api.delete(`/admin/menu-items/${id}/`);
  return data;
};
