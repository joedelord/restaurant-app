/**
 * userOrderService
 *
 * API helpers for managing the current user's orders.
 *
 * Responsibilities:
 * - Fetches all orders belonging to the current user
 */

import api from "../../../api";

export const getMyOrders = async () => {
  const { data } = await api.get("/orders/");
  return data;
};
