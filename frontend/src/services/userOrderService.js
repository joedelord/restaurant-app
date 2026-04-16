import api from "../api";

export const getMyOrders = async () => {
  const { data } = await api.get("/orders/");
  return data;
};
