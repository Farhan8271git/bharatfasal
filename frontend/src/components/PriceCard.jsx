import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

// ==========================================
// LOCAL IMAGES FOR COMMON CROPS
// ==========================================

const localCropImages = {
  wheat: "/images/crops/wheat.jpg",

  rice: "/images/crops/rice.jpg",
  paddy: "/images/crops/rice.jpg",

  tomato: "/images/crops/tomato.jpeg",

  cotton: "/images/crops/cotton.jpg",

  chickpea: "/images/crops/chickpea.jpg",
  chana: "/images/crops/chickpea.jpg",

  turmeric: "/images/crops/turmeric.jpeg",

  soybean: "/images/crops/default.jpg",
  soyabean: "/images/crops/default.jpg",
};


// ==========================================
// PRICE CARD
// ==========================================

export default function PriceCard({ price }) {

  // ========================================
  // COMMODITY
  // ========================================

  const commodity =
    price?.commodity ||
    price?.Commodity ||
    price?.crop ||
    price?.Crop ||
    "Crop";


  // ========================================
  // MARKET
  // ========================================

  const market =
    price?.market ||
    price?.Market ||
    price?.market_name ||
    price?.Market_Name ||
    "";


  // ========================================
  // STATE
  // ========================================

  const state =
    price?.state ||
    price?.State ||
    "";


  // ========================================
  // PRICE
  // ========================================

  const modalPrice = Number(
    price?.modal_price ||
      price?.Modal_Price ||
      price?.modalPrice ||
      price?.price ||
      price?.Price ||
      0
  );


  // ========================================
  // MIN PRICE
  // ========================================

  const minPrice = Number(
    price?.min_price ||
      price?.Min_Price ||
      price?.minPrice ||
      0
  );


  // ========================================
  // MAX PRICE
  // ========================================

  const maxPrice = Number(
    price?.max_price ||
      price?.Max_Price ||
      price?.maxPrice ||
      0
  );


  // ========================================
  // PRICE CHANGE
  // ========================================

  const change = Number(
    price?.change || 0
  );


  const ChangeIcon =
    change > 0
      ? TrendingUp
      : change < 0
      ? TrendingDown
      : Minus;


  // ========================================
  // NORMALIZE CROP NAME
  // ========================================

  const commodityKey = String(
    commodity || ""
  )
    .toLowerCase()
    .trim();


  // ========================================
  // CHECK LOCAL IMAGE
  // ========================================

  const localImage =
    localCropImages[commodityKey] || null;


  // ========================================
  // IMAGE STATE
  // ========================================

  const [image, setImage] = useState(
    localImage ||
      "/images/crops/default.jpg"
  );

  const [imageLoading, setImageLoading] =
    useState(!localImage);


  // ========================================
  // IMAGE LOADING
  // ========================================

  useEffect(() => {

    let cancelled = false;


    // ----------------------------------------
    // COMMON CROP
    // ----------------------------------------

    if (localImage) {

      setImage(localImage);
      setImageLoading(false);

      return;
    }


    // ----------------------------------------
    // UNKNOWN CROP
    // USE DYNAMIC API
    // ----------------------------------------

    const fetchCropImage = async () => {

      try {

        setImageLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/crop-image?crop=${encodeURIComponent(
            commodity
          )}`
        );


        if (!response.ok) {
          throw new Error(
            `Image API error: ${response.status}`
          );
        }


        const data =
          await response.json();


        console.log(
          "Dynamic crop image:",
          commodity,
          data
        );


        if (
          !cancelled &&
          data?.success &&
          data?.image
        ) {

          setImage(data.image);

        } else if (!cancelled) {

          setImage(
            "/images/crops/default.jpg"
          );

        }

      } catch (error) {

        console.error(
          `Image loading failed for ${commodity}:`,
          error
        );


        if (!cancelled) {

          setImage(
            "/images/crops/default.jpg"
          );

        }

      } finally {

        if (!cancelled) {
          setImageLoading(false);
        }

      }
    };


    if (
      commodity &&
      commodity !== "Crop"
    ) {

      fetchCropImage();

    } else {

      setImageLoading(false);

    }


    return () => {
      cancelled = true;
    };

  }, [commodity, localImage]);


  // ========================================
  // IMAGE ERROR
  // ========================================

  const handleImageError = (event) => {

    // Prevent infinite error loop
    event.currentTarget.onerror = null;

    event.currentTarget.src =
      "/images/crops/default.jpg";

  };


  // ========================================
  // UI
  // ========================================

  return (

    <div
      className="
        w-[250px]
        sm:w-[270px]
        flex-shrink-0
        bg-white
        border
        border-gray-200
        rounded-2xl
        overflow-hidden
        shadow-sm
        hover:shadow-md
        transition-all
        duration-200
      "
    >

      {/* ====================================
          CROP IMAGE
          ==================================== */}

      <div
        className="
          h-32
          w-full
          overflow-hidden
          bg-gray-100
        "
      >

        {imageLoading ? (

          <div
            className="
              w-full
              h-full
              animate-pulse
              bg-gray-200
            "
          />

        ) : (

          <img
            src={image}
            alt={commodity}
            onError={handleImageError}
            className="
              block
              w-full
              h-full
              object-cover
              transition-transform
              duration-300
              hover:scale-105
            "
          />

        )}

      </div>


      {/* ====================================
          CARD CONTENT
          ==================================== */}

      <div className="p-4">


        {/* CROP + MARKET */}

        <div className="mb-4">

          <h4
            className="
              text-base
              font-bold
              text-gray-900
              truncate
            "
          >
            {commodity}
          </h4>


          <p
            className="
              text-xs
              text-gray-500
              mt-1
              truncate
            "
          >
            {market}

            {state
              ? `, ${state}`
              : ""}
          </p>

        </div>


        {/* PRICE */}

        <div
          className="
            flex
            items-end
            justify-between
            gap-3
          "
        >

          <div>

            <p
              className="
                text-xl
                font-bold
                text-primary-700
              "
            >
              ₹
              {modalPrice.toLocaleString(
                "en-IN"
              )}
            </p>


            <p
              className="
                text-xs
                text-gray-500
                mt-1
              "
            >
              Modal price / quintal
            </p>

          </div>


          {/* PRICE CHANGE */}

          {change !== 0 && (

            <div
              className={`
                flex
                items-center
                gap-1
                text-sm
                font-semibold
                ${
                  change > 0
                    ? "text-green-600"
                    : "text-red-500"
                }
              `}
            >

              <ChangeIcon size={16} />

              <span>
                {Math.abs(change).toFixed(1)}%
              </span>

            </div>

          )}

        </div>


        {/* MIN / MAX */}

        {(minPrice > 0 ||
          maxPrice > 0) && (

          <div
            className="
              flex
              items-center
              justify-between
              mt-4
              pt-3
              border-t
              border-gray-100
              text-xs
            "
          >

            {/* MIN */}

            <div>

              <span className="text-gray-400">
                Min
              </span>

              <p
                className="
                  font-semibold
                  text-gray-700
                  mt-0.5
                "
              >
                ₹
                {minPrice.toLocaleString(
                  "en-IN"
                )}
              </p>

            </div>


            {/* MAX */}

            <div className="text-right">

              <span className="text-gray-400">
                Max
              </span>

              <p
                className="
                  font-semibold
                  text-gray-700
                  mt-0.5
                "
              >
                ₹
                {maxPrice.toLocaleString(
                  "en-IN"
                )}
              </p>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}