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
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-10 text-center">
        <h1 className="mt-3 text-4xl font-bold text-gray-900">{title}</h1>
      </header>
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
