/**
 * NavbarSection
 *
 * Layout wrapper for grouping navigation items in the Navbar.
 *
 * Responsibilities:
 * - Groups navigation items into a single section
 * - Handles responsive layout (column on mobile, row on desktop)
 * - Provides consistent spacing between items
 *
 * Notes:
 * - Used by Navbar to organize primary and mobile navigation links
 */

const NavbarSection = ({ children }) => {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
      {children}
    </div>
  );
};

export default NavbarSection;
