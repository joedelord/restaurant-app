/**
 * menu index
 *
 * Public exports for the menu feature.
 *
 * Responsibilities:
 * - Exposes menu pages
 * - Exposes menu components
 * - Exposes menu utils
 * - Exposes menu services
 */

// Pages
export { default as Menu } from "./pages/Menu";

// Components
export { default as MenuItemCard } from "./components/MenuItemCard";
export { default as MenuSection } from "./components/MenuSection";

// Utils
export {
  getLocalizedMenuItemName,
  getLocalizedMenuItemDescription,
  getLocalizedCategoryName,
  getLocalizedCategoryDescription,
  getItemCategoryId,
  groupMenuItemsByCategory,
} from "./utils/menuHelpers";

// Services
export { getMenuItems, getMenuCategories } from "./services/menuService";
