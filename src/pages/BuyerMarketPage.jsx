import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Search,
  Handshake,
  ClipboardList,
  Plus,
  Package,
  MapPin,
  CalendarDays,
  IndianRupee,
  Truck,
  CheckCircle2,
  Building2,
  UserRound,
  Send,
  Eye,
  ShoppingCart,
  Clock3,
} from "lucide-react";

import SearchBar from "../components/SearchBar";
import BuyerCard from "../components/BuyerCard";

import { buyers, demandBoard } from "../data/mockBuyers";
import { commodities } from "../data/mockCommodities";

import {
  formatCurrency,
  getStatusColor,
} from "../utils/formatters";


// =====================================================
// BUYER DEMO LOTS
// =====================================================

const availableLots = [
  {
    id: "BF-LOT-10452",
    crop: "wheat",
    quantity: "500 Quintals",
    grade: "Grade A",
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
    crop: "rice",
    quantity: "300 Quintals",
    grade: "Grade A",
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
    crop: "soybean",
    quantity: "200 Quintals",
    grade: "Grade A",
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
    crop: "maize",
    quantity: "450 Quintals",
    grade: "Premium",
    price: 2350,
    pickupLocation: "Madhya Pradesh",
    availableDate: "2026-09-08",
    seller: "Central India Farmers Group",
    sellerType: "Farmer Group",
    verified: true,
    transportation: "buyer",
  },
];


// =====================================================
// HELPERS
// =====================================================

