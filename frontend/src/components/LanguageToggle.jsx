import { useTranslation } from "react-i18next";

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language?.startsWith("fi") ? "fi" : "en";

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  };

  return (
    <div className="inline-flex items-center rounded-full border border-default-medium bg-white p-1 shadow-xs">
      <button
        type="button"
        onClick={() => changeLanguage("fi")}
        className={`rounded-full px-2 py-0.5 text-xs font-medium transition-all duration-200 sm:text-sm ${
          currentLanguage === "fi"
            ? "bg-black text-white shadow-sm"
            : "text-heading hover:bg-neutral-secondary-medium"
        }`}
        aria-pressed={currentLanguage === "fi"}
      >
        FI
      </button>

      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`rounded-full px-2 py-0.5 text-xs font-medium transition-all duration-200 sm:text-sm ${
          currentLanguage === "en"
            ? "bg-black text-white shadow-sm"
            : "text-heading hover:bg-neutral-secondary-medium"
        }`}
        aria-pressed={currentLanguage === "en"}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
