import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getReservations,
  updateReservation,
} from "../services/staffReservationService";

const POLL_INTERVAL = 20000;

const sortReservations = (items) =>
  [...items].sort(
    (a, b) => new Date(a.reservation_time) - new Date(b.reservation_time),
  );

const useStaffPendingReservations = () => {
  const { t } = useTranslation();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchReservations = async ({ silent = false } = {}) => {
      if (!silent && isMounted) {
        setLoading(true);
      }

      try {
        if (isMounted) {
          setError("");
        }

        const data = await getReservations();

        if (isMounted) {
          setReservations(data);
        }
      } catch (err) {
        console.error(err);

        if (isMounted) {
          setError(t("staff.pendingReservations.messages.fetchError"));
        }
      } finally {
        if (!silent && isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReservations();

    const intervalId = window.setInterval(() => {
      fetchReservations({ silent: true });
    }, POLL_INTERVAL);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [t]);

  const pendingReservations = useMemo(() => {
    return sortReservations(
      reservations.filter((item) => item.status === "pending"),
    );
  }, [reservations]);

  const updateReservationStatus = async (item, status) => {
    try {
      setActionLoadingId(item.id);
      setError("");
      setMessage("");

      const updated = await updateReservation(item.id, { status });

      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === item.id ? updated : reservation,
        ),
      );

      setMessage(
        status === "confirmed"
          ? t("staff.pendingReservations.messages.confirmed")
          : t("staff.pendingReservations.messages.cancelled"),
      );
    } catch (err) {
      console.error(err);
      setError(t("staff.pendingReservations.messages.updateError"));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirm = async (item) => {
    await updateReservationStatus(item, "confirmed");
  };

  const handleCancel = async (item) => {
    const confirmed = window.confirm(
      t("staff.pendingReservations.messages.confirmCancel", { id: item.id }),
    );

    if (!confirmed) return;

    await updateReservationStatus(item, "cancelled");
  };

  return {
    loading,
    actionLoadingId,
    message,
    error,
    pendingReservations,
    handleConfirm,
    handleCancel,
  };
};

export default useStaffPendingReservations;
