import API from "../api/axios";

const login = async (credentials) => {
  const res = await API.post("/users/login/", credentials);
  return res.data;
};

const register = async (formData) => {
  return API.post("/users/register/", formData);
};

const refreshToken = async () => {
  const refresh = localStorage.getItem("refreshToken");

  const res = await API.post("/users/refresh/", {
    refresh,
  });

  return res.data;
};

const getProfile = async () => {
  const res = await API.get("/users/profile/");

  return res.data;
};

const changePassword = (data) => API.post("/users/change-password/", data);

const updateProfile = (formData) =>
  API.put("/users/profile/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export default {
  login,
  register,
  refreshToken,
  getProfile,
  changePassword,
  updateProfile,
};
