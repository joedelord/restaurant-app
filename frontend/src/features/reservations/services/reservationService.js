/**
 * reservationService
 *
 * API helpers for reservation-related operations.
 *
 * Responsibilities:
 * - Fetches available reservation time slots
 * - Fetches restaurant tables used in the reservation flow
 * - Creates new reservations
 * - Fetches the current user's reservations
 * - Updates reservation status when needed
 */

import api from "@/api";

export const getReservationAvailability = async ({ date, partySize }) => {
  const response = await api.get("/reservations/availability/", {
    params: {
      date,
      party_size: partySize,
    },
  });

  return response.data;
};

export const getTables = async () => {
  const response = await api.get("/tables/");
  return response.data;
};

export const createReservation = async (payload) => {
  const response = await api.post("/reservations/", payload);
  return response.data;
};

export const getReservations = async () => {
  const response = await api.get("/reservations/");
  return response.data;
};

export const updateReservation = async (id, payload) => {
  const response = await api.patch(`/reservations/${id}/`, payload);
  return response.data;
};

export const updateReservationStatus = async (id, status) => {
  const response = await api.patch(`/reservations/${id}/status/`, { status });
  return response.data;
};
