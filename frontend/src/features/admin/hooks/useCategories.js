/**
 * useCategories
 *
 * Manages category data for the admin dashboard.
 *
 * Responsibilities:
 * - Fetches and sorts menu categories
 * - Handles creating, updating and deleting categories
 * - Manages editing state
 * - Provides loading, success and error state
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/categoryService";

const sortCategories = (items) =>
  [...items].sort(
    (a, b) =>
      a.display_order - b.display_order ||
      (a.name_en || "").localeCompare(b.name_en || ""),
  );

const getCategoryLabel = (category) => {
  return [category.name_en, category.name_fi].filter(Boolean).join(" / ");
};

const useCategories = () => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setError("");
        const data = await getCategories();
        setCategories(sortCategories(data));
      } catch (err) {
        console.error(err);
        setError(t("admin.categories.messages.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [t]);

  const handleCreate = async (payload) => {
    try {
      const created = await createCategory(payload);

      setCategories((prev) => sortCategories([...prev, created]));
      setMessage(t("admin.categories.messages.created"));
      setError("");
      setEditingCategory(null);
    } catch (err) {
      console.error(err);
      setError(t("admin.categories.messages.saveError"));
      throw err;
    }
  };

  const handleUpdate = async (payload) => {
    if (!editingCategory) return;

    try {
      const updated = await updateCategory(editingCategory.id, payload);

      setCategories((prev) =>
        sortCategories(
          prev.map((item) => (item.id === editingCategory.id ? updated : item)),
        ),
      );

      setMessage(t("admin.categories.messages.updated"));
      setError("");
      setEditingCategory(null);
    } catch (err) {
      console.error(err);
      setError(t("admin.categories.messages.saveError"));
      throw err;
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      t("admin.categories.messages.confirmDelete", {
        name: getCategoryLabel(item),
      }),
    );

    if (!confirmed) return;

    try {
      await deleteCategory(item.id);

      setCategories((prev) => prev.filter((cat) => cat.id !== item.id));

      if (editingCategory?.id === item.id) {
        setEditingCategory(null);
      }

      setMessage(t("admin.categories.messages.deleted"));
      setError("");
    } catch (err) {
      console.error(err);
      setError(t("admin.categories.messages.deleteError"));
    }
  };

  const startEditing = (item) => {
    setEditingCategory(item);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setEditingCategory(null);
  };

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  return {
    categories,
    editingCategory,
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

export default useCategories;
