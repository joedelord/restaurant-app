/**
 * staff index
 *
 * Public exports for the staff feature.
 *
 * Responsibilities:
 * - Exposes staff pages
 * - Exposes staff components
 * - Exposes staff hooks
 * - Exposes staff services
 */

// Pages
export { default as StaffCreateOrder } from "./pages/StaffCreateOrder";
export { default as StaffDashboard } from "./pages/StaffDashboard";
export { default as StaffOrders } from "./pages/StaffOrders";
export { default as StaffPendingReservations } from "./pages/StaffPendingReservations";
export { default as StaffReservations } from "./pages/StaffReservations";

// Components
export { default as StaffReservationList } from "./components/StaffReservationList";
export { default as StaffPendingReservationList } from "./components/StaffPendingReservationList";
export { default as StaffReservationForm } from "./components/StaffReservationForm";

export { default as StaffOrderList } from "./components/StaffOrderList";
export { default as StaffOrderForm } from "./components/StaffOrderForm";
export { default as StaffOrderCreateForm } from "./components/StaffOrderCreateForm";

// Hooks
export { default as useStaffPendingReservations } from "./hooks/useStaffPendingReservations";
export { default as useStaffReservations } from "./hooks/useStaffReservations";
export { default as useStaffOrders } from "./hooks/useStaffOrders";

// Services - Reservations
export {
  getReservations,
  updateReservation,
  deleteReservation,
} from "./services/staffReservationService";

// Services - Orders
export {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "./services/staffOrderService";

export * from "./utils/staffOrderHelpers";
