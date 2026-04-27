/**
 * useMenuItems
 *
 * Manages menu items for the admin dashboard.
 *
 * Responsibilities:
 * - Fetches and sorts menu items
 * - Handles creating, updating and deleting menu items
 * - Manages editing state
 * - Provides loading, success and error state
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
      (a.name_en || "").localeCompare(b.name_en || ""),
  );

const getMenuItemLabel = (item) => {
  return [item.name_en, item.name_fi].filter(Boolean).join(" / ");
};

const useMenuItems = () => {
  const { t } = useTranslation();

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
        setError(t("admin.menuItems.messages.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [t]);

  const handleCreate = async (payload) => {
    try {
      const created = await createMenuItem(payload);

      setMenuItems((prev) => sortMenuItems([...prev, created]));
      setMessage(t("admin.menuItems.messages.created"));
      setError("");
      setEditingMenuItem(null);
    } catch (err) {
      console.error(err);
      setError(t("admin.menuItems.messages.saveError"));
      throw err;
    }
  };

  const handleUpdate = async (payload) => {
    if (!editingMenuItem) return;

    try {
      const updated = await updateMenuItem(editingMenuItem.id, payload);

      setMenuItems((prev) =>
        sortMenuItems(
          prev.map((item) => (item.id === editingMenuItem.id ? updated : item)),
        ),
      );

      setMessage(t("admin.menuItems.messages.updated"));
      setError("");
      setEditingMenuItem(null);
    } catch (err) {
      console.error(err);
      setError(t("admin.menuItems.messages.saveError"));
      throw err;
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      t("admin.menuItems.messages.confirmDelete", {
        name: getMenuItemLabel(item),
      }),
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

      setMessage(t("admin.menuItems.messages.deleted"));
      setError("");
    } catch (err) {
      console.error(err);
      setError(t("admin.menuItems.messages.deleteError"));
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

  const clearMessages = () => {
    setMessage("");
    setError("");
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
    clearMessages,
  };
};

export default useMenuItems;
