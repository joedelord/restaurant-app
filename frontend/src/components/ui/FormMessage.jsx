/**
 * FormMessage
 *
 * Reusable component for displaying feedback messages in forms and pages.
 *
 * Responsibilities:
 * - Displays success, error or informational messages
 * - Applies variant-based styling
 * - Provides accessible feedback using ARIA roles
 * - Hides itself when no message is provided
 *
 * Notes:
 * - Used across pages for consistent message UI
 * - Variant defaults to "error" if not specified
 */

const stylesByVariant = {
  error: "border-red-300 bg-red-50 text-red-700",
  success: "border-green-300 bg-green-50 text-green-700",
  info: "border-blue-300 bg-blue-50 text-blue-700",
};

const FormMessage = ({ message, variant = "error" }) => {
  if (!message) return null;

  const styles = stylesByVariant[variant] || stylesByVariant.error;

  return (
    <div
      className={`mb-5 rounded-base border px-4 py-3 text-sm ${styles}`}
      role={variant === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      {message}
    </div>
  );
};

export default FormMessage;
