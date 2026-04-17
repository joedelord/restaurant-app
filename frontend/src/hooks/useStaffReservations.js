import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getReservations,
  updateReservation,
  deleteReservation,
} from "../services/staffReservationService";

const sortUpcomingReservations = (items) =>
  [...items].sort(
    (a, b) => new Date(a.reservation_time) - new Date(b.reservation_time),
  );

const sortPastReservations = (items) =>
  [...items].sort(
    (a, b) => new Date(b.reservation_time) - new Date(a.reservation_time),
  );

const useStaffReservations = () => {
  const { t } = useTranslation();

  const [reservations, setReservations] = useState([]);
  const [editingReservation, setEditingReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setError("");
        const data = await getReservations();
        setReservations(data);
      } catch (err) {
        console.error(err);
        setError(t("staff.reservations.messages.fetchError"));
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

  const handleUpdate = async (payload) => {
    if (!editingReservation) return;

    try {
      const updated = await updateReservation(editingReservation.id, payload);

      setReservations((prev) =>
        prev.map((item) =>
          item.id === editingReservation.id ? updated : item,
        ),
      );

      setMessage(t("staff.reservations.messages.updated"));
      setError("");
      setEditingReservation(null);
    } catch (err) {
      console.error(err);
      setError(t("staff.reservations.messages.saveError"));
      throw err;
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      t("staff.reservations.messages.confirmDelete", { id: item.id }),
    );

    if (!confirmed) return;

    try {
      await deleteReservation(item.id);

      setReservations((prev) =>
        prev.filter((reservation) => reservation.id !== item.id),
      );

      if (editingReservation?.id === item.id) {
        setEditingReservation(null);
      }

      setMessage(t("staff.reservations.messages.deleted"));
      setError("");
    } catch (err) {
      console.error(err);
      setError(t("staff.reservations.messages.deleteError"));
    }
  };

  const startEditing = (item) => {
    setEditingReservation(item);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setEditingReservation(null);
  };

  return {
    upcomingReservations,
    pastReservations,
    editingReservation,
    loading,
    message,
    error,
    handleUpdate,
    handleDelete,
    startEditing,
    cancelEditing,
  };
};

export default useStaffReservations;
