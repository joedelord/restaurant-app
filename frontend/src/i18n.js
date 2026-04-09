import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enNavbar from "./locales/en/navbar.json";
import enMenu from "./locales/en/menu.json";
import enAdmin from "./locales/en/admin.json";
import enProfile from "./locales/en/profile.json";
import enHome from "./locales/en/home.json";

import fiCommon from "./locales/fi/common.json";
import fiAuth from "./locales/fi/auth.json";
import fiNavbar from "./locales/fi/navbar.json";
import fiMenu from "./locales/fi/menu.json";
import fiAdmin from "./locales/fi/admin.json";
import fiProfile from "./locales/fi/profile.json";
import fiHome from "./locales/fi/home.json";

const resources = {
  en: {
    translation: {
      common: enCommon,
      auth: enAuth,
      navbar: enNavbar,
      menu: enMenu,
      admin: enAdmin,
      profile: enProfile,
      home: enHome,
    },
  },
  fi: {
    translation: {
      common: fiCommon,
      auth: fiAuth,
      navbar: fiNavbar,
      menu: fiMenu,
      admin: fiAdmin,
      profile: fiProfile,
      home: fiHome,
    },
  },
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
