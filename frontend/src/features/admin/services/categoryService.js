/**
 * categoryService
 *
 * API helpers for admin category management.
 *
 * Responsibilities:
 * - Fetches menu categories for admin views
 * - Creates new categories
 * - Updates existing categories
 * - Deletes categories
 */

import api from "../../../api";

export const getCategories = async () => {
  const { data } = await api.get("/admin/categories/");
  return data;
};

export const createCategory = async (categoryData) => {
  const { data } = await api.post("/admin/categories/", categoryData);
  return data;
};

export const updateCategory = async (id, categoryData) => {
  const { data } = await api.patch(`/admin/categories/${id}/`, categoryData);
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await api.delete(`/admin/categories/${id}/`);
  return data;
};
