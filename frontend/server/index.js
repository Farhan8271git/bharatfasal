import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const DATA_GOV_API_KEY = process.env.DATA_GOV_API_KEY;

const MANDI_RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";

const MANDI_API_URL = `https://api.data.gov.in/resource/${MANDI_RESOURCE_ID}`;

/* =====================================================
   CORS
===================================================== */

app.use(
  cors({
    origin: true,
    credentials: false,
  }),
);

app.use(express.json());

/* =====================================================
   PERSISTENT MANDI CACHE
===================================================== */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_FILE = path.join(__dirname, "mandi-cache.json");

/*
  Mandi data is not fetched on every frontend request.

  Fresh cache duration:
  6 hours

  This prevents unnecessary Government API requests.
*/
const CACHE_DURATION = 6 * 60 * 60 * 1000;

/*
  If Government API returns 429,
  don't immediately keep retrying.

  Wait 30 minutes before another attempt.
*/
const GOVERNMENT_API_COOLDOWN = 30 * 60 * 1000;

/*
  In-memory copy of persistent cache.
*/
let mandiCache = null;

let mandiCacheTime = 0;

/*
  Prevent multiple users from creating
  multiple Government API requests at
  exactly the same time.
*/
let mandiFetchPromise = null;

/*
  Timestamp until which Government API
  should not be called.
*/
let governmentApiBlockedUntil = 0;

/* =====================================================
   DEMO FALLBACK
===================================================== */

/*
  LAST RESORT ONLY.

  If:
  - Government API is unavailable
  - 429 is returned
  - persistent cache does not exist

  then prototype can still show the last
  known mandi values instead of a blank screen.

  These are fallback values only.
*/

const DEMO_FALLBACK_RECORDS = [
  {
    state: "Haryana",
    district: "Kurukshetra",
    market: "Shahabad APMC",
    commodity: "Orange",
    variety: "Orange",
    grade: "",
    arrivalDate: "04/09/2026",
    minPrice: 10000,
    maxPrice: 10000,
    modalPrice: 10000,
  },

  {
    state: "Punjab",
    district: "Ludhiana",
    market: "Madlauda APMC",
    commodity: "Potato",
    variety: "Potato",
    grade: "",
    arrivalDate: "04/09/2026",
    minPrice: 800,
    maxPrice: 800,
    modalPrice: 800,
  },

  {
    state: "Punjab",
    district: "Gurdaspur",
    market: "Batala APMC",
    commodity: "Bhindi(Ladies Finger)",
    variety: "Other",
    grade: "",
    arrivalDate: "04/09/2026",
    minPrice: 4000,
    maxPrice: 4500,
    modalPrice: 4200,
  },

  {
    state: "Haryana",
    district: "Ambala",
    market: "Radaur APMC",
    commodity: "Cucumber(Kheera)",
    variety: "Other",
    grade: "",
    arrivalDate: "04/09/2026",
    minPrice: 2500,
    maxPrice: 3000,
    modalPrice: 2800,
  },
];

/* =====================================================
   CACHE HELPERS
===================================================== */

async function loadMandiCache() {
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf-8");

    const cached = JSON.parse(raw);

    if (cached && Array.isArray(cached.records) && cached.records.length > 0) {
  cached.records = cached.records.map((record) => {
    const minPrice = toNumber(record.min_price ?? record.minPrice);
    const maxPrice = toNumber(record.max_price ?? record.maxPrice);
    const modalPrice = toNumber(record.modal_price ?? record.modalPrice);

    return {
      ...record,
      minPrice,
      maxPrice,
      modalPrice,
      min_price: minPrice,
      max_price: maxPrice,
      modal_price: modalPrice,
    };
  });

  mandiCache = cached;

  mandiCacheTime = Number(cached.cacheTime) || 0;

  console.log(`Loaded mandi cache: ${cached.records.length} records`);

  return cached;
}

    console.log("Mandi cache file exists but contains no records.");

    return null;
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(
        "No mandi cache found. First successful Government API response will create it.",
      );
    } else {
      console.error("Unable to load mandi cache:", error.message);
    }

    return null;
  }
}

async function saveMandiCache(data) {
  try {
    const cacheData = {
      ...data,
      cacheTime: Date.now(),
    };

    await fs.writeFile(CACHE_FILE, JSON.stringify(cacheData, null, 2), "utf-8");

    mandiCache = cacheData;

    mandiCacheTime = cacheData.cacheTime;

    console.log(`Mandi cache saved: ${cacheData.records.length} records`);
  } catch (error) {
    console.error("Unable to save mandi cache:", error.message);

    /*
      Even if disk write fails,
      keep memory cache available.
    */

    mandiCache = data;

    mandiCacheTime = Date.now();
  }
}

