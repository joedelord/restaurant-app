/**
 * App
 *
 * Root application component that defines the main route structure.
 *
 * Responsibilities:
 * - Defines public, protected and role-based routes
 * - Wraps pages with the main layout
 * - Uses route guards for authentication and authorization
 * - Provides fallback route for unknown paths
 */

import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import RoleRoute from "./routes/RoleRoute";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";

import Menu from "./features/menu/pages/Menu";
import Reservations from "./features/reservations/pages/Reservations";

import {
  UserDashboard,
  UserProfile,
  UserReservations,
  UserOrders,
  UserChangePassword,
} from "@/features/user";

import AdminDashboard from "./features/admin/pages/AdminDashboard";
import AdminCategories from "./features/admin/pages/AdminCategories";
import AdminMenuItems from "./features/admin/pages/AdminMenuItems";
import AdminUsers from "./features/admin/pages/AdminUsers";
import AdminTables from "./features/admin/pages/AdminTables";
import AdminSales from "./features/admin/pages/AdminSales";

import {
  StaffDashboard,
  StaffReservations,
  StaffOrders,
  StaffCreateOrder,
  StaffPendingReservations,
} from "@/features/staff";

const STAFF_ROLES = ["staff", "admin"];
const ADMIN_ROLES = ["admin"];

const publicOnly = (page) => <PublicRoute>{page}</PublicRoute>;
const protectedRoute = (page) => <ProtectedRoute>{page}</ProtectedRoute>;
const roleRoute = (page, roles) => (
  <RoleRoute allowedRoles={roles}>{page}</RoleRoute>
);

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reservations" element={<Reservations />} />

        {/* Auth routes */}
        <Route path="/login" element={publicOnly(<Login />)} />
        <Route path="/register" element={publicOnly(<Register />)} />

        {/* User routes */}
        <Route path="/user" element={protectedRoute(<UserDashboard />)} />
        <Route path="/user/profile" element={protectedRoute(<UserProfile />)} />
        <Route
          path="/user/change-password"
          element={protectedRoute(<UserChangePassword />)}
        />
        <Route
          path="/user/reservations"
          element={protectedRoute(<UserReservations />)}
        />
        <Route path="/user/orders" element={protectedRoute(<UserOrders />)} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={roleRoute(<AdminDashboard />, ADMIN_ROLES)}
        />
        <Route
          path="/admin/categories"
          element={roleRoute(<AdminCategories />, ADMIN_ROLES)}
        />
        <Route
          path="/admin/menu"
          element={roleRoute(<AdminMenuItems />, ADMIN_ROLES)}
        />
        <Route
          path="/admin/users"
          element={roleRoute(<AdminUsers />, ADMIN_ROLES)}
        />
        <Route
          path="/admin/tables"
          element={roleRoute(<AdminTables />, ADMIN_ROLES)}
        />
        <Route
          path="/admin/sales"
          element={roleRoute(<AdminSales />, ADMIN_ROLES)}
        />

        {/* Staff routes */}
        <Route
          path="/staff"
          element={roleRoute(<StaffDashboard />, STAFF_ROLES)}
        />
        <Route
          path="/staff/reservations"
          element={roleRoute(<StaffReservations />, STAFF_ROLES)}
        />
        <Route
          path="/staff/reservations/pending"
          element={roleRoute(<StaffPendingReservations />, STAFF_ROLES)}
        />
        <Route
          path="/staff/orders"
          element={roleRoute(<StaffOrders />, STAFF_ROLES)}
        />
        <Route
          path="/staff/orders/new"
          element={roleRoute(<StaffCreateOrder />, STAFF_ROLES)}
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
