import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fi from "./locales/fi/translation.json";
import en from "./locales/en/translation.json";

const resources = {
  fi: { translation: fi },
  en: { translation: en },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "fi",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18n;
