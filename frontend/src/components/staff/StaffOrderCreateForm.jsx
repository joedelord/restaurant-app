import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AuthSubmitButton from "../auth/AuthSubmitButton";
import Button from "../ui/Button";
import api from "../../api";
import { createOrder } from "../../services/staffOrderService";
import { formatCurrency } from "../../utils/currency";

const emptyRow = {
  menu_item_id: "",
  quantity: 1,
};

const StaffOrderCreateForm = ({ onCreated }) => {
  const { t, i18n } = useTranslation();

  const [mode, setMode] = useState("reservation");
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [formData, setFormData] = useState({
    reservation_id: "",
    table_id: "",
    status: "pending",
    items: [{ ...emptyRow }],
  });

  const [loadingData, setLoadingData] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getLocalizedName = (item) => {
    return i18n.language === "fi"
      ? item.name_fi || item.name_en
      : item.name_en || item.name_fi;
  };

  const getLocalizedCategoryName = (item) => {
    return i18n.language === "fi"
      ? item.category_name_fi || item.category_name_en
      : item.category_name_en || item.category_name_fi;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        setError("");

        const [reservationRes, orderRes, tableRes, menuRes] = await Promise.all(
          [
            api.get("/reservations/"),
            api.get("/orders/"),
            api.get("/tables/"),
            api.get("/menu-items/"),
          ],
        );

        const reservationIdsWithOrder = new Set(
          orderRes.data.map((order) => order.reservation?.id).filter(Boolean),
        );

        const usableReservations = reservationRes.data.filter(
          (reservation) =>
            reservation.status !== "cancelled" &&
            reservation.status !== "completed" &&
            !reservationIdsWithOrder.has(reservation.id),
        );

        setReservations(usableReservations);
        setTables(tableRes.data);
        setMenuItems(menuRes.data.filter((item) => item.is_available));
      } catch (err) {
        console.error(err);
        setError(t("staff.orders.messages.fetchError"));
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [t]);

  const selectedReservation = useMemo(() => {
    return reservations.find(
      (reservation) =>
        String(reservation.id) === String(formData.reservation_id),
    );
  }, [reservations, formData.reservation_id]);

  useEffect(() => {
    if (mode === "reservation" && selectedReservation?.table?.id) {
      setFormData((prev) => ({
        ...prev,
        table_id: String(selectedReservation.table.id),
      }));
    }
  }, [mode, selectedReservation]);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setError("");
    setMessage("");

    setFormData((prev) => ({
      ...prev,
      reservation_id: "",
      table_id: "",
      items: prev.items.length ? prev.items : [{ ...emptyRow }],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: field === "quantity" ? Number(value) : value,
            }
          : item,
      ),
    }));

    setError("");
    setMessage("");
  };

  const handleAddRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...emptyRow }],
    }));
  };

  const handleRemoveRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      items:
        prev.items.length === 1
          ? [{ ...emptyRow }]
          : prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const totalPreview = useMemo(() => {
    return formData.items.reduce((sum, row) => {
      const menuItem = menuItems.find(
        (item) => String(item.id) === String(row.menu_item_id),
      );

      if (!menuItem || !row.quantity) return sum;
      return sum + Number(menuItem.price) * Number(row.quantity);
    }, 0);
  }, [formData.items, menuItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loadingSubmit) return;

    setError("");
    setMessage("");

    const cleanedItems = formData.items
      .filter((row) => row.menu_item_id && Number(row.quantity) > 0)
      .map((row) => ({
        menu_item_id: Number(row.menu_item_id),
        quantity: Number(row.quantity),
      }));

    if (mode === "reservation" && !formData.reservation_id) {
      setError(t("staff.orders.validation.reservationRequired"));
      return;
    }

    if (!formData.table_id) {
      setError(t("staff.orders.validation.tableRequired"));
      return;
    }

    if (!cleanedItems.length) {
      setError(t("staff.orders.validation.itemsRequired"));
      return;
    }

    const duplicateIds = new Set();
    for (const item of cleanedItems) {
      if (duplicateIds.has(item.menu_item_id)) {
        setError(t("staff.orders.validation.duplicateItems"));
        return;
      }
      duplicateIds.add(item.menu_item_id);
    }

    try {
      setLoadingSubmit(true);

      const payload = {
        reservation_id:
          mode === "reservation" ? Number(formData.reservation_id) : null,
        table_id: Number(formData.table_id),
        status: formData.status,
        items: cleanedItems,
      };

      const createdOrder = await createOrder(payload);

      setMessage(t("staff.orders.messages.created"));
      setFormData({
        reservation_id: "",
        table_id: "",
        status: "pending",
        items: [{ ...emptyRow }],
      });

      if (onCreated) {
        onCreated(createdOrder);
      }
    } catch (err) {
      console.error(err);

      const data = err?.response?.data;

      if (data?.table_id?.[0]) {
        setError(data.table_id[0]);
      } else if (data?.reservation_id?.[0]) {
        setError(data.reservation_id[0]);
      } else if (data?.items?.[0]) {
        setError(data.items[0]);
      } else if (data?.status?.[0]) {
        setError(data.status[0]);
      } else if (data?.detail) {
        setError(data.detail);
      } else {
        setError(t("staff.orders.messages.saveError"));
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingData) {
    return (
      <div className="mx-auto w-full max-w-5xl rounded-md border border-black p-5">
        <p className="text-sm text-body">{t("staff.orders.loading.form")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl rounded-md border border-black p-5">
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div className="rounded-base border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-base border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2.5 block text-sm font-medium text-heading">
              {t("staff.orders.fields.orderType")}
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleModeChange("reservation")}
                className={`rounded-base px-4 py-2 text-sm font-medium transition ${
                  mode === "reservation"
                    ? "bg-brand text-white"
                    : "bg-gray-100 text-heading hover:bg-gray-200"
                }`}
              >
                {t("staff.orders.types.reservation")}
              </button>

              <button
                type="button"
                onClick={() => handleModeChange("walkIn")}
                className={`rounded-base px-4 py-2 text-sm font-medium transition ${
                  mode === "walkIn"
                    ? "bg-brand text-white"
                    : "bg-gray-100 text-heading hover:bg-gray-200"
                }`}
              >
                {t("staff.orders.types.walkIn")}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              {t("staff.orders.fields.status")}
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loadingSubmit}
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand"
            >
              <option value="pending">
                {t("staff.orders.statuses.pending")}
              </option>
              <option value="confirmed">
                {t("staff.orders.statuses.confirmed")}
              </option>
              <option value="preparing">
                {t("staff.orders.statuses.preparing")}
              </option>
              <option value="ready">{t("staff.orders.statuses.ready")}</option>
              <option value="served">
                {t("staff.orders.statuses.served")}
              </option>
              <option value="paid">{t("staff.orders.statuses.paid")}</option>
              <option value="cancelled">
                {t("staff.orders.statuses.cancelled")}
              </option>
            </select>
          </div>
        </div>

        {mode === "reservation" && (
          <div>
            <label
              htmlFor="reservation_id"
              className="mb-2.5 block text-sm font-medium text-heading"
            >
              {t("staff.orders.fields.reservation")}
            </label>

            <select
              id="reservation_id"
              name="reservation_id"
              value={formData.reservation_id}
              onChange={handleChange}
              disabled={loadingSubmit}
              className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand"
            >
              <option value="">
                {t("staff.orders.placeholders.selectReservation")}
              </option>
              {reservations.map((reservation) => {
                const customerName =
                  `${reservation.user?.first_name || ""} ${reservation.user?.last_name || ""}`.trim() ||
                  reservation.user?.email ||
                  `#${reservation.id}`;

                return (
                  <option key={reservation.id} value={reservation.id}>
                    #{reservation.id} · {customerName} ·{" "}
                    {reservation.table?.table_number
                      ? `${t("staff.orders.values.table")} ${reservation.table.table_number}`
                      : "-"}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        <div>
          <label
            htmlFor="table_id"
            className="mb-2.5 block text-sm font-medium text-heading"
          >
            {t("staff.orders.fields.table")}
          </label>

          <select
            id="table_id"
            name="table_id"
            value={formData.table_id}
            onChange={handleChange}
            disabled={
              loadingSubmit || (mode === "reservation" && !!selectedReservation)
            }
            className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand disabled:opacity-60"
          >
            <option value="">
              {t("staff.orders.placeholders.selectTable")}
            </option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                {t("staff.orders.values.table")} {table.table_number} (
                {table.seats})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-heading">
              {t("staff.orders.sections.items")}
            </h2>

            <Button type="button" variant="secondary" onClick={handleAddRow}>
              {t("staff.orders.actions.addItem")}
            </Button>
          </div>

          {formData.items.map((row, index) => {
            const selectedItem = menuItems.find(
              (item) => String(item.id) === String(row.menu_item_id),
            );

            return (
              <div
                key={index}
                className="grid gap-3 rounded-base border border-default-medium p-4 md:grid-cols-[1fr_140px_auto]"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-heading">
                    {t("staff.orders.fields.menuItem")}
                  </label>

                  <select
                    value={row.menu_item_id}
                    onChange={(e) =>
                      handleItemChange(index, "menu_item_id", e.target.value)
                    }
                    disabled={loadingSubmit}
                    className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand"
                  >
                    <option value="">
                      {t("staff.orders.placeholders.selectMenuItem")}
                    </option>

                    {menuItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {getLocalizedName(item)} ·{" "}
                        {getLocalizedCategoryName(item)} ·{" "}
                        {formatCurrency(item.price)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-heading">
                    {t("staff.orders.fields.quantity")}
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={row.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    disabled={loadingSubmit}
                    className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleRemoveRow(index)}
                    disabled={loadingSubmit}
                    className="w-full"
                  >
                    {t("staff.orders.actions.removeItem")}
                  </Button>
                </div>

                {selectedItem && (
                  <div className="md:col-span-3 text-sm text-body">
                    {t("staff.orders.fields.rowTotal")}:{" "}
                    {formatCurrency(
                      Number(selectedItem.price) * Number(row.quantity),
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="rounded-base bg-gray-50 px-4 py-3 text-sm font-medium text-heading">
          {t("staff.orders.fields.totalPreview")}:{" "}
          {formatCurrency(totalPreview)}
        </div>

        <div className="flex gap-3">
          <AuthSubmitButton
            loading={loadingSubmit}
            idleText={t("staff.orders.actions.create")}
            loadingText={t("staff.orders.actions.creating")}
          />
        </div>
      </form>
    </div>
  );
};

export default StaffOrderCreateForm;
