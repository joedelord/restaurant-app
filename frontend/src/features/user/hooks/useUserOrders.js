/**
 * useUserOrders
 *
 * Custom hook for managing the current user's orders.
 *
 * Responsibilities:
 * - Fetches user orders from the backend
 * - Splits orders into active and past
 * - Provides loading and error state
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getMyOrders } from "../services/userOrderService";

const ACTIVE_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "served",
];
const PAST_STATUSES = ["paid", "cancelled"];

const sortActiveOrders = (items) =>
  [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

const sortPastOrders = (items) =>
  [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

const useUserOrders = () => {
  const { t } = useTranslation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setError("");
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError(t("user.orders.messages.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [t]);

  const activeOrders = useMemo(() => {
    return sortActiveOrders(
      orders.filter((item) => ACTIVE_STATUSES.includes(item.status)),
    );
  }, [orders]);

  const pastOrders = useMemo(() => {
    return sortPastOrders(
      orders.filter((item) => PAST_STATUSES.includes(item.status)),
    );
  }, [orders]);

  return {
    loading,
    error,
    activeOrders,
    pastOrders,
  };
};

export default useUserOrders;
