import API from "../api/axios";

const getMyBookings = async () => {
  const res = await API.get("/bookings/");
  return res.data;
};

const createBooking = async (data) => {
  const res = await API.post("/bookings/", data);
  return res.data;
};

// ACTIONS
const approveBooking = (id) =>
  API.patch(`/bookings/${id}/approve/`);

const rejectBooking = (id) =>
  API.patch(`/bookings/${id}/reject/`);

const requestReturn = (id) =>
  API.patch(`/bookings/${id}/request-return/`);

const returnBooking = (id) =>
  API.patch(`/bookings/${id}/return/`);

const getOwnerBookings = async () => {
  const res = await API.get("/bookings/?role=owner");
  return res.data;
};

const handOverBooking = (id) =>
  API.patch(`/bookings/${id}/handover/`);

const confirmReturn = async (id) => {
  return API.patch(`/bookings/${id}/confirm/`);
};

const getAnalytics = async () => {
  const response = await API.get(
    "/bookings/analytics/"
  );

  return response.data;
};

export default {
  getMyBookings,
  createBooking,
  approveBooking,
  rejectBooking,
  requestReturn,
  returnBooking,
  getOwnerBookings,
  confirmReturn,
  handOverBooking,
  getAnalytics,
};