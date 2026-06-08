import API from "../api/axios";

const getEquipmentReviews = (
  equipmentId
) =>
  API.get(
    `/reviews/equipment/${equipmentId}/reviews/`
  );

const createReview = (
  bookingId,
  data
) =>
  API.post(
    `/reviews/bookings/${bookingId}/review/`,
    data
  );

export default {
  getEquipmentReviews,
  createReview,
};