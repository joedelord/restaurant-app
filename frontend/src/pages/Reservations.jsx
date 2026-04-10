import { useEffect, useMemo, useState } from "react";
import {
  createReservation,
  getReservationAvailability,
  getTables,
} from "../services/reservationService";
import TimeSlotPicker from "../components/reservations/TimeSlotPicker";

const Reservations = () => {
  const [date, setDate] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [specialRequests, setSpecialRequests] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const data = await getTables();
        setTables(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTables();
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!date || !partySize) {
        setSlots([]);
        return;
      }

      try {
        setLoadingSlots(true);
        setError("");
        setSelectedSlot(null);
        setSelectedTableId(null);

        const data = await getReservationAvailability({ date, partySize });
        setSlots(data.slots || []);
      } catch (err) {
        console.error(err);
        setError("Aikojen haku epäonnistui.");
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [date, partySize]);

  const availableTablesForSelectedSlot = useMemo(() => {
    if (!selectedSlot) return [];

    return tables.filter(
      (table) =>
        selectedSlot.available_tables.includes(table.id) &&
        table.seats >= Number(partySize),
    );
  }, [selectedSlot, tables, partySize]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !selectedSlot || !selectedTableId) {
      setError("Valitse päivä, aika ja pöytä.");
      return;
    }

    try {
      setLoadingSubmit(true);
      setError("");
      setMessage("");

      await createReservation({
        reservation_time: `${date}T${selectedSlot.time}:00`,
        party_size: Number(partySize),
        table_id: selectedTableId,
        special_requests: specialRequests.trim(),
      });

      setMessage("Varaus luotu onnistuneesti.");
      setSelectedSlot(null);
      setSelectedTableId(null);
      setSpecialRequests("");
    } catch (err) {
      console.error(err);
      setError("Varauksen tekeminen epäonnistui.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Varaa pöytä</h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Valitse päivä, henkilömäärä ja vapaa aika.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Päivämäärä
            </label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Henkilömäärä
            </label>
            <input
              type="number"
              min="1"
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Vapaat ajat
          </h2>

          {loadingSlots ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
              Haetaan aikoja...
            </div>
          ) : (
            <TimeSlotPicker
              slots={slots}
              selectedTime={selectedSlot?.time || null}
              onSelect={setSelectedSlot}
            />
          )}
        </section>

        {selectedSlot && (
          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Vapaat pöydät ajalle {selectedSlot.time}
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {availableTablesForSelectedSlot.map((table) => {
                const isSelected = selectedTableId === table.id;

                return (
                  <button
                    key={table.id}
                    type="button"
                    onClick={() => setSelectedTableId(table.id)}
                    className={`rounded-xl border p-4 text-left ${
                      isSelected
                        ? "border-black bg-gray-900 text-white"
                        : "border-gray-200 bg-white hover:border-gray-400"
                    }`}
                  >
                    <div className="font-semibold">
                      Pöytä {table.table_number}
                    </div>
                    <div className="text-sm opacity-80">
                      Paikkoja: {table.seats}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            Lisätiedot
          </label>
          <textarea
            rows="4"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm"
          />
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loadingSubmit}
          className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loadingSubmit ? "Tallennetaan..." : "Vahvista varaus"}
        </button>
      </form>
    </div>
  );
};

export default Reservations;
