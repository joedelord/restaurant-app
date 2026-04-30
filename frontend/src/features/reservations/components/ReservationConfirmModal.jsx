/**
 * ReservationConfirmModal
 *
 * Confirmation modal shown before a reservation is finally submitted.
 *
 * Responsibilities:
 * - Displays a summary of the reservation details
 * - Informs the user when login is required
 * - Lets the user go back, log in, or confirm the reservation
 */

import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils";
import { Button } from "@/components";

const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between gap-4">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

const ReservationConfirmModal = ({
  open,
  reservation,
  isAuthorized,
  loading,
  onClose,
  onConfirm,
  onLogin,
}) => {
  const { t } = useTranslation();

  if (!open || !reservation) return null;

  const tableLabel = reservation.table_number
    ? t("reservation.tablePicker.table", {
        number: reservation.table_number,
      })
    : "-";

  const specialRequests =
    reservation.special_requests || t("reservation.confirm.noRequests");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {t("reservation.confirm.title")}
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            {t("reservation.confirm.subtitle")}
          </p>
        </div>

        <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
          <SummaryRow
            label={t("reservation.confirm.date")}
            value={formatDate(reservation.date)}
          />

          <SummaryRow
            label={t("reservation.confirm.time")}
            value={reservation.time}
          />

          <SummaryRow
            label={t("reservation.confirm.partySize")}
            value={reservation.party_size}
          />

          <SummaryRow
            label={t("reservation.confirm.table")}
            value={tableLabel}
          />

          <div className="pt-2">
            <div className="mb-1 text-gray-500">
              {t("reservation.confirm.specialRequests")}
            </div>
            <div className="text-gray-900">{specialRequests}</div>
          </div>
        </div>

        {!isAuthorized && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {t("reservation.confirm.loginRequired")}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("reservation.confirm.back")}
          </Button>

          {!isAuthorized ? (
            <Button type="button" onClick={onLogin}>
              {t("reservation.confirm.login")}
            </Button>
          ) : (
            <Button type="button" onClick={onConfirm} disabled={loading}>
              {loading
                ? t("reservation.confirm.saving")
                : t("reservation.confirm.confirm")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationConfirmModal;
