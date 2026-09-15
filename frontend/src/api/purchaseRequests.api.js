import { apiRequest } from "./client";

export const createPurchaseRequest = async ({
  lotId,
  quantity,
}) => {
  return apiRequest("/purchase-requests", {
    method: "POST",
    auth: true,
    body: {
      lotId,
      quantity: Number(quantity),
    },
  });
};

export const getBuyerPurchaseRequests = async ({
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

  const queryString = searchParams.toString();

  return apiRequest(`/purchase-requests/buyer?${queryString}`, {
    method: "GET",
    auth: true,
  });
};

export const getSellerPurchaseRequests = async ({
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

  const queryString = searchParams.toString();

  return apiRequest(`/purchase-requests/seller?${queryString}`, {
    method: "GET",
    auth: true,
  });
};

export const getPurchaseRequestById = async (requestId) => {
  return apiRequest(
    `/purchase-requests/${encodeURIComponent(requestId)}`,
    {
      method: "GET",
      auth: true,
    }
  );
};