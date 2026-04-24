/**
 * useUserReservations
 *
 * Custom hook for managing the current user's reservations.
 *
 * Responsibilities:
 * - Fetches user reservations from the backend
 * - Splits reservations into upcoming and past
 * - Handles reservation cancellation
 * - Provides loading, error, and success state
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getMyReservations,
  cancelMyReservation,
} from "../services/userReservationService";

const sortUpcomingReservations = (items) =>
  [...items].sort(
    (a, b) => new Date(a.reservation_time) - new Date(b.reservation_time),
  );

const sortPastReservations = (items) =>
  [...items].sort(
    (a, b) => new Date(b.reservation_time) - new Date(a.reservation_time),
  );

const canCancelReservation = (item) => {
  const reservationDate = new Date(item.reservation_time);

  return (
    reservationDate > new Date() &&
    ["pending", "confirmed"].includes(item.status)
  );
};

const useUserReservations = () => {
  const { t } = useTranslation();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setError("");
        const data = await getMyReservations();
        setReservations(data);
      } catch (err) {
        console.error(err);
        setError(t("user.reservations.messages.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [t]);

  const upcomingReservations = useMemo(() => {
    const now = new Date();

    return sortUpcomingReservations(
      reservations.filter((item) => {
        const reservationDate = new Date(item.reservation_time);
        return reservationDate >= now && item.status !== "completed";
      }),
    );
  }, [reservations]);

  const pastReservations = useMemo(() => {
    const now = new Date();

    return sortPastReservations(
      reservations.filter((item) => {
        const reservationDate = new Date(item.reservation_time);
        return reservationDate < now || item.status === "completed";
      }),
    );
  }, [reservations]);

  const handleCancel = async (item) => {
    const confirmed = window.confirm(
      t("user.reservations.messages.confirmCancel"),
    );

    if (!confirmed) return;

    try {
      const updated = await cancelMyReservation(item.id);

      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === item.id ? updated : reservation,
        ),
      );

      setTimeout(
        () => setMessage(t("user.reservations.messages.cancelled")),
        3000,
      );
    } catch (err) {
      console.error(err);
      setError(t("user.reservations.messages.cancelError"));
    }
  };

  return {
    loading,
    message,
    error,
    upcomingReservations,
    pastReservations,
    handleCancel,
    canCancelReservation,
  };
};

export default useUserReservations;
