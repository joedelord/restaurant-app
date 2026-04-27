// features/staff/utils/staffOrderHelpers.js

export const emptyOrderItemRow = {
  menu_item_id: "",
  quantity: 1,
};

export const getTodayDate = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

export const toLocalDateString = (value) => {
  if (!value) return "";

  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

export const formatReservationDateTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString("fi-FI", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

export const getLocalizedMenuItemName = (item, language) => {
  return language === "fi"
    ? item.name_fi || item.name_en
    : item.name_en || item.name_fi;
};

export const getLocalizedMenuItemCategoryName = (item, language) => {
  return language === "fi"
    ? item.category_name_fi || item.category_name_en
    : item.category_name_en || item.category_name_fi;
};

export const getStaffOrderErrorMessage = (err, fallbackMessage) => {
  const data = err?.response?.data;

  if (data?.table_id?.[0]) return data.table_id[0];
  if (data?.reservation_id?.[0]) return data.reservation_id[0];
  if (data?.items?.[0]) return data.items[0];
  if (data?.status?.[0]) return data.status[0];
  if (data?.detail) return data.detail;

  return fallbackMessage;
};
