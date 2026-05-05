/**
 * ScrollToTop
 *
 * Utility component that automatically scrolls the window to the top
 * whenever the route changes.
 *
 * Responsibilities:
 * - Listens to route (pathname) changes
 * - Resets scroll position to the top of the page
 *
 * Notes:
 * - Improves user experience in SPA navigation
 * - Prevents unwanted scroll position persistence between pages
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
