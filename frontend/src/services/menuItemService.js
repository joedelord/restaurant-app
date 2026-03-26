import api from "../api";

export const getMenuItems = async () => {
  const response = await api.get("/admin/menu-items/");
  return response.data;
};

export const createMenuItem = async (menuData) => {
  const response = await api.post("/admin/menu-items/", menuData);
  return response.data;
};

export const updateMenuItem = async (id, menuData) => {
  const response = await api.put(`/admin/menu-items/${id}/`, menuData);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await api.delete(`/admin/menu-items/${id}/`);
  return response.data;
};
