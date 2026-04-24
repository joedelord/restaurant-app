/**
 * menuHelpers
 *
 * Utility helpers for menu-related display logic.
 *
 * Responsibilities:
 * - Resolves localized menu item names
 * - Resolves localized menu item descriptions
 */

export const getLocalizedMenuItemName = (item, language) => {
  return (
    item.name ||
    (language === "fi"
      ? item.name_fi || item.name_en
      : item.name_en || item.name_fi) ||
    ""
  );
};

export const getLocalizedMenuItemDescription = (item, language) => {
  return (
    item.description ||
    (language === "fi"
      ? item.description_fi || item.description_en
      : item.description_en || item.description_fi) ||
    ""
  );
};
