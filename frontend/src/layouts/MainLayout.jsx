import { Outlet } from "react-router-dom";
import Navbar from "@components/navbar/Navbar";
import NavbarSection from "@components/navbar/NavbarSection";
import NavbarItem from "@components/navbar/NavbarItem";
import Footer from "@components/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar>
        <NavbarSection>
          <NavbarItem href="/">Home</NavbarItem>
          <NavbarItem href="/menu">Menu</NavbarItem>
          <NavbarItem href="/table">Table</NavbarItem>
          <NavbarItem href="/about">About</NavbarItem>
          <NavbarItem href="/login">Login</NavbarItem>
          <NavbarItem href="/register">Register</NavbarItem>
        </NavbarSection>
      </Navbar>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
