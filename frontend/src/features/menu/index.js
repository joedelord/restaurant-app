/**
 * menu index
 *
 * Public exports for the menu feature.
 *
 * Responsibilities:
 * - Provides a single import entry point for menu components
 * - Re-exports menu-related helper functions
 */

export { default as MenuItemCard } from "./components/MenuItemCard";
export { default as MenuSection } from "./components/MenuSection";

export {
  getLocalizedMenuItemDescription,
  getLocalizedMenuItemName,
} from "./utils/menuHelpers";
