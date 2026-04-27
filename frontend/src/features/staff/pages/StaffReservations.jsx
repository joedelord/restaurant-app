/**
 * StaffReservations
 *
 * Staff page for viewing and managing restaurant reservations.
 *
 * Responsibilities:
 * - Displays upcoming and past reservations in separate sections
 * - Uses useStaffReservations to handle reservation data and actions
 * - Shows edit form state for selected reservations
 * - Handles page-level loading, success and error messages
 * - Provides navigation back to the staff dashboard
 *
 * Notes:
 * - Reservation API logic and state management are handled in useStaffReservations
 * - Form and list rendering are delegated to StaffReservationForm and StaffReservationList
 */

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../../components/ui/Button";
import FormMessage from "../../../components/ui/FormMessage";
import StaffReservationForm from "../components/StaffReservationForm";
import StaffReservationList from "../components/StaffReservationList";
import useStaffReservations from "../hooks/useStaffReservations";
import PageLoader from "../../../components/ui/PageLoader";

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

        <FormMessage message={message} variant="success" />
        <FormMessage message={error} variant="error" />

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
