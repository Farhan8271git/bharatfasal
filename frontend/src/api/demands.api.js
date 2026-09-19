import { apiRequest } from "./client";

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
};

export const createDemand = async (payload) => {
  return apiRequest("/demands", {
    method: "POST",
    auth: true,
    body: payload,
  });
};

export const getMyDemands = async ({
  status,
  page = 1,
  limit = 20,
} = {}) => {
  const queryString = buildQueryString({
    status,
    page,
    limit,
  });

  return apiRequest(`/demands/my${queryString}`, {
    method: "GET",
    auth: true,
  });
};

export const getDemandById = async (demandId) => {
  if (!demandId) {
    throw new Error("Demand ID is required.");
  }

  return apiRequest(
    `/demands/${encodeURIComponent(demandId)}`,
    {
      method: "GET",
      auth: true,
    }
  );
};

export const cancelDemand = async (demandId) => {
  if (!demandId) {
    throw new Error("Demand ID is required.");
  }

  return apiRequest(
    `/demands/${encodeURIComponent(demandId)}`,
    {
      method: "DELETE",
      auth: true,
    }
  );
};

export const getMarketDemands = async ({
  status = "active",
  page = 1,
  limit = 20,
} = {}) => {
  const queryString = buildQueryString({
    status,
    page,
    limit,
  });

  return apiRequest(`/demands/market${queryString}`, {
    method: "GET",
    auth: true,
  });
};