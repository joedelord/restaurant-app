/**
 * userReservationService
 *
 * API helpers for managing the current user's reservations.
 *
 * Responsibilities:
 * - Fetches all reservations belonging to the current user
 * - Allows cancelling a reservation by updating its status
 */

import api from "@/api";

export const getMyReservations = async () => {
  const { data } = await api.get("/reservations/");
  return data;
};

export const cancelMyReservation = async (id) => {
  const { data } = await api.patch(`/reservations/${id}/status/`, {
    status: "cancelled",
  });
  return data;
};
