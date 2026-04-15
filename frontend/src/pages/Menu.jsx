import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import MenuSection from "../components/menu/MenuSection";
import { getCategories, getMenuItems } from "../services/menuService";
import PageLoader from "../components/ui/PageLoader";

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
          getCategories(),
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

  const groupedMenu = useMemo(() => {
    const getLocalizedCategoryName = (category) => {
      return i18n.language === "fi"
        ? category.name_fi || category.name_en || ""
        : category.name_en || category.name_fi || "";
    };

    const getLocalizedCategoryDescription = (category) => {
      return i18n.language === "fi"
        ? category.description_fi || category.description_en || ""
        : category.description_en || category.description_fi || "";
    };

    const sortedCategories = [...categories].sort(
      (a, b) =>
        a.display_order - b.display_order ||
        getLocalizedCategoryName(a).localeCompare(getLocalizedCategoryName(b)),
    );

    return sortedCategories.map((category) => {
      const items = menuItems.filter((item) => {
        if (!item.is_available) return false;

        if (typeof item.category === "object" && item.category !== null) {
          return item.category.id === category.id;
        }

        return item.category === category.id;
      });

      return {
        category: {
          ...category,
          localizedName: getLocalizedCategoryName(category),
          localizedDescription: getLocalizedCategoryDescription(category),
        },
        items,
      };
    });
  }, [categories, menuItems, i18n.language]);

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
        <div className="grid grid-cols-3 items-center">
          <div />
          <h1 className="mt-3 justify-self-center text-4xl font-bold text-gray-900">
            {t("menu.title")}
          </h1>
        </div>

        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
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
