import { useEffect, useMemo, useState } from "react";
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
  ChevronRight,
  FileText,
  UserRound,
  IndianRupee,
} from "lucide-react";

import { formatCurrency } from "../utils/formatters";
import { getMyLots } from "../api/lots.api";
import {
  getSellerPurchaseRequests,
  respondToPurchaseRequest,
} from "../api/purchaseRequests.api";

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

const getCropName = (id, t) => {
  if (!id) {
    return "Crop";
  }

  const translated = t(id);

  if (translated && translated !== id) {
    return translated;
  }

  return String(id)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getGradeLabel = (grade) => {
  if (!grade) {
    return "—";
  }

  if (String(grade).toLowerCase().startsWith("grade")) {
    return grade;
  }

  return `Grade ${grade}`;
};

const getStatusConfig = (status) => {
  switch (status) {
    case "listed":
      return {
        label: "Listed",
        className: "bg-green-50 text-green-700 border-green-100",
        icon: CheckCircle2,
      };

    case "reserved":
      return {
        label: "Reserved",
        className: "bg-blue-50 text-blue-700 border-blue-100",
        icon: Clock3,
      };

    case "sold":
      return {
        label: "Sold",
        className: "bg-emerald-50 text-emerald-700 border-emerald-100",
        icon: CheckCircle2,
      };

    case "draft":
      return {
        label: "Draft",
        className: "bg-amber-50 text-amber-700 border-amber-100",
        icon: FileText,
      };

    case "cancelled":
      return {
        label: "Cancelled",
        className: "bg-red-50 text-red-700 border-red-100",
        icon: XCircle,
      };

    default:
      return {
        label: "Active",
        className: "bg-gray-50 text-gray-700 border-gray-100",
        icon: Package,
      };
  }
};

const getRequestStatusConfig = (status) => {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        className: "bg-amber-50 text-amber-700 border-amber-100",
        icon: Clock3,
      };

    case "accepted":
      return {
        label: "Accepted",
        className: "bg-green-50 text-green-700 border-green-100",
        icon: CheckCircle2,
      };

    case "rejected":
      return {
        label: "Rejected",
        className: "bg-red-50 text-red-700 border-red-100",
        icon: XCircle,
      };

    case "cancelled":
      return {
        label: "Cancelled",
        className: "bg-gray-50 text-gray-700 border-gray-100",
        icon: XCircle,
      };

    default:
      return {
        label: status || "Unknown",
        className: "bg-gray-50 text-gray-700 border-gray-100",
        icon: FileText,
      };
  }
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

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

const formatRequestAmount = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "—";
  }

  return formatCurrency(value);
};

