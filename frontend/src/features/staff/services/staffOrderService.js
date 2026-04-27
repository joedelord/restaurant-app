/**
 * staffOrderService
 *
 * API helpers for staff order management.
 *
 * Responsibilities:
 * - Fetches orders for staff users
 * - Creates new staff orders
 * - Updates existing orders
 * - Deletes orders when needed
 */

import api from "@/api";

export const getOrders = async () => {
  const { data } = await api.get("/orders/");
  return data;
};

export const createOrder = async (payload) => {
  const { data } = await api.post("/orders/create/", payload);
  return data;
};

export const updateOrder = async (id, payload) => {
  const { data } = await api.patch(`/orders/${id}/`, payload);
  return data;
};

export const deleteOrder = async (id) => {
  const { data } = await api.delete(`/orders/${id}/`);
  return data;
};
