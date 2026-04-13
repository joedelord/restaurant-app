import { useTranslation } from "react-i18next";

const TablePicker = ({ tables, selectedTableId, onSelect, partySize }) => {
  const { t } = useTranslation();

  if (!tables.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
        {t("reservation.tablePicker.noTables")}
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
                {t("reservation.tablePicker.table", {
                  number: table.table_number,
                })}
              </h3>

              <span className="text-sm">
                👥{" "}
                {t("reservation.tablePicker.seats", {
                  count: table.seats,
                })}
              </span>
            </div>

            <p className="mt-2 text-sm opacity-80">
              {tooSmall
                ? t("reservation.tablePicker.tooSmall")
                : t("reservation.tablePicker.available")}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default TablePicker;
