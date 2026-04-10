import api from "../api";

export const getReservationAvailability = async ({ date, partySize }) => {
  const response = await api.get("/reservations/availability/", {
    params: {
      date,
      party_size: partySize,
    },
  });

  return response.data;
};

export const getTables = async () => {
  const response = await api.get("/tables/");
  return response.data;
};

export const createReservation = async (payload) => {
  const response = await api.post("/reservations/", payload);
  return response.data;
};
