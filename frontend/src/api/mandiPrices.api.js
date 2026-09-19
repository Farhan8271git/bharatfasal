import { apiRequest } from "./client";

export const getMandiPrices = async () => {
  return apiRequest("/mandi-prices", {
    method: "GET",
    auth: false,
  });
};