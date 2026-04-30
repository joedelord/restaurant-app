/**
 * TimeSlotPicker
 *
 * Displays available reservation time slots for a selected date.
 *
 * Responsibilities:
 * - Renders a grid of selectable time slots
 * - Disables unavailable or past time slots
 * - Highlights the selected slot
 * - Displays slot status (available, reserved, past)
 */

import { useTranslation } from "react-i18next";
import { isPastTimeSlot } from "@/utils";

const getSlotClasses = ({ isSelected, isPast, isAvailable }) => {
  if (isSelected) return "bg-black text-white";
  if (isPast) return "cursor-not-allowed bg-gray-100 text-gray-400";
  if (isAvailable) return "bg-green-100 text-green-700 hover:bg-green-200";
  return "cursor-not-allowed bg-red-100 text-red-500";
};

const getSlotLabel = ({ isPast, isAvailable, t }) => {
  if (isPast) return t("reservation.timeSlot.past");
  if (isAvailable) return t("reservation.timeSlot.available");
  return t("reservation.timeSlot.reserved");
};

const TimeSlotPicker = ({ date, slots, selectedSlot, onSelect }) => {
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
          const isPast = isPastTimeSlot(date, slot.time);
          const isAvailable = slot.available;
          const isDisabled = !isAvailable || isPast;

          return (
            <button
              key={slot.time}
              type="button"
              onClick={() => !isDisabled && onSelect(slot)}
              disabled={isDisabled}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${getSlotClasses(
                {
                  isSelected,
                  isPast,
                  isAvailable,
                },
              )}`}
            >
              <div>{slot.time}</div>

              <div className="text-xs">
                {getSlotLabel({ isPast, isAvailable, t })}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotPicker;
