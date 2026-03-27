import { useEffect, useMemo, useState } from "react";
import MenuSection from "../components/menu/MenuSection";
import { getCategories, getMenuItems } from "../services/menuService";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        setError("");

        const [categoriesData, menuItemsData] = await Promise.all([
          getCategories(),
          getMenuItems(),
        ]);

        const sortedCategories = [...categoriesData].sort(
          (a, b) =>
            a.display_order - b.display_order || a.name.localeCompare(b.name),
        );

        setCategories(sortedCategories);
        setMenuItems(menuItemsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load menu.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  const groupedMenu = useMemo(() => {
    return categories.map((category) => {
      const items = menuItems.filter((item) => {
        if (!item.is_available) return false;

        if (typeof item.category === "object" && item.category !== null) {
          return item.category.id === category.id;
        }

        return item.category === category.id;
      });

      return {
        category,
        items,
      };
    });
  }, [categories, menuItems]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-500">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-10">
        <div className="grid grid-cols-3 items-center">
          <div></div>
          <h1 className="mt-3 text-4xl font-bold text-gray-900 justify-self-center">
            {t("menu.title")}
          </h1>
          <div className="justify-self-end">
            <LanguageToggle />
          </div>
        </div>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600 text-center">
          {t("menu.subtitle")}
        </p>
      </header>

      <div className="space-y-10">
        {groupedMenu.map(({ category, items }) => (
          <MenuSection key={category.id} category={category} items={items} />
        ))}
      </div>
    </div>
  );
};

export default Menu;
