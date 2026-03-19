import { useState } from "react";

const Menu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Navbar */}
      <div className="flex items-center justify-between bg-slate-900 text-white text-xl p-4">
        <div className="font-bold">Logo</div>

        {/* Desktop Navbar */}
        <div className="hidden sm:flex gap-2">
          <span>Home</span>
          <span>About</span>
          <span>Contact</span>
        </div>

        <button
          className="text-xl cursor-pointer sm:hidden"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Navbar */}
      {open && (
        <div className="flex flex-col items-center gap-2 bg-slate-900 text-white p-4 sm:hidden">
          <span>Home</span>
          <span>About</span>
          <span>Contact</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 text-white p-6 gap-6 text-center fotn-semibold text-xl">
        <div className="bg-slate-500 p-4 rounded hover:bg-slate-600 hover:scale-105 transition-all duration-200">
          Feature One
        </div>
        <div className="bg-slate-500 p-4 rounded hover:bg-slate-600 hover:scale-105">
          Feature Two
        </div>
        <div className="bg-slate-500 p-4 rounded">Feature Three</div>
        <div className="bg-slate-500 p-4 rounded">Feature Four</div>
        <div className="bg-slate-500 p-4 rounded">Feature Five</div>
        <div className="bg-slate-500 p-4 rounded">Feature Six</div>
      </div>
    </div>
  );
};

export default Menu;
