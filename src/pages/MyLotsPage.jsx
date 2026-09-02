import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Package,
  Plus,
  MapPin,
  CalendarDays,
  Truck,
  Pencil,
  Eye,
  CheckCircle2,
  XCircle,
  Clock3,
  ShoppingCart,
  Search,
  Building2,
  ShieldCheck,
  IndianRupee,
  ChevronRight,
  FileText,
} from "lucide-react";

import { formatCurrency } from "../utils/formatters";


// =====================================================
// SELLER LOTS
// =====================================================

const sellerLots = [
  {
    id: "BF-LOT-001",
    commodityId: "wheat",
    quantity: 50,
    grade: "A",
    expectedPrice: 2500,
    createdAt: "2026-08-25",
    status: "listed",

    pickupLocation: "Gorakhpur, Uttar Pradesh",
    availableDate: "2026-09-05",

    transportation: "buyer",

    offers: [
      {
        id: "OFFER-001",
        buyer: "Abuzer Agri Business",
        date: "2026-08-27",
        price: 2450,
        status: "pending",
      },
      {
        id: "OFFER-002",
        buyer: "UP Agro Industries",
        date: "2026-08-28",
        price: 2420,
        status: "pending",
      },
    ],
  },

  {
    id: "BF-LOT-002",
    commodityId: "soybean",
    quantity: 30,
    grade: "A",
    expectedPrice: 5200,
    createdAt: "2026-08-20",
    status: "offer",

    pickupLocation: "Indore, Madhya Pradesh",
    availableDate: "2026-09-03",

    transportation: "seller",

    offers: [
      {
        id: "OFFER-003",
        buyer: "ITC Limited",
        date: "2026-08-22",
        price: 5150,
        status: "pending",
      },
    ],
  },

  {
    id: "BF-LOT-003",
    commodityId: "onion",
    quantity: 100,
    grade: "B",
    expectedPrice: 1900,
    createdAt: "2026-08-10",
    status: "sold",

    pickupLocation: "Nashik, Maharashtra",
    availableDate: "2026-08-14",

    transportation: "seller",

    soldTo: "Mother Dairy",
    soldPrice: 1850,
    soldDate: "2026-08-15",
  },

  {
    id: "BF-LOT-004",
    commodityId: "cotton",
    quantity: 20,
    grade: "A",
    expectedPrice: 7400,
    createdAt: "2026-08-30",
    status: "draft",

    pickupLocation: "Nagpur, Maharashtra",
    availableDate: "2026-09-10",

    transportation: "buyer",

    offers: [],
  },
];


// =====================================================
// BUYER MARKETPLACE LOTS
// =====================================================

const availableLots = [
  {
    id: "BF-LOT-10452",
    commodityId: "wheat",
    quantity: 500,
    grade: "A",
    price: 2500,
    pickupLocation: "Gorakhpur, Uttar Pradesh",
    availableDate: "2026-09-05",
    seller: "Shiv Farmers FPO",
    sellerType: "FPO",
    verified: true,
    transportation: "buyer",
  },

  {
    id: "BF-LOT-10431",
    commodityId: "rice",
    quantity: 300,
    grade: "A",
    price: 2900,
    pickupLocation: "Karnal, Haryana",
    availableDate: "2026-09-04",
    seller: "Eastern Grain FPO",
    sellerType: "FPO",
    verified: true,
    transportation: "seller",
  },

  {
    id: "BF-LOT-10392",
    commodityId: "soybean",
    quantity: 200,
    grade: "A",
    price: 5200,
    pickupLocation: "Indore, Madhya Pradesh",
    availableDate: "2026-09-06",
    seller: "Malwa Agro FPO",
    sellerType: "FPO",
    verified: true,
    transportation: "seller",
  },

  {
    id: "BF-LOT-10376",
    commodityId: "maize",
    quantity: 450,
    grade: "Premium",
    price: 2350,
    pickupLocation: "Madhya Pradesh",
    availableDate: "2026-09-08",
    seller: "Central India Farmers Group",
    sellerType: "Farmer Group",
    verified: true,
    transportation: "buyer",
  },

  {
    id: "BF-LOT-10361",
    commodityId: "chickpea",
    quantity: 150,
    grade: "A",
    price: 6100,
    pickupLocation: "Bhopal, Madhya Pradesh",
    availableDate: "2026-09-09",
    seller: "MP Farmers FPO",
    sellerType: "FPO",
    verified: true,
    transportation: "seller",
  },
];


