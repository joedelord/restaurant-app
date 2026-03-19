import { useState } from "react";

const Navbar = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-xl font-bold">Restaurant</div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            {children}
          </div>

          {/* Hamburger */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            className="md:hidden flex flex-col space-y-2 pb-4"
            onClick={() => setOpen(false)}
          >
            {children}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
