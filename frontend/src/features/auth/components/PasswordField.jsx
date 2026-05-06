/**
 * PasswordField
 *
 * Reusable password input field with show/hide toggle.
 *
 * Responsibilities:
 * - Renders password input using AuthField
 * - Allows toggling password visibility
 * - Displays accessible eye icon button
 */

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import AuthField from "./AuthField";

const PasswordField = ({ type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <AuthField {...props} type={showPassword ? "text" : "password"} />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-10 text-gray-700 transition hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={showPassword ? "Show password" : "Hide password"}
        disabled={props.disabled}
      >
        {showPassword ? (
          <EyeIcon className="h-5 w-5" />
        ) : (
          <EyeSlashIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

export default PasswordField;
