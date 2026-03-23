import { Link } from "react-router-dom";

const AuthCard = ({
  title,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) => {
  return (
    <div className="px-4 py-10">
      <h1 className="m-10 text-center text-2xl">{title}</h1>

      <div className="mx-auto w-full max-w-xl rounded-md border-2 border-black p-5">
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
