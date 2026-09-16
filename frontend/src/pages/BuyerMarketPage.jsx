import { useEffect, useMemo, useState } from "react";
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
  Send,
  Eye,
  ShoppingCart,
  Clock3,
  X,
} from "lucide-react";

import SearchBar from "../components/SearchBar";

import {
  createDemand,
  getMyDemands,
  getMarketDemands,
} from "../api/demands.api";

import {
  getLots,
} from "../api/lots.api";

import {
  createPurchaseRequest,
  getSellerPurchaseRequests,
} from "../api/purchaseRequests.api";

import {
  formatCurrency,
  getStatusColor,
} from "../utils/formatters";

const getCommodityName = (crop, t) => {
  if (!crop) {
    return "Crop";
  }

  try {
    const translated = t(crop);

    if (translated && translated !== crop) {
      return translated;
    }
  } catch {
    // Translation fallback.
  }

  return String(crop)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return String(date);
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const normalizeLot = (lot) => {
  const totalQuantity = Number(lot?.quantity) || 0;
  const reservedQuantity = Number(lot?.reservedQuantity) || 0;
  const availableQuantity = Math.max(
    0,
    totalQuantity - reservedQuantity
  );

  const seller = lot?.sellerId || lot?.seller || {};

  const sellerName =
    seller?.name ||
    seller?.organizationName ||
    lot?.sellerName ||
    "Seller";

  const sellerType =
    seller?.role ||
    lot?.sellerType ||
    "farmer";

  const price =
    Number(lot?.expectedPrice) ||
    Number(lot?.price) ||
    0;

  return {
    ...lot,
    id: lot?._id || lot?.id,
    crop: lot?.commodity || lot?.crop || "",
    quantity: availableQuantity,
    totalQuantity,
    reservedQuantity,
    grade: lot?.grade || "Not specified",
    price,
    pickupLocation:
      lot?.pickupLocation ||
      lot?.location ||
      "Not specified",
    availableDate:
      lot?.availableDate ||
      lot?.availabilityDate ||
      null,
    seller: sellerName,
    sellerType,
    verified:
      Boolean(lot?.verified) ||
      Boolean(seller?.verified),
    transportation:
      lot?.transportation || "buyer",
  };
};

export default function BuyerMarketPage({ user }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const isBuyer = user?.role === "buyer";
  const isSeller =
    user?.role === "farmer" ||
    user?.role === "fpo";

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

  const [myDemands, setMyDemands] = useState([]);
  const [demandLoading, setDemandLoading] = useState(false);
  const [demandError, setDemandError] = useState("");

  const [marketDemands, setMarketDemands] = useState([]);
  const [marketDemandsLoading, setMarketDemandsLoading] =
    useState(false);
  const [marketDemandsError, setMarketDemandsError] =
    useState("");

  const [lots, setLots] = useState([]);
  const [lotsLoading, setLotsLoading] = useState(false);
  const [lotsError, setLotsError] = useState("");

  const [sellerRequests, setSellerRequests] = useState([]);
  const [sellerRequestsLoading, setSellerRequestsLoading] =
    useState(false);
  const [sellerRequestsError, setSellerRequestsError] =
    useState("");

  const [lotSearch, setLotSearch] = useState("");
  const [lotGrade, setLotGrade] = useState("all");

  const [selectedLot, setSelectedLot] = useState(null);
  const [requestLot, setRequestLot] = useState(null);
  const [requestQuantity, setRequestQuantity] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");

  useEffect(() => {
    if (!isBuyer) {
      return;
    }

    let cancelled = false;

    const fetchDemands = async () => {
      setDemandLoading(true);
      setDemandError("");

      try {
        const response = await getMyDemands({
          status: "active",
          page: 1,
          limit: 20,
        });

        if (cancelled) {
          return;
        }

        setMyDemands(
          Array.isArray(response?.demands)
            ? response.demands
            : []
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        setDemandError(
          error?.message ||
            "Unable to load your demands."
        );
      } finally {
        if (!cancelled) {
          setDemandLoading(false);
        }
      }
    };

    fetchDemands();

    return () => {
      cancelled = true;
    };
  }, [isBuyer]);

  useEffect(() => {
    if (!isBuyer) {
      return;
    }

    let cancelled = false;

    const fetchLots = async () => {
      setLotsLoading(true);
      setLotsError("");

      try {
        const response = await getLots({
          status: "listed",
          page: 1,
          limit: 100,
        });

        if (cancelled) {
          return;
        }

        const receivedLots = Array.isArray(response?.lots)
          ? response.lots
          : [];

        setLots(
          receivedLots
            .map(normalizeLot)
            .filter((lot) => lot.id && lot.quantity > 0)
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        setLotsError(
          error?.message ||
            "Unable to load available lots."
        );
        setLots([]);
      } finally {
        if (!cancelled) {
          setLotsLoading(false);
        }
      }
    };

    fetchLots();

    return () => {
      cancelled = true;
    };
  }, [isBuyer]);

  useEffect(() => {
    if (!isSeller) {
      return;
    }

    let cancelled = false;

    const fetchSellerRequests = async () => {
      setSellerRequestsLoading(true);
      setSellerRequestsError("");

      try {
        const response =
          await getSellerPurchaseRequests({
            status: "pending",
            page: 1,
            limit: 100,
          });

        if (cancelled) {
          return;
        }

        setSellerRequests(
          Array.isArray(response?.requests)
            ? response.requests
            : []
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        setSellerRequestsError(
          error?.message ||
            "Unable to load buyer requests."
        );
        setSellerRequests([]);
      } finally {
        if (!cancelled) {
          setSellerRequestsLoading(false);
        }
      }
    };

    fetchSellerRequests();

    return () => {
      cancelled = true;
    };
  }, [isSeller]);

  useEffect(() => {
    if (!isSeller) {
      return;
    }

    let cancelled = false;

    const fetchMarketDemands = async () => {
      setMarketDemandsLoading(true);
      setMarketDemandsError("");

      try {
        const response = await getMarketDemands({
          status: "active",
          page: 1,
          limit: 20,
        });

        if (cancelled) {
          return;
        }

        setMarketDemands(
          Array.isArray(response?.demands)
            ? response.demands
            : []
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        setMarketDemandsError(
          error?.message ||
            "Unable to load buyer demands."
        );

        setMarketDemands([]);
      } finally {
        if (!cancelled) {
          setMarketDemandsLoading(false);
        }
      }
    };

    fetchMarketDemands();

    return () => {
      cancelled = true;
    };
  }, [isSeller]);

  const changeTab = (newTab) => {
    setTab(newTab);
    setSubmitted(false);
    setDemandError("");
    setRequestError("");
    setRequestSuccess("");

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

  const filteredBuyers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    const buyerMap = new Map();

    sellerRequests.forEach((request) => {
      const buyer = request?.buyerId;

      if (!buyer) {
        return;
      }

      const buyerId =
        buyer?._id ||
        buyer?.id ||
        request?.buyerId;

      if (!buyerMap.has(String(buyerId))) {
        buyerMap.set(String(buyerId), {
          id: buyerId,
          name:
            buyer?.name ||
            buyer?.organizationName ||
            "Buyer",
          location: [
            buyer?.district,
            buyer?.state,
          ]
            .filter(Boolean)
            .join(", "),
          type:
            buyer?.businessType ||
            "buyer",
          mobile: buyer?.mobile,
          email: buyer?.email,
          requestCount: 0,
        });
      }

      buyerMap.get(String(buyerId)).requestCount += 1;
    });

    return Array.from(buyerMap.values()).filter(
      (buyer) => {
        const matchesSearch =
          !searchText ||
          buyer.name
            ?.toLowerCase()
            .includes(searchText) ||
          buyer.location
            ?.toLowerCase()
            .includes(searchText);

        const normalizedType =
          String(buyer.type || "").toLowerCase();

        const matchesType =
          typeFilter === "all" ||
          normalizedType ===
            typeFilter.toLowerCase();

        return matchesSearch && matchesType;
      }
    );
  }, [
    sellerRequests,
    search,
    typeFilter,
  ]);

  const filteredLots = useMemo(() => {
    const searchText = lotSearch
      .trim()
      .toLowerCase();

    return lots.filter((lot) => {
      const cropName = getCommodityName(
        lot.crop,
        t
      );

      const matchesSearch =
        !searchText ||
        cropName
          .toLowerCase()
          .includes(searchText) ||
        String(lot.id)
          .toLowerCase()
          .includes(searchText) ||
        lot.pickupLocation
          ?.toLowerCase()
          .includes(searchText) ||
        lot.seller
          ?.toLowerCase()
          .includes(searchText);

      const matchesGrade =
        lotGrade === "all" ||
        lot.grade === lotGrade;

      return matchesSearch && matchesGrade;
    });
  }, [
    lots,
    lotSearch,
    lotGrade,
    t,
  ]);

  const availableGrades = useMemo(() => {
    const grades = new Set();

    lots.forEach((lot) => {
      if (lot.grade) {
        grades.add(lot.grade);
      }
    });

    return Array.from(grades);
  }, [lots]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
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
      setDemandError(
        "Please complete all required fields."
      );
      return;
    }

    const quantity = Number(formData.quantity);
    const estimatedPrice = Number(
      formData.estimatedPrice
    );

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setDemandError(
        "Quantity must be greater than zero."
      );
      return;
    }

    if (
      !Number.isFinite(estimatedPrice) ||
      estimatedPrice < 0
    ) {
      setDemandError(
        "Estimated price must be a valid amount."
      );
      return;
    }

    setDemandLoading(true);
    setDemandError("");

    try {
      const response = await createDemand({
        commodity: formData.crop,
        quantity,
        grade: formData.grade,
        estimatedPrice,
        deliveryLocation:
          formData.deliveryLocation.trim(),
        deadline: formData.deadline,
        transportation:
          formData.transportation,
      });

      const createdDemand =
        response?.demand;

      if (!createdDemand) {
        throw new Error(
          "Demand was created but no demand data was returned."
        );
      }

      setMyDemands((previousDemands) => [
        createdDemand,
        ...previousDemands,
      ]);

      setSubmitted(true);
    } catch (error) {
      setDemandError(
        error?.message ||
          "Unable to create buyer demand."
      );
    } finally {
      setDemandLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setDemandError("");

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

  const openRequestModal = (lot) => {
    setRequestLot(lot);
    setRequestQuantity("");
    setRequestError("");
    setRequestSuccess("");
  };

  const closeRequestModal = () => {
    if (requestLoading) {
      return;
    }

    setRequestLot(null);
    setRequestQuantity("");
    setRequestError("");
    setRequestSuccess("");
  };

  const handleRequestToBuy = async (e) => {
    e.preventDefault();

    if (!requestLot?.id) {
      setRequestError(
        "Lot information is missing."
      );
      return;
    }

    const quantity = Number(
      requestQuantity
    );

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      setRequestError(
        "Enter a valid quantity."
      );
      return;
    }

    if (quantity > requestLot.quantity) {
      setRequestError(
        `Maximum available quantity is ${requestLot.quantity} quintals.`
      );
      return;
    }

    setRequestLoading(true);
    setRequestError("");
    setRequestSuccess("");

    try {
      await createPurchaseRequest({
        lotId: requestLot.id,
        quantity,
      });

      setRequestSuccess(
        "Purchase request sent successfully."
      );

      setLots((previousLots) =>
        previousLots.map((lot) => {
          if (lot.id !== requestLot.id) {
            return lot;
          }

          return {
            ...lot,
            quantity: Math.max(
              0,
              lot.quantity - quantity
            ),
          };
        })
      );
    } catch (error) {
      setRequestError(
        error?.message ||
          "Unable to send purchase request."
      );
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

      {isSeller && (
        <>
          <section className="bg-white border border-gray-200 rounded-xl px-5 py-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span>Seller Marketplace</span>
                  <span className="text-gray-300">/</span>
                  <span>
                    {tab === "demand"
                      ? "Buyer Demands"
                      : "Interested Buyers"}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Find Buyers
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Connect your crop lots with buyers who have
                  submitted real purchase requests.
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

          <div className="bg-white border border-gray-200 rounded-xl p-1.5 grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => changeTab("buyers")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                tab === "buyers"
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Handshake size={16} />
              Interested Buyers
            </button>

            <button
              type="button"
              onClick={() => changeTab("demand")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                tab === "demand"
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ClipboardList size={16} />
              Buyer Demands
            </button>
          </div>

          {tab === "buyers" && (
            <section className="space-y-4">
              <SearchBar
                value={search}
                onChange={setSearch}
              />

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
                    onClick={() =>
                      setTypeFilter(type.id)
                    }
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                      typeFilter === type.id
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {sellerRequestsLoading ? (
                <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                  <Clock3
                    size={30}
                    className="mx-auto text-gray-300 animate-pulse"
                  />
                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    Loading buyer requests...
                  </p>
                </div>
              ) : sellerRequestsError ? (
                <div className="bg-white border border-red-200 rounded-xl p-8 text-center">
                  <Handshake
                    size={30}
                    className="mx-auto text-red-300"
                  />
                  <p className="mt-3 text-sm font-semibold text-red-700">
                    Unable to load buyers
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    {sellerRequestsError}
                  </p>
                </div>
              ) : filteredBuyers.length > 0 ? (
                <div className="space-y-3">
                  {filteredBuyers.map((buyer) => (
                    <div
                      key={buyer.id}
                      className="bg-white border border-gray-200 rounded-xl p-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                            <Building2
                              size={20}
                              className="text-green-600"
                            />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-gray-900">
                                {buyer.name}
                              </h3>

                              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700">
                                <CheckCircle2 size={11} />
                                Active Request
                              </span>
                            </div>

                            {buyer.location && (
                              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                <MapPin size={13} />
                                {buyer.location}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {buyer.requestCount}{" "}
                            {buyer.requestCount === 1
                              ? "request"
                              : "requests"}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            Pending purchase interest
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                  <Search
                    size={28}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    No interested buyers found
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Buyers will appear here after they submit
                    purchase requests for your listed lots.
                  </p>
                </div>
              )}
            </section>
          )}

          {tab === "demand" && (
            <section className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Buyer Demands
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  View active procurement requirements submitted by buyers.
                </p>
              </div>

              {marketDemandsLoading ? (
                <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                  <Clock3
                    size={30}
                    className="mx-auto text-gray-300 animate-pulse"
                  />

                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    Loading buyer demands...
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Fetching active procurement requirements.
                  </p>
                </div>
              ) : marketDemandsError ? (
                <div className="bg-white border border-red-200 rounded-xl p-8 text-center">
                  <ClipboardList
                    size={30}
                    className="mx-auto text-red-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-red-700">
                    Unable to load buyer demands
                  </p>

                  <p className="text-xs text-red-500 mt-1">
                    {marketDemandsError}
                  </p>
                </div>
              ) : marketDemands.length > 0 ? (
                <div className="space-y-3">
                  {marketDemands.map((demand) => (
                    <div
                      key={demand._id || demand.id}
                      className="bg-white border border-gray-200 rounded-xl p-5"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                            <ClipboardList
                              size={20}
                              className="text-green-600"
                            />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-gray-900">
                                {getCommodityName(
                                  demand.commodity,
                                  t
                                )}
                              </h3>

                              <span
                                className={`px-2 py-1 rounded-full text-[11px] font-semibold capitalize ${getStatusColor(
                                  demand.status
                                )}`}
                              >
                                {demand.status}
                              </span>
                            </div>

                            <p className="text-sm text-gray-500 mt-1">
                              Buyer:{" "}
                              {demand.buyerId?.organizationName ||
                                demand.buyerId?.name ||
                                "Buyer"}
                            </p>

                            {(demand.buyerId?.district ||
                              demand.buyerId?.state) && (
                              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                <MapPin size={13} />

                                {[
                                  demand.buyerId?.district,
                                  demand.buyerId?.state,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-left lg:text-right">
                          <p className="text-lg font-bold text-green-700">
                            {formatCurrency(
                              demand.estimatedPrice
                            )}
                          </p>

                          <p className="text-xs text-gray-500">
                            per quintal
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                        <div>
                          <p className="text-xs text-gray-400">
                            Required Quantity
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {demand.quantity}{" "}
                            {demand.unit || "quintal"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Grade / Quality
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {demand.grade}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Delivery Location
                          </p>

                          <p className="mt-1 flex items-start gap-1 text-sm font-semibold text-gray-900">
                            <MapPin
                              size={14}
                              className="mt-0.5 shrink-0 text-gray-400"
                            />

                            {demand.deliveryLocation}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Required By
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-gray-900">
                            <CalendarDays
                              size={14}
                              className="text-gray-400"
                            />

                            {formatDate(
                              demand.deadline
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Truck size={14} />

                          <span>
                            Transportation:{" "}
                            <span className="font-semibold text-gray-700 capitalize">
                              {demand.transportation}
                            </span>
                          </span>
                        </div>

                        <p className="text-xs text-gray-400">
                          Posted{" "}
                          {formatDate(
                            demand.createdAt
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                  <ClipboardList
                    size={30}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    No active buyer demands
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Active procurement requirements from buyers will appear here.
                  </p>
                </div>
              )}
            </section>
          )}
        </>
      )}

      {isBuyer && (
        <>
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
                  Find suitable farmer and FPO lots or post your
                  procurement requirement.
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

          <div className="bg-white border border-gray-200 rounded-xl p-1.5 grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => changeTab("lots")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                tab === "lots"
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Package size={16} />
              Available Lots
            </button>

            <button
              type="button"
              onClick={() => changeTab("demands")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                tab === "demands"
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ClipboardList size={16} />
              My Demands
            </button>

            <button
              type="button"
              onClick={() => changeTab("post")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                tab === "post"
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Plus size={16} />
              Post Demand
            </button>
          </div>

          {tab === "lots" && (
            <section className="space-y-4">
              <SearchBar
                value={lotSearch}
                onChange={setLotSearch}
              />

              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setLotGrade("all")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                    lotGrade === "all"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"
                  }`}
                >
                  All Grades
                </button>

                {availableGrades.map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() =>
                      setLotGrade(grade)
                    }
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                      lotGrade === grade
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>

              {lotsLoading ? (
                <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                  <Clock3
                    size={30}
                    className="mx-auto text-gray-300 animate-pulse"
                  />

                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    Loading available lots...
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Fetching currently listed farmer and FPO lots.
                  </p>
                </div>
              ) : lotsError ? (
                <div className="bg-white border border-red-200 rounded-xl p-8 text-center">
                  <Package
                    size={30}
                    className="mx-auto text-red-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-red-700">
                    Unable to load available lots
                  </p>

                  <p className="text-xs text-red-500 mt-1">
                    {lotsError}
                  </p>
                </div>
              ) : filteredLots.length > 0 ? (
                <div className="space-y-3">
                  {filteredLots.map((lot) => (
                    <div
                      key={lot.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                    >
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

                        <div className="text-left lg:text-right">
                          <p className="text-lg font-bold text-green-700">
                            {formatCurrency(
                              lot.price
                            )}
                          </p>

                          <p className="text-xs text-gray-500">
                            per quintal
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
                        <div>
                          <p className="text-xs text-gray-400">
                            Available Quantity
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {lot.quantity} quintals
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
                                {lot.transportation ===
                                "buyer"
                                  ? "Buyer will arrange"
                                  : lot.transportation ===
                                      "seller"
                                    ? "Seller will arrange"
                                    : lot.transportation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 bg-gray-50 px-5 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedLot(lot)
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          <Eye size={14} />
                          View Details
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openRequestModal(lot)
                          }
                          disabled={
                            lot.quantity <= 0
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <ShoppingCart size={14} />
                          Request to Buy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
            </section>
          )}

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

              {demandLoading ? (
                <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                  <Clock3
                    size={30}
                    className="mx-auto text-gray-300 animate-pulse"
                  />

                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    Loading your demands...
                  </p>
                </div>
              ) : demandError ? (
                <div className="bg-white border border-red-200 rounded-xl p-8 text-center">
                  <ClipboardList
                    size={30}
                    className="mx-auto text-red-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-red-700">
                    Unable to load your demands
                  </p>

                  <p className="text-xs text-red-500 mt-1">
                    {demandError}
                  </p>
                </div>
              ) : myDemands.length > 0 ? (
                <div className="space-y-3">
                  {myDemands.map((demand) => (
                    <div
                      key={
                        demand._id ||
                        demand.id
                      }
                      className="bg-white border border-gray-200 rounded-xl p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                          <Package
                            size={18}
                            className="text-green-600"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-gray-900">
                              {getCommodityName(
                                demand.commodity,
                                t
                              )}
                            </h3>

                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${getStatusColor(
                                demand.status ||
                                  "active"
                              )}`}
                            >
                              {demand.status ||
                                "active"}
                            </span>
                          </div>

                          <p className="text-xs text-gray-400 mt-1">
                            Posted{" "}
                            {formatDate(
                              demand.createdAt
                            )}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                            <div>
                              <p className="text-xs text-gray-400">
                                Required Quantity
                              </p>

                              <p className="mt-1 text-sm font-semibold text-gray-900">
                                {demand.quantity}{" "}
                                {demand.unit ||
                                  "quintal"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400">
                                Grade / Quality
                              </p>

                              <p className="mt-1 text-sm font-semibold text-gray-900">
                                {demand.grade ||
                                  "Any"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400">
                                Estimated Price
                              </p>

                              <p className="mt-1 text-sm font-semibold text-gray-900">
                                {demand.estimatedPrice !=
                                null
                                  ? formatCurrency(
                                      demand.estimatedPrice
                                    )
                                  : "Not specified"}
                                {demand.estimatedPrice !=
                                  null && (
                                  <span className="text-xs font-normal text-gray-500">
                                    {" "}
                                    / quintal
                                  </span>
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400">
                                Delivery Location
                              </p>

                              <p className="mt-1 flex items-start gap-1 text-sm font-semibold text-gray-900">
                                <MapPin
                                  size={14}
                                  className="mt-0.5 shrink-0 text-gray-400"
                                />
                                {demand.deliveryLocation ||
                                  "Not specified"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400">
                                Required By
                              </p>

                              <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-gray-900">
                                <CalendarDays
                                  size={14}
                                  className="text-gray-400"
                                />
                                {formatDate(
                                  demand.deadline
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400">
                                Transportation
                              </p>

                              <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-gray-900">
                                <Truck
                                  size={14}
                                  className="text-gray-400"
                                />

                                {demand.transportation ===
                                "buyer"
                                  ? "Buyer will arrange"
                                  : demand.transportation ===
                                      "seller"
                                    ? "Seller will arrange"
                                    : demand.transportation ||
                                      "Not specified"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
                    Create a demand to start matching with farmer
                    and FPO lots.
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

          {tab === "post" && (
            <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
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
                    Your procurement requirement has been created
                    and can now be matched with suitable farmer and
                    FPO lots.
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
                  {demandError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-sm font-medium text-red-700">
                        {demandError}
                      </p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Produce Requirements
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Specify the crop and quantity you want to procure.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Crop
                        </label>

                        <input
                          type="text"
                          name="crop"
                          value={formData.crop}
                          onChange={handleChange}
                          placeholder="e.g. wheat"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                          required
                        />
                      </div>

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
                            value={
                              formData.estimatedPrice
                            }
                            onChange={handleChange}
                            min="0"
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

                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900">
                      Delivery Requirements
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Tell sellers where and when the produce is required.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
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
                            value={
                              formData.deliveryLocation
                            }
                            onChange={handleChange}
                            placeholder="e.g. Ahmedabad, Gujarat"
                            className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            required
                          />
                        </div>
                      </div>

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
                            value={
                              formData.deadline
                            }
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2.5 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

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
                      {[
                        {
                          value: "buyer",
                          title: "Buyer will arrange",
                          description:
                            "I will arrange the transporter after the order is confirmed.",
                        },
                        {
                          value: "seller",
                          title: "Seller will arrange",
                          description:
                            "Seller will arrange delivery to the specified location.",
                        },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                            formData.transportation ===
                            option.value
                              ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="transportation"
                            value={option.value}
                            checked={
                              formData.transportation ===
                              option.value
                            }
                            onChange={handleChange}
                            className="sr-only"
                          />

                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                              formData.transportation ===
                              option.value
                                ? "border-green-600"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.transportation ===
                              option.value && (
                              <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {option.title}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              {option.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

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
                            After posting, Bharat Fasal can match your
                            requirement with suitable farmer and FPO lots
                            based on crop, quantity, quality, price and
                            delivery requirements.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        changeTab("lots")
                      }
                      className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={demandLoading}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                    >
                      <Send size={16} />
                      {demandLoading
                        ? "Posting..."
                        : "Post Demand"}
                    </button>
                  </div>
                </form>
              )}
            </section>
          )}
        </>
      )}

      {selectedLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Lot Details
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Lot ID: {selectedLot.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedLot(null)
                }
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <p className="text-xs text-gray-400">
                  Commodity
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {getCommodityName(
                    selectedLot.crop,
                    t
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-400">
                    Available Quantity
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {selectedLot.quantity} quintals
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-400">
                    Price
                  </p>

                  <p className="mt-1 font-semibold text-green-700">
                    {formatCurrency(
                      selectedLot.price
                    )}{" "}
                    / quintal
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-400">
                    Grade
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {selectedLot.grade}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-400">
                    Seller
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {selectedLot.seller}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-400">
                    Pickup Location
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {selectedLot.pickupLocation}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-400">
                    Available From
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {formatDate(
                      selectedLot.availableDate
                    )}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedLot(null)
                  }
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedLot(null);
                    openRequestModal(
                      selectedLot
                    );
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                >
                  <ShoppingCart size={15} />
                  Request to Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {requestLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Request to Buy
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {getCommodityName(
                    requestLot.crop,
                    t
                  )}{" "}
                  · {requestLot.id}
                </p>
              </div>

              <button
                type="button"
                onClick={closeRequestModal}
                disabled={requestLoading}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleRequestToBuy}
              className="p-5 space-y-5"
            >
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-gray-500">
                    Available
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {requestLot.quantity} quintals
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 mt-2">
                  <span className="text-xs text-gray-500">
                    Price
                  </span>

                  <span className="text-sm font-semibold text-green-700">
                    {formatCurrency(
                      requestLot.price
                    )}{" "}
                    / quintal
                  </span>
                </div>
              </div>

              {requestError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-700">
                    {requestError}
                  </p>
                </div>
              )}

              {requestSuccess && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                  <p className="text-sm text-green-700">
                    {requestSuccess}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Requested Quantity
                </label>

                <div className="relative">
                  <input
                    type="number"
                    value={requestQuantity}
                    onChange={(e) =>
                      setRequestQuantity(
                        e.target.value
                      )
                    }
                    min="0.01"
                    max={requestLot.quantity}
                    step="0.01"
                    placeholder="Enter quantity"
                    disabled={
                      requestLoading ||
                      Boolean(requestSuccess)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-20 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
                    required
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    Quintals
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeRequestModal}
                  disabled={requestLoading}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Close
                </button>

                {!requestSuccess && (
                  <button
                    type="submit"
                    disabled={
                      requestLoading ||
                      requestLot.quantity <= 0
                    }
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 text-white text-sm font-semibold"
                  >
                    <Send size={15} />
                    {requestLoading
                      ? "Sending..."
                      : "Send Request"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}