const NavbarSection = ({ children }) => {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
      {children}
    </div>
  );
};

export default NavbarSection;
