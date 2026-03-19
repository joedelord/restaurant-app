import { NavLink } from "react-router-dom";

const NavbarItem = ({ href, children }) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `block py-2 md:py-0 ${
          isActive ? "text-blue-400" : "hover:text-gray-300"
        }`
      }
    >
      {children}
    </NavLink>
  );
};

export default NavbarItem;
