/**
 * user index
 *
 * Public exports for the user feature.
 *
 * Responsibilities:
 * - Exposes user pages
 * - Exposes user components
 * - Exposes user hooks
 * - Exposes user services
 */

// Pages
export { default as UserDashboard } from "./pages/UserDashboard";
export { default as UserProfile } from "./pages/UserProfile";
export { default as UserReservations } from "./pages/UserReservations";
export { default as UserOrders } from "./pages/UserOrders";
export { default as UserChangePassword } from "./pages/UserChangePassword";

// Components
export { default as UserOrderList } from "./components/UserOrderList";
export { default as UserProfileForm } from "./components/UserProfileForm";
export { default as UserReservationList } from "./components/UserReservationList";
export { default as UserChangePasswordForm } from "./components/UserChangePasswordForm";

// Hooks
export { default as useUserReservations } from "./hooks/useUserReservations";
export { default as useUserOrders } from "./hooks/useUserOrders";

// Services
export {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
} from "./services/userProfileService";

export {
  getMyReservations,
  cancelMyReservation,
} from "./services/userReservationService";

export { getMyOrders } from "./services/userOrderService";
