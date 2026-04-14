import api from "../api";

export const getReservations = async () => {
  const response = await api.get("/reservations/");
  return response.data;
};

export const updateReservation = async (id, payload) => {
  const response = await api.patch(`/reservations/${id}/`, payload);
  return response.data;
};

export const deleteReservation = async (id) => {
  const response = await api.delete(`/reservations/${id}/`);
  return response.data;
};
