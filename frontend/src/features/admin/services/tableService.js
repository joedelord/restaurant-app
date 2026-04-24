/**
 * tableService
 *
 * API helpers for admin table management.
 *
 * Responsibilities:
 * - Fetches restaurant tables for admin views
 * - Creates new tables
 * - Updates existing tables
 * - Deletes tables
 */

import api from "../../../api";

export const getTables = async () => {
  const { data } = await api.get("/admin/tables/");
  return data;
};

export const createTable = async (tableData) => {
  const { data } = await api.post("/admin/tables/", tableData);
  return data;
};

export const updateTable = async (id, tableData) => {
  const { data } = await api.patch(`/admin/tables/${id}/`, tableData);
  return data;
};

export const deleteTable = async (id) => {
  const { data } = await api.delete(`/admin/tables/${id}/`);
  return data;
};
