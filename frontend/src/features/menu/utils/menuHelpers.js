/**
 * menuHelpers
 *
 * Utility helpers for menu-related display logic.
 *
 * Responsibilities:
 * - Resolves localized category names and descriptions
 * - Groups available menu items under their categories
 * - Sorts categories by display order and localized name
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

export const getLocalizedCategoryName = (category, language) => {
  return language === "fi"
    ? category.name_fi || category.name_en || ""
    : category.name_en || category.name_fi || "";
};

export const getLocalizedCategoryDescription = (category, language) => {
  return language === "fi"
    ? category.description_fi || category.description_en || ""
    : category.description_en || category.description_fi || "";
};

export const getItemCategoryId = (item) => {
  if (typeof item.category === "object" && item.category !== null) {
    return item.category.id;
  }

  return item.category;
};

export const groupMenuItemsByCategory = (categories, menuItems, language) => {
  const sortedCategories = [...categories].sort(
    (a, b) =>
      a.display_order - b.display_order ||
      getLocalizedCategoryName(a, language).localeCompare(
        getLocalizedCategoryName(b, language),
      ),
  );

  return sortedCategories
    .map((category) => {
      const items = menuItems.filter((item) => {
        if (!item.is_available) return false;
        return getItemCategoryId(item) === category.id;
      });

      return {
        category: {
          ...category,
          localizedName: getLocalizedCategoryName(category, language),
          localizedDescription: getLocalizedCategoryDescription(
            category,
            language,
          ),
        },
        items,
      };
    })
    .filter(({ items }) => items.length > 0);
};
