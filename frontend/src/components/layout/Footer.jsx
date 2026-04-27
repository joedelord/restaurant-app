/**
 * Footer
 *
 * Global footer component displayed across the application.
 *
 * Responsibilities:
 * - Displays restaurant branding and description
 * - Provides navigation links to key pages
 * - Shows contact information and opening hours
 * - Displays social media links
 * - Renders copyright information
 *
 * Notes:
 * - Uses i18n for all text content
 * - Included in MainLayout and visible on all pages
 */

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="mt-16 border-t border-white/10 bg-black text-sm text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">
              RestaurantApp
            </h2>
            <p className="mb-4 text-gray-400">{t("footer.description")}</p>

            <div className="flex gap-4">
              <a
                href="#"
                className="group rounded-full border border-white/10 p-2 hover:bg-white/10 hover:scale-110 transition"
              >
                <FaFacebookF className="h-4 w-4 text-gray-400 group-hover:text-white" />
              </a>

              <a
                href="#"
                className="group rounded-full border border-white/10 p-2 hover:bg-white/10 hover:scale-110 transition"
              >
                <FaInstagram className="h-4 w-4 text-gray-400 group-hover:text-white" />
              </a>

              <a
                href="#"
                className="group rounded-full border border-white/10 p-2 hover:bg-white/10 hover:scale-110 transition"
              >
                <FaTwitter className="h-4 w-4 text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">
              {t("footer.navigation")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition">
                  {t("navbar.home")}
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-white transition">
                  {t("navbar.menu")}
                </Link>
              </li>
              <li>
                <Link
                  to="/reservations"
                  className="hover:text-white transition"
                >
                  {t("navbar.reservations")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">
              {t("footer.contact")}
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>📍 Helsinki</li>
              <li>📞 +358 40 123 4567</li>
              <li>✉️ info@restaurant.com</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">
              {t("footer.hours")}
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>{t("footer.weekdays")}: 12:00 – 22:00</li>
              <li>{t("footer.weekend")}: 14:00 – 00:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} RestaurantApp. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
