import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Menu from "./features/menu/pages/Menu";
import Reservations from "./features/reservations/pages/Reservations";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import StaffDashboard from "./features/staff/pages/StaffDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import RoleRoute from "./routes/RoleRoute";
import MainLayout from "./layouts/MainLayout";
import UserDashboard from "./features/user/pages/UserDashboard";
import UserProfile from "./features/user/pages/UserProfile";
import UserReservations from "./features/user/pages/UserReservations";
import UserOrders from "./features/user/pages/UsertOrders";
import ChangePassword from "./features/user/pages/ChangePassword";
import AdminCategories from "./features/admin/pages/AdminCategories";
import AdminMenuItems from "./features/admin/pages/AdminMenuItems";
import AdminUsers from "./features/admin/pages/AdminUsers";
import AdminTables from "./features/admin/pages/AdminTables";
import StaffReservations from "./features/staff/pages/StaffReservations";
import StaffOrders from "./features/staff/pages/StaffOrders";
import StaffCreateOrder from "./features/staff/pages/StaffCreateOrder";
import StaffPendingReservations from "./features/staff/pages/StaffPendingReservations";
import NotFound from "./pages/NotFound";
import AdminSales from "./features/admin/pages/AdminSales";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="user/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="user/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="user/reservations"
          element={
            <ProtectedRoute>
              <UserReservations />
            </ProtectedRoute>
          }
        />
        <Route
          path="user/orders"
          element={
            <ProtectedRoute>
              <UserOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <RoleRoute allowedRoles={["staff", "admin"]}>
              <StaffDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminCategories />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminMenuItems />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/tables"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminTables />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/sales"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminSales />
            </RoleRoute>
          }
        />
        <Route
          path="/staff/reservations"
          element={
            <RoleRoute allowedRoles={["staff", "admin"]}>
              <StaffReservations />
            </RoleRoute>
          }
        />
        <Route
          path="/staff/orders"
          element={
            <RoleRoute allowedRoles={["staff", "admin"]}>
              <StaffOrders />
            </RoleRoute>
          }
        />
        <Route
          path="/staff/orders/new"
          element={
            <RoleRoute allowedRoles={["staff", "admin"]}>
              <StaffCreateOrder />
            </RoleRoute>
          }
        />
        <Route
          path="/staff/reservations/pending"
          element={
            <RoleRoute allowedRoles={["staff", "admin"]}>
              <StaffPendingReservations />
            </RoleRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
