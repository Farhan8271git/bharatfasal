import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";

import mandiRoutes from "./routes/mandi.routes.js";
import authRoutes from "./routes/auth.routes.js";
import verificationRoutes from "./routes/verifications.routes.js";

import connectDB from "./config/db.js";

const app = express();
app.use((req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    console.log(
      `${req.method} ${req.originalUrl} \x1b[32m${res.statusCode}\x1b[0m \x1b[32m${duration}ms\x1b[0m`
    );
  });

  next();
});

const PORT = process.env.PORT || 5000;

// MIDDLEWARE

app.use(cors());

app.use(express.json());

// ROUTES

app.use("/api/auth", authRoutes);

app.use("/api/mandi-prices", mandiRoutes);

app.use("/api/verifications", verificationRoutes);


app.use((err, req, res, next) => {
  console.error("Global error:", err);

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

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