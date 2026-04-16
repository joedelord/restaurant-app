import api from "../api";

export const getMyReservations = async () => {
  const { data } = await api.get("/reservations/");
  return data;
};

export const cancelMyReservation = async (id) => {
  const { data } = await api.patch(`/reservations/${id}/status/`, {
    status: "cancelled",
  });
  return data;
};
