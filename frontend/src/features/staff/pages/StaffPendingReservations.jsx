import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../../components/ui/Button";
import PageLoader from "../../../components/ui/PageLoader";
import StaffPendingReservationList from "../components/StaffPendingReservationList";
import useStaffPendingReservations from "../hooks/useStaffPendingReservations";

const StaffPendingReservations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    loading,
    actionLoadingId,
    message,
    error,
    pendingReservations,
    handleConfirm,
    handleCancel,
  } = useStaffPendingReservations();

  return (
    <div className="px-4 py-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => navigate("/staff")}
            className="inline-flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {t("staff.navigation.backToDashboard")}
          </Button>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-heading">
            {t("staff.pendingReservations.title")}
          </h1>
          <p className="mt-2 text-gray-500">
            {t("staff.pendingReservations.subtitle")}
          </p>
          <p className="mt-2 text-sm text-gray-400">
            {t("staff.pendingReservations.autoRefresh")}
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-base border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-base border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mx-auto w-full rounded-md border border-black p-5">
            <PageLoader />
          </div>
        ) : (
          <>
            <div className="mb-4 text-center text-sm text-gray-500">
              {t("staff.pendingReservations.count", {
                count: pendingReservations.length,
              })}
            </div>

            <StaffPendingReservationList
              items={pendingReservations}
              actionLoadingId={actionLoadingId}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default StaffPendingReservations;
