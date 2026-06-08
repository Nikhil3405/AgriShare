import axios from "axios";

const API = axios.create({
  baseURL: "https://agrishare-52sg.onrender.com/api",
});

// Attach access token
API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

// Refresh expired token
API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh =
          localStorage.getItem("refreshToken");

        const res = await axios.post(
          "https://agrishare-52sg.onrender.com/api/users/refresh/",
          {
            refresh,
          }
        );

        localStorage.setItem(
          "accessToken",
          res.data.access
        );

        originalRequest.headers.Authorization =
          `Bearer ${res.data.access}`;

        return API(originalRequest);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;