import api from "../api";

export const getTables = async () => {
  const response = await api.get("/admin/tables/");
  return response.data;
};

export const createTable = async (tableData) => {
  const response = await api.post("/admin/tables/", tableData);
  return response.data;
};

export const updateTable = async (id, tableData) => {
  const response = await api.patch(`/admin/tables/${id}/`, tableData);
  return response.data;
};

export const deleteTable = async (id) => {
  const response = await api.delete(`/admin/tables/${id}/`);
  return response.data;
};
