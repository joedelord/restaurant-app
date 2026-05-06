/**
 * ReservationSuccessModal
 *
 * Success modal shown after a reservation has been created.
 *
 * Responsibilities:
 * - Confirms that the reservation was submitted successfully
 * - Shows a short summary of the created reservation
 * - Informs the user that the reservation can be managed later
 * - Provides a link to the user's own reservations page
 */

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils";
import { Button } from "@/components";

const ReservationSuccessModal = ({ open, reservation, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!open || !reservation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {t("reservation.success.title")}
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            {t("reservation.success.subtitle")}
          </p>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <p>
            {formatDate(reservation.date)} klo {reservation.time},{" "}
            {reservation.party_size} hlö
          </p>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          {t("reservation.success.cancelInfo")}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("reservation.success.close")}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate("/user/reservations")}
          >
            {t("reservation.success.myReservations")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReservationSuccessModal;
