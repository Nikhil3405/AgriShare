import API from "../api/axios";

const getAll = async (params = {}) => {
  const res = await API.get("/equipment/", { params });
  return res.data;
};

const getMyEquipment = async () => {
  const res = await API.get("/equipment/?mine=true");
  return res.data;
};

const deleteEquipment = async (id) => {
  return API.delete(`/equipment/${id}/`);
};

const createEquipment = async (formData) => {
  const res = await API.post("/equipment/", formData);

  return res.data;
};

const updateEquipment = async (id, formData) => {
  const res = await API.put(`/equipment/${id}/`, formData);

  return res.data;
};

const getById = async (id) => {
  const res = await API.get(`/equipment/${id}/`);

  return res.data;
};
const uploadImage = (equipmentId, formData) =>
  API.post(`/equipment/${equipmentId}/images/`, formData);

const getImages = (equipmentId) =>
  API.get(`/equipment/${equipmentId}/images/list/`).then((res) => res.data);

const deleteImage = (imageId) => API.delete(`/equipment/images/${imageId}/`);

export default {
  getAll,
  getById,
  getMyEquipment,
  deleteEquipment,
  createEquipment,
  updateEquipment,
  uploadImage,
  getImages,
  deleteImage,
};
