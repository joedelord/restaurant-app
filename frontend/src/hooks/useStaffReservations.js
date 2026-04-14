import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getReservations,
  updateReservation,
  deleteReservation,
} from "../services/staffReservationService";

const sortReservations = (items) =>
  [...items].sort(
    (a, b) => new Date(a.reservation_time) - new Date(b.reservation_time),
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
        setReservations(sortReservations(data));
      } catch (err) {
        console.error(err);
        setError(t("staff.reservations.messages.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [t]);

  const handleUpdate = async (payload) => {
    if (!editingReservation) return;

    const updated = await updateReservation(editingReservation.id, payload);

    setReservations((prev) =>
      sortReservations(
        prev.map((item) =>
          item.id === editingReservation.id ? updated : item,
        ),
      ),
    );

    setMessage(t("staff.reservations.messages.updated"));
    setError("");
    setEditingReservation(null);
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      t("staff.reservations.messages.confirmDelete", {
        id: item.id,
      }),
    );

    if (!confirmed) return;

    try {
      await deleteReservation(item.id);

      setReservations((prev) => prev.filter((res) => res.id !== item.id));

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
    reservations,
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
