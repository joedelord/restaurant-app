import { useState } from "react";
import { useTranslation } from "react-i18next";
import StaffOrderCreateForm from "../../components/staff/StaffOrderCreateForm";

const StaffCreateOrder = () => {
  const { t } = useTranslation();
  const [selectedMode, setSelectedMode] = useState(null);

  return (
    <div className="px-4 py-0">
      <h1 className="text-center text-3xl font-bold">
        {t("staff.orders.createTitle")}
      </h1>

      <div className="mx-auto w-full max-w-5xl space-y-6">
        <p className="mt-2 text-center text-gray-500">
          {t("staff.orders.createSubtitle")}
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => setSelectedMode("reservation")}
            className={`rounded-xl border px-5 py-5 text-center shadow-sm transition ${
              selectedMode === "reservation"
                ? "border-brand bg-gray-600 text-white"
                : "border-gray-200 bg-white hover:border-brand hover:shadow-md"
            }`}
          >
            <p className="text-base font-semibold">
              {t("staff.orders.types.reservation")}
            </p>
            <p
              className={`mt-2 text-sm ${
                selectedMode === "reservation"
                  ? "text-white/90"
                  : "text-gray-500"
              }`}
            >
              {t("staff.orders.modeDescriptions.reservation")}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMode("walkIn")}
            className={`rounded-xl border px-5 py-5 text-center shadow-sm transition ${
              selectedMode === "walkIn"
                ? "border-brand  bg-gray-600 text-white"
                : "border-gray-200 bg-white hover:border-brand hover:shadow-md"
            }`}
          >
            <p className="text-base font-semibold">
              {t("staff.orders.types.walkIn")}
            </p>
            <p
              className={`mt-2 text-sm ${
                selectedMode === "walkIn" ? "text-white/90" : "text-gray-500"
              }`}
            >
              {t("staff.orders.modeDescriptions.walkIn")}
            </p>
          </button>
        </div>

        {selectedMode && (
          <StaffOrderCreateForm
            initialMode={selectedMode}
            modeLocked
            onCreated={() => {
              setSelectedMode(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default StaffCreateOrder;
