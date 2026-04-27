/**
 * AuthCard
 *
 * Layout wrapper for authentication pages.
 *
 * Responsibilities:
 * - Displays the authentication page title
 * - Wraps auth forms inside a consistent card layout
 * - Shows optional footer text and navigation link
 */

import { Link } from "react-router-dom";

const AuthCard = ({
  title,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) => {
  return (
    <div className="px-4 py-0">
      <h1 className="p-6 text-center text-3xl font-bold">{title}</h1>

      <div className="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mx-auto max-w-sm">
          {children}

          {(footerText || footerLinkText) && (
            <p className="mt-4 text-sm text-body">
              {footerText}{" "}
              <Link to={footerLinkTo} className="underline">
                {footerLinkText}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
