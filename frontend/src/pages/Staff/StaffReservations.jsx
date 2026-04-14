import { useTranslation } from "react-i18next";
import StaffReservationForm from "../../components/staff/StaffReservationForm";
import StaffReservationList from "../../components/staff/StaffReservationList";
import useStaffReservations from "../../hooks/useStaffReservations";
import PageLoader from "../../components/ui/PageLoader";

const StaffReservations = () => {
  const { t } = useTranslation();

  const {
    reservations,
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
    <div className="px-4 py-0">
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

          <div>
            <h2 className="mb-3 text-center text-lg font-semibold text-heading">
              {t("staff.reservations.listTitle", {
                count: reservations.length,
              })}
            </h2>

            {loading ? (
              <div className="mx-auto w-full rounded-md border border-black p-5">
                <PageLoader />
              </div>
            ) : (
              <StaffReservationList
                items={reservations}
                onEdit={startEditing}
                onDelete={handleDelete}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StaffReservations;
