import MandiPrice from "../models/mandiPrice.model.js";

const CACHE_DURATION = 10 * 60 * 1000;

let mandiCache = null;
let mandiCacheTime = 0;

// fetch government mandi data
const fetchGovernmentPrices = async () => {
  const apiKey = process.env.DATA_GOV_API_KEY;

  if (!apiKey) {
    throw new Error("DATA_GOV_API_KEY is missing in .env");
  }

  const apiUrl =
    "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070" +
    `?api-key=${encodeURIComponent(apiKey)}` +
    "&format=json" +
    "&limit=20";

  const response = await fetch(apiUrl);
  const text = await response.text();

  if (!response.ok) {
    const error = new Error("Government API request failed");

    error.status = response.status;
    error.details = text;

    throw error;
  }

  const data = JSON.parse(text);

  if (!Array.isArray(data?.records)) {
    throw new Error("Government API returned no records");
  }

  return data;
};

// normalize government records
const normalizeRecords = (records) => {
  const normalized = records
    .map((item) => {
      const commodity =
        item?.commodity ??
        item?.Commodity ??
        item?.crop ??
        item?.Crop ??
        "";

      const market =
        item?.market ??
        item?.Market ??
        item?.market_name ??
        item?.Market_Name ??
        item?.district ??
        item?.District ??
        "";

      const state =
        item?.state ??
        item?.State ??
        "";

      const minPrice = Number(
        item?.min_price ??
        item?.Min_Price ??
        item?.["Min Price"] ??
        0
      );

      const maxPrice = Number(
        item?.max_price ??
        item?.Max_Price ??
        item?.["Max Price"] ??
        0
      );

      const modalPrice = Number(
        item?.modal_price ??
        item?.Modal_Price ??
        item?.["Modal Price"] ??
        0
      );

      return {
        commodity: String(commodity).trim(),
        market: String(market).trim(),
        state: String(state).trim(),
        min_price: minPrice,
        max_price: maxPrice,
        modal_price: modalPrice,
      };
    })
    .filter(
      (item) =>
        item.commodity &&
        item.market &&
        item.state &&
        Number.isFinite(item.min_price) &&
        Number.isFinite(item.max_price) &&
        Number.isFinite(item.modal_price) &&
        item.min_price >= 0 &&
        item.max_price >= 0 &&
        item.modal_price > 0
    );

  // remove duplicate logical records
  const uniqueRecords = new Map();

  for (const record of normalized) {
    const key = [
      record.commodity.toLowerCase(),
      record.market.toLowerCase(),
      record.state.toLowerCase(),
    ].join("|");

    uniqueRecords.set(key, record);
  }

  return [...uniqueRecords.values()];
};

// save or update mandi prices
const saveMandiPrices = async (records) => {
  if (!records.length) {
    throw new Error("No valid mandi prices available");
  }

  const operations = records.map((record) => ({
    updateOne: {
      filter: {
        commodity: record.commodity,
        market: record.market,
        state: record.state,
      },

      update: {
        $set: {
          min_price: record.min_price,
          max_price: record.max_price,
          modal_price: record.modal_price,
        },
      },

      upsert: true,
    },
  }));

  await MandiPrice.bulkWrite(operations);

  return records;
};

// get mandi prices
export const getMandiPrices = async () => {
  // return memory cache
  if (
    mandiCache &&
    Date.now() - mandiCacheTime < CACHE_DURATION
  ) {
    return {
      records: mandiCache,
    };
  }

  try {
    // fetch fresh government data
    const governmentData = await fetchGovernmentPrices();

    // normalize government records
    const records = normalizeRecords(
      governmentData.records
    );

    if (!records.length) {
      throw new Error("No valid mandi prices found");
    }

    // save latest prices
    await saveMandiPrices(records);

    // update memory cache
    mandiCache = records;
    mandiCacheTime = Date.now();

    return {
      records,
    };
  } catch (error) {
    // return existing memory cache
    if (mandiCache) {
      return {
        records: mandiCache,
      };
    }

    // fallback to MongoDB
    const databaseRecords = await MandiPrice.find()
      .select("-__v")
      .sort({ updatedAt: -1 })
      .lean();

    if (databaseRecords.length) {
      const records = databaseRecords.map(
        ({
          _id,
          createdAt,
          updatedAt,
          ...record
        }) => record
      );

      mandiCache = records;
      mandiCacheTime = Date.now();

      return {
        records,
      };
    }

    // preserve original government API error
    throw error;
  }
};