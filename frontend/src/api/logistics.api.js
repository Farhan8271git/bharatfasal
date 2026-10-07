import { apiRequest } from "./client";

export const getWarehouses = async ({
  district,
  state,
  page = 1,
  limit = 20,
} = {}) => {
  const searchParams = new URLSearchParams();

  if (district) {
    searchParams.set("district", district);
  }

  if (state) {
    searchParams.set("state", state);
  }

  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));

  return apiRequest(
    `/logistics/warehouses?${searchParams.toString()}`,
    {
      method: "GET",
      auth: true,
    }
  );
};

export const getTransportProviders = async ({
  page = 1,
  limit = 20,
} = {}) => {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));

  return apiRequest(
    `/logistics/transport?${searchParams.toString()}`,
    {
      method: "GET",
      auth: true,
    }
  );
};

export const createLogisticsBooking = async (
  payload
) => {
  return apiRequest("/logistics/bookings", {
    method: "POST",
    auth: true,
    body: payload,
  });
};

export const getMyLogisticsBookings = async ({
  page = 1,
  limit = 20,
} = {}) => {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));

  return apiRequest(
    `/logistics/bookings/my?${searchParams.toString()}`,
    {
      method: "GET",
      auth: true,
    }
  );
};

export const getLogisticsBookingById = async (
  bookingId
) => {
  if (!bookingId) {
    throw new Error("Booking ID is required.");
  }

  return apiRequest(
    `/logistics/bookings/${encodeURIComponent(
      bookingId
    )}`,
    {
      method: "GET",
      auth: true,
    }
  );
};