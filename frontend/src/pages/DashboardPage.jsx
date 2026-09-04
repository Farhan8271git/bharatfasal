import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { MapPin, TrendingUp, TrendingDown, Minus, Newspaper, Package, Truck, ArrowRight, Users, WalletCards, } from "lucide-react";

import MarketTicker from "../components/MarketTicker";
import StatCard from "../components/StatCard";
import PriceCard from "../components/PriceCard";

import { priceAlerts } from "../data/mockPrices";
import { getGreeting, formatCurrency } from "../utils/formatters";
import { api } from "../utils/api.js";
// hero images for the dashboard slider

const HERO_IMAGES = [
  "/images/hero/farmer1.jpg",
  "/images/hero/farmer2.jpg",
  "/images/hero/farmer3.jpg",
  "/images/hero/farmer4.jpg",
  "/images/hero/farmer5.jpg",
];

// demo active lots for the dashboard (replace with real data in production)

const activeLots = [
  {
    id: "BF-LT-1024",
    crop: "Wheat",
    quantity: "500 Quintals",
    grade: "Grade A",
    price: 2450,
    location: "Gorakhpur, Uttar Pradesh",
    buyerInterest: "3 buyers interested",
    status: "Active",
  },
  {
    id: "BF-LT-1025",
    crop: "Rice",
    quantity: "300 Quintals",
    grade: "Premium",
    price: 3100,
    location: "Deoria, Uttar Pradesh",
    buyerInterest: "2 buyers interested",
    status: "Active",
  },
  {
    id: "BF-LT-1026",
    crop: "Maize",
    quantity: "250 Quintals",
    grade: "Grade A",
    price: 2200,
    location: "Kushinagar, Uttar Pradesh",
    buyerInterest: "1 buyer interested",
    status: "Active",
  },
];

// dashboard page component that displays hero slider, stats, quick actions, active lots, top prices, price alerts, and market news