// =====================================================
// HELPERS
// =====================================================

const getCropName = (id, t) => {
  if (!id) return "Crop";

  const translated = t(id);

  if (translated && translated !== id) {
    return translated;
  }

  return String(id)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};


const getGradeLabel = (grade) => {
  if (!grade) return "—";

  if (
    grade.toLowerCase().startsWith("grade")
  ) {
    return grade;
  }

  return `Grade ${grade}`;
};


const getStatusConfig = (status) => {
  switch (status) {
    case "listed":
      return {
        label: "Listed",
        className:
          "bg-green-50 text-green-700 border-green-100",
        icon: CheckCircle2,
      };

    case "offer":
      return {
        label: "Offer Received",
        className:
          "bg-blue-50 text-blue-700 border-blue-100",
        icon: Clock3,
      };

    case "sold":
      return {
        label: "Sold",
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-100",
        icon: CheckCircle2,
      };

    case "draft":
      return {
        label: "Draft",
        className:
          "bg-amber-50 text-amber-700 border-amber-100",
        icon: FileText,
      };

    default:
      return {
        label: "Active",
        className:
          "bg-gray-50 text-gray-700 border-gray-100",
        icon: Package,
      };
  }
};


const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};


// =====================================================
// MAIN PAGE
// =====================================================

