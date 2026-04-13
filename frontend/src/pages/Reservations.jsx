import { useTranslation } from "react-i18next";
import ReservationForm from "../components/reservations/ReservationForm";

const Reservations = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          {t("reservation.page.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          {t("reservation.page.subtitle")}
        </p>
      </header>

      <ReservationForm />
    </div>
  );
};

export default Reservations;
