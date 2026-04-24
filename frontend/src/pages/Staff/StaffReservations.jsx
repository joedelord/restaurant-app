import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";
import StaffReservationForm from "../../features/staff/components/StaffReservationForm";
import StaffReservationList from "../../features/staff/components/StaffReservationList";
import useStaffReservations from "../../features/staff/hooks/useStaffReservations";
import PageLoader from "../../components/ui/PageLoader";

const StaffReservations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    upcomingReservations,
    pastReservations,
    editingReservation,
    loading,
    message,
    error,
    handleUpdate,
    handleDelete,
    startEditing,
    cancelEditing,
  } = useStaffReservations();

  return (
    <div className="px-4 py-6">
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
      <h1 className="text-center text-3xl font-bold">
        {t("staff.reservations.title")}
      </h1>

      <div className="mx-auto w-full max-w-5xl space-y-6">
        <p className="mt-2 text-center text-gray-500">
          {t("staff.reservations.subtitle")}
        </p>

        {message && (
          <div className="rounded-base border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-base border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="space-y-6">
          {editingReservation && (
            <div>
              <h2 className="mb-3 text-center text-lg font-semibold text-heading">
                {t("staff.reservations.editTitle")}
              </h2>

              <StaffReservationForm
                key={editingReservation.id}
                initialData={editingReservation}
                submitText={t("staff.reservations.actions.update")}
                onSubmit={handleUpdate}
                onCancel={cancelEditing}
              />
            </div>
          )}

          {loading ? (
            <div className="mx-auto w-full rounded-md border border-black p-5">
              <PageLoader />
            </div>
          ) : (
            <div className="space-y-8">
              <section>
                <h2 className="mb-3 text-center text-lg font-semibold text-heading">
                  {t("staff.reservations.sections.upcoming", {
                    count: upcomingReservations.length,
                  })}
                </h2>

                <StaffReservationList
                  items={upcomingReservations}
                  onEdit={startEditing}
                  onDelete={handleDelete}
                  emptyText={t("staff.reservations.emptyUpcoming")}
                />
              </section>

              <section>
                <h2 className="mb-3 text-center text-lg font-semibold text-heading">
                  {t("staff.reservations.sections.past", {
                    count: pastReservations.length,
                  })}
                </h2>

                <StaffReservationList
                  items={pastReservations}
                  onEdit={startEditing}
                  onDelete={handleDelete}
                  emptyText={t("staff.reservations.emptyPast")}
                />
              </section>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StaffReservations;
