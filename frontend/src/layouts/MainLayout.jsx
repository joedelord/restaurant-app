/**
 * MainLayout
 *
 * Main application layout used for most routes.
 *
 * Responsibilities:
 * - Provides a consistent page structure (Navbar, content, Footer)
 * - Wraps routed pages using React Router's Outlet
 * - Ensures full-height layout with sticky footer behavior
 * - Applies consistent page container width and spacing
 *
 * Notes:
 * - Used as the root layout for public and protected routes
 * - Individual pages are rendered inside the <Outlet />
 */

import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
