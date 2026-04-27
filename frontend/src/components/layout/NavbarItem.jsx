/**
 * NavbarItem
 *
 * Reusable navigation link component for the Navbar.
 *
 * Responsibilities:
 * - Wraps react-router NavLink for client-side navigation
 * - Applies active and inactive link styling
 * - Supports click handling for menu interactions (e.g. closing mobile menu)
 *
 * Notes:
 * - Active state is determined automatically by NavLink
 * - Used in both desktop and mobile navigation
 */

import { NavLink } from "react-router-dom";

const NavbarItem = ({ href, children, onClick }) => {
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        `block py-2 text-sm transition md:py-0 ${
          isActive ? "font-medium text-brand" : "text-white hover:text-gray-300"
        }`
      }
    >
      {children}
    </NavLink>
  );
};

export default NavbarItem;
