import api from "../api";

export const getMyProfile = async () => {
  const response = await api.get("/users/me/");
  return response.data;
};

export const updateMyProfile = async (payload) => {
  const response = await api.patch("/users/me/", payload);
  return response.data;
};

export const changeMyPassword = async (payload) => {
  const { data } = await api.post("/users/change-password/", payload);
  return data;
};
