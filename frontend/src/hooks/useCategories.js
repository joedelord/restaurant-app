import { useEffect, useState } from "react";
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

const useCategories = () => {
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
        setError("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCreate = async (payload) => {
    const created = await createCategory(payload);

    setCategories((prev) => sortCategories([...prev, created]));
    setMessage("Category created successfully.");
    setError("");
    setEditingCategory(null);
  };

  const handleUpdate = async (payload) => {
    if (!editingCategory) return;

    const updated = await updateCategory(editingCategory.id, payload);

    setCategories((prev) =>
      sortCategories(
        prev.map((item) => (item.id === editingCategory.id ? updated : item)),
      ),
    );

    setMessage("Category updated successfully.");
    setError("");
    setEditingCategory(null);
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete category "${item.name_en} / ${item.name_fi}"?`,
    );

    if (!confirmed) return;

    try {
      await deleteCategory(item.id);

      setCategories((prev) => prev.filter((cat) => cat.id !== item.id));

      if (editingCategory?.id === item.id) {
        setEditingCategory(null);
      }

      setMessage("Category deleted successfully.");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to delete category.");
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