/* =====================================================
   HELPERS
===================================================== */

function cleanCropName(crop) {
  return String(crop || "")
    .replace(/\([^)]*\)/g, "")
    .replace(/[-_/]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function toNumber(value) {
  const number = Number(String(value || "").replace(/,/g, ""));

  return Number.isFinite(number) ? number : null;
}
function normalizeMandiRecord(record) {
  const minPrice = toNumber(record.min_price);
  const maxPrice = toNumber(record.max_price);
  const modalPrice = toNumber(record.modal_price);

  return {
    // Existing fields — SAME
    state: record.state || "",
    district: record.district || "",
    market: record.market || "",
    commodity: record.commodity || "",
    variety: record.variety || "",
    grade: record.grade || "",
    arrivalDate: record.arrival_date || "",
    minPrice,
    maxPrice,
    modalPrice,

    // Compatibility fields for existing frontend
    min_price: minPrice,
    max_price: maxPrice,
    modal_price: modalPrice,
  };
}

/* =====================================================
   REQUEST WITH TIMEOUT
===================================================== */

async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

/* =====================================================
   LOCAL CROP IMAGE MAP
===================================================== */

const cropImageCache = new Map();

function getLocalCropImage(crop) {
  const name = cleanCropName(crop);

  const imageMap = {
  wheat: "/images/crops/wheat.jpg",
  rice: "/images/crops/rice.jpg",
  paddy: "/images/crops/rice.jpg",
  maize: "/images/crops/maize.jpg",
  corn: "/images/crops/maize.jpg",
  onion: "/images/crops/onion.jpg",
  tomato: "/images/crops/tomato.jpeg",
  chilli: "/images/crops/chilli.jpg",
  "green chilli": "/images/crops/chilli.jpg",
  pumpkin: "/images/crops/pumpkin.jpg",
  banana: "/images/crops/banana.jpg",
  potato: "/images/crops/potato.jpg",
  carrot: "/images/crops/carrot.jpg",
  cucumber: "/images/crops/cucumber.jpg",
  soybean: "/images/crops/soybean.jpg",
  cotton: "/images/crops/cotton.jpg",
  chickpea: "/images/crops/chickpea.jpg",
};

  for (const [key, image] of Object.entries(imageMap)) {
    if (name.includes(key)) {
      return image;
    }
  }

  return "/images/crops/default.jpg";
}

/* =====================================================
   CROP IMAGE API
===================================================== */

app.get("/api/crop-image", async (req, res) => {
  try {
    const crop = String(req.query.crop || "").trim();

    if (!crop) {
      return res.status(400).json({
        success: false,
        message: "Crop name is required",
      });
    }

    const cacheKey = cleanCropName(crop);

    /* -----------------------------------------------
         CROP IMAGE MEMORY CACHE
      ------------------------------------------------ */

    if (cropImageCache.has(cacheKey)) {
      return res.json({
        success: true,
        crop,
        image: cropImageCache.get(cacheKey),
        source: "cache",
      });
    }

    /* -----------------------------------------------
         LOCAL IMAGE
      ------------------------------------------------ */

    const localImage = getLocalCropImage(crop);

    if (localImage !== "/images/crops/default.jpg") {
      cropImageCache.set(cacheKey, localImage);

      return res.json({
        success: true,
        crop,
        image: localImage,
        source: "local",
      });
    }

    /* -----------------------------------------------
         WIKIMEDIA FALLBACK
      ------------------------------------------------ */

    const searchQuery = encodeURIComponent(`${crop} crop agriculture`);

    const wikiUrl =
      "https://commons.wikimedia.org/w/api.php" +
      `?action=query` +
      `&generator=search` +
      `&gsrsearch=${searchQuery}` +
      `&gsrnamespace=6` +
      `&gsrlimit=5` +
      `&prop=imageinfo` +
      `&iiprop=url` +
      `&iiurlwidth=600` +
      `&format=json` +
      `&origin=*`;

    const response = await fetchWithTimeout(wikiUrl, {}, 8000);

    if (response.ok) {
      const data = await response.json();

      const pages = data?.query?.pages ? Object.values(data.query.pages) : [];

      const imagePage = pages.find(
        (page) => page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url,
      );

      const imageUrl =
        imagePage?.imageinfo?.[0]?.thumburl || imagePage?.imageinfo?.[0]?.url;

      if (imageUrl) {
        cropImageCache.set(cacheKey, imageUrl);

        return res.json({
          success: true,
          crop,
          image: imageUrl,
          source: "wikimedia",
        });
      }
    }

    /* -----------------------------------------------
         DEFAULT IMAGE
      ------------------------------------------------ */

    const fallback = "/images/crops/default.jpg";

    cropImageCache.set(cacheKey, fallback);

    return res.json({
      success: true,
      crop,
      image: fallback,
      source: "fallback",
    });
  } catch (error) {
    console.error("Crop image error:", error.message);

    return res.json({
      success: true,
      crop: req.query.crop || "",
      image: "/images/crops/default.jpg",
      source: "fallback",
    });
  }
});

/* =====================================================
   FETCH FRESH GOVERNMENT MANDI DATA
===================================================== */

async function fetchFreshMandiData(limit = 50) {
  const params = new URLSearchParams();

  params.set("api-key", DATA_GOV_API_KEY);

  params.set("format", "json");

  params.set("offset", "0");

  /*
    Fetch more records once and cache them.

    Frontend can then request 4, 10, 20 etc.
    without hitting Government API again.
  */

  params.set("limit", String(limit));

  const apiUrl = `${MANDI_API_URL}?${params.toString()}`;

  console.log("======================================");

  console.log("Calling Government Mandi API...");

  console.log("======================================");

  const response = await fetchWithTimeout(
    apiUrl,
    {
      headers: {
        Accept: "application/json",
      },
    },
    10000,
  );

  const text = await response.text();

  console.log("Government API status:", response.status);

  /* -----------------------------------------------
     GOVERNMENT API ERROR
  ------------------------------------------------ */

  if (!response.ok) {
    console.error("Government API error:", response.status, text);

    /*
      429 = Too Many Requests
    */

    if (response.status === 429) {
      governmentApiBlockedUntil = Date.now() + GOVERNMENT_API_COOLDOWN;

      console.log("Government API returned 429.");

      console.log("Government API retry disabled for 30 minutes.");
    }

    /*
      Use existing cache if available.
    */

    if (mandiCache?.records?.length) {
      console.log("Serving last known mandi cache.");

      return {
        ...mandiCache,
        cached: true,
        stale: true,
      };
    }

    /*
      No cache exists.
      Throw error so route can use
      demo fallback.
    */

    throw new Error(`Government API returned status ${response.status}`);
  }

  /* -----------------------------------------------
     PARSE RESPONSE
  ------------------------------------------------ */

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Government API returned invalid JSON");
  }

  if (!Array.isArray(data?.records)) {
    throw new Error("Government API returned no records");
  }

  /* -----------------------------------------------
     NORMALIZE DATA
  ------------------------------------------------ */

  const records = data.records
    .map(normalizeMandiRecord)
    .filter(
      (record) =>
        record.commodity && record.market && record.modalPrice !== null,
    );

  if (!records.length) {
    throw new Error("Government API returned no usable mandi records");
  }

  /* -----------------------------------------------
     CREATE RESULT
  ------------------------------------------------ */

  const result = {
    success: true,

    source: "Government of India - data.gov.in / AGMARKNET",

    resourceId: MANDI_RESOURCE_ID,

    fetchedAt: new Date().toISOString(),

    count: records.length,

    records,
  };

  /* -----------------------------------------------
     SAVE TO PERSISTENT CACHE
  ------------------------------------------------ */

  await saveMandiCache(result);

  console.log(`Fresh mandi data saved: ${records.length} records`);

  return result;
}

