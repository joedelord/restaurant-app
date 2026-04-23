/**
 * TablePicker
 *
 * Displays available restaurant tables for the selected reservation slot.
 *
 * Responsibilities:
 * - Renders selectable table options
 * - Highlights the selected table
 * - Disables tables that are too small for the party size
 * - Shows table availability and seat capacity information
 */

import { useTranslation } from "react-i18next";

const getTableClasses = ({ isSelected, isTooSmall }) => {
  if (isSelected) {
    return "border-black bg-gray-900 text-white";
  }

  if (isTooSmall) {
    return "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400";
  }

  return "border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm";
};

const getTableStatusLabel = ({ isTooSmall, t }) => {
  if (isTooSmall) {
    return t("reservation.tablePicker.tooSmall");
  }

  return t("reservation.tablePicker.available");
};

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
        const isTooSmall = Number(partySize) > table.seats;
        const isSelected = selectedTableId === table.id;

        return (
          <button
            key={table.id}
            type="button"
            onClick={() => !isTooSmall && onSelect(table.id)}
            disabled={isTooSmall}
            className={`rounded-2xl border p-4 text-left transition ${getTableClasses(
              {
                isSelected,
                isTooSmall,
              },
            )}`}
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
              {getTableStatusLabel({ isTooSmall, t })}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default TablePicker;
