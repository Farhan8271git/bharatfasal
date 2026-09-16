import { apiRequest } from "./client";

export const getMyVerification = async () => {
  return apiRequest("/verifications/me", {
    method: "GET",
    auth: true,
  });
};

export const submitBuyerVerification = async (payload) => {
  return apiRequest("/verifications/buyer", {
    method: "POST",
    auth: true,
    body: payload,
  });
};