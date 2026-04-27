/**
 * reservationHelpers
 *
 * Utility helpers for reservation-related logic.
 *
 * Responsibilities:
 * - Stores constants used across the reservation feature
 * - Builds reservation payloads for API requests
 * - Maps backend validation errors into user-friendly messages
 */

export const STORAGE_KEY = "pendingReservation";

export const buildReservationDraft = ({
  date,
  selectedSlot,
  selectedTableId,
  tables,
  partySize,
  specialRequests,
}) => {
  if (!selectedSlot || !selectedSlot.time) {
    throw new Error("Invalid reservation slot");
  }

  const selectedTable = tables.find((table) => table.id === selectedTableId);

  return {
    reservation_time: `${date}T${selectedSlot.time}:00`,
    date,
    time: selectedSlot.time,
    party_size: Number(partySize),
    table_id: selectedTableId,
    table_number: selectedTable?.table_number ?? null,
    special_requests: specialRequests?.trim() || "",
  };
};

export const getReservationErrorMessage = (err, fallbackMessage) => {
  const data = err?.response?.data;

  if (!data) return fallbackMessage;

  const fieldError =
    data.reservation_time?.[0] || data.party_size?.[0] || data.table_id?.[0];

  if (fieldError) return fieldError;

  if (data.detail) return data.detail;

  return fallbackMessage;
};
