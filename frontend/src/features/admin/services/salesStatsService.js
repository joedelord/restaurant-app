/**
 * salesService
 *
 * API helpers for fetching admin sales statistics.
 *
 * Responsibilities:
 * - Fetches sales statistics data for the admin dashboard
 * - Provides aggregated sales insights (e.g. popular items, category sales)
 */

import api from "../../../api";

export const getSalesStats = async () => {
  const { data } = await api.get("/admin/sales/");
  return data;
};
