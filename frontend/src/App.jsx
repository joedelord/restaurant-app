import { Routes, Route } from "react-router-dom";

import MainLayout from "@layouts/MainLayout";
import Home from "@pages/Home";
import Menu from "@pages/Menu";
import Table from "@pages/Table";
import About from "@pages/About";
import Register from "@pages/Register";
import Login from "@pages/Login";
import NotFound from "@pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login route="/api/users/login/" />} />
        <Route
          path="/register"
          element={<Register route="/api/users/register/" />}
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
