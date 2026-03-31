import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";
import LogoutButton from "../LogoutButton";
import NavbarSection from "./NavbarSection";
import NavbarItem from "./NavbarItem";
import LanguageToggle from "../LanguageToggle";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthorized, user } = useAuth();
  const { t } = useTranslation();

  const closeMenu = () => setOpen(false);

  if (isAuthorized === null) {
    return null;
  }

  return (
    <nav className="border-b border-white/10 bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight"
            onClick={closeMenu}
          >
            Restaurant
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <NavbarSection>
              {isAuthorized ? (
                <>
                  <NavbarItem href="/">{t("navbar.home")}</NavbarItem>
                  <NavbarItem href="/menu">{t("navbar.menu")}</NavbarItem>
                  <NavbarItem href="/user">{t("navbar.user")}</NavbarItem>

                  {(user?.role === "staff" || user?.role === "admin") && (
                    <NavbarItem href="/staff">{t("navbar.staff")}</NavbarItem>
                  )}

                  {user?.role === "admin" && (
                    <NavbarItem href="/admin">{t("navbar.admin")}</NavbarItem>
                  )}
                </>
              ) : (
                <>
                  <NavbarItem href="/">{t("navbar.home")}</NavbarItem>
                  <NavbarItem href="/menu">{t("navbar.menu")}</NavbarItem>
                  <NavbarItem href="/login">{t("navbar.login")}</NavbarItem>
                  <NavbarItem href="/register">
                    {t("navbar.register")}
                  </NavbarItem>
                </>
              )}
            </NavbarSection>

            <div className="flex items-center gap-3">
              <LanguageToggle />
              {isAuthorized && <LogoutButton variant="link" />}
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle />

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xl text-white transition hover:bg-white/10"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={t("navbar.toggleMenu")}
              aria-expanded={open}
            >
              <span
                className={`transition-transform duration-200 ${
                  open ? "rotate-90" : "rotate-0"
                }`}
              >
                {open ? "✕" : "☰"}
              </span>
            </button>
          </div>
        </div>

        {open && (
          <div className="space-y-3 border-t border-white/10 pb-4 pt-4 md:hidden">
            <NavbarSection>
              {isAuthorized ? (
                <>
                  <NavbarItem href="/" onClick={closeMenu}>
                    {t("navbar.home")}
                  </NavbarItem>
                  <NavbarItem href="/menu" onClick={closeMenu}>
                    {t("navbar.menu")}
                  </NavbarItem>
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
              ) : (
                <>
                  <NavbarItem href="/" onClick={closeMenu}>
                    {t("navbar.home")}
                  </NavbarItem>
                  <NavbarItem href="/menu" onClick={closeMenu}>
                    {t("navbar.menu")}
                  </NavbarItem>
                  <NavbarItem href="/login" onClick={closeMenu}>
                    {t("navbar.login")}
                  </NavbarItem>
                  <NavbarItem href="/register" onClick={closeMenu}>
                    {t("navbar.register")}
                  </NavbarItem>
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
