/**
 * currency.js
 *
 * Utility functions for formatting numeric values and currency.
 *
 * Responsibilities:
 * - Formats numeric values with fixed decimal precision
 * - Formats currency values using locale-aware formatting
 * - Handles invalid or empty inputs safely
 *
 * Notes:
 * - Uses Finnish locale (fi-FI) and EUR currency by default
 * - Returns "-" for invalid or missing values
 */

const parseNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isNaN(number) ? null : number;
};

export const formatPrice = (value) => {
  const number = parseNumber(value);
  if (number === null) return "-";

  return new Intl.NumberFormat("fi-FI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

export const formatCurrency = (value) => {
  const number = parseNumber(value);
  if (number === null) return "-";

  return new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: "EUR",
  }).format(number);
};
