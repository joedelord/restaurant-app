import { useEffect, useState } from "react";
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
} from "../services/tableService";

const sortTables = (items) =>
  [...items].sort((a, b) => a.table_number - b.table_number);

const useTables = () => {
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
        setError("Failed to fetch tables.");
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  const handleCreate = async (payload) => {
    const created = await createTable(payload);

    setTables((prev) => sortTables([...prev, created]));
    setMessage("Table created successfully.");
    setError("");
    setEditingTable(null);
  };

  const handleUpdate = async (payload) => {
    if (!editingTable) return;

    const updated = await updateTable(editingTable.id, payload);

    setTables((prev) =>
      sortTables(
        prev.map((item) => (item.id === editingTable.id ? updated : item)),
      ),
    );

    setMessage("Table updated successfully.");
    setError("");
    setEditingTable(null);
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete table ${item.table_number}?`,
    );

    if (!confirmed) return;

    try {
      await deleteTable(item.id);
      setTables((prev) => prev.filter((table) => table.id !== item.id));

      if (editingTable?.id === item.id) {
        setEditingTable(null);
      }

      setMessage("Table deleted successfully.");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to delete table.");
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
  };
};

export default useTables;
