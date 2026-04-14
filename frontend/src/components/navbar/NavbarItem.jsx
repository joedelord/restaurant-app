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
