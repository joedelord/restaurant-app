/**
 * admin index
 *
 * Public exports for the admin feature.
 *
 * Responsibilities:
 * - Exposes admin components
 * - Exposes admin hooks
 * - Exposes admin services
 * - Provides a single import entry point for admin-related functionality
 */

// Components
export { default as AdminResponsiveList } from "./components/AdminResponsiveList";

export { default as CategoryForm } from "./components/CategoryForm";
export { default as CategoryList } from "./components/CategoryList";

export { default as MenuItemForm } from "./components/MenuItemForm";
export { default as MenuItemList } from "./components/MenuItemList";

export { default as TableForm } from "./components/TableForm";
export { default as TableList } from "./components/TableList";

export { default as UserForm } from "./components/UserForm";
export { default as UserList } from "./components/UserList";

// Hooks
export { default as useCategories } from "./hooks/useCategories";
export { default as useMenuItems } from "./hooks/useMenuItems";
export { default as useTables } from "./hooks/useTables";
export { default as useUsers } from "./hooks/useUsers";

// Services
export * from "./services/categoryService";
export * from "./services/menuItemService";
export * from "./services/tableService";
export * from "./services/userService";
export * from "./services/salesService";
