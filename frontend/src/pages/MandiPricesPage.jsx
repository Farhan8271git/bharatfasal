import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Wheat,
  Apple,
  Leaf,
  Sprout,
  Loader2,
  AlertCircle,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

import SearchBar from "../components/SearchBar";
import PriceCard from "../components/PriceCard";
import { api } from "../utils/api.js";

// category helper
function getCategory(commodity = "") {
  const name = commodity.toLowerCase().trim();

  // grains
  if (
    name.includes("wheat") ||
    name.includes("rice") ||
    name.includes("paddy") ||
    name.includes("maize") ||
    name.includes("corn") ||
    name.includes("bajra") ||
    name.includes("jowar") ||
    name.includes("ragi") ||
    name.includes("barley")
  ) {
    return "grains";
  }

  // vegetables
  if (
    name.includes("tomato") ||
    name.includes("potato") ||
    name.includes("onion") ||
    name.includes("brinjal") ||
    name.includes("eggplant") ||
    name.includes("cabbage") ||
    name.includes("cauliflower") ||
    name.includes("bitter gourd") ||
    name.includes("ridgeguard") ||
    name.includes("ridge gourd") ||
    name.includes("bottle gourd") ||
    name.includes("lady finger") ||
    name.includes("okra") ||
    name.includes("carrot") ||
    name.includes("peas")
  ) {
    return "vegetables";
  }

  // fruits
  if (
    name.includes("apple") ||
    name.includes("banana") ||
    name.includes("mango") ||
    name.includes("orange") ||
    name.includes("grapes") ||
    name.includes("papaya") ||
    name.includes("guava") ||
    name.includes("pomegranate") ||
    name.includes("watermelon")
  ) {
    return "fruits";
  }

  // spices
  if (
    name.includes("turmeric") ||
    name.includes("chilli") ||
    name.includes("pepper") ||
    name.includes("cumin") ||
    name.includes("coriander") ||
    name.includes("ginger") ||
    name.includes("garlic")
  ) {
    return "spices";
  }

  // oilseeds
  if (
    name.includes("soybean") ||
    name.includes("soyabean") ||
    name.includes("mustard") ||
    name.includes("groundnut") ||
    name.includes("sesamum") ||
    name.includes("sesame") ||
    name.includes("sunflower")
  ) {
    return "oilseeds";
  }

  return "other";
}

// category icons
function CategoryIcon({ category }) {
  if (category === "grains") {
    return <Wheat size={15} />;
  }

  if (category === "vegetables") {
    return <Leaf size={15} />;
  }

  if (category === "fruits") {
    return <Apple size={15} />;
  }

  return <Sprout size={15} />;
}

// normalize government mandi records
function normalizeMandiRecords(records) {
  return records
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

      const state = item?.state ?? item?.State ?? "";

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
        ...item,
        commodity: String(commodity).trim(),
        market: String(market).trim(),
        state: String(state).trim(),
        min_price: minPrice,
        max_price: maxPrice,
        modal_price: modalPrice,
        category: getCategory(commodity),
      };
    })
    .filter(
      (item) =>
        item.commodity &&
        item.modal_price > 0
    );
}

