import { NavLink } from "react-router-dom";

const NavbarItem = ({ href, children, onClick }) => {
  return (
    <NavLink
      to={href}
      onClick={onClick}
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
