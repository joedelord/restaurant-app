import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../services/userService";

const sortUsers = (items) =>
  [...items].sort((a, b) => {
    const lastNameCompare = (a.last_name || "").localeCompare(
      b.last_name || "",
    );
    if (lastNameCompare !== 0) return lastNameCompare;

    return (a.first_name || "").localeCompare(b.first_name || "");
  });

const useUsers = () => {
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError("");
        const data = await getUsers();
        setUsers(sortUsers(data));
      } catch (err) {
        console.error(err);
        setError(t("admin.users.messages.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [t]);

  const handleCreate = async (payload) => {
    const created = await createUser(payload);

    setUsers((prev) => sortUsers([...prev, created]));
    setMessage(t("admin.users.messages.created"));
    setError("");
    setEditingUser(null);
  };

  const handleUpdate = async (payload) => {
    if (!editingUser) return;

    const updated = await updateUser(editingUser.id, payload);

    setUsers((prev) =>
      sortUsers(
        prev.map((item) => (item.id === editingUser.id ? updated : item)),
      ),
    );

    setMessage(t("admin.users.messages.updated"));
    setError("");
    setEditingUser(null);
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      t("admin.users.messages.confirmDelete", { email: item.email }),
    );

    if (!confirmed) return;

    try {
      await deleteUser(item.id);

      setUsers((prev) => prev.filter((user) => user.id !== item.id));

      if (editingUser?.id === item.id) {
        setEditingUser(null);
      }

      setMessage(t("admin.users.messages.deleted"));
      setError("");
    } catch (err) {
      console.error(err);
      setError(t("admin.users.messages.deleteError"));
    }
  };

  const startEditing = (item) => {
    setEditingUser(item);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setEditingUser(null);
  };

  return {
    users,
    editingUser,
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

export default useUsers;
