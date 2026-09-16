import { apiRequest } from "./client";

export const getBuyerOrders = async (params = {}) => {
  const searchParams = new URLSearchParams();

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();

  return apiRequest(`/orders/buyer${query ? `?${query}` : ""}`);
};

export const getSellerOrders = async (params = {}) => {
  const searchParams = new URLSearchParams();

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();

  return apiRequest(`/orders/seller${query ? `?${query}` : ""}`);
};

export const getOrderById = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  return apiRequest(`/orders/${encodeURIComponent(orderId)}`);
};