const TimeSlotPicker = ({ slots, selectedTime, onSelect }) => {
  if (!slots.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
        Ei aikoja saatavilla.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {slots.map((slot) => {
        const isSelected = selectedTime === slot.time;

        return (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            onClick={() => slot.available && onSelect(slot)}
            className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
              !slot.available
                ? "cursor-not-allowed border border-red-200 bg-red-100 text-red-700"
                : isSelected
                  ? "border border-green-700 bg-green-700 text-white"
                  : "border border-green-200 bg-green-100 text-green-800 hover:bg-green-200"
            }`}
          >
            {slot.time}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotPicker;
