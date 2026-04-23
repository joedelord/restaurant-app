/**
 * Navbar
 *
 * Main navigation component of the application.
 *
 * Responsibilities:
 * - Displays primary navigation links (home, menu, reservations)
 * - Handles authentication state (login icon vs profile dropdown)
 * - Shows role-based navigation (staff, admin)
 * - Controls mobile menu and profile dropdown state
 * - Includes language switch functionality
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import useAuth from "../../hooks/useAuth";
import LogoutButton from "../auth/LogoutButton";
import NavbarSection from "./NavbarSection";
import NavbarItem from "./NavbarItem";
import LanguageToggle from "./LanguageToggle";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isAuthorized, user } = useAuth();
  const { t } = useTranslation();
  const profileRef = useRef(null);

  const closeMenu = () => setOpen(false);
  const closeProfileMenu = () => setProfileOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isAuthorized === null) {
    return null;
  }

  return (
    <nav className="border-b border-white/10 bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-xl font-semibold tracking-tight"
              onClick={() => {
                closeMenu();
                closeProfileMenu();
              }}
            >
              RestaurantApp
            </Link>

            <div className="hidden md:block">
              <NavbarSection>
                <NavbarItem href="/">{t("navbar.home")}</NavbarItem>
                <NavbarItem href="/menu">{t("navbar.menu")}</NavbarItem>
                <NavbarItem href="/reservations">
                  {t("navbar.reservations")}
                </NavbarItem>
              </NavbarSection>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageToggle />

            {!isAuthorized ? (
              <Link
                to="/login"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
                aria-label={t("navbar.login")}
              >
                <UserCircleIcon className="h-6 w-6" />
              </Link>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10"
                  aria-label={t("navbar.profileMenu")}
                  aria-expanded={profileOpen}
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <span className="max-w-120px truncate">
                    {user?.first_name || user?.email || t("navbar.account")}
                  </span>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-gray-800 shadow-xl">
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="text-sm font-medium text-white">
                        {user?.first_name && user?.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user?.email}
                      </p>

                      {user?.role && (
                        <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">
                          {t(`admin.users.roles.${user.role}`)}
                        </p>
                      )}
                    </div>

                    <div className="py-2">
                      <Link
                        to="/user"
                        onClick={closeProfileMenu}
                        className="block px-4 py-2 text-sm transition hover:bg-white/10"
                      >
                        {t("navbar.user")}
                      </Link>

                      {(user?.role === "staff" || user?.role === "admin") && (
                        <Link
                          to="/staff"
                          onClick={closeProfileMenu}
                          className="block px-4 py-2 text-sm transition hover:bg-white/10"
                        >
                          {t("navbar.staff")}
                        </Link>
                      )}

                      {user?.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={closeProfileMenu}
                          className="block px-4 py-2 text-sm transition hover:bg-white/10"
                        >
                          {t("navbar.admin")}
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-white/10 px-2 py-2">
                      <LogoutButton
                        variant="link"
                        className="w-full justify-start px-2"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle />

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition hover:bg-white/10"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={t("navbar.toggleMenu")}
              aria-expanded={open}
            >
              {open ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {open && (
          <div className="space-y-3 border-t border-white/10 pb-4 pt-4 md:hidden">
            <NavbarSection>
              <NavbarItem href="/" onClick={closeMenu}>
                {t("navbar.home")}
              </NavbarItem>

              <NavbarItem href="/menu" onClick={closeMenu}>
                {t("navbar.menu")}
              </NavbarItem>

              <NavbarItem href="/reservations" onClick={closeMenu}>
                {t("navbar.reservations")}
              </NavbarItem>

              {!isAuthorized ? (
                <NavbarItem href="/login" onClick={closeMenu}>
                  {t("navbar.login")}
                </NavbarItem>
              ) : (
                <>
                  <NavbarItem href="/user" onClick={closeMenu}>
                    {t("navbar.user")}
                  </NavbarItem>

                  {(user?.role === "staff" || user?.role === "admin") && (
                    <NavbarItem href="/staff" onClick={closeMenu}>
                      {t("navbar.staff")}
                    </NavbarItem>
                  )}

                  {user?.role === "admin" && (
                    <NavbarItem href="/admin" onClick={closeMenu}>
                      {t("navbar.admin")}
                    </NavbarItem>
                  )}
                </>
              )}
            </NavbarSection>

            {isAuthorized && (
              <LogoutButton variant="link" className="w-full justify-center" />
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
