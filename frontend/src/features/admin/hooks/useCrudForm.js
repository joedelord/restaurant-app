import { useState } from "react";

export const useCrudForm = () => {
  const [showForm, setShowForm] = useState(false);

  const openCreateForm = (resetEditing) => {
    resetEditing?.();
    setShowForm(true);
  };

  const openEditForm = (item, startEditing) => {
    startEditing(item);
    setShowForm(true);
  };

  const closeForm = (resetEditing) => {
    resetEditing?.();
    setShowForm(false);
  };

  const closeAfterSubmit = () => {
    setShowForm(false);
  };

  return {
    showForm,
    openCreateForm,
    openEditForm,
    closeForm,
    closeAfterSubmit,
  };
};
