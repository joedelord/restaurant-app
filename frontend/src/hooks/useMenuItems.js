import { useEffect, useState } from "react";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItems,
  updateMenuItem,
} from "../services/menuItemService";

const sortMenuItems = (items) =>
  [...items].sort(
    (a, b) =>
      (a.category_name || "").localeCompare(b.category_name || "") ||
      (a.name || "").localeCompare(b.name || ""),
  );

const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setError("");
        const data = await getMenuItems();
        setMenuItems(sortMenuItems(data));
      } catch (err) {
        console.error(err);
        setError("Failed to fetch menu items.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleCreate = async (payload) => {
    const created = await createMenuItem(payload);

    setMenuItems((prev) => sortMenuItems([...prev, created]));
    setMessage("Menu item created successfully.");
    setError("");
    setEditingMenuItem(null);
  };

  const handleUpdate = async (payload) => {
    if (!editingMenuItem) return;

    const updated = await updateMenuItem(editingMenuItem.id, payload);

    setMenuItems((prev) =>
      sortMenuItems(
        prev.map((item) => (item.id === editingMenuItem.id ? updated : item)),
      ),
    );

    setMessage("Menu item updated successfully.");
    setError("");
    setEditingMenuItem(null);
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete menu item "${item.name}"?`,
    );

    if (!confirmed) return;

    try {
      await deleteMenuItem(item.id);

      setMenuItems((prev) =>
        prev.filter((menuItem) => menuItem.id !== item.id),
      );

      if (editingMenuItem?.id === item.id) {
        setEditingMenuItem(null);
      }

      setMessage("Menu item deleted successfully.");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to delete menu item.");
    }
  };

  const startEditing = (item) => {
    setEditingMenuItem(item);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setEditingMenuItem(null);
  };

  return {
    menuItems,
    editingMenuItem,
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

export default useMenuItems;
