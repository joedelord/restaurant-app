/**
 * useStaffOrders
 *
 * Manages orders for staff dashboard.
 *
 * Responsibilities:
 * - Fetches and sorts orders
 * - Supports editing, updating and deleting orders
 * - Handles loading, message and error state
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getOrders,
  updateOrder,
  deleteOrder,
} from "../services/staffOrderService";

const sortOrders = (items) =>
  [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

const useStaffOrders = () => {
  const { t } = useTranslation();

  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setError("");
        const data = await getOrders();
        setOrders(sortOrders(data));
      } catch (err) {
        console.error(err);
        setError(t("staff.orders.messages.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [t]);

  const handleUpdate = async (payload) => {
    if (!editingOrder) return;

    try {
      const updated = await updateOrder(editingOrder.id, payload);

      setOrders((prev) =>
        sortOrders(
          prev.map((item) => (item.id === editingOrder.id ? updated : item)),
        ),
      );

      setMessage(t("staff.orders.messages.updated"));
      setError("");
      setEditingOrder(null);
    } catch (err) {
      console.error(err);
      setError(t("staff.orders.messages.updateError"));
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      t("staff.orders.messages.confirmDelete", { id: item.id }),
    );

    if (!confirmed) return;

    try {
      await deleteOrder(item.id);

      setOrders((prev) => prev.filter((order) => order.id !== item.id));

      if (editingOrder?.id === item.id) {
        setEditingOrder(null);
      }

      setMessage(t("staff.orders.messages.deleted"));
      setError("");
    } catch (err) {
      console.error(err);
      setError(t("staff.orders.messages.deleteError"));
    }
  };

  const startEditing = (item) => {
    setEditingOrder(item);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setEditingOrder(null);
  };

  return {
    orders,
    editingOrder,
    loading,
    message,
    error,
    handleUpdate,
    handleDelete,
    startEditing,
    cancelEditing,
  };
};

export default useStaffOrders;
