const TablePicker = ({ tables, selectedTableId, onSelect, partySize }) => {
  if (!tables.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
        Ei pöytiä saatavilla.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tables.map((table) => {
        const tooSmall = partySize && Number(partySize) > table.seats;
        const isSelected = selectedTableId === table.id;

        return (
          <button
            key={table.id}
            type="button"
            onClick={() => !tooSmall && onSelect(table.id)}
            disabled={tooSmall}
            className={`rounded-2xl border p-4 text-left transition ${
              isSelected
                ? "border-black bg-gray-900 text-white"
                : tooSmall
                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                  : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Pöytä {table.table_number}
              </h3>
              <span className="text-sm">👥 {table.seats}</span>
            </div>

            <p className="mt-2 text-sm opacity-80">
              {tooSmall
                ? "Liian pieni valitulle henkilömäärälle"
                : "Sopiva valinta varaukselle"}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default TablePicker;
