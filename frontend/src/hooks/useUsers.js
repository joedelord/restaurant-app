import { useEffect, useState } from "react";
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
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreate = async (payload) => {
    const created = await createUser(payload);
    setUsers((prev) => sortUsers([...prev, created]));
    setMessage("User created successfully.");
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

    setMessage("User updated successfully.");
    setError("");
    setEditingUser(null);
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete user "${item.email}"?`,
    );

    if (!confirmed) return;

    try {
      await deleteUser(item.id);
      setUsers((prev) => prev.filter((user) => user.id !== item.id));

      if (editingUser?.id === item.id) {
        setEditingUser(null);
      }

      setMessage("User deleted successfully.");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to delete user.");
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
