/**
 * date.js
 *
 * Utility functions for formatting dates and handling reservation date logic.
 *
 * Responsibilities:
 * - Formats dates, times and date-time values for display
 * - Converts Date values into HTML date input format
 * - Provides a default reservation date based on restaurant closing time
 * - Checks whether a selected reservation time slot is in the past
 *
 * Notes:
 * - Uses Finnish locale (fi-FI) for display formatting
 * - Returns safe fallback values for invalid or missing dates
 */

export const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("fi-FI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("fi-FI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("fi-FI", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const toDateInputValue = (date = new Date()) => {
  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getDefaultReservationDate = (closingHour = 22) => {
  const now = new Date();

  if (now.getHours() >= closingHour) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return toDateInputValue(tomorrow);
  }

  return toDateInputValue(now);
};

export const isPastTimeSlot = (dateValue, timeValue) => {
  if (!dateValue || !timeValue) return false;

  const slotDate = new Date(`${dateValue}T${timeValue}:00`);

  if (Number.isNaN(slotDate.getTime())) {
    return false;
  }

  return slotDate < new Date();
};
