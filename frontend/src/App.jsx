import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import Reservations from "./pages/Reservations";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import RoleRoute from "./routes/RoleRoute";
import MainLayout from "./layouts/MainLayout";
import UserProfile from "./pages/UserProfile";
import AdminCategories from "./pages/Admin/AdminCategories";
import AdminMenuItems from "./pages/Admin/AdminMenuItems";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminTables from "./pages/Admin/AdminTables";
import StaffReservations from "./pages/Staff/StaffReservations";
import StaffOrders from "./pages/staff/StaffOrders";
import NotFound from "./pages/NotFound";

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
              <UserProfile />
            </ProtectedRoute>
          }
        />
        s
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
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
