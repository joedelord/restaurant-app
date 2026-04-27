/**
 * staffReservationService
 *
 * API helpers for staff reservation management.
 *
 * Responsibilities:
 * - Fetches reservations for staff users
 * - Updates reservation details or status
 * - Deletes reservations when needed
 */

import api from "@/api";

export const getReservations = async () => {
  const { data } = await api.get("/reservations/");
  return data;
};

export const updateReservation = async (id, payload) => {
  const { data } = await api.patch(`/reservations/${id}/`, payload);
  return data;
};

export const deleteReservation = async (id) => {
  const { data } = await api.delete(`/reservations/${id}/`);
  return data;
};
