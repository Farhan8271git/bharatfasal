import { apiRequest } from "./client";

export const getMyDisputes = async ({
  status,
  page = 1,
  limit = 20,
} = {}) => {
  const searchParams = new URLSearchParams();

  if (status) {
    searchParams.set("status", status);
  }

  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));

  return apiRequest(
    `/disputes/my?${searchParams.toString()}`,
    {
      method: "GET",
      auth: true,
    }
  );
};

export const createDispute = async ({
  orderId,
  type,
  description,
}) => {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  if (!type) {
    throw new Error("Dispute type is required.");
  }

  if (!description?.trim()) {
    throw new Error(
      "Dispute description is required."
    );
  }

  return apiRequest("/disputes", {
    method: "POST",
    auth: true,
    body: {
      orderId,
      type,
      description: description.trim(),
    },
  });
};

export const getDisputeById = async (
  disputeId
) => {
  if (!disputeId) {
    throw new Error("Dispute ID is required.");
  }

  return apiRequest(
    `/disputes/${encodeURIComponent(disputeId)}`,
    {
      method: "GET",
      auth: true,
    }
  );
};