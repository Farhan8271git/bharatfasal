import { apiRequest } from "./client";

export const getRecommendedBuyers = async ({
  lotId,
  page = 1,
  limit = 10,
} = {}) => {
  if (!lotId) {
    throw new Error("Lot ID is required.");
  }

  const searchParams = new URLSearchParams();

  searchParams.set("lotId", lotId);
  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));

  return apiRequest(`/buyers/recommended?${searchParams.toString()}`, {
    method: "GET",
    auth: true,
  });
};