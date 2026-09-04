const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const api = {
  // fetch mandi prices
  getMandiPrices: async () => {
    const response = await fetch(
      `${API_BASE_URL}/mandi-prices`
    );

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(
        data?.message || "Failed to fetch mandi prices"
      );

      error.status = response.status;
      error.details = data?.details;

      throw error;
    }

    return data;
  },

  // fetch crop image
  getCropImage: async (crop) => {
    const response = await fetch(
      `${API_BASE_URL}/crop-image?crop=${encodeURIComponent(crop)}`
    );

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(
        data?.message || "Failed to fetch crop image"
      );

      error.status = response.status;
      error.details = data?.details;

      throw error;
    }

    return data;
  },
};