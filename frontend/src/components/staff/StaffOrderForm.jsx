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
    const fetchMenuItems = async () => {
      try {
        setLoadingMenu(true);
        const response = await api.get("/menu-items/");
        setMenuItems(response.data.filter((item) => item.is_available));
      } catch (err) {
        console.error(err);
        setError(t("staff.orders.messages.fetchError"));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || loadingMenu) return;

    setError("");

    const cleanedItems = formData.items
      .filter((row) => row.menu_item_id && Number(row.quantity) > 0)
      .map((row) => ({
        menu_item_id: Number(row.menu_item_id),
        quantity: Number(row.quantity),
      }));

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

  if (loadingMenu) {
    return (
      <div className="mx-auto w-full max-w-5xl rounded-md border border-black p-5">
        <p className="text-sm text-body">{t("staff.orders.loading.form")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl rounded-md border border-black p-5">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-base border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
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
              <option value="served">
                {t("staff.orders.statuses.served")}
              </option>
              <option value="paid">{t("staff.orders.statuses.paid")}</option>
              <option value="cancelled">
                {t("staff.orders.statuses.cancelled")}
              </option>
            </select>
          </div>

          <div className="rounded-base bg-gray-50 px-4 py-3 text-sm">
            <p className="font-medium text-heading">
              {t("staff.orders.fields.orderId")}: #{initialData?.id ?? "-"}
            </p>
            <p className="mt-1 text-body">
              {t("staff.orders.fields.table")}:{" "}
              {initialData?.table?.table_number
                ? `${t("staff.orders.values.table")} ${initialData.table.table_number}`
                : "-"}
            </p>
          </div>
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
                    disabled={loading}
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
                    disabled={loading}
                    className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs focus:border-brand focus:ring-brand"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleRemoveRow(index)}
                    disabled={loading}
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
