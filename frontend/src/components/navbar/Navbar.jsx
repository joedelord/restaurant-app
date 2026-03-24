import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LogoutButton from "../LogoutButton";
import NavbarSection from "./NavbarSection";
import NavbarItem from "./NavbarItem";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthorized, user } = useAuth();

  const closeMenu = () => setOpen(false);

  if (isAuthorized === null) {
    return null;
  }

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold" onClick={closeMenu}>
            Restaurant
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <NavbarSection>
              {isAuthorized ? (
                <>
                  <NavbarItem href="/">Home</NavbarItem>
                  <NavbarItem href="/reservations">My Reservations</NavbarItem>

                  {(user?.role === "staff" || user?.role === "admin") && (
                    <NavbarItem href="/staff">Staff</NavbarItem>
                  )}

                  {user?.role === "admin" && (
                    <NavbarItem href="/admin">Admin</NavbarItem>
                  )}
                </>
              ) : (
                <>
                  <NavbarItem href="/login">Login</NavbarItem>
                  <NavbarItem href="/register">Register</NavbarItem>
                </>
              )}
            </NavbarSection>

            {isAuthorized && <LogoutButton />}
          </div>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {open && (
          <div className="md:hidden flex flex-col space-y-2 pb-4">
            <NavbarSection>
              {isAuthorized ? (
                <>
                  <NavbarItem href="/" onClick={closeMenu}>
                    Home
                  </NavbarItem>
                  <NavbarItem href="/reservations" onClick={closeMenu}>
                    My Reservations
                  </NavbarItem>

                  {(user?.role === "staff" || user?.role === "admin") && (
                    <NavbarItem href="/staff" onClick={closeMenu}>
                      Staff
                    </NavbarItem>
                  )}

                  {user?.role === "admin" && (
                    <NavbarItem href="/admin" onClick={closeMenu}>
                      Admin
                    </NavbarItem>
                  )}
                </>
              ) : (
                <>
                  <NavbarItem href="/login" onClick={closeMenu}>
                    Login
                  </NavbarItem>
                  <NavbarItem href="/register" onClick={closeMenu}>
                    Register
                  </NavbarItem>
                </>
              )}
            </NavbarSection>

            {isAuthorized && <LogoutButton className="w-full justify-center" />}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