export default function MyLotsPage({ user }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isBuyer = user?.role === "buyer";

  // =====================================================
  // SELLER STATE
  // =====================================================

  const [sellerFilter, setSellerFilter] =
    useState("all");

  const [sellerSearch, setSellerSearch] =
    useState("");

  const [offerState, setOfferState] =
    useState({});


  // =====================================================
  // BUYER STATE
  // =====================================================

  const [buyerSearch, setBuyerSearch] =
    useState("");

  const [buyerGrade, setBuyerGrade] =
    useState("all");


  // =====================================================
  // SELLER LOT FILTER
  // =====================================================

  const filteredSellerLots = useMemo(() => {
    const searchText =
      sellerSearch.toLowerCase().trim();

    return sellerLots.filter((lot) => {
      const cropName = getCropName(
        lot.commodityId,
        t
      ).toLowerCase();

      const matchesSearch =
        !searchText ||
        cropName.includes(searchText) ||
        lot.id.toLowerCase().includes(searchText) ||
        lot.pickupLocation
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        sellerFilter === "all" ||
        lot.status === sellerFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    sellerSearch,
    sellerFilter,
    t,
  ]);


  // =====================================================
  // BUYER LOT FILTER
  // =====================================================

  const filteredBuyerLots = useMemo(() => {
    const searchText =
      buyerSearch.toLowerCase().trim();

    return availableLots.filter((lot) => {
      const cropName = getCropName(
        lot.commodityId,
        t
      ).toLowerCase();

      const matchesSearch =
        !searchText ||
        cropName.includes(searchText) ||
        lot.id.toLowerCase().includes(searchText) ||
        lot.pickupLocation
          .toLowerCase()
          .includes(searchText) ||
        lot.seller
          .toLowerCase()
          .includes(searchText);

      const matchesGrade =
        buyerGrade === "all" ||
        lot.grade === buyerGrade;

      return matchesSearch && matchesGrade;
    });
  }, [
    buyerSearch,
    buyerGrade,
    t,
  ]);


  // =====================================================
  // ACCEPT OFFER
  // =====================================================

  const handleAcceptOffer = (lotId, offerId) => {
    setOfferState((prev) => ({
      ...prev,
      [`${lotId}-${offerId}`]: "accepted",
    }));
  };


  // =====================================================
  // REJECT OFFER
  // =====================================================

  const handleRejectOffer = (lotId, offerId) => {
    setOfferState((prev) => ({
      ...prev,
      [`${lotId}-${offerId}`]: "rejected",
    }));
  };


  // =====================================================
  // BUYER REQUEST
  // =====================================================

  const handleRequestToBuy = (lot) => {
    console.log("Request to buy:", lot);

    alert(
      `Purchase request created for ${getCropName(
        lot.commodityId,
        t
      )} (${lot.id}).`
    );
  };


  // =====================================================
  // BUYER VIEW
  // =====================================================

  if (isBuyer) {
    return (
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="bg-white border border-gray-200 rounded-xl px-5 py-5">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span>Marketplace</span>
                <span className="text-gray-300">
                  /
                </span>
                <span>Available Lots</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Browse Available Lots
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Find verified farmer and FPO lots that match your procurement requirements.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/buyers?mode=post")
              }
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              <Plus size={17} />
              Post New Demand
            </button>

          </div>

        </section>


        {/* =================================================
            SEARCH
        ================================================= */}

        <section className="space-y-3">

          <div className="relative">

            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={buyerSearch}
              onChange={(e) =>
                setBuyerSearch(e.target.value)
              }
              placeholder="Search crop, lot, seller or location..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

          </div>


          <div className="flex gap-2 overflow-x-auto pb-1">

            {[
              {
                id: "all",
                label: "All Grades",
              },
              {
                id: "A",
                label: "Grade A",
              },
              {
                id: "Premium",
                label: "Premium",
              },
            ].map((item) => (

              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setBuyerGrade(item.id)
                }
                className={`
                  whitespace-nowrap
                  px-4 py-2
                  rounded-full
                  text-sm
                  font-semibold
                  border
                  transition-colors
                  ${
                    buyerGrade === item.id
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
                  }
                `}
              >
                {item.label}
              </button>

            ))}

          </div>

        </section>


        {/* =================================================
            AVAILABLE LOTS
        ================================================= */}

        <section>

          <div className="flex items-end justify-between mb-3">

            <div>

              <h2 className="text-lg font-bold text-gray-900">
                Available Lots
              </h2>

              <p className="text-sm text-gray-500 mt-0.5">
                Verified produce currently available for procurement.
              </p>

            </div>

            <span className="text-xs text-gray-400">
              {filteredBuyerLots.length} lots
            </span>

          </div>


          <div className="space-y-3">

            {filteredBuyerLots.length > 0 ? (

              filteredBuyerLots.map((lot) => (

                <div
                  key={lot.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >

                  {/* HEADER */}

                  <div className="p-5 border-b border-gray-100">

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                      <div className="flex items-start gap-3">

                        <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                          <Package
                            size={20}
                            className="text-green-600"
                          />
                        </div>

                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="text-lg font-bold text-gray-900">
                              {getCropName(
                                lot.commodityId,
                                t
                              )}
                            </h3>

                            {lot.verified && (

                              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 px-2 py-1 text-[11px] font-semibold">
                                <ShieldCheck size={11} />
                                Verified Seller
                              </span>

                            )}

                          </div>

                          <p className="text-xs text-gray-400 mt-1">
                            Lot ID: {lot.id}
                          </p>

                        </div>

                      </div>


                      <div className="text-left lg:text-right">

                        <p className="text-xl font-bold text-green-700">
                          {formatCurrency(
                            lot.price
                          )}
                        </p>

                        <p className="text-xs text-gray-500">
                          per quintal
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">

                    <div>
                      <p className="text-xs text-gray-400">
                        Available Quantity
                      </p>

                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {lot.quantity} Quintals
                      </p>
                    </div>


                    <div>
                      <p className="text-xs text-gray-400">
                        Grade / Quality
                      </p>

                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {getGradeLabel(
                          lot.grade
                        )}
                      </p>
                    </div>


                    <div>
                      <p className="text-xs text-gray-400">
                        Pickup Location
                      </p>

                      <p className="flex items-start gap-1.5 text-sm font-semibold text-gray-900 mt-1">
                        <MapPin
                          size={14}
                          className="text-gray-400 mt-0.5 shrink-0"
                        />
                        {lot.pickupLocation}
                      </p>
                    </div>


                    <div>
                      <p className="text-xs text-gray-400">
                        Available From
                      </p>

                      <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 mt-1">
                        <CalendarDays
                          size={14}
                          className="text-gray-400"
                        />
                        {formatDate(
                          lot.availableDate
                        )}
                      </p>
                    </div>

                  </div>


                  {/* SELLER / TRANSPORT */}

                  <div className="mx-5 mb-5 rounded-lg border border-gray-200 bg-gray-50 p-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div className="flex items-center gap-3">

                        <Building2
                          size={18}
                          className="text-gray-500"
                        />

                        <div>

                          <p className="text-xs text-gray-400">
                            Seller / FPO
                          </p>

                          <p className="text-sm font-semibold text-gray-900">
                            {lot.seller}
                          </p>

                          <p className="text-xs text-gray-500 mt-0.5">
                            {lot.sellerType}
                          </p>

                        </div>

                      </div>


                      <div className="flex items-center gap-3">

                        <Truck
                          size={18}
                          className="text-gray-500"
                        />

                        <div>

                          <p className="text-xs text-gray-400">
                            Transportation
                          </p>

                          <p className="text-sm font-semibold text-gray-900">
                            {lot.transportation ===
                            "buyer"
                              ? "Buyer will arrange"
                              : "Seller will arrange"}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* ACTIONS */}

                  <div className="flex flex-wrap justify-end gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50">

                    <button
                      type="button"
                      onClick={() =>
                        console.log(
                          "View lot details:",
                          lot
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <Eye size={14} />
                      View Details
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        handleRequestToBuy(
                          lot
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700"
                    >
                      <ShoppingCart size={14} />
                      Request to Buy
                    </button>

                  </div>

                </div>

              ))

            ) : (

              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">

                <Search
                  size={30}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-3 text-sm font-semibold text-gray-700">
                  No available lots found
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Try another crop, seller or location.
                </p>

              </div>

            )}

          </div>

        </section>

      </div>
    );
  }


  // =====================================================
  // SELLER VIEW
  // =====================================================

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="bg-white border border-gray-200 rounded-xl px-5 py-5">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span>Seller Marketplace</span>
              <span className="text-gray-300">
                /
              </span>
              <span>My Lots</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Lots
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage your listed produce, offers and completed sales.
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              navigate("/lots/create")
            }
            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus size={17} />
            Create Lot
          </button>

        </div>

      </section>


      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <section className="space-y-3">

        <div className="relative">

          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={sellerSearch}
            onChange={(e) =>
              setSellerSearch(e.target.value)
            }
            placeholder="Search crop, lot ID or pickup location..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />

        </div>


        <div className="flex gap-2 overflow-x-auto pb-1">

          {[
            {
              id: "all",
              label: "All Lots",
            },
            {
              id: "listed",
              label: "Listed",
            },
            {
              id: "offer",
              label: "Offers Received",
            },
            {
              id: "sold",
              label: "Sold",
            },
            {
              id: "draft",
              label: "Drafts",
            },
          ].map((filter) => (

            <button
              key={filter.id}
              type="button"
              onClick={() =>
                setSellerFilter(
                  filter.id
                )
              }
              className={`
                whitespace-nowrap
                px-4 py-2
                rounded-full
                text-sm
                font-semibold
                border
                transition-colors
                ${
                  sellerFilter ===
                  filter.id
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
                }
              `}
            >
              {filter.label}
            </button>

          ))}

        </div>

      </section>


      {/* =================================================
          LOT LIST
      ================================================= */}

      <section className="space-y-3">

        {filteredSellerLots.length > 0 ? (

          filteredSellerLots.map((lot) => {

            const status =
              getStatusConfig(
                lot.status
              );

            const StatusIcon =
              status.icon;

            const activeOffers =
              lot.offers?.filter(
                (offer) =>
                  offerState[
                    `${lot.id}-${offer.id}`
                  ] !== "rejected"
              ) || [];

            return (

              <article
                key={lot.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              >

                {/* =========================================
                    LOT HEADER
                ========================================= */}

                <div className="p-5">

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                    <div className="flex items-start gap-3">

                      <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center shrink-0">

                        <Package
                          size={20}
                          className="text-green-600"
                        />

                      </div>


                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <h2 className="text-lg font-bold text-gray-900">
                            {getCropName(
                              lot.commodityId,
                              t
                            )}
                          </h2>

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1
                              px-2
                              py-1
                              rounded-full
                              border
                              text-[11px]
                              font-semibold
                              ${status.className}
                            `}
                          >
                            <StatusIcon
                              size={11}
                            />

                            {status.label}
                          </span>

                        </div>


                        <p className="text-xs text-gray-400 mt-1">
                          {lot.id} ·{" "}
                          Created{" "}
                          {formatDate(
                            lot.createdAt
                          )}
                        </p>


                        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-gray-600">

                          <span className="inline-flex items-center gap-1.5">
                            <Package
                              size={14}
                              className="text-gray-400"
                            />

                            {lot.quantity}{" "}
                            Quintals
                          </span>


                          <span>
                            {getGradeLabel(
                              lot.grade
                            )}
                          </span>


                          <span className="inline-flex items-center gap-1.5">

                            <MapPin
                              size={14}
                              className="text-gray-400"
                            />

                            {lot.pickupLocation}

                          </span>

                        </div>

                      </div>

                    </div>


                    {/* PRICE */}

                    <div className="text-left lg:text-right">

                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(
                          lot.expectedPrice
                        )}
                      </p>

                      <p className="text-xs text-gray-500">
                        Expected price / quintal
                      </p>

                    </div>

                  </div>


                  {/* =========================================
                      LOT INFORMATION
                  ========================================= */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">

                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">

                      <div className="flex items-center gap-2">

                        <MapPin
                          size={15}
                          className="text-gray-500"
                        />

                        <p className="text-xs text-gray-400">
                          Pickup Location
                        </p>

                      </div>

                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {lot.pickupLocation}
                      </p>

                    </div>


                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">

                      <div className="flex items-center gap-2">

                        <CalendarDays
                          size={15}
                          className="text-gray-500"
                        />

                        <p className="text-xs text-gray-400">
                          Available From
                        </p>

                      </div>

                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {formatDate(
                          lot.availableDate
                        )}
                      </p>

                    </div>


                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">

                      <div className="flex items-center gap-2">

                        <Truck
                          size={15}
                          className="text-gray-500"
                        />

                        <p className="text-xs text-gray-400">
                          Transportation
                        </p>

                      </div>

                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {lot.transportation ===
                        "buyer"
                          ? "Buyer will arrange"
                          : "Seller will arrange"}
                      </p>

                    </div>

                  </div>

                </div>


                {/* =========================================
                    OFFERS
                ========================================= */}

                {lot.status ===
                  "offer" ||
                (lot.status ===
                  "listed" &&
                  activeOffers.length >
                    0) ? (

                  <div className="border-t border-gray-100">

                    <div className="px-5 py-3 bg-gray-50">

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2">

                          <HandshakeIcon />

                          <p className="text-sm font-semibold text-gray-800">
                            Offers Received (
                            {
                              activeOffers.length
                            }
                            )
                          </p>

                        </div>

                      </div>

                    </div>


                    <div>

                      {activeOffers.map(
                        (offer) => {

                          const key =
                            `${lot.id}-${offer.id}`;

                          const currentState =
                            offerState[key];


                          return (

                            <div
                              key={
                                offer.id
                              }
                              className="px-5 py-4 border-t border-gray-100"
                            >

                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                <div>

                                  <p className="text-sm font-semibold text-gray-900">
                                    {offer.buyer}
                                  </p>

                                  <p className="text-xs text-gray-500 mt-1">
                                    Offer received on{" "}
                                    {formatDate(
                                      offer.date
                                    )}
                                  </p>

                                </div>


                                <div className="flex flex-wrap items-center gap-3">

                                  <p className="text-base font-bold text-green-700">
                                    {formatCurrency(
                                      offer.price
                                    )}
                                    <span className="ml-1 text-xs font-normal text-gray-400">
                                      /q
                                    </span>
                                  </p>


                                  {currentState ===
                                  "accepted" ? (

                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                                      <CheckCircle2
                                        size={14}
                                      />
                                      Accepted
                                    </span>

                                  ) : currentState ===
                                    "rejected" ? (

                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                                      <XCircle
                                        size={14}
                                      />
                                      Rejected
                                    </span>

                                  ) : (

                                    <>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleAcceptOffer(
                                            lot.id,
                                            offer.id
                                          )
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
                                      >
                                        <CheckCircle2
                                          size={14}
                                        />
                                        Accept
                                      </button>


                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRejectOffer(
                                            lot.id,
                                            offer.id
                                          )
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                                      >
                                        <XCircle
                                          size={14}
                                        />
                                        Reject
                                      </button>

                                    </>

                                  )}

                                </div>

                              </div>

                            </div>

                          );

                        }
                      )}

                    </div>

                  </div>

                ) : null}


                {/* =========================================
                    SOLD
                ========================================= */}

                {lot.status ===
                  "sold" && (

                  <div className="mx-5 mb-5 rounded-lg border border-green-100 bg-green-50 px-4 py-3">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                      <div className="flex items-start gap-2">

                        <CheckCircle2
                          size={17}
                          className="text-green-600 mt-0.5"
                        />

                        <div>

                          <p className="text-sm font-semibold text-green-800">
                            Sold to{" "}
                            {lot.soldTo}
                          </p>

                          <p className="text-xs text-green-700 mt-0.5">
                            Sale price{" "}
                            {formatCurrency(
                              lot.soldPrice
                            )}{" "}
                            / quintal ·{" "}
                            {formatDate(
                              lot.soldDate
                            )}
                          </p>

                        </div>

                      </div>


                      <span className="text-xs font-semibold text-green-700">
                        Sale completed
                      </span>

                    </div>

                  </div>

                )}


                {/* =========================================
                    ACTIONS
                ========================================= */}

                <div className="flex flex-wrap justify-end gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50">

                  <button
                    type="button"
                    onClick={() =>
                      console.log(
                        "View lot:",
                        lot
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <Eye size={14} />
                    View Details
                  </button>


                  {lot.status ===
                    "draft" && (

                    <button
                      type="button"
                      onClick={() =>
                        console.log(
                          "Edit lot:",
                          lot
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <Pencil
                        size={14}
                      />
                      Edit Lot
                    </button>

                  )}


                  {lot.status ===
                    "listed" && (

                    <button
                      type="button"
                      onClick={() =>
                        console.log(
                          "Edit lot:",
                          lot
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <Pencil
                        size={14}
                      />
                      Edit Lot
                    </button>

                  )}

                </div>

              </article>

            );

          })

        ) : (

          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">

            <Package
              size={32}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm font-semibold text-gray-700">
              No lots found
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Try another search or status filter.
            </p>

          </div>

        )}

      </section>


      {/* =================================================
          SELLING GUIDANCE
      ================================================= */}

      <section className="bg-white border border-gray-200 rounded-xl px-5 py-4">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div className="flex items-start gap-3">

            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">

              <ShieldCheck
                size={18}
                className="text-green-600"
              />

            </div>

            <div>

              <h3 className="text-sm font-bold text-gray-900">
                Sell with greater confidence
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Track offers, protected payments, verification and delivery from one place.
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={() =>
              navigate("/payments")
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 text-sm font-semibold"
          >
            View Payments
            <ChevronRight
              size={16}
            />
          </button>

        </div>

      </section>

    </div>
  );
}


// =====================================================
// SMALL INLINE ICON
// =====================================================

function HandshakeIcon() {
  return (
    <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center">
      <HandshakeSymbol />
    </div>
  );
}


function HandshakeSymbol() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="text-blue-600"
    >
      <path d="m12 5 3 3 2-2 4 4-3 3" />
      <path d="m12 5-3 3-2-2-4 4 3 3" />
      <path d="m8 13 3 3a2 2 0 0 0 3 0l5-5" />
      <path d="m4 10 5 5" />
    </svg>
  );
}