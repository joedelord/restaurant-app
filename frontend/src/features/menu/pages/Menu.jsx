/**
 * Menu
 *
 * Public menu page for browsing restaurant categories and menu items.
 *
 * Responsibilities:
 * - Fetches menu categories and menu items from the API
 * - Manages loading and error states during data fetching
 * - Determines active language (fi/en) for content localization
 * - Groups menu items under their corresponding categories
 * - Displays categorized menu sections using reusable components
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getMenuCategories, getMenuItems } from "../services/menuService";
import { groupMenuItemsByCategory } from "../utils/menuHelpers";
import MenuSection from "../components/MenuSection";
import PageLoader from "../../../components/ui/PageLoader";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        setError("");

        const [categoriesData, menuItemsData] = await Promise.all([
          getMenuCategories(),
          getMenuItems(),
        ]);

        setCategories(categoriesData);
        setMenuItems(menuItemsData);
      } catch (err) {
        console.error(err);
        setError("menu.loadError");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  const language = i18n.language?.startsWith("fi") ? "fi" : "en";

  const groupedMenu = useMemo(() => {
    return groupMenuItemsByCategory(categories, menuItems, language);
  }, [categories, menuItems, language]);

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
          {t(error)}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-10">
        <h1 className="mt-3 text-center text-4xl font-bold text-gray-900">
          {t("menu.title")}
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
          {t("menu.subtitle")}
        </p>
      </header>

      {groupedMenu.length > 0 ? (
        <div className="space-y-10">
          {groupedMenu.map(({ category, items }) => (
            <MenuSection key={category.id} category={category} items={items} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500 shadow-sm">
          {t("menu.noItems")}
        </div>
      )}
    </div>
  );
};

export default Menu;
