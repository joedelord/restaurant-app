import { useEffect, useMemo, useState } from "react";
import TablePicker from "./TablePicker";
import {
  createReservation,
  getTables,
} from "../../services/reservationService";
import AuthSubmitButton from "../auth/AuthSubmitButton";

const getLocalDateTimeValue = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const ReservationForm = () => {
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    reservation_time: "",
    party_size: 2,
    table_id: null,
    special_requests: "",
  });

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoadingTables(true);
        const data = await getTables();
        setTables(data);
      } catch (err) {
        console.error(err);
        setError("Pöytien hakeminen epäonnistui.");
      } finally {
        setLoadingTables(false);
      }
    };

    fetchTables();
  }, []);

  const availableSizeTables = useMemo(() => {
    return tables.filter(
      (table) =>
        Number(formData.party_size) > 0 &&
        table.seats >= Number(formData.party_size),
    );
  }, [tables, formData.party_size]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "party_size" ? Number(value) : value,
    }));

    setMessage("");
    setError("");
  };

  const handleTableSelect = (tableId) => {
    setFormData((prev) => ({
      ...prev,
      table_id: tableId,
    }));
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reservation_time) {
      setError("Valitse varausaika.");
      return;
    }

    if (!formData.party_size || Number(formData.party_size) <= 0) {
      setError("Henkilömäärän täytyy olla vähintään 1.");
      return;
    }

    if (!formData.table_id) {
      setError("Valitse pöytä.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await createReservation({
        reservation_time: formData.reservation_time,
        party_size: Number(formData.party_size),
        table_id: formData.table_id,
        special_requests: formData.special_requests.trim(),
      });

      setMessage("Varaus lähetetty onnistuneesti.");
      setFormData({
        reservation_time: "",
        party_size: 2,
        table_id: null,
        special_requests: "",
      });
    } catch (err) {
      console.error(err);

      const data = err?.response?.data;

      if (data?.reservation_time?.[0]) {
        setError(data.reservation_time[0]);
      } else if (data?.party_size?.[0]) {
        setError(data.party_size[0]);
      } else if (data?.table_id?.[0]) {
        setError(data.table_id[0]);
      } else if (data?.detail) {
        setError(data.detail);
      } else {
        setError("Varauksen tekeminen epäonnistui.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Varausaika
            </label>
            <input
              type="datetime-local"
              name="reservation_time"
              value={formData.reservation_time}
              min={getLocalDateTimeValue()}
              onChange={handleChange}
              className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-black focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Henkilömäärä
            </label>
            <input
              type="number"
              name="party_size"
              min="1"
              value={formData.party_size}
              onChange={handleChange}
              className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-black focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-gray-900">
            Valitse pöytä
          </label>

          {loadingTables ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
              Ladataan pöytiä...
            </div>
          ) : (
            <TablePicker
              tables={availableSizeTables}
              selectedTableId={formData.table_id}
              onSelect={handleTableSelect}
              partySize={formData.party_size}
            />
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            Lisätiedot
          </label>
          <textarea
            name="special_requests"
            rows="4"
            value={formData.special_requests}
            onChange={handleChange}
            placeholder="Esim. lastenistuin, allergiat tai toive rauhallisesta pöydästä"
            className="block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-black focus:outline-none"
          />
        </div>

        <AuthSubmitButton
          loading={loading}
          idleText="Vahvista varaus"
          loadingText="Lähetetään..."
        />
      </form>
    </div>
  );
};

export default ReservationForm;
