import api from "../api";

export const getSalesStats = async () => {
  const response = await api.get("/admin/sales/");
  return response.data;
};