export default function DashboardPage({ user }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [heroSlide, setHeroSlide] = useState(0);
  const [topPrices, setTopPrices] = useState([]);

  const previousPricesRef = useRef({});

  const currentUser = user;
  const greeting = getGreeting();

  
  // HERO AUTO SLIDER


  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

 // fetch mandi prices from the API and update the topPrices state
// fetch mandi prices
useEffect(() => {
  const fetchMandiPrices = async () => {
    try {
      const data = await api.getMandiPrices();

      if (!Array.isArray(data?.records)) {
        console.warn("No mandi records found");
        return;
      }

      // calculate price changes
      const updatedRecords = data.records.map((item) => {
        const key =
          `${item.commodity}-${item.market}`.toLowerCase();

        const previousPrice =
          previousPricesRef.current[key];

        let change = 0;

        if (previousPrice > 0) {
          change =
            ((item.modal_price - previousPrice) /
              previousPrice) *
            100;
        }

        return {
          ...item,
          change,
        };
      });

      // save current prices
      const currentPrices = {};

      updatedRecords.forEach((item) => {
        const key =
          `${item.commodity}-${item.market}`.toLowerCase();

        currentPrices[key] = item.modal_price;
      });

      previousPricesRef.current = currentPrices;

      // show latest six prices
      setTopPrices(updatedRecords.slice(0, 6));
    } catch (error) {
      console.error("Mandi price fetch error:", error);
    }
  };

  fetchMandiPrices();

  const interval = setInterval(
    fetchMandiPrices,
    5 * 60 * 1000
  );

  return () => clearInterval(interval);
}, []);

  // SLIDER CONTROLS
  

  const nextSlide = () => {
    setHeroSlide((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  const previousSlide = () => {
    setHeroSlide(
      (prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length,
    );
  };

  
  // QUICK ACTIONS
  
  const quickActions = [
    {
      image: "/images/actions/new-lot.jpg",
      label: "New Lot",
      path: "/lots",
    },
    {
      image: "/images/actions/find-buyer.jpg",
      label: "Find Buyer",
      path: "/buyers",
    },
    {
      image: "/images/actions/customer-complaint.jpg",
      label: "Complaint",
      path: "/disputes",
    },
    {
      image: "/images/actions/payment.jpg",
      label: "Track Payment",
      path: "/payments",
    },
  ];
  return (
    <div className="w-full">
      {/* Hero slider */}
      <section
        className="
          relative
          w-full
          h-[320px]
          sm:h-[400px]
          lg:h-[500px]
          overflow-hidden
          shadow-xl
        "
      >
        {/* HERO IMAGES */}

        {HERO_IMAGES.map((image, index) => (
          <img
            key={image}
            src={image}
            alt="Bharat Fasal agriculture"
            className={`
              absolute
              inset-0
              w-full
              h-full
              object-cover
              transition-opacity
              duration-1000
              ease-in-out
              ${index === heroSlide ? "opacity-100" : "opacity-0"}
            `}
          />
        ))}

        {/* DARK OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/65
            via-black/35
            to-black/5
          "
        />

        {/* HERO CONTENT */}

        <div
          className="
            absolute
            inset-0
            flex
            items-center
          "
        >
          <div
            className="
              w-full
              max-w-7xl
              mx-auto
              px-6
              sm:px-10
              lg:px-8
            "
          >
            <div className="max-w-xl text-white">
              {/* GREETING */}

              <p
                className="
                  text-base
                  sm:text-lg
                  font-semibold
                  text-white
                  drop-shadow-md
                "
              >
                {t(greeting)}, {currentUser?.name || "Farmer"}
              </p>

              {/* LOCATION */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mt-2
                  text-white/90
                "
              >
                <MapPin size={17} strokeWidth={2} className="text-white" />

                <span
                  className="
                    text-sm
                    sm:text-base
                    font-medium
                    drop-shadow-md
                  "
                >
                  {currentUser?.location || "India"}
                </span>
              </div>

              {/* HEADING */}

              <h2
                className="
                  text-4xl
                  sm:text-5xl
                  lg:text-6xl
                  font-extrabold
                  leading-tight
                  tracking-tight
                  text-white
                  drop-shadow-lg
                  mt-7
                "
              >
                Your crop deserves
                <br />
                the right market.
              </h2>

              {/* DESCRIPTION */}

              <p
                className="
                  text-sm
                  sm:text-base
                  text-white/90
                  mt-4
                  max-w-lg
                  leading-relaxed
                  drop-shadow-md
                "
              >
                Check today's prices, discover better buyers and make a smarter
                selling decision.
              </p>
            </div>
          </div>
        </div>

        {/* LEFT ARROW */}

        <button
          onClick={previousSlide}
          aria-label="Previous slide"
          className="
            absolute
            left-4
            sm:left-6
            top-1/2
            -translate-y-1/2
            z-20
            w-11
            h-11
            rounded-full
            bg-black/35
            hover:bg-black/60
            text-white
            text-3xl
            flex
            items-center
            justify-center
            transition-all
          "
        >
          ‹
        </button>

        {/* RIGHT ARROW */}

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="
            absolute
            right-4
            sm:right-6
            top-1/2
            -translate-y-1/2
            z-20
            w-11
            h-11
            rounded-full
            bg-black/35
            hover:bg-black/60
            text-white
            text-3xl
            flex
            items-center
            justify-center
            transition-all
          "
        >
          ›
        </button>

        {/* SLIDER DOTS */}

        <div
          className="
            absolute
            bottom-6
            left-1/2
            -translate-x-1/2
            z-20
            flex
            items-center
            gap-2
          "
        >
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setHeroSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`
                h-2
                rounded-full
                transition-all
                duration-300
                ${index === heroSlide
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
                }
              `}
            />
          ))}
        </div>
      </section>

      {/* MAIN DASHBOARD CONTENT*/}

      <div
        className="
          w-full
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-6
          space-y-7
          pb-10
        "
      >
        {/* MARKET TICKER */}

        <MarketTicker />

        {/* STATS */}

        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-3
          "
        >
          <StatCard
            image="/images/stats/best-price.jpg"
            label="Today's Best Price"
            value={formatCurrency(7350)}
            color="primary"
          />

          <StatCard
            image="/images/stats/active-lots.jpg"
            label="Active Lots"
            value="3"
            color="blue"
          />

          <StatCard
            image="/images/stats/pending-payment.jpg"
            label="Payments Pending"
            value={formatCurrency(215000)}
            color="yellow"
          />

          <StatCard
            image="/images/stats/nearby-buyer.jpg"
            label="Recommended Buyers"
            value="8"
            color="primary"
          />
        </div>

        {/* QUICK ACTIONS*/}

        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {t("quick_actions")}
              </h3>

              <p className="text-sm text-gray-500 mt-0.5">
                Quickly access your farming activities
              </p>
            </div>
          </div>

          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-4
              gap-4
            "
          >
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="
                  group
                  bg-white
                  border
                  border-gray-200
                  rounded-2xl
                  overflow-hidden
                  text-left
                  shadow-sm
                  hover:shadow-lg
                  hover:border-primary-300
                  hover:-translate-y-0.5
                  transition-all
                  duration-200
                "
              >
                <div
                  className="
                    h-20
                    sm:h-24
                    w-full
                    overflow-hidden
                    bg-gray-100
                  "
                >
                  <img
                    src={action.image}
                    alt={action.label}
                    className="
                      w-full
                      h-full
                      object-cover
                      transition-transform
                      duration-300
                      group-hover:scale-105
                    "
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                <div className="px-4 py-3">
                  <span
                    className="
                      text-sm
                      font-semibold
                      text-gray-800
                    "
                  >
                    {action.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* YOUR ACTIVE LOTS*/}

        <section>
          <div
            className="
              flex
              items-center
              justify-between
              mb-3
            "
          >
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Your Active Lots
              </h3>

              <p className="text-sm text-gray-500 mt-0.5">
                Monitor your currently listed crops
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/lots")}
              className="
                inline-flex
                items-center
                gap-1
                text-primary-600
                text-sm
                font-semibold
                hover:text-primary-700
              "
            >
              View All
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="space-y-3">
            {activeLots.map((lot) => (
              <div
                key={lot.id}
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-2xl
                  shadow-sm
                  p-4
                  hover:shadow-md
                  transition-shadow
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-4
                  "
                >
                  {/* LOT INFO */}

                  <div className="flex items-start gap-3">
                    <div
                      className="
                        w-11
                        h-11
                        rounded-xl
                        bg-green-50
                        border
                        border-green-100
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                      "
                    >
                      <Package size={21} className="text-green-600" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-gray-900">{lot.crop}</h4>

                        <span
                          className="
                            px-2
                            py-1
                            rounded-md
                            bg-green-50
                            text-green-700
                            text-[11px]
                            font-semibold
                          "
                        >
                          {lot.status}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        Lot ID: {lot.id}
                      </p>

                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-x-4
                          gap-y-1
                          mt-2
                          text-sm
                          text-gray-600
                        "
                      >
                        <span>{lot.quantity}</span>

                        <span>{lot.grade}</span>

                        <span>
                          ₹{lot.price.toLocaleString("en-IN")}
                          /q
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* LOT META */}

                  <div
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      gap-3
                      lg:min-w-[360px]
                      lg:justify-end
                    "
                  >
                    <div
                      className="
                        text-sm
                        text-gray-600
                        sm:text-right
                      "
                    >
                      <p className="flex items-center gap-1.5 sm:justify-end">
                        <MapPin size={14} />
                        {lot.location}
                      </p>

                      <p
                        className="
                          flex
                          items-center
                          gap-1.5
                          mt-1
                          text-green-700
                          font-medium
                          sm:justify-end
                        "
                      >
                        <Users size={14} />
                        {lot.buyerInterest}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/lots")}
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-1.5
                        px-4
                        py-2.5
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        text-sm
                        font-semibold
                        text-gray-700
                        hover:bg-gray-100
                        transition-colors
                      "
                    >
                      View Lot
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TOP PRICES*/}

        <section>
          <div
            className="
              flex
              items-center
              justify-between
              mb-3
            "
          >
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {t("top_prices_today")}
              </h3>

              <p className="text-sm text-gray-500 mt-0.5">
                Latest mandi prices from government data
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/prices")}
              className="
                text-primary-600
                text-sm
                font-semibold
                hover:text-primary-700
              "
            >
              {t("mandi_prices")} →
            </button>
          </div>

          {topPrices.length > 0 ? (
            <div
              className="
                flex
                gap-3
                overflow-x-auto
                pb-2
                -mx-4
                px-4
                snap-x
              "
            >
              {topPrices.map((price, index) => (
                <div
                  key={index}
                  className="
                    snap-start
                    flex-shrink-0
                  "
                >
                  <PriceCard price={price} />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                px-5
                py-8
                text-center
                text-sm
                text-gray-500
              "
            >
              Loading latest mandi prices...
            </div>
          )}
        </section>

        {/* PRICE ALERTS*/}

        <section>
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900">
              {t("price_alerts")}
            </h3>

            <p className="text-sm text-gray-500 mt-0.5">
              Latest changes in mandi prices
            </p>
          </div>

          <div className="space-y-2">
            {priceAlerts.map((alert, index) => (
              <div
                key={index}
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-2xl
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  shadow-sm
                  hover:shadow-md
                  transition-shadow
                "
              >
                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-gray-50
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  {alert.type === "up" ? (
                    <TrendingUp size={20} className="text-green-600" />
                  ) : alert.type === "down" ? (
                    <TrendingDown size={20} className="text-red-500" />
                  ) : (
                    <Minus size={20} className="text-gray-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {alert.message}
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MARKET NEWS */}

        <section>
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900">
              {t("market_news")}
            </h3>

            <p className="text-sm text-gray-500 mt-0.5">
              Latest updates affecting farmers and markets
            </p>
          </div>

          <div
            className="
              bg-primary-50
              border
              border-primary-200
              rounded-2xl
              p-4
            "
          >
            <div className="space-y-3">
              {/* NEWS 1 */}

              <div className="flex items-start gap-3">
                <div
                  className="
                    w-9
                    h-9
                    rounded-lg
                    bg-white
                    flex
                    items-center
                    justify-center
                    shrink-0
                    border
                    border-primary-100
                  "
                >
                  <Newspaper size={18} className="text-primary-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Government announces 5% increase in MSP for Kharif 2026-27
                    season
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Government Policy • Today
                  </p>
                </div>
              </div>

              {/* NEWS 2 */}

              <div className="flex items-start gap-3">
                <div
                  className="
                    w-9
                    h-9
                    rounded-lg
                    bg-white
                    flex
                    items-center
                    justify-center
                    shrink-0
                    border
                    border-primary-100
                  "
                >
                  <Newspaper size={18} className="text-primary-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    APMC reforms: Direct selling to processors now allowed in 12
                    states
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Market Reform • Today
                  </p>
                </div>
              </div>

              {/* NEWS 3 */}

              <div className="flex items-start gap-3">
                <div
                  className="
                    w-9
                    h-9
                    rounded-lg
                    bg-white
                    flex
                    items-center
                    justify-center
                    shrink-0
                    border
                    border-primary-100
                  "
                >
                  <Newspaper size={18} className="text-primary-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Cold storage capacity increased by 20% in Maharashtra
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Storage & Logistics • Yesterday
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SELLER TRUST MESSAGE */}

        <section
          className="
            bg-white
            border
            border-gray-200
            rounded-2xl
            px-5
            py-4
          "
        >
          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-4
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-green-50
                  border
                  border-green-100
                  flex
                  items-center
                  justify-center
                  shrink-0" >
                <WalletCards size={19} className="text-green-600" />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Sell with greater confidence
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Track orders, payments and buyer activity from one place.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/payments")}
              className=" inline-flex items-center justify- gap-1.5px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors ">
              View Payments
              <ArrowRight size={15} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
