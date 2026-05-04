/**
 * UserChangePassword
 *
 * User page for changing the authenticated user's password.
 *
 * Responsibilities:
 * - Renders the page layout
 * - Shows page title and subtitle
 * - Provides navigation back to the user dashboard
 * - Renders the password change form
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components";
import UserChangePasswordForm from "../components/UserChangePasswordForm";

const UserChangePassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6">
          <BackButton />
        </div>

        <header className="mb-10 text-center">
          <h1 className="mt-3 text-4xl font-bold text-gray-900">
            {t("user.password.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            {t("user.password.subtitle")}
          </p>
        </header>

        <UserChangePasswordForm />
      </div>
    </div>
  );
};

export default UserChangePassword;
