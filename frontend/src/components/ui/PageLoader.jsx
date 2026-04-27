/**
 * PageLoader
 *
 * Reusable loading indicator for pages and components.
 *
 * Responsibilities:
 * - Displays a centered loading spinner
 * - Shows a loading message
 * - Provides consistent loading UI across the application
 *
 * Notes:
 * - Used in route guards, pages and data-fetching states
 * - Should be lightweight and fast to render
 */

import { useTranslation } from "react-i18next";

const PageLoader = ({ text }) => {
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-col items-center justify-center gap-3 p-6"
      role="status"
      aria-live="polite"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand"></div>
      <p className="text-sm text-gray-500">
        {text || t("auth.spinner.loading")}
      </p>
    </div>
  );
};

export default PageLoader;