/* =====================================================
   MANDI PRICES API
===================================================== */

app.get("/api/mandi-prices", async (req, res) => {
  try {
    /* -----------------------------------------------
         API KEY CHECK
      ------------------------------------------------ */

    if (!DATA_GOV_API_KEY) {
      console.error("DATA_GOV_API_KEY is missing.");

      return res.status(500).json({
        success: false,
        message: "Mandi API is not configured.",
      });
    }

    /* -----------------------------------------------
         REQUEST LIMIT
      ------------------------------------------------ */

    const requestedLimit = Number(req.query.limit || 20);

    const limit = Math.min(Math.max(requestedLimit, 1), 100);

    /* -----------------------------------------------
         FRESH CACHE
      ------------------------------------------------ */

    if (
      mandiCache &&
      Array.isArray(mandiCache.records) &&
      mandiCache.records.length > 0 &&
      Date.now() - mandiCacheTime < CACHE_DURATION
    ) {
      console.log("Returning fresh cached mandi data.");

      return res.json({
        ...mandiCache,

        records: mandiCache.records.slice(0, limit),

        count: Math.min(limit, mandiCache.records.length),

        cached: true,

        stale: false,
      });
    }

    /* -----------------------------------------------
         GOVERNMENT API COOLDOWN
      ------------------------------------------------ */

    if (Date.now() < governmentApiBlockedUntil) {
      console.log("Government API is in cooldown.");

      /*
          Return persistent cache
          if available.
        */

      if (mandiCache?.records?.length) {
        return res.json({
          ...mandiCache,

          records: mandiCache.records.slice(0, limit),

          count: Math.min(limit, mandiCache.records.length),

          cached: true,

          stale: true,
        });
      }

      /*
          No cache.
          Use demo fallback.
        */

      console.log("No cache available. Serving demo fallback data.");

      return res.json({
        success: true,

        source: "Bharat Fasal fallback data",

        resourceId: MANDI_RESOURCE_ID,

        fetchedAt: new Date().toISOString(),

        count: Math.min(limit, DEMO_FALLBACK_RECORDS.length),

        records: DEMO_FALLBACK_RECORDS.slice(0, limit),

        cached: true,

        stale: true,

        fallback: true,
      });
    }

    /* -----------------------------------------------
         PREVENT DUPLICATE GOVERNMENT API CALLS
      ------------------------------------------------ */

    if (!mandiFetchPromise) {
      mandiFetchPromise = fetchFreshMandiData(50);
    }

    try {
      const result = await mandiFetchPromise;

      return res.json({
        ...result,

        records: result.records.slice(0, limit),

        count: Math.min(limit, result.records.length),

        cached: result.cached ?? false,

        stale: result.stale ?? false,
      });
    } finally {
      mandiFetchPromise = null;
    }
  } catch (error) {
    console.error("Mandi API route error:", error.message);

    /* -----------------------------------------------
         STALE CACHE FALLBACK
      ------------------------------------------------ */

    if (mandiCache?.records?.length) {
      console.log("Returning stale persistent mandi cache.");

      const requestedLimit = Number(req.query.limit || 20);

      const limit = Math.min(Math.max(requestedLimit, 1), 100);

      return res.json({
        ...mandiCache,

        records: mandiCache.records.slice(0, limit),

        count: Math.min(limit, mandiCache.records.length),

        cached: true,

        stale: true,
      });
    }

    /* -----------------------------------------------
         FINAL DEMO FALLBACK
      ------------------------------------------------ */

    console.log("No persistent cache available.");

    console.log("Serving final demo fallback data.");

    const requestedLimit = Number(req.query.limit || 20);

    const limit = Math.min(Math.max(requestedLimit, 1), 100);

    return res.json({
      success: true,

      source: "Bharat Fasal fallback data",

      resourceId: MANDI_RESOURCE_ID,

      fetchedAt: new Date().toISOString(),

      count: Math.min(limit, DEMO_FALLBACK_RECORDS.length),

      records: DEMO_FALLBACK_RECORDS.slice(0, limit),

      cached: true,

      stale: true,

      fallback: true,
    });
  }
});

/* =====================================================
   HEALTH CHECK
===================================================== */

app.get("/", (req, res) => {
  res.json({
    success: true,

    message: "Bharat Fasal API is running 🌾",

    services: {
      mandiPrices: "/api/mandi-prices",

      cropImage: "/api/crop-image",
    },

    mandiCache: {
      available: Boolean(mandiCache?.records?.length),

      records: mandiCache?.records?.length || 0,

      stale: mandiCache ? Date.now() - mandiCacheTime >= CACHE_DURATION : true,
    },
  });
});

/* =====================================================
   START SERVER
===================================================== */

async function startServer() {
  /*
    Load persistent mandi cache
    before starting server.
  */

  await loadMandiCache();

  app.listen(PORT, () => {
    console.log("======================================");

    console.log(`🌾 Bharat Fasal API running on http://localhost:${PORT}`);

    console.log(`📊 Mandi API: http://localhost:${PORT}/api/mandi-prices`);

    console.log("======================================");
  });
}

startServer();
