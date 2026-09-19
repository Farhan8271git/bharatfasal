import { apiRequest } from "./client";

export const createBuyerRating = async ({
  orderId,
  rating,
  review = "",
}) => {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  return apiRequest("/ratings", {
    method: "POST",
    auth: true,
    body: {
      orderId,
      rating,
      review,
    },
  });
};

export const getBuyerRating = async () => {
  return apiRequest("/ratings/summary", {
    method: "GET",
    auth: true,
  });
};

export const getBuyerRatings = async ({
  page = 1,
  limit = 10,
} = {}) => {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));

  return apiRequest(
    `/ratings?${searchParams.toString()}`,
    {
      method: "GET",
      auth: true,
    }
  );
};

export const getRatingByOrder = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  return apiRequest(
    `/ratings/order/${encodeURIComponent(orderId)}`,
    {
      method: "GET",
      auth: true,
    }
  );
};