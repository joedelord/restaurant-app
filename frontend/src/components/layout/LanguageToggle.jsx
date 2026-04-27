/**
 * LanguageToggle
 *
 * Component for switching the application language.
 *
 * Responsibilities:
 * - Displays available language options (FI / EN)
 * - Highlights the currently active language
 * - Updates i18n language on user selection
 * - Provides a compact UI suitable for navbar usage
 *
 * Notes:
 * - Uses i18next for language management
 * - Current language is derived from i18n.language
 */

import { useTranslation } from "react-i18next";

const LanguageToggle = ({ className = "" }) => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language?.startsWith("fi") ? "fi" : "en";

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div
      className={`flex items-center rounded-full border border-white/10 bg-white/5 p-0.5 ${className}`}
    >
      <button
        type="button"
        onClick={() => changeLanguage("fi")}
        className={`px-2 py-0.5 text-xs font-medium transition-all ${
          currentLanguage === "fi"
            ? "rounded-full bg-white text-gray-900"
            : "text-white/70 hover:text-white"
        }`}
      >
        FI
      </button>

      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`px-2 py-0.5 text-xs font-medium transition-all ${
          currentLanguage === "en"
            ? "rounded-full bg-white text-gray-900"
            : "text-white/70 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
