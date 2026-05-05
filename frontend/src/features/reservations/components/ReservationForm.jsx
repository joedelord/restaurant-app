/**
 * ReservationForm
 *
 * Main reservation form component for creating a table booking.
 *
 * Responsibilities:
 * - Manages reservation form state
 * - Fetches available reservation slots based on date and party size
 * - Displays available tables for the selected time slot
 * - Restores a pending reservation after login
 * - Opens a confirmation modal before final submission
 * - Creates the reservation through the reservation service
 */

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  createReservation,
  getReservationAvailability,
  getTables,
} from "../services/reservationService";

import {
  STORAGE_KEY,
  buildReservationDraft,
  getReservationErrorMessage,
} from "../utils/reservationHelpers";

import { useAuth } from "@/features/auth";
import { getDefaultReservationDate, toDateInputValue } from "@/utils";
import TimeSlotPicker from "./TimeSlotPicker";
import TablePicker from "./TablePicker";
import ReservationConfirmModal from "./ReservationConfirmModal";
import { SubmitButton } from "@/components";

const ReservationForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthorized } = useAuth();

  const [date, setDate] = useState(getDefaultReservationDate());
  const [partySize, setPartySize] = useState(2);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [specialRequests, setSpecialRequests] = useState("");

  const [loadingTables, setLoadingTables] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingReservation, setPendingReservation] = useState(null);

  const clearFeedback = () => {
    setMessage("");
    setError("");
  };

  const resetForm = () => {
    setDate(getDefaultReservationDate());
    setPartySize(2);
    setSlots([]);
    setSelectedSlot(null);
    setSelectedTableId(null);
    setSpecialRequests("");
    setPendingReservation(null);
    setShowConfirmModal(false);
  };

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoadingTables(true);
        setError("");
        const data = await getTables();
        setTables(data);
      } catch (err) {
        console.error(err);
        setError(t("reservation.messages.tablesFetchError"));
      } finally {
        setLoadingTables(false);
      }
    };

    fetchTables();
  }, [t]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!date || !partySize || Number(partySize) <= 0) {
        setSlots([]);
        setSelectedSlot(null);
        setSelectedTableId(null);
        return;
      }

      try {
        setLoadingSlots(true);
        setError("");
        setSelectedSlot(null);
        setSelectedTableId(null);

        const data = await getReservationAvailability({
          date,
          partySize: Number(partySize),
        });

        setSlots(data?.slots || []);
      } catch (err) {
        console.error(err);
        setSlots([]);
        setError(t("reservation.messages.slotsFetchError"));
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [date, partySize, t]);

  useEffect(() => {
    const savedReservation = sessionStorage.getItem(STORAGE_KEY);

    if (!isAuthorized || !savedReservation) return;

    try {
      const parsed = JSON.parse(savedReservation);

      setDate(parsed.date || "");
      setPartySize(parsed.party_size || 2);
      setSpecialRequests(parsed.special_requests || "");
      setSelectedTableId(parsed.table_id || null);
      setPendingReservation(parsed);

      sessionStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Failed to restore pending reservation:", err);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (!pendingReservation?.time || !slots.length) return;

    const matchedSlot = slots.find(
      (slot) => slot.time === pendingReservation.time,
    );

    if (matchedSlot?.available) {
      setSelectedSlot(matchedSlot);
      setShowConfirmModal(true);
    }
  }, [slots, pendingReservation]);

  const availableTablesForSelectedSlot = useMemo(() => {
    if (!selectedSlot) return [];

    return tables.filter(
      (table) =>
        selectedSlot.available_tables.includes(table.id) &&
        table.seats >= Number(partySize),
    );
  }, [selectedSlot, tables, partySize]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date || !selectedSlot || !selectedTableId) {
      setError(t("reservation.validation.selectionRequired"));
      return;
    }

    const reservationDraft = buildReservationDraft({
      date,
      selectedSlot,
      selectedTableId,
      tables,
      partySize,
      specialRequests,
    });

    clearFeedback();
    setPendingReservation(reservationDraft);
    setShowConfirmModal(true);
  };

  const handleLoginRedirect = () => {
    if (pendingReservation) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pendingReservation));
    }

    navigate("/login", {
      state: {
        from: { pathname: "/reservations" },
        redirectTo: "/reservations",
      },
    });
  };

  const handleFinalConfirm = async () => {
    if (!pendingReservation) return;

    if (!isAuthorized) {
      handleLoginRedirect();
      return;
    }

    try {
      setLoadingSubmit(true);
      clearFeedback();

      await createReservation({
        reservation_time: pendingReservation.reservation_time,
        party_size: pendingReservation.party_size,
        table_id: pendingReservation.table_id,
        special_requests: pendingReservation.special_requests,
      });

      setMessage(t("reservation.messages.created"));
      resetForm();
    } catch (err) {
      console.error(err);
      setError(
        getReservationErrorMessage(err, t("reservation.messages.createError")),
      );
      setShowConfirmModal(false);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {message && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="min-w-0">
              <label className="mb-2 block text-sm font-medium text-gray-900">
                {t("reservation.fields.date")}
              </label>
              <input
                type="date"
                value={date}
                min={toDateInputValue()}
                onChange={(e) => {
                  setDate(e.target.value);
                  clearFeedback();
                }}
                className="block min-w-0 w-full max-w-full appearance-none rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-black focus:outline-none"
              />
            </div>

            <div className="min-w-0">
              <label className="mb-2 block text-sm font-medium text-gray-900">
                {t("reservation.fields.partySize")}
              </label>
              <input
                type="number"
                min="1"
                value={partySize}
                onChange={(e) => {
                  const value = e.target.value;

                  setPartySize(value === "" ? "" : Number(value));
                  clearFeedback();
                }}
                className="block min-w-0 w-full max-w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-black focus:outline-none"
              />
            </div>
          </div>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              {t("reservation.sections.availableTimes")}
            </h2>

            {loadingSlots ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
                {t("reservation.loading.slots")}
              </div>
            ) : (
              <TimeSlotPicker
                date={date}
                slots={slots}
                selectedSlot={selectedSlot}
                onSelect={(slot) => {
                  setSelectedSlot(slot);
                  setSelectedTableId(null);
                  clearFeedback();
                }}
              />
            )}
          </section>

          {selectedSlot && (
            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">
                {t("reservation.sections.availableTablesForTime", {
                  time: selectedSlot.time,
                })}
              </h2>

              {loadingTables ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                  {t("reservation.loading.tables")}
                </div>
              ) : (
                <TablePicker
                  tables={availableTablesForSelectedSlot}
                  selectedTableId={selectedTableId}
                  onSelect={(tableId) => {
                    setSelectedTableId(tableId);
                    clearFeedback();
                  }}
                  partySize={partySize}
                />
              )}
            </section>
          )}

          <section>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              {t("reservation.fields.specialRequests")}
            </label>
            <textarea
              rows="4"
              value={specialRequests}
              onChange={(e) => {
                setSpecialRequests(e.target.value);
                clearFeedback();
              }}
              placeholder={t("reservation.fields.specialRequestsPlaceholder")}
              className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-black focus:outline-none"
            />
          </section>

          <SubmitButton
            loading={loadingSubmit}
            idleText={t("reservation.actions.review")}
            loadingText={t("reservation.actions.saving")}
          />
        </form>
      </div>

      <ReservationConfirmModal
        open={showConfirmModal}
        reservation={pendingReservation}
        isAuthorized={isAuthorized}
        loading={loadingSubmit}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleFinalConfirm}
        onLogin={handleLoginRedirect}
      />
    </>
  );
};

export default ReservationForm;
