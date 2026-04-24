/**
 * useTables
 *
 * Manages restaurant tables for the admin dashboard.
 *
 * Responsibilities:
 * - Fetches and sorts tables
 * - Handles creating, updating and deleting tables
 * - Manages editing state
 * - Provides loading, success and error state
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
} from "../services/tableService";

const sortTables = (items) =>
  [...items].sort((a, b) => a.table_number - b.table_number);

const useTables = () => {
  const { t } = useTranslation();

  const [tables, setTables] = useState([]);
  const [editingTable, setEditingTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setError("");
        const data = await getTables();
        setTables(sortTables(data));
      } catch (err) {
        console.error(err);
        setError(t("admin.tables.messages.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [t]);

  const handleCreate = async (payload) => {
    try {
      const created = await createTable(payload);

      setTables((prev) => sortTables([...prev, created]));
      setMessage(t("admin.tables.messages.created"));
      setError("");
      setEditingTable(null);
    } catch (err) {
      console.error(err);
      setError(t("admin.tables.messages.saveError"));
      throw err;
    }
  };

  const handleUpdate = async (payload) => {
    if (!editingTable) return;

    try {
      const updated = await updateTable(editingTable.id, payload);

      setTables((prev) =>
        sortTables(
          prev.map((item) => (item.id === editingTable.id ? updated : item)),
        ),
      );

      setMessage(t("admin.tables.messages.updated"));
      setError("");
      setEditingTable(null);
    } catch (err) {
      console.error(err);
      setError(t("admin.tables.messages.saveError"));
      throw err;
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      t("admin.tables.messages.confirmDelete", {
        tableNumber: item.table_number,
      }),
    );

    if (!confirmed) return;

    try {
      await deleteTable(item.id);

      setTables((prev) => prev.filter((table) => table.id !== item.id));

      if (editingTable?.id === item.id) {
        setEditingTable(null);
      }

      setMessage(t("admin.tables.messages.deleted"));
      setError("");
    } catch (err) {
      console.error(err);
      setError(t("admin.tables.messages.deleteError"));
    }
  };

  const startEditing = (item) => {
    setEditingTable(item);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setEditingTable(null);
  };

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  return {
    tables,
    editingTable,
    loading,
    message,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    startEditing,
    cancelEditing,
    clearMessages,
  };
};

export default useTables;
