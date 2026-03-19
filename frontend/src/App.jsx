import { Routes, Route } from "react-router-dom";

import MainLayout from "@layouts/MainLayout";
import Home from "@pages/Home";
import Menu from "@pages/Menu";
import Table from "@pages/Table";
import About from "@pages/About";
import Register from "@pages/Register";
import Login from "@pages/Login";
import NotFound from "@pages/NotFound";

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/table" element={<Table />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