// main page
export default function MandiPricesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // page state
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // fetch mandi data from backend api
  const fetchMandiPrices = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else if (prices.length === 0) {
        setLoading(true);
      }

      setError("");

      const data = await api.getMandiPrices();

      if (!data || !Array.isArray(data.records)) {
        throw new Error("No mandi records found");
      }

      const normalized = normalizeMandiRecords(data.records);

      if (normalized.length === 0) {
        throw new Error(
          "No valid mandi prices available"
        );
      }

      setPrices(normalized);
      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      console.error("Mandi prices error:", err);

      setError(
        err?.message ||
          "Unable to load mandi prices"
      );

      // keep existing prices visible when refresh fails
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // initial load and auto refresh
  useEffect(() => {
    fetchMandiPrices();

    const interval = setInterval(() => {
      fetchMandiPrices();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // filter prices
  const filteredPrices = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return prices.filter((price) => {
      const commodity = String(
        price.commodity || ""
      ).toLowerCase();

      const market = String(
        price.market || ""
      ).toLowerCase();

      const state = String(
        price.state || ""
      ).toLowerCase();

      const matchesSearch =
        !searchText ||
        commodity.includes(searchText) ||
        market.includes(searchText) ||
        state.includes(searchText);

      const matchesCategory =
        activeCategory === "all" ||
        price.category === activeCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [prices, search, activeCategory]);

  // group prices by commodity
  const commodityGroups = useMemo(() => {
    const groups = {};

    filteredPrices.forEach((price) => {
      const name = price.commodity;

      if (!groups[name]) {
        groups[name] = [];
      }

      groups[name].push(price);
    });

    return Object.entries(groups);
  }, [filteredPrices]);

  // categories
  const categoryList = [
    {
      id: "all",
      label: "All Commodities",
    },
    {
      id: "grains",
      label: "Grains",
    },
    {
      id: "vegetables",
      label: "Vegetables",
    },
    {
      id: "fruits",
      label: "Fruits",
    },
    {
      id: "spices",
      label: "Spices",
    },
    {
      id: "oilseeds",
      label: "Oilseeds",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div
        className="
          w-full
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-6
          pb-10
        "
      >
        {/* header */}
        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            mb-6
          "
        >
          <div>
            <h1
              className="
                flex
                items-center
                gap-3
                text-2xl
                sm:text-3xl
                font-bold
                text-gray-900
              "
            >
              <span
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-100
                  text-green-700
                  shrink-0
                "
              >
                <Wheat size={21} />
              </span>

              {t("mandi_prices")}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Government mandi prices for
              agricultural commodities
            </p>
          </div>

          {/* updated time and refresh */}
          <div
            className="
              flex
              items-center
              gap-2
              self-start
              sm:self-auto
            "
          >
            {lastUpdated && (
              <div
                className="
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3
                  py-2
                  text-xs
                  text-gray-500
                "
              >
                Updated{" "}
                {lastUpdated.toLocaleTimeString(
                  "en-IN",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                fetchMandiPrices(true)
              }
              disabled={refreshing}
              title="Refresh mandi prices"
              className="
                inline-flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                border-gray-200
                bg-white
                text-gray-600
                transition
                hover:border-green-300
                hover:text-green-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </div>

        {/* search */}
        <div className="mb-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search commodity, mandi or state..."
          />
        </div>

        {/* category filters */}
        <div
          className="
            flex
            gap-2
            overflow-x-auto
            pb-2
            mb-7
            scrollbar-thin
          "
        >
          {categoryList.map((category) => {
            const active =
              activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setActiveCategory(
                    category.id
                  )
                }
                className={`
                  inline-flex
                  items-center
                  gap-1.5
                  px-4
                  py-2
                  rounded-full
                  whitespace-nowrap
                  text-sm
                  font-semibold
                  border
                  transition-all
                  duration-200
                  ${
                    active
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
                  }
                `}
              >
                <CategoryIcon
                  category={category.id}
                />

                {category.label}
              </button>
            );
          })}
        </div>

        {/* loading */}
        {loading && (
          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              py-20
              text-center
            "
          >
            <Loader2
              size={36}
              className="
                mx-auto
                animate-spin
                text-green-600
              "
            />

            <p className="mt-3 text-sm text-gray-500">
              Loading mandi prices...
            </p>
          </div>
        )}

        {/* error without existing data */}
        {!loading &&
          error &&
          prices.length === 0 && (
            <div
              className="
                rounded-2xl
                border
                border-red-200
                bg-red-50
                px-5
                py-10
                text-center
              "
            >
              <AlertCircle
                size={34}
                className="mx-auto text-red-500"
              />

              <h3
                className="
                  mt-3
                  font-semibold
                  text-red-700
                "
              >
                Unable to load mandi prices
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-red-500
                "
              >
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  fetchMandiPrices(true)
                }
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-green-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-green-700
                "
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          )}

        {/* refresh warning with existing data */}
        {!loading &&
          error &&
          prices.length > 0 && (
            <div
              className="
                mb-5
                flex
                items-start
                gap-2
                rounded-xl
                border
                border-yellow-200
                bg-yellow-50
                px-4
                py-3
                text-sm
                text-yellow-700
              "
            >
              <AlertCircle
                size={17}
                className="mt-0.5 shrink-0"
              />

              <span>
                Showing the latest available
                prices. The latest refresh was
                unsuccessful.
              </span>
            </div>
          )}

        {/* commodity groups */}
        {!loading &&
          commodityGroups.map(
            ([commodityName, commodityPrices]) => {
              const category =
                commodityPrices[0]?.category;

              return (
                <section
                  key={commodityName}
                  className="mb-9"
                >
                  {/* group header */}
                  <div
                    className="
                      mb-4
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                      "
                    >
                      <span
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-green-100
                          text-green-700
                        "
                      >
                        <CategoryIcon
                          category={category}
                        />
                      </span>

                      <div className="min-w-0">
                        <h2
                          className="
                            truncate
                            text-lg
                            font-bold
                            text-gray-900
                          "
                        >
                          {commodityName}
                        </h2>

                        <p className="text-xs text-gray-500">
                          {commodityPrices.length}{" "}
                          market
                          {commodityPrices.length !==
                          1
                            ? "s"
                            : ""}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/prices/${encodeURIComponent(
                            commodityName
                          )}`
                        )
                      }
                      className="
                        inline-flex
                        shrink-0
                        items-center
                        gap-1
                        text-sm
                        font-semibold
                        text-green-700
                        hover:text-green-800
                      "
                    >
                      <span className="hidden sm:inline">
                        View details
                      </span>

                      <ChevronRight
                        size={17}
                      />
                    </button>
                  </div>

                  {/* price cards */}
                  <div
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      lg:grid-cols-3
                      gap-4
                    "
                  >
                    {commodityPrices.map(
                      (price, index) => (
                        <PriceCard
                          key={`
                            ${commodityName}-
                            ${price.market}-
                            ${price.state}-
                            ${index}
                          `}
                          price={price}
                        />
                      )
                    )}
                  </div>
                </section>
              );
            }
          )}

        {/* no results */}
        {!loading &&
          !error &&
          filteredPrices.length === 0 && (
            <div
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                px-5
                py-16
                text-center
              "
            >
              <Search
                size={42}
                className="mx-auto text-gray-300"
              />

              <p
                className="
                  mt-4
                  text-base
                  font-semibold
                  text-gray-700
                "
              >
                No commodities found
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-400
                "
              >
                Try another crop, mandi or state
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("all");
                  }}
                  className="
                    mt-4
                    text-sm
                    font-semibold
                    text-green-700
                    hover:text-green-800
                  "
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
      </div>
    </div>
  );
}