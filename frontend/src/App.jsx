import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import RoleRoute from "./routes/RoleRoute";
import MainLayout from "./layouts/MainLayout";
import UserProfile from "./pages/UserProfile";
import AdminCategories from "./pages/Admin/AdminCategories";
import AdminMenuItems from "./pages/Admin/AdminMenuItems";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
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
      </Route>
    </Routes>
  );
}

export default App;