export default function MyLotsPage({ user }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isBuyer = user?.role === "buyer";

  const [sellerFilter, setSellerFilter] = useState("all");
  const [sellerSearch, setSellerSearch] = useState("");
  const [sellerLots, setSellerLots] = useState([]);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [sellerError, setSellerError] = useState("");

  const [sellerRequests, setSellerRequests] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [requestActionId, setRequestActionId] = useState("");
  const [requestActionError, setRequestActionError] = useState("");

  const [buyerSearch, setBuyerSearch] = useState("");
  const [buyerGrade, setBuyerGrade] = useState("all");

  useEffect(() => {
    if (isBuyer) {
      return;
    }

    let isMounted = true;

    const loadSellerLots = async () => {
      setSellerLoading(true);
      setSellerError("");

      try {
        const response = await getMyLots({
          page: 1,
          limit: 100,
        });

        if (!response?.success) {
          throw new Error(
            response?.message || "Unable to load your lots."
          );
        }

        if (isMounted) {
          setSellerLots(response.lots || []);
        }
      } catch (error) {
        if (isMounted) {
          setSellerError(
            error?.message || "Unable to load your lots."
          );
        }
      } finally {
        if (isMounted) {
          setSellerLoading(false);
        }
      }
    };

    loadSellerLots();

    return () => {
      isMounted = false;
    };
  }, [isBuyer]);

  useEffect(() => {
    if (isBuyer) {
      return;
    }

    let isMounted = true;

    const loadSellerRequests = async () => {
      setRequestLoading(true);
      setRequestError("");

      try {
        const response = await getSellerPurchaseRequests({
          page: 1,
          limit: 100,
        });

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Unable to load purchase requests."
          );
        }

        if (isMounted) {
          setSellerRequests(response.requests || []);
        }
      } catch (error) {
        if (isMounted) {
          setRequestError(
            error?.message ||
              "Unable to load purchase requests."
          );
        }
      } finally {
        if (isMounted) {
          setRequestLoading(false);
        }
      }
    };

    loadSellerRequests();

    return () => {
      isMounted = false;
    };
  }, [isBuyer]);

  const filteredSellerLots = useMemo(() => {
    const searchText = sellerSearch.toLowerCase().trim();

    return sellerLots.filter((lot) => {
      const cropName = getCropName(
        lot.commodity,
        t
      ).toLowerCase();

      const lotId = String(lot._id || "").toLowerCase();

      const pickupLocation = String(
        lot.pickupLocation || ""
      ).toLowerCase();

      const matchesSearch =
        !searchText ||
        cropName.includes(searchText) ||
        lotId.includes(searchText) ||
        pickupLocation.includes(searchText);

      const matchesStatus =
        sellerFilter === "all" ||
        lot.status === sellerFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sellerLots, sellerSearch, sellerFilter, t]);

  const filteredBuyerLots = useMemo(() => {
    const searchText = buyerSearch.toLowerCase().trim();

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
        lot.seller.toLowerCase().includes(searchText);

      const matchesGrade =
        buyerGrade === "all" ||
        lot.grade === buyerGrade;

      return matchesSearch && matchesGrade;
    });
  }, [buyerSearch, buyerGrade, t]);

  const pendingRequests = useMemo(() => {
    return sellerRequests.filter(
      (request) => request.status === "pending"
    );
  }, [sellerRequests]);

  const handleViewLot = (lotId) => {
    navigate(`/lots/${lotId}`);
  };

  const handlePurchaseRequestResponse = async (
    requestId,
    action
  ) => {
    if (!requestId || !["accept", "reject"].includes(action)) {
      return;
    }

    setRequestActionId(requestId);
    setRequestActionError("");

    try {
      const response = await respondToPurchaseRequest(
        requestId,
        {
          action,
        }
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to update purchase request."
        );
      }

      const updatedRequest = response.request;

      setSellerRequests((currentRequests) =>
        currentRequests.map((request) =>
          String(request._id) === String(requestId)
            ? updatedRequest || {
                ...request,
                status:
                  action === "accept"
                    ? "accepted"
                    : "rejected",
              }
            : request
        )
      );

      if (action === "accept" && updatedRequest?.lotId) {
        const updatedLotId =
          updatedRequest.lotId?._id ||
          updatedRequest.lotId;

        setSellerLots((currentLots) =>
          currentLots.map((lot) =>
            String(lot._id) === String(updatedLotId)
              ? {
                  ...lot,
                  status: "reserved",
                }
              : lot
          )
        );
      }
    } catch (error) {
      setRequestActionError(
        error?.message ||
          "Unable to update purchase request."
      );
    } finally {
      setRequestActionId("");
    }
  };

  if (isBuyer) {
    return (
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <section className="bg-white border border-gray-200 rounded-xl px-5 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span>Marketplace</span>
                <span className="text-gray-300">/</span>
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
              onClick={() => navigate("/buyers?mode=post")}
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              <Plus size={17} />
              Post New Demand
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={buyerSearch}
              onChange={(e) => setBuyerSearch(e.target.value)}
              placeholder="Search crop, lot, seller or location..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { id: "all", label: "All Grades" },
              { id: "A", label: "Grade A" },
              { id: "Premium", label: "Premium" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setBuyerGrade(item.id)}
                className={`
                  whitespace-nowrap px-4 py-2 rounded-full text-sm
                  font-semibold border transition-colors
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
                          {formatCurrency(lot.price)}
                        </p>

                        <p className="text-xs text-gray-500">
                          per quintal
                        </p>
                      </div>
                    </div>
                  </div>

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
                        {getGradeLabel(lot.grade)}
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
                        {formatDate(lot.availableDate)}
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
                            {lot.transportation === "buyer"
                              ? "Buyer will arrange"
                              : "Seller will arrange"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-end gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => handleViewLot(lot.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <Eye size={14} />
                      View Details
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          "Purchase requests will be available after the order workflow is connected."
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

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      <section className="bg-white border border-gray-200 rounded-xl px-5 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span>Seller Marketplace</span>
              <span className="text-gray-300">/</span>
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
            onClick={() => navigate("/lots/create")}
            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus size={17} />
            Create Lot
          </button>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingCart
                size={19}
                className="text-green-600"
              />

              <h2 className="text-lg font-bold text-gray-900">
                Purchase Requests
              </h2>

              {pendingRequests.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                  {pendingRequests.length}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Review buyer requests for your marketplace lots.
            </p>
          </div>

          <span className="text-xs text-gray-400">
            {sellerRequests.length} requests
          </span>
        </div>

        {requestActionError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-start gap-2">
              <XCircle
                size={17}
                className="text-red-600 mt-0.5 shrink-0"
              />

              <p className="text-sm text-red-700">
                {requestActionError}
              </p>
            </div>
          </div>
        )}

        {requestLoading ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-10 text-center">
            <ShoppingCart
              size={30}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm font-semibold text-gray-700">
              Loading purchase requests...
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Fetching the latest buyer requests.
            </p>
          </div>
        ) : requestError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <XCircle
              size={30}
              className="mx-auto text-red-400"
            />

            <p className="mt-3 text-sm font-semibold text-red-700">
              Unable to load purchase requests
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {requestError}
            </p>
          </div>
        ) : sellerRequests.length > 0 ? (
          <div className="space-y-3">
            {sellerRequests.map((request) => {
              const requestStatus = getRequestStatusConfig(
                request.status
              );

              const RequestStatusIcon =
                requestStatus.icon;

              const lot = request.lotId;
              const buyer = request.buyerId;

              const requestLotId =
                lot?._id || request.lotId;

              const isActionLoading =
                requestActionId === request._id;

              return (
                <article
                  key={request._id}
                  className="rounded-xl border border-gray-200 overflow-hidden"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                          <UserRound
                            size={18}
                            className="text-green-600"
                          />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-gray-900">
                              {buyer?.name ||
                                buyer?.organizationName ||
                                "Buyer"}
                            </h3>

                            <span
                              className={`
                                inline-flex items-center gap-1 px-2 py-1
                                rounded-full border text-[11px] font-semibold
                                ${requestStatus.className}
                              `}
                            >
                              <RequestStatusIcon
                                size={11}
                              />
                              {requestStatus.label}
                            </span>
                          </div>

                          <p className="text-xs text-gray-400 mt-1">
                            Request ID: {request._id}
                          </p>

                          {buyer?.organizationName && (
                            <p className="text-xs text-gray-500 mt-1">
                              {buyer.organizationName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-left lg:text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatRequestAmount(
                            request.totalAmount
                          )}
                        </p>

                        <p className="text-xs text-gray-500">
                          Total request value
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <p className="text-xs text-gray-400">
                          Lot
                        </p>

                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {getCropName(
                            lot?.commodity,
                            t
                          )}
                        </p>

                        <p className="text-xs text-gray-500 mt-0.5">
                          {requestLotId
                            ? `Lot ID: ${requestLotId}`
                            : "Lot information unavailable"}
                        </p>
                      </div>

                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <p className="text-xs text-gray-400">
                          Requested Quantity
                        </p>

                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {request.quantity}{" "}
                          {request.unit === "quintal"
                            ? "Quintals"
                            : request.unit || ""}
                        </p>
                      </div>

                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <div className="flex items-center gap-1.5">
                          <IndianRupee
                            size={14}
                            className="text-gray-400"
                          />

                          <p className="text-xs text-gray-400">
                            Offered Price
                          </p>
                        </div>

                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {formatRequestAmount(
                            request.offeredPrice
                          )}{" "}
                          / quintal
                        </p>
                      </div>

                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays
                            size={14}
                            className="text-gray-400"
                          />

                          <p className="text-xs text-gray-400">
                            Requested On
                          </p>
                        </div>

                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {formatDate(request.createdAt)}
                        </p>
                      </div>
                    </div>

                    {lot?.pickupLocation && (
                      <div className="flex items-start gap-2 mt-4 text-sm text-gray-600">
                        <MapPin
                          size={15}
                          className="text-gray-400 mt-0.5 shrink-0"
                        />

                        <span>
                          Pickup:{" "}
                          <span className="font-semibold text-gray-800">
                            {lot.pickupLocation}
                          </span>
                        </span>
                      </div>
                    )}

                    {buyer?.mobile && (
                      <div className="mt-2 text-xs text-gray-500">
                        Buyer contact: {buyer.mobile}
                      </div>
                    )}

                    {request.buyerNote && (
                      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
                        <p className="text-xs font-semibold text-gray-500">
                          Buyer Note
                        </p>

                        <p className="text-sm text-gray-700 mt-1">
                          {request.buyerNote}
                        </p>
                      </div>
                    )}

                    {request.sellerNote && (
                      <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
                        <p className="text-xs font-semibold text-gray-500">
                          Seller Note
                        </p>

                        <p className="text-sm text-gray-700 mt-1">
                          {request.sellerNote}
                        </p>
                      </div>
                    )}
                  </div>

                  {request.status === "pending" && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-3 border-t border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500">
                        Review this request before accepting or rejecting it.
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() =>
                            handlePurchaseRequestResponse(
                              request._id,
                              "reject"
                            )
                          }
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle size={14} />
                          {isActionLoading
                            ? "Processing..."
                            : "Reject"}
                        </button>

                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() =>
                            handlePurchaseRequestResponse(
                              request._id,
                              "accept"
                            )
                          }
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle2 size={14} />
                          {isActionLoading
                            ? "Processing..."
                            : "Accept Request"}
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-10 text-center">
            <ShoppingCart
              size={30}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm font-semibold text-gray-700">
              No purchase requests yet
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Buyer requests for your listed lots will appear here.
            </p>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={sellerSearch}
            onChange={(e) => setSellerSearch(e.target.value)}
            placeholder="Search crop, lot ID or pickup location..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: "all", label: "All Lots" },
            { id: "listed", label: "Listed" },
            { id: "reserved", label: "Reserved" },
            { id: "sold", label: "Sold" },
            { id: "draft", label: "Drafts" },
            { id: "cancelled", label: "Cancelled" },
          ].map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setSellerFilter(filter.id)}
              className={`
                whitespace-nowrap px-4 py-2 rounded-full text-sm
                font-semibold border transition-colors
                ${
                  sellerFilter === filter.id
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

      <section className="space-y-3">
        {sellerLoading ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Package
              size={32}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm font-semibold text-gray-700">
              Loading your lots...
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Fetching your latest marketplace data.
            </p>
          </div>
        ) : sellerError ? (
          <div className="bg-white border border-red-200 rounded-xl p-10 text-center">
            <XCircle
              size={32}
              className="mx-auto text-red-400"
            />

            <p className="mt-3 text-sm font-semibold text-red-700">
              Unable to load your lots
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {sellerError}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Retry
            </button>
          </div>
        ) : filteredSellerLots.length > 0 ? (
          filteredSellerLots.map((lot) => {
            const status = getStatusConfig(lot.status);
            const StatusIcon = status.icon;

            return (
              <article
                key={lot._id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
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
                              lot.commodity,
                              t
                            )}
                          </h2>

                          <span
                            className={`
                              inline-flex items-center gap-1 px-2 py-1
                              rounded-full border text-[11px] font-semibold
                              ${status.className}
                            `}
                          >
                            <StatusIcon size={11} />
                            {status.label}
                          </span>
                        </div>

                        <p className="text-xs text-gray-400 mt-1">
                          {lot._id} · Created{" "}
                          {formatDate(lot.createdAt)}
                        </p>

                        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-1.5">
                            <Package
                              size={14}
                              className="text-gray-400"
                            />
                            {lot.quantity}{" "}
                            {lot.unit === "quintal"
                              ? "Quintals"
                              : lot.unit}
                          </span>

                          <span>
                            {getGradeLabel(lot.grade)}
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
                        {lot.transportation === "buyer"
                          ? "Buyer will arrange"
                          : lot.transportation ===
                              "seller"
                            ? "Seller will arrange"
                            : "Platform will arrange"}
                      </p>
                    </div>
                  </div>

                  {lot.status === "sold" && (
                    <div className="mt-5 rounded-lg border border-green-100 bg-green-50 px-4 py-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2
                          size={17}
                          className="text-green-600 mt-0.5"
                        />

                        <div>
                          <p className="text-sm font-semibold text-green-800">
                            Sale completed
                          </p>

                          <p className="text-xs text-green-700 mt-0.5">
                            This lot has been marked as sold.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {lot.status === "cancelled" && (
                    <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                      <div className="flex items-start gap-2">
                        <XCircle
                          size={17}
                          className="text-red-600 mt-0.5"
                        />

                        <div>
                          <p className="text-sm font-semibold text-red-800">
                            Lot cancelled
                          </p>

                          <p className="text-xs text-red-700 mt-0.5">
                            This lot is no longer available.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap justify-end gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50">
                  <button
                    type="button"
                    onClick={() =>
                      handleViewLot(lot._id)
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <Eye size={14} />
                    View Details
                  </button>

                  {(lot.status === "draft" ||
                    lot.status === "listed") && (
                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          "Lot editing will be connected to the edit workflow next."
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <Pencil size={14} />
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
            onClick={() => navigate("/payments")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 text-sm font-semibold"
          >
            View Payments
            <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}