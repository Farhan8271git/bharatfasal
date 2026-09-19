import { SETTINGS_STORAGE_KEYS } from "../constants/settings.constants.js";

const VERIFICATION_KEY = SETTINGS_STORAGE_KEYS.VERIFICATION;
const PROFILE_KEY = SETTINGS_STORAGE_KEYS.PROFILE;

export const getStoredVerification = (user) => {
  try {
    const requests = JSON.parse(
      localStorage.getItem(VERIFICATION_KEY) || "[]",
    );

    if (!Array.isArray(requests)) {
      return null;
    }

    return (
      requests.find(
        (item) =>
          item.userId === user?.id || item.phone === user?.phone,
      ) || null
    );
  } catch {
    return null;
  }
};

export const getStoredProfile = (user) => {
  try {
    const profiles = JSON.parse(
      localStorage.getItem(PROFILE_KEY) || "{}",
    );

    return profiles[user?.id] || {};
  } catch {
    return {};
  }
};

export const saveProfile = (userId, profile) => {
  try {
    const profiles = JSON.parse(
      localStorage.getItem(PROFILE_KEY) || "{}",
    );

    profiles[userId] = profile;

    localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error("Unable to save profile", error);
  }
};

export const saveVerification = (request) => {
  try {
    const existing = JSON.parse(
      localStorage.getItem(VERIFICATION_KEY) || "[]",
    );

    const requests = Array.isArray(existing) ? existing : [];

    const existingIndex = requests.findIndex(
      (item) =>
        item.userId === request.userId ||
        item.phone === request.phone,
    );

    if (existingIndex >= 0) {
      requests[existingIndex] = {
        ...requests[existingIndex],
        ...request,
        id: requests[existingIndex].id || request.id,
      };
    } else {
      requests.push(request);
    }

    localStorage.setItem(
      VERIFICATION_KEY,
      JSON.stringify(requests),
    );

    return request;
  } catch (error) {
    console.error("Unable to save verification", error);
    return null;
  }
};

export const VERIFICATION_STORAGE_KEY =
  SETTINGS_STORAGE_KEYS.VERIFICATION;