const getCommodityName = (crop, t) => {
  if (!crop) return "Crop";

  try {
    const translated = t(crop);

    if (translated && translated !== crop) {
      return translated;
    }
  } catch {
    // fallback below
  }

  return String(crop)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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

export default function BuyerMarketPage({ user }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  // =====================================================
  // ROLE
  // =====================================================

  const isBuyer = user?.role === "buyer";
  const isSeller = user?.role === "farmer" || user?.role === "fpo";

  // =====================================================
  // PAGE STATE
  // =====================================================

  const initialMode = searchParams.get("mode");

  const getInitialTab = () => {
    if (isBuyer) {
      if (
        initialMode === "post" ||
        initialMode === "demands"
      ) {
        return initialMode;
      }

      return "lots";
    }

    if (initialMode === "demand") {
      return "demand";
    }

    return "buyers";
  };

  const [tab, setTab] = useState(getInitialTab);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // =====================================================
  // POST DEMAND FORM
  // =====================================================

  const [formData, setFormData] = useState({
    crop: "",
    quantity: "",
    grade: "",
    estimatedPrice: "",
    deliveryLocation: "",
    deadline: "",
    transportation: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // =====================================================
  // BUYER LOT FILTERS
  // =====================================================

  const [lotSearch, setLotSearch] = useState("");
  const [lotGrade, setLotGrade] = useState("all");

  // =====================================================
  // TAB CHANGE
  // =====================================================

  const changeTab = (newTab) => {
    setTab(newTab);

    setSubmitted(false);

    if (newTab === "post") {
      setSearchParams({ mode: "post" });
    } else if (newTab === "demand") {
      setSearchParams({ mode: "demand" });
    } else if (newTab === "demands") {
      setSearchParams({ mode: "demands" });
    } else {
      setSearchParams({});
    }
  };

  // =====================================================
  // SELLER → BUYER FILTER
  // =====================================================

  const filteredBuyers = useMemo(() => {
    return buyers.filter((buyer) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        !searchText ||
        buyer.name?.toLowerCase().includes(searchText) ||
        buyer.location?.toLowerCase().includes(searchText);

      const matchesType =
        typeFilter === "all" ||
        buyer.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  // =====================================================
  // BUYER → LOT FILTER
  // =====================================================

  const filteredLots = useMemo(() => {
    const searchText = lotSearch.toLowerCase();

    return availableLots.filter((lot) => {
      const cropName = getCommodityName(lot.crop, t);

      const matchesSearch =
        !searchText ||
        cropName.toLowerCase().includes(searchText) ||
        lot.id.toLowerCase().includes(searchText) ||
        lot.pickupLocation.toLowerCase().includes(searchText) ||
        lot.seller.toLowerCase().includes(searchText);

      const matchesGrade =
        lotGrade === "all" ||
        lot.grade === lotGrade;

      return matchesSearch && matchesGrade;
    });
  }, [lotSearch, lotGrade, t]);

  // =====================================================
  // FORM INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // FORM SUBMIT
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.crop ||
      !formData.quantity ||
      !formData.grade ||
      !formData.estimatedPrice ||
      !formData.deliveryLocation ||
      !formData.deadline ||
      !formData.transportation
    ) {
      return;
    }

    setSubmitted(true);

    console.log("New Buyer Demand:", {
      ...formData,
      buyerId: user?.id,
      buyerName:
        user?.companyName ||
        user?.businessName ||
        user?.name ||
        "Buyer",
    });
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setSubmitted(false);

    setFormData({
      crop: "",
      quantity: "",
      grade: "",
      estimatedPrice: "",
      deliveryLocation: "",
      deadline: "",
      transportation: "",
    });
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

      {/* =====================================================
          SELLER VIEW
      ===================================================== */}

      {isSeller && (
        <>

          {/* PAGE HEADER */}

          <section className="bg-white border border-gray-200 rounded-xl px-5 py-5">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span>Seller Marketplace</span>
                  <span className="text-gray-300">/</span>

                  <span>
                    {tab === "demand"
                      ? "Buyer Demands"
                      : "Verified Buyers"}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Find Buyers
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Connect your crop lots with verified buyers,
                  processors and institutional purchasers.
                </p>

              </div>

              <button
                type="button"
                onClick={() => navigate("/lots")}
                className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                <Package size={17} />
                View My Lots
              </button>

            </div>

          </section>


          {/* SELLER TABS */}

          <div className="bg-white border border-gray-200 rounded-xl p-1.5 grid grid-cols-2 gap-1">

            <button
              type="button"
              onClick={() => changeTab("buyers")}
              className={`
                flex items-center justify-center gap-2
                rounded-lg px-3 py-2.5
                text-sm font-semibold
                transition-colors
                ${
                  tab === "buyers"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              <Handshake size={16} />
              Verified Buyers
            </button>

            <button
              type="button"
              onClick={() => changeTab("demand")}
              className={`
                flex items-center justify-center gap-2
                rounded-lg px-3 py-2.5
                text-sm font-semibold
                transition-colors
                ${
                  tab === "demand"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              <ClipboardList size={16} />
              Buyer Demands
            </button>

          </div>


          {/* =====================================================
              VERIFIED BUYERS
          ===================================================== */}

          {tab === "buyers" && (

            <section className="space-y-4">

              <SearchBar
                value={search}
                onChange={setSearch}
              />

              {/* BUYER TYPES */}

              <div className="flex gap-2 overflow-x-auto pb-1">

                {[
                  {
                    id: "all",
                    label: "All",
                  },
                  {
                    id: "processor",
                    label: "Processors",
                  },
                  {
                    id: "trader",
                    label: "Traders",
                  },
                  {
                    id: "institutional",
                    label: "Institutional",
                  },
                ].map((type) => (

                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setTypeFilter(type.id)}
                    className={`
                      px-4 py-2 rounded-full
                      text-sm font-semibold
                      whitespace-nowrap
                      transition-colors
                      ${
                        typeFilter === type.id
                          ? "bg-green-600 text-white"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"
                      }
                    `}
                  >
                    {type.label}
                  </button>

                ))}

              </div>


              {/* BUYER LIST */}

              <div className="space-y-3">

                {filteredBuyers.length > 0 ? (

                  filteredBuyers.map((buyer) => (

                    <BuyerCard
                      key={buyer.id}
                      buyer={buyer}
                    />

                  ))

                ) : (

                  <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

                    <Search
                      size={28}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-3 text-sm font-semibold text-gray-700">
                      No buyers found
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Try a different search or buyer type.
                    </p>

                  </div>

                )}

              </div>

            </section>

          )}


          {/* =====================================================
              BUYER DEMANDS
          ===================================================== */}

          {tab === "demand" && (

            <section className="space-y-3">

              <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">

                <h2 className="text-lg font-bold text-gray-900">
                  Buyer Demands
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Find procurement requirements that match your crop lots.
                </p>

              </div>


              {demandBoard.length > 0 ? (

                demandBoard.map((demand, index) => {

                  const buyer = buyers.find(
                    (item) =>
                      item.id === demand.buyerId
                  );

                  const commodity = commodities.find(
                    (item) =>
                      item.id === demand.commodityId
                  );

                  return (

                    <div
                      key={index}
                      className={`
                        bg-white
                        border
                        rounded-xl
                        p-5
                        ${
                          demand.status === "urgent"
                            ? "border-red-200 bg-red-50/30"
                            : "border-gray-200"
                        }
                      `}
                    >

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                        {/* LEFT */}

                        <div className="min-w-0">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                              <Package
                                size={18}
                                className="text-amber-600"
                              />
                            </div>

                            <div>

                              <div className="flex flex-wrap items-center gap-2">

                                <h3 className="font-bold text-gray-900">
                                  {t(
                                    demand.commodityId
                                  )}
                                </h3>

                                <span
                                  className={`
                                    px-2 py-0.5
                                    rounded-full
                                    text-[11px]
                                    font-semibold
                                    capitalize
                                    ${getStatusColor(
                                      demand.status
                                    )}
                                  `}
                                >
                                  {demand.status}
                                </span>

                              </div>

                              <p className="text-sm text-gray-500 mt-0.5">
                                {buyer?.name || "Buyer"}
                              </p>

                            </div>

                          </div>


                          {/* DETAILS */}

                          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs text-gray-500">

                            <span className="inline-flex items-center gap-1.5">
                              <Package size={13} />
                              {demand.quantity}
                            </span>

                            <span>
                              Grade {demand.grade}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <MapPin size={13} />
                              {demand.deliveryLocation ||
                                "Delivery location specified"}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays size={13} />

                              By{" "}

                              {new Date(
                                demand.deadline
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                }
                              )}

                            </span>

                          </div>

                        </div>


                        {/* RIGHT */}

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:justify-end">

                          <div className="text-left sm:text-right">

                            <p className="text-lg font-bold text-green-700">
                              {formatCurrency(
                                demand.priceOffered
                              )}
                            </p>

                            <p className="text-xs text-gray-500">
                              per quintal
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              navigate("/lots")
                            }
                            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
                          >
                            <Package size={15} />
                            Submit Lot
                          </button>

                        </div>

                      </div>

                    </div>

                  );

                })

              ) : (

                <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

                  <ClipboardList
                    size={30}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 font-semibold text-gray-700">
                    No buyer demands available
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    New procurement requirements will appear here.
                  </p>

                </div>

              )}

            </section>

          )}

        </>
      )}


      {/* =====================================================
          BUYER VIEW
      ===================================================== */}

      {isBuyer && (
        <>

          {/* BUYER HEADER */}

          <section className="bg-white border border-gray-200 rounded-xl px-5 py-5">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span>Procurement Marketplace</span>
                  <span className="text-gray-300">/</span>

                  <span>
                    {tab === "post"
                      ? "Post Demand"
                      : tab === "demands"
                        ? "My Demands"
                        : "Available Lots"}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Procurement Marketplace
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Find suitable farmer and FPO lots or post your procurement requirement.
                </p>

              </div>


              {tab !== "post" && (

                <button
                  type="button"
                  onClick={() => changeTab("post")}
                  className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Plus size={17} />
                  Post New Demand
                </button>

              )}

            </div>

          </section>


          {/* BUYER TABS */}

          <div className="bg-white border border-gray-200 rounded-xl p-1.5 grid grid-cols-3 gap-1">

            <button
              type="button"
              onClick={() => changeTab("lots")}
              className={`
                flex items-center justify-center gap-2
                rounded-lg px-3 py-2.5
                text-sm font-semibold
                transition-colors
                ${
                  tab === "lots"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              <Package size={16} />
              Available Lots
            </button>


            <button
              type="button"
              onClick={() => changeTab("demands")}
              className={`
                flex items-center justify-center gap-2
                rounded-lg px-3 py-2.5
                text-sm font-semibold
                transition-colors
                ${
                  tab === "demands"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              <ClipboardList size={16} />
              My Demands
            </button>


            <button
              type="button"
              onClick={() => changeTab("post")}
              className={`
                flex items-center justify-center gap-2
                rounded-lg px-3 py-2.5
                text-sm font-semibold
                transition-colors
                ${
                  tab === "post"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              <Plus size={16} />
              Post Demand
            </button>

          </div>


          {/* =====================================================
              AVAILABLE LOTS
          ===================================================== */}

          {tab === "lots" && (

            <section className="space-y-4">

              <SearchBar
                value={lotSearch}
                onChange={setLotSearch}
              />


              {/* GRADE FILTER */}

              <div className="flex gap-2 overflow-x-auto pb-1">

                {[
                  {
                    id: "all",
                    label: "All Grades",
                  },
                  {
                    id: "Grade A",
                    label: "Grade A",
                  },
                  {
                    id: "Premium",
                    label: "Premium",
                  },
                ].map((grade) => (

                  <button
                    key={grade.id}
                    type="button"
                    onClick={() =>
                      setLotGrade(grade.id)
                    }
                    className={`
                      px-4 py-2 rounded-full
                      text-sm font-semibold
                      whitespace-nowrap
                      transition-colors
                      ${
                        lotGrade === grade.id
                          ? "bg-green-600 text-white"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"
                      }
                    `}
                  >
                    {grade.label}
                  </button>

                ))}

              </div>


              {/* LOT LIST */}

              <div className="space-y-3">

                {filteredLots.length > 0 ? (

                  filteredLots.map((lot) => (

                    <div
                      key={lot.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                    >

                      {/* LOT HEADER */}

                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 p-5 border-b border-gray-100">

                        <div className="flex items-start gap-3">

                          <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                            <Package
                              size={20}
                              className="text-green-600"
                            />
                          </div>

                          <div>

                            <div className="flex flex-wrap items-center gap-2">

                              <h3 className="font-bold text-gray-900">
                                {getCommodityName(
                                  lot.crop,
                                  t
                                )}
                              </h3>

                              {lot.verified && (

                                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700">
                                  <CheckCircle2 size={11} />
                                  Verified Seller
                                </span>

                              )}

                            </div>

                            <p className="text-xs text-gray-400 mt-1">
                              Lot ID: {lot.id}
                            </p>

                          </div>

                        </div>


                        {/* PRICE */}

                        <div className="text-left lg:text-right">

                          <p className="text-lg font-bold text-green-700">
                            {formatCurrency(lot.price)}
                          </p>

                          <p className="text-xs text-gray-500">
                            per quintal
                          </p>

                        </div>

                      </div>


                      {/* LOT DETAILS */}

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">

                        <div>

                          <p className="text-xs text-gray-400">
                            Available Quantity
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {lot.quantity}
                          </p>

                        </div>


                        <div>

                          <p className="text-xs text-gray-400">
                            Grade / Quality
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {lot.grade}
                          </p>

                        </div>


                        <div>

                          <p className="text-xs text-gray-400">
                            Pickup Location
                          </p>

                          <p className="mt-1 flex items-start gap-1 text-sm font-semibold text-gray-900">
                            <MapPin
                              size={14}
                              className="mt-0.5 shrink-0 text-gray-400"
                            />

                            {lot.pickupLocation}
                          </p>

                        </div>


                        <div>

                          <p className="text-xs text-gray-400">
                            Available From
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-gray-900">
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


                      {/* SELLER + TRANSPORT */}

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
                                {lot.transportation === "buyer"
                                  ? "Buyer will arrange"
                                  : "Seller will arrange"}
                              </p>

                            </div>

                          </div>

                        </div>

                      </div>


                      {/* ACTIONS */}

                      <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 bg-gray-50 px-5 py-3">

                        <button
                          type="button"
                          onClick={() =>
                            console.log(
                              "View Lot:",
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
                            console.log(
                              "Request to Buy:",
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

                  <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

                    <Search
                      size={30}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-3 text-sm font-semibold text-gray-700">
                      No lots found
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Try another crop, location or grade.
                    </p>

                  </div>

                )}

              </div>

            </section>

          )}


          {/* =====================================================
              MY DEMANDS
          ===================================================== */}

          {tab === "demands" && (

            <section className="space-y-4">

              <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">

                <h2 className="text-lg font-bold text-gray-900">
                  My Procurement Demands
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Track procurement requirements posted by your business.
                </p>

              </div>


              {submitted ? (

                <div className="bg-white border border-gray-200 rounded-xl p-8">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div className="flex items-start gap-3">

                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">

                        <CheckCircle2
                          size={20}
                          className="text-green-600"
                        />

                      </div>

                      <div>

                        <h3 className="font-bold text-gray-900">
                          {getCommodityName(
                            formData.crop,
                            t
                          )} Procurement
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {formData.quantity} Quintals ·{" "}
                          {formData.grade}
                        </p>

                      </div>

                    </div>


                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                      <Clock3 size={13} />
                      Matching Active
                    </span>

                  </div>


                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">

                    <div>

                      <p className="text-xs text-gray-400">
                        Expected Price
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        ₹{formData.estimatedPrice} / quintal
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Delivery Location
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {formData.deliveryLocation}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Required By
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {formatDate(formData.deadline)}
                      </p>

                    </div>

                  </div>


                  <div className="flex justify-end mt-5">

                    <button
                      type="button"
                      onClick={() =>
                        changeTab("post")
                      }
                      className="text-sm font-semibold text-green-700 hover:text-green-800"
                    >
                      Post another demand
                    </button>

                  </div>

                </div>

              ) : (

                <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

                  <ClipboardList
                    size={30}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    No procurement demands yet
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Create a demand to start matching with farmer and FPO lots.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      changeTab("post")
                    }
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    <Plus size={16} />
                    Post Demand
                  </button>

                </div>

              )}

            </section>

          )}

        </>
      )}


      {/* =====================================================
          POST DEMAND
      ===================================================== */}

      {isBuyer && tab === "post" && (

        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">

          {/* FORM HEADER */}

          <div className="px-5 sm:px-7 py-5 border-b border-gray-100">

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">

                <ClipboardList
                  size={19}
                  className="text-green-600"
                />

              </div>

              <div>

                <h2 className="text-lg font-bold text-gray-900">
                  Post a Procurement Demand
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Tell farmers and FPOs what produce you need.
                </p>

              </div>

            </div>

          </div>


          {/* SUCCESS */}

          {submitted ? (

            <div className="px-5 sm:px-7 py-12 text-center">

              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto">

                <CheckCircle2
                  size={28}
                  className="text-green-600"
                />

              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                Demand Posted Successfully
              </h3>

              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                Your procurement requirement has been created and can now
                be matched with suitable farmer and FPO lots.
              </p>


              <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Post Another Demand
                </button>


                <button
                  type="button"
                  onClick={() =>
                    changeTab("demands")
                  }
                  className="px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold"
                >
                  View My Demands
                </button>

              </div>

            </div>

          ) : (

            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-7 space-y-7"
            >

              {/* PRODUCE */}

              <div>

                <h3 className="text-sm font-bold text-gray-900">
                  Produce Requirements
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Specify the crop and quantity you want to procure.
                </p>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

                  {/* CROP */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Crop
                    </label>

                    <select
                      name="crop"
                      value={formData.crop}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      required
                    >

                      <option value="">
                        Select crop
                      </option>

                      {commodities.map(
                        (commodity) => (

                          <option
                            key={commodity.id}
                            value={commodity.id}
                          >
                            {t(commodity.id)}
                          </option>

                        )
                      )}

                    </select>

                  </div>


                  {/* QUANTITY */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Required Quantity
                    </label>

                    <div className="relative">

                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="1"
                        placeholder="e.g. 500"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-20 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        required
                      />

                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        Quintals
                      </span>

                    </div>

                  </div>


                  {/* GRADE */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Grade / Quality
                    </label>

                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      required
                    >

                      <option value="">
                        Select required quality
                      </option>

                      <option value="Grade A">
                        Grade A
                      </option>

                      <option value="Grade B">
                        Grade B
                      </option>

                      <option value="Premium">
                        Premium
                      </option>

                    </select>

                  </div>


                  {/* PRICE */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Estimated Price
                    </label>

                    <div className="relative">

                      <IndianRupee
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="number"
                        name="estimatedPrice"
                        value={formData.estimatedPrice}
                        onChange={handleChange}
                        min="1"
                        placeholder="e.g. 2500"
                        className="w-full rounded-lg border border-gray-300 pl-9 pr-20 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        required
                      />

                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        / quintal
                      </span>

                    </div>

                    <p className="text-xs text-gray-400 mt-1.5">
                      Your expected / maximum procurement price per quintal.
                    </p>

                  </div>

                </div>

              </div>


              {/* DELIVERY */}

              <div className="pt-6 border-t border-gray-100">

                <h3 className="text-sm font-bold text-gray-900">
                  Delivery Requirements
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Tell sellers where and when the produce is required.
                </p>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

                  {/* LOCATION */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Location
                    </label>

                    <div className="relative">

                      <MapPin
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="deliveryLocation"
                        value={formData.deliveryLocation}
                        onChange={handleChange}
                        placeholder="e.g. Ahmedabad, Gujarat"
                        className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        required
                      />

                    </div>

                  </div>


                  {/* DEADLINE */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Required By
                    </label>

                    <div className="relative">

                      <CalendarDays
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2.5 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        required
                      />

                    </div>

                  </div>

                </div>

              </div>


              {/* TRANSPORTATION */}

              <div className="pt-6 border-t border-gray-100">

                <div className="flex items-start gap-3">

                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">

                    <Truck
                      size={17}
                      className="text-amber-600"
                    />

                  </div>

                  <div>

                    <h3 className="text-sm font-bold text-gray-900">
                      Transportation
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Who will arrange transportation for this demand?
                    </p>

                  </div>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">

                  {/* BUYER */}

                  <label
                    className={`
                      relative flex items-start gap-3
                      p-4 rounded-xl border cursor-pointer
                      transition-all
                      ${
                        formData.transportation === "buyer"
                          ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                  >

                    <input
                      type="radio"
                      name="transportation"
                      value="buyer"
                      checked={
                        formData.transportation === "buyer"
                      }
                      onChange={handleChange}
                      className="sr-only"
                    />

                    <div
                      className={`
                        w-5 h-5 rounded-full border-2
                        flex items-center justify-center
                        shrink-0 mt-0.5
                        ${
                          formData.transportation === "buyer"
                            ? "border-green-600"
                            : "border-gray-300"
                        }
                      `}
                    >

                      {formData.transportation === "buyer" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                      )}

                    </div>

                    <div>

                      <p className="text-sm font-semibold text-gray-900">
                        Buyer will arrange
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        I will arrange the transporter after the order is confirmed.
                      </p>

                    </div>

                  </label>


                  {/* SELLER */}

                  <label
                    className={`
                      relative flex items-start gap-3
                      p-4 rounded-xl border cursor-pointer
                      transition-all
                      ${
                        formData.transportation === "seller"
                          ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                  >

                    <input
                      type="radio"
                      name="transportation"
                      value="seller"
                      checked={
                        formData.transportation === "seller"
                      }
                      onChange={handleChange}
                      className="sr-only"
                    />

                    <div
                      className={`
                        w-5 h-5 rounded-full border-2
                        flex items-center justify-center
                        shrink-0 mt-0.5
                        ${
                          formData.transportation === "seller"
                            ? "border-green-600"
                            : "border-gray-300"
                        }
                      `}
                    >

                      {formData.transportation === "seller" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                      )}

                    </div>

                    <div>

                      <p className="text-sm font-semibold text-gray-900">
                        Seller will arrange
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Seller will arrange delivery to the specified location.
                      </p>

                    </div>

                  </label>

                </div>

              </div>


              {/* MATCHING INFO */}

              <div className="pt-6 border-t border-gray-100">

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

                  <div className="flex items-start gap-3">

                    <CheckCircle2
                      size={17}
                      className="text-green-600 mt-0.5 shrink-0"
                    />

                    <div>

                      <p className="text-sm font-semibold text-gray-900">
                        Procurement matching
                      </p>

                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        After posting, Bharat Fasal can match your requirement
                        with suitable farmer and FPO lots based on crop,
                        quantity, quality, price and delivery requirements.
                      </p>

                    </div>

                  </div>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => changeTab("lots")}
                  className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors"
                >
                  <Send size={16} />
                  Post Demand
                </button>

              </div>

            </form>

          )}

        </section>

      )}

    </div>
  );
}