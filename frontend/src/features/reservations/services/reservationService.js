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
  const { data } = await api.get("/reservations/availability/", {
    params: {
      date,
      party_size: partySize,
    },
  });

  return data;
};

export const getTables = async () => {
  const { data } = await api.get("/tables/");
  return data;
};

export const createReservation = async (payload) => {
  const { data } = await api.post("/reservations/", payload);
  return data;
};

export const getReservations = async () => {
  const { data } = await api.get("/reservations/");
  return data;
};

export const updateReservation = async (id, payload) => {
  const { data } = await api.patch(`/reservations/${id}/`, payload);
  return data;
};

export const updateReservationStatus = async (id, status) => {
  const { data } = await api.patch(`/reservations/${id}/status/`, { status });
  return data;
};
