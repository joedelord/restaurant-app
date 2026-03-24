import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full p-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
