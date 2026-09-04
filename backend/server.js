import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mandiRoutes from "./routes/mandi.routes.js";
import authRoutes from "./routes/auth.routes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = 5000;

// MIDDLEWARE

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);


// ROUTES
app.use("/api/mandi-prices", mandiRoutes);

// Mandi API cache
let mandiCache = null;
let mandiCacheTime = 0;

const CACHE_DURATION = 10 * 60 * 1000;

// Crop image cache
const cropImageCache = new Map();

// HELPER - CLEAN CROP NAME

function cleanCropName(crop) {
  return String(crop || "")
    .replace(/\([^)]*\)/g, "")
    .replace(/[-_/]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
// LOCAL CROP IMAGE MAP

function getLocalCropImage(crop) {
  const name = cleanCropName(crop);

  const imageMap = {
    wheat: "/images/crops/wheat.jpg",
    rice: "/images/crops/rice.jpg",
    paddy: "/images/crops/rice.jpg",
    tomato: "/images/crops/tomato.jpeg",
    cotton: "/images/crops/cotton.jpg",
    chickpea: "/images/crops/chickpea.jpg",
    turmeric: "/images/crops/turmeric.jpeg",
  };

  for (const [key, image] of Object.entries(imageMap)) {
    if (name.includes(key)) {
      return image;
    }
  }

  return "/images/crops/default.jpg";
}

// CROP IMAGE API

app.get("/api/crop-image", async (req, res) => {
  try {
    const crop = String(req.query.crop || "").trim();

    // validate crop name
    if (!crop) {
      return res.status(400).json({
        success: false,
        message: "Crop name is required",
      });
    }

    const cacheKey = cleanCropName(crop);

    // RETURN CACHED IMAGE

    if (cropImageCache.has(cacheKey)) {
      return res.json({
        success: true,
        crop,
        image: cropImageCache.get(cacheKey),
        source: "cache",
      });
    }

    // CHECK LOCAL IMAGE FIRST

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

    // WIKIMEDIA COMMONS FALLBACK
    const searchQuery = encodeURIComponent(
      `${crop} crop agriculture`
    );

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

    const response = await fetch(wikiUrl);

    if (response.ok) {
      const data = await response.json();

      const pages = data?.query?.pages
        ? Object.values(data.query.pages)
        : [];

      const imagePage = pages.find(
        (page) =>
          page?.imageinfo?.[0]?.thumburl ||
          page?.imageinfo?.[0]?.url
      );

      const imageUrl =
        imagePage?.imageinfo?.[0]?.thumburl ||
        imagePage?.imageinfo?.[0]?.url;

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

    // DEFAULT FALLBACK

    const fallback = "/images/crops/default.jpg";

    cropImageCache.set(cacheKey, fallback);

    return res.json({
      success: true,
      crop,
      image: fallback,
      source: "fallback",
    });
  } catch (error) {
    console.error("❌ Crop image error:", error);

    return res.json({
      success: true,
      crop: req.query.crop || "",
      image: "/images/crops/default.jpg",
      source: "fallback",
    });
  }
});

// MANDI PRICES API

app.get("/api/mandi-prices", async (req, res) => {
  try {
    // RETURN CACHE

    if (
      mandiCache &&
      Date.now() - mandiCacheTime < CACHE_DURATION
    ) {
      console.log("✅ Returning cached mandi data");

      return res.json(mandiCache);
    }

    // CHECK API KEY

    const apiKey = process.env.DATA_GOV_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "DATA_GOV_API_KEY is missing in .env",
      });
    }

    // GOVERNMENT API

    const apiUrl =
      "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070" +
      `?api-key=${encodeURIComponent(apiKey)}` +
      "&format=json" +
      "&limit=20";

    console.log("🌾 Calling Government Mandi API...");

    const response = await fetch(apiUrl);
    const text = await response.text();

    console.log(
      "Government API status:",
      response.status
    );

    // GOVERNMENT API ERROR

    if (!response.ok) {
      if (mandiCache) {
        console.log(
          "⚠️ Government API unavailable. Returning old cache."
        );

        return res.json(mandiCache);
      }

      return res.status(500).json({
        success: false,
        message: "Government API request failed",
        governmentStatus: response.status,
        details: text,
      });
    }

    // PARSE GOVERNMENT RESPONSE

    const data = JSON.parse(text);

    if (!Array.isArray(data?.records)) {
      throw new Error(
        "Government API returned no records"
      );
    }


    // SAVE DATA TO CACHE

    mandiCache = data;
    mandiCacheTime = Date.now();

    console.log(
      "✅ Fresh mandi data saved:",
      data.records.length
    );

    return res.json(data);
  } catch (error) {
    console.error("❌ Mandi API error:", error);

    // CACHE FALLBACK


    if (mandiCache) {
      console.log(
        "⚠️ Returning cached mandi data after error"
      );

      return res.json(mandiCache);
    }

    return res.status(500).json({
      success: false,
      message: "Unable to fetch mandi prices",
      error: error.message,
    });
  }
});

// HOME / HEALTH

app.get("/", (req, res) => {
  res.json({
    message: "Bharat Fasal API is running 🌾",
  });
});

// CONNECT TO DATABASE
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `🌾 Bharat Fasal API running on http://localhost:${PORT}`
    );

    console.log(
      `🔐 DATA_GOV_API_KEY: ${process.env.DATA_GOV_API_KEY
        ? "loaded"
        : "missing"
      }`
    );
  });
};

startServer();