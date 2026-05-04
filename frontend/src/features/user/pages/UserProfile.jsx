/**
 * UserProfile
 *
 * User page for viewing and updating personal profile information.
 *
 * Responsibilities:
 * - Renders the profile page layout
 * - Shows page title and subtitle
 * - Provides navigation back to the user dashboard
 * - Renders the profile form
 *
 * Notes:
 * - Profile form handles fetching, updating and form state
 * - Password changes are handled on a separate page
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components";
import UserProfileForm from "../components/UserProfileForm";

const UserProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6">
          <BackButton />
        </div>

        <header className="mb-10 text-center">
          <h1 className="mt-3 text-4xl font-bold text-gray-900">
            {t("profile.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            {t("profile.subtitle")}
          </p>
        </header>

        <UserProfileForm />
      </div>
    </div>
  );
};

export default UserProfile;
