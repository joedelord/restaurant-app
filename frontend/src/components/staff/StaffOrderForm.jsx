import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AuthSubmitButton from "../auth/AuthSubmitButton";
import Button from "../ui/Button";
import api from "../../api";
import { formatCurrency } from "../../utils/currency";

const emptyRow = {
  menu_item_id: "",
  quantity: 1,
};

const getInitialItems = (initialData) => {
  if (!initialData?.items?.length) {
    return [{ ...emptyRow }];
  }

  return initialData.items.map((item) => ({
    menu_item_id: item.menu_item?.id ? String(item.menu_item.id) : "",
    quantity: item.quantity ?? 1,
  }));
};

const getFormValues = (initialData) => ({
  status: initialData?.status ?? "pending",
  items: getInitialItems(initialData),
});

const formatReservationDateTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString("fi-FI", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const StaffOrderForm = ({
  onSubmit,
  initialData = null,
  submitText,
  onCancel,
}) => {
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState(() => getFormValues(initialData));
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getLocalizedName = (item) =>
    i18n.language === "fi"
      ? item.name_fi || item.name_en
      : item.name_en || item.name_fi;

  const getLocalizedCategoryName = (item) =>
    i18n.language === "fi"
      ? item.category_name_fi || item.category_name_en
      : item.category_name_en || item.category_name_fi;

  useEffect(() => {
    setFormData(getFormValues(initialData));
    setError("");
  }, [initialData]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoadingMenu(true);
        setError("");

        const response = await api.get("/menu-items/");
        setMenuItems(response.data.filter((item) => item.is_available));
      } catch (err) {
        console.error(err);
        setError(t("staff.orders.messages.fetchMenuError"));
      } finally {
        setLoadingMenu(false);
      }
    };

    fetchMenuItems();
  }, [t]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
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

    setError("");
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

  const orderType = initialData?.reservation
    ? t("staff.orders.types.reservation")
    : t("staff.orders.types.walkIn");

  const isItemsLocked = ["paid", "cancelled"].includes(initialData?.status);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || loadingMenu) return;

    setError("");

    const cleanedItems = formData.items
      .filter((item) => item.menu_item_id && Number(item.quantity) > 0)
      .map((item) => ({
        menu_item_id: Number(item.menu_item_id),
        quantity: Number(item.quantity),
      }));

    if (!cleanedItems.length) {
      setError(t("staff.orders.validation.itemsRequired"));
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        status: formData.status,
        items: cleanedItems,
      });
    } catch (err) {
      console.error(err);

      const data = err?.response?.data;

      if (data?.items?.[0]) {
        setError(data.items[0]);
      } else if (data?.status?.[0]) {
        setError(data.status[0]);
      } else if (data?.detail) {
        setError(data.detail);
      } else {
        setError(t("staff.orders.messages.saveError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl rounded-md border border-black p-5">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-base border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-base border border-default-medium bg-gray-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {t("staff.orders.fields.type")}
            </p>
            <p className="mt-1 text-sm font-medium text-heading">{orderType}</p>
          </div>

          <div className="rounded-base border border-default-medium bg-gray-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {t("staff.orders.fields.table")}
            </p>
            <p className="mt-1 text-sm font-medium text-heading">
              {initialData?.table?.table_number
                ? `${t("staff.orders.values.table")} ${initialData.table.table_number}`
                : "-"}
            </p>
          </div>
        </div>

        {initialData?.reservation && (
          <div className="rounded-base border border-default-medium bg-gray-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {t("staff.orders.fields.reservation")}
            </p>
            <p className="mt-1 text-sm font-medium text-heading">
              #{initialData.reservation.id} ·{" "}
              {formatReservationDateTime(
                initialData.reservation.reservation_time,
              )}
            </p>
          </div>
        )}

        <div className="max-w-xl">
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
            disabled={loading}
            className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand disabled:opacity-50"
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
            <option value="served">{t("staff.orders.statuses.served")}</option>
            <option value="paid">{t("staff.orders.statuses.paid")}</option>
            <option value="cancelled">
              {t("staff.orders.statuses.cancelled")}
            </option>
          </select>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-semibold text-heading">
            {t("staff.orders.fields.items")}
          </h3>

          {isItemsLocked && (
            <div className="rounded-base border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              {t("staff.orders.messages.itemsLocked")}
            </div>
          )}

          {formData.items.map((row, index) => {
            const selectedItem = menuItems.find(
              (item) => String(item.id) === String(row.menu_item_id),
            );

            return (
              <div
                key={index}
                className="space-y-4 rounded-base border border-default-medium p-4"
              >
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_140px_140px]">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-heading">
                      {t("staff.orders.fields.menuItem")}
                    </label>

                    <select
                      value={row.menu_item_id}
                      onChange={(e) =>
                        handleItemChange(index, "menu_item_id", e.target.value)
                      }
                      disabled={loading || loadingMenu || isItemsLocked}
                      className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand disabled:opacity-50"
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
                      disabled={loading || isItemsLocked}
                      className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand disabled:opacity-50"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => handleRemoveRow(index)}
                      disabled={loading || isItemsLocked}
                      className="w-full"
                    >
                      {t("staff.orders.actions.removeItem")}
                    </Button>
                  </div>
                </div>

                {selectedItem && (
                  <div className="text-sm text-body">
                    {t("staff.orders.fields.rowTotal")}:{" "}
                    {formatCurrency(
                      Number(selectedItem.price) * Number(row.quantity),
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {!isItemsLocked && (
            <div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddRow}
                disabled={loading || loadingMenu}
              >
                {t("staff.orders.actions.addItem")}
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-base bg-gray-50 px-4 py-3 text-sm font-medium text-heading">
          {t("staff.orders.fields.totalPreview")}:{" "}
          {formatCurrency(totalPreview)}
        </div>

        <div className="flex gap-3">
          <AuthSubmitButton
            loading={loading}
            idleText={submitText}
            loadingText={submitText}
          />

          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              {t("staff.orders.actions.cancel")}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StaffOrderForm;
