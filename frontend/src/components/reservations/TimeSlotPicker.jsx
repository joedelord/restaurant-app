import { useTranslation } from "react-i18next";

const TimeSlotPicker = ({ slots, selectedSlot, onSelect }) => {
  const { t } = useTranslation();

  if (!slots.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
        {t("reservation.timeSlot.noSlots")}
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-gray-900">
        {t("reservation.timeSlot.title")}
      </h3>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {slots.map((slot) => {
          const isSelected = selectedSlot?.time === slot.time;

          return (
            <button
              key={slot.time}
              type="button"
              onClick={() => slot.available && onSelect(slot)}
              disabled={!slot.available}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                isSelected
                  ? "bg-black text-white"
                  : slot.available
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "cursor-not-allowed bg-red-100 text-red-500"
              }`}
            >
              <div>{slot.time}</div>

              <div className="text-xs">
                {slot.available
                  ? t("reservation.timeSlot.available")
                  : t("reservation.timeSlot.reserved")}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotPicker;
