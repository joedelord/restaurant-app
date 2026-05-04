/**
 * useCrudForm
 *
 * Reusable hook for handling form visibility and CRUD form behavior
 * in admin pages.
 *
 * Responsibilities:
 * - Manages form visibility state (show/hide)
 * - Opens form for creating a new item
 * - Opens form for editing an existing item
 * - Closes form and optionally resets editing state
 * - Provides helper for closing form after successful submit
 *
 * Notes:
 * - Designed to work with feature-specific hooks (e.g. useUsers, useTables)
 * - Expects external editing handlers (startEditing, cancelEditing)
 * - Keeps UI logic (form visibility) separate from data logic (CRUD)
 */

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
