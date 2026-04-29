/**
 * ChaUserngePassword
 *
 * User page for changing the authenticated user's password.
 *
 * Responsibilities:
 * - Renders the page layout
 * - Shows page title and subtitle
 * - Provides navigation back to the user dashboard
 * - Renders the password change form
 */

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import UserChangePasswordForm from "../components/UserChangePasswordForm";

const UserChangePassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => navigate("/user")}
            className="inline-flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {t("user.navigation.backToDashboard")}
          </Button>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-heading">
            {t("user.password.title")}
          </h1>
          <p className="mt-2 text-gray-500">{t("user.password.subtitle")}</p>
        </div>

        <UserChangePasswordForm />
      </div>
    </div>
  );
};

export default UserChangePassword;
