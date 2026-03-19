const NavbarSection = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row md:space-x-6">{children}</div>
  );
};

export default NavbarSection;
