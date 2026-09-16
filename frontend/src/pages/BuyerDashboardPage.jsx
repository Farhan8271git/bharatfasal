import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleHelp,
  Clock3,
  FileCheck2,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

import { getLots } from "../api/lots.api";
import { getMandiPrices } from "../api/mandiPrices.api";
import { getBuyerOrders } from "../api/orders.api";
import { getMyDemands } from "../api/demands.api";
import { getMyVerification } from "../api/verifications.api";

const formatCurrency = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusLabel = (status) => {
  if (!status) {
    return "Unknown";
  }

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const getVerificationStatusLabel = (status) => {
  const labels = {
    pending: "Pending",
    under_review: "Under Review",
    approved: "Approved",
    rejected: "Rejected",
  };

  return labels[status] || "Not Submitted";
};

const getVerificationStatusClass = (status) => {
  const classes = {
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    under_review: "bg-blue-50 text-blue-700 border-blue-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    classes[status] ||
    "bg-slate-50 text-slate-600 border-slate-200"
  );
};

const getDocumentStatus = (value) => {
  return value === true ? "Verified" : "Not Submitted";
};

const getDocumentStatusClass = (value) => {
  return value === true
    ? "text-emerald-700"
    : "text-slate-500";
};

const getOrderId = (order) => {
  return order?._id || order?.id || "";
};

const getLotId = (order) => {
  if (!order?.lotId) {
    return "";
  }

  if (typeof order.lotId === "string") {
    return order.lotId;
  }

  return order.lotId._id || order.lotId.id || "";
};

const normalizeLot = (lot) => {
  const totalQuantity = Number(lot?.quantity) || 0;
  const reservedQuantity = Number(lot?.reservedQuantity) || 0;
  const availableQuantity = Math.max(
    0,
    totalQuantity - reservedQuantity
  );

  return {
    ...lot,
    id: lot?._id || lot?.id,
    commodity: lot?.commodity || "Unknown Commodity",
    quantity: availableQuantity,
    totalQuantity,
    reservedQuantity,
    unit: lot?.unit || "quintal",
    grade: lot?.grade || "—",
    expectedPrice: Number(lot?.expectedPrice) || 0,
    pickupLocation: lot?.pickupLocation || "—",
    availableDate: lot?.availableDate || null,
    transportation: lot?.transportation || "buyer",
    status: lot?.status || "listed",
    seller: lot?.seller || null,
  };
};

const normalizeOrder = (order) => {
  const quantity = Number(order?.quantity) || 0;
  const pricePerUnit = Number(order?.pricePerUnit) || 0;

  return {
    ...order,
    id: getOrderId(order),
    lotId: getLotId(order),
    orderNumber: order?.orderNumber || "—",
    quantity,
    unit: order?.unit || "quintal",
    pricePerUnit,
    totalAmount:
      Number(order?.totalAmount) ||
      quantity * pricePerUnit,
    status: order?.status || "pending",
    paymentStatus: order?.paymentStatus || "pending",
    fulfillmentStatus:
      order?.fulfillmentStatus || "pending",
    pickupLocation: order?.pickupLocation || "—",
    deliveryLocation: order?.deliveryLocation || "—",
    placedAt: order?.placedAt || order?.createdAt || null,
    confirmedAt: order?.confirmedAt || null,
  };
};

const normalizeDemand = (demand) => {
  return {
    ...demand,
    id: demand?._id || demand?.id,
    commodity: demand?.commodity || "Unknown Commodity",
    quantity: Number(demand?.quantity) || 0,
    unit: demand?.unit || "quintal",
    grade: demand?.grade || "—",
    estimatedPrice: Number(demand?.estimatedPrice) || 0,
    deliveryLocation: demand?.deliveryLocation || "—",
    deadline: demand?.deadline || null,
    transportation: demand?.transportation || "buyer",
    status: demand?.status || "active",
  };
};

export default function BuyerDashboardPage({ user }) {
  const navigate = useNavigate();

  const [verificationOpen, setVerificationOpen] =
    useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [questionType, setQuestionType] =
    useState("Payment");
  const [questionText, setQuestionText] = useState("");
  const [questionSubmitted, setQuestionSubmitted] =
    useState(false);

  const [lots, setLots] = useState([]);
  const [marketWatch, setMarketWatch] = useState([]);
  const [recentProcurement, setRecentProcurement] =
    useState([]);
  const [activeDemands, setActiveDemands] = useState([]);
  const [activeDemandCount, setActiveDemandCount] =
    useState(0);

  const [verification, setVerification] = useState(null);
  const [verificationLoading, setVerificationLoading] =
    useState(false);
  const [verificationError, setVerificationError] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const buyerName =
    user?.name ||
    user?.fullName ||
    user?.organizationName ||
    "Buyer";

  const buyerLocation = [
    user?.district,
    user?.state,
  ]
    .filter(Boolean)
    .join(", ") || "—";

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [
          lotsResponse,
          mandiResponse,
          ordersResponse,
          demandsResponse,
        ] = await Promise.all([
          getLots({
            status: "listed",
            page: 1,
            limit: 8,
          }),
          getMandiPrices(),
          getBuyerOrders({
            page: 1,
            limit: 4,
          }),
          getMyDemands({
            status: "active",
            page: 1,
            limit: 4,
          }),
        ]);

        if (cancelled) {
          return;
        }

        const normalizedLots = Array.isArray(
          lotsResponse?.lots
        )
          ? lotsResponse.lots.map(normalizeLot)
          : [];

        const normalizedOrders = Array.isArray(
          ordersResponse?.orders
        )
          ? ordersResponse.orders.map(normalizeOrder)
          : [];

        const normalizedDemands = Array.isArray(
          demandsResponse?.demands
        )
          ? demandsResponse.demands.map(normalizeDemand)
          : [];

        setLots(
          normalizedLots.filter(
            (lot) => lot.quantity > 0
          )
        );

        setMarketWatch(
          Array.isArray(mandiResponse?.prices)
            ? mandiResponse.prices
            : Array.isArray(mandiResponse)
              ? mandiResponse
              : []
        );

        setRecentProcurement(normalizedOrders);
        setActiveDemands(normalizedDemands);

        setActiveDemandCount(
          Number(
            demandsResponse?.pagination?.total
          ) || normalizedDemands.length
        );
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        setError(
          requestError?.message ||
            "Unable to load buyer dashboard."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadVerification = async () => {
      setVerificationLoading(true);
      setVerificationError("");

      try {
        const response = await getMyVerification();

        if (cancelled) {
          return;
        }

        setVerification(
          response?.verification || null
        );
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        setVerificationError(
          requestError?.message ||
            "Unable to load verification details."
        );
        setVerification(null);
      } finally {
        if (!cancelled) {
          setVerificationLoading(false);
        }
      }
    };

    loadVerification();

    return () => {
      cancelled = true;
    };
  }, []);

  const availableLotCount = useMemo(() => {
    return lots.filter(
      (lot) =>
        lot.status === "listed" &&
        lot.quantity > 0
    ).length;
  }, [lots]);

  const totalPurchased = useMemo(() => {
    return recentProcurement.reduce(
      (total, order) => {
        return total + (Number(order.quantity) || 0);
      },
      0
    );
  }, [recentProcurement]);

  const bestMandiPrice = useMemo(() => {
    const modalPrices = marketWatch
      .map((item) => Number(item?.modal_price))
      .filter((price) => Number.isFinite(price));

    if (!modalPrices.length) {
      return null;
    }

    return Math.max(...modalPrices);
  }, [marketWatch]);

  const priceAlerts = useMemo(() => {
    return marketWatch
      .filter((item) => {
        const modalPrice = Number(
          item?.modal_price
        );

        return Number.isFinite(modalPrice);
      })
      .slice(0, 3)
      .map((item) => ({
        id:
          item?._id ||
          `${item?.commodity}-${item?.market}`,
        commodity: item?.commodity || "Commodity",
        market: item?.market || "Market",
        price: Number(item?.modal_price) || 0,
      }));
  }, [marketWatch]);

  const isVerified =
    verification?.status === "approved";

  const verificationRows = [
    {
      label: "Account",
      value:
        verification?.name ||
        buyerName,
      icon: UserRound,
    },
    {
      label: "Organization",
      value:
        verification?.businessName ||
        "—",
      icon: Building2,
    },
    {
      label: "Mobile",
      value:
        verification?.phone ||
        "—",
      icon: UserRound,
    },
    {
      label: "Location",
      value:
        verification?.location ||
        verification?.address ||
        buyerLocation,
      icon: MapPin,
    },
    {
      label: "Verification Status",
      value: getVerificationStatusLabel(
        verification?.status
      ),
      icon: ShieldCheck,
    },
    {
      label: "PAN",
      value: getDocumentStatus(
        verification?.documents?.pan
      ),
      icon: FileCheck2,
    },
    {
      label: "GST",
      value: getDocumentStatus(
        verification?.documents?.gst
      ),
      icon: FileCheck2,
    },
    {
      label: "Business Proof",
      value: getDocumentStatus(
        verification?.documents?.businessProof
      ),
      icon: FileCheck2,
    },
    {
      label: "Bank Proof",
      value: getDocumentStatus(
        verification?.documents?.bankProof
      ),
      icon: FileCheck2,
    },
    {
      label: "Submitted",
      value: formatDate(
        verification?.submittedAt
      ),
      icon: CalendarDays,
    },
  ];

  const handleOpenQuestion = (order) => {
    setSelectedOrder(order);
    setQuestionType("Payment");
    setQuestionText("");
    setQuestionSubmitted(false);
    setQuestionOpen(true);
  };

  const handleCloseQuestion = () => {
    setQuestionOpen(false);
    setSelectedOrder(null);
    setQuestionText("");
    setQuestionSubmitted(false);
  };

  const handleSubmitQuestion = (event) => {
    event.preventDefault();

    if (!selectedOrder || !questionText.trim()) {
      return;
    }

    console.log("RAISE QUESTION:", {
      orderId: selectedOrder.id,
      lotId: selectedOrder.lotId,
      issue: questionType,
      description: questionText.trim(),
    });

    setQuestionSubmitted(true);
  };

  const handleBrowseLots = () => {
    navigate("/lots");
  };

  const handleCreateDemand = () => {
    navigate("/buyers?mode=post");
  };

  const handleViewPayments = () => {
    navigate("/payments");
  };

  const handleViewDemands = () => {
    navigate("/buyers?mode=demands");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex items-center gap-3 text-slate-600">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Loading buyer dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-medium">
                Unable to load dashboard data
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>
          </div>
        )}

        <section className="mb-8">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-medium text-emerald-600">
                Buyer Dashboard
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Welcome back, {buyerName}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                {buyerLocation}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleBrowseLots}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <ShoppingCart className="h-4 w-4" />
                Browse Lots
              </button>

              <button
                type="button"
                onClick={handleViewDemands}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Package className="h-4 w-4" />
                My Demands
              </button>

              <button
                type="button"
                onClick={handleCreateDemand}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                <Plus className="h-4 w-4" />
                Create Demand
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <Package className="h-5 w-5" />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Available
              </span>
            </div>

            <p className="mt-4 text-2xl font-bold text-slate-900">
              {availableLotCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Available Lots
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <ShoppingCart className="h-5 w-5" />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Recent
              </span>
            </div>

            <p className="mt-4 text-2xl font-bold text-slate-900">
              {totalPurchased > 0
                ? `${totalPurchased.toLocaleString("en-IN")} q`
                : "—"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Purchased Quantity
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                <Bell className="h-5 w-5" />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Market
              </span>
            </div>

            <p className="mt-4 text-2xl font-bold text-slate-900">
              {bestMandiPrice
                ? formatCurrency(bestMandiPrice)
                : "—"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Highest Modal Price
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
                <CircleHelp className="h-5 w-5" />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Active
              </span>
            </div>

            <p className="mt-4 text-2xl font-bold text-slate-900">
              {activeDemandCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Active Demands
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Available Lots
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Live lots currently available for procurement
                </p>
              </div>

              <button
                type="button"
                onClick={handleBrowseLots}
                className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {lots.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-slate-500">
                  No available lots found.
                </div>
              ) : (
                lots.slice(0, 4).map((lot) => (
                  <div
                    key={lot.id}
                    className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-semibold text-slate-900">
                          {lot.commodity}
                        </h3>

                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          {lot.grade}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>
                          {lot.quantity.toLocaleString(
                            "en-IN"
                          )}{" "}
                          {lot.unit}
                        </span>

                        <span>
                          {formatCurrency(
                            lot.expectedPrice
                          )} / {lot.unit}
                        </span>

                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {lot.pickupLocation}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleBrowseLots}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      View Lot
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">
                Market Watch
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest available mandi modal prices
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {priceAlerts.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-slate-500">
                  Market price data unavailable.
                </div>
              ) : (
                priceAlerts.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">
                        {item.commodity}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {item.market}
                      </p>
                    </div>

                    <p className="shrink-0 font-semibold text-slate-900">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Active Demands
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Your active procurement requirements
                </p>
              </div>

              <button
                type="button"
                onClick={handleViewDemands}
                className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {activeDemands.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-slate-500">
                  No active demands found.
                </div>
              ) : (
                activeDemands.map((demand) => (
                  <div
                    key={demand.id}
                    className="px-5 py-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {demand.commodity}
                          </h3>

                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                            {getStatusLabel(
                              demand.status
                            )}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span>
                            {demand.quantity.toLocaleString(
                              "en-IN"
                            )}{" "}
                            {demand.unit}
                          </span>

                          <span>
                            Up to{" "}
                            {formatCurrency(
                              demand.estimatedPrice
                            )}
                          </span>

                          <span>
                            Deadline{" "}
                            {formatDate(
                              demand.deadline
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {demand.deliveryLocation}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Recent Procurement
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Your latest purchase orders
                </p>
              </div>

              <button
                type="button"
                onClick={handleViewPayments}
                className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Payments
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentProcurement.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-slate-500">
                  No procurement orders found.
                </div>
              ) : (
                recentProcurement.map((order) => (
                  <div
                    key={order.id}
                    className="px-5 py-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900">
                            {order.orderNumber}
                          </p>

                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                            {getStatusLabel(
                              order.status
                            )}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          {order.quantity.toLocaleString(
                            "en-IN"
                          )}{" "}
                          {order.unit} ·{" "}
                          {formatCurrency(
                            order.pricePerUnit
                          )}{" "}
                          / {order.unit}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Placed{" "}
                          {formatDate(order.placedAt)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                        <p className="font-semibold text-slate-900">
                          {formatCurrency(
                            order.totalAmount
                          )}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenQuestion(order)
                          }
                          className="mt-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                        >
                          Raise Question
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />

                  <h2 className="font-semibold text-slate-900">
                    Buyer Verification
                  </h2>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Verification information linked to your buyer account.
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                  isVerified
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                {isVerified ? (
                  <BadgeCheck className="h-3.5 w-3.5" />
                ) : (
                  <Clock3 className="h-3.5 w-3.5" />
                )}

                {getVerificationStatusLabel(
                  verification?.status
                )}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Organization
                </p>

                <p className="mt-1 truncate font-semibold text-slate-900">
                  {verification?.businessName ||
                    "—"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Business Type
                </p>

                <p className="mt-1 truncate font-semibold text-slate-900">
                  {verification?.businessType ||
                    "—"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setVerificationOpen(true)}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <FileCheck2 className="h-4 w-4" />
              View Verification Details
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                <Star className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Buyer Performance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Performance metrics will be shown when the corresponding backend data is available.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Buyer Rating
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  —
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Lots Matched
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  —
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Completed Purchases
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  —
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Disputes
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  —
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <Truck className="h-5 w-5" />
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Logistics
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Track fulfillment and transportation for confirmed orders.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Procurement
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Review your latest orders and payment status.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
                <CircleHelp className="h-5 w-5" />
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Support
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Raise a question against a specific procurement order.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {verificationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Verification Details
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Current verification information from your account.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setVerificationOpen(false)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close verification details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              {verificationLoading ? (
                <div className="flex items-center justify-center py-12 text-sm text-slate-500">
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Loading verification details...
                </div>
              ) : verificationError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {verificationError}
                </div>
              ) : !verification ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <ShieldCheck className="mx-auto h-8 w-8 text-slate-400" />

                  <p className="mt-3 font-medium text-slate-700">
                    Verification not submitted
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    No verification record is currently available for this buyer account.
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className={`mb-5 flex items-center justify-between rounded-xl border p-4 ${getVerificationStatusClass(
                      verification.status
                    )}`}
                  >
                    <div>
                      <p className="text-xs font-medium">
                        Verification Status
                      </p>

                      <p className="mt-1 text-lg font-bold">
                        {getVerificationStatusLabel(
                          verification.status
                        )}
                      </p>
                    </div>

                    {verification.status ===
                    "approved" ? (
                      <BadgeCheck className="h-7 w-7" />
                    ) : (
                      <Clock3 className="h-7 w-7" />
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {verificationRows.map(
                      ({
                        label,
                        value,
                        icon: Icon,
                      }) => {
                        const isDocument =
                          [
                            "PAN",
                            "GST",
                            "Business Proof",
                            "Bank Proof",
                          ].includes(label);

                        const documentValue =
                          isDocument
                            ? verification?.documents?.[
                                label === "PAN"
                                  ? "pan"
                                  : label === "GST"
                                    ? "gst"
                                    : label ===
                                        "Business Proof"
                                      ? "businessProof"
                                      : "bankProof"
                              ]
                            : null;

                        return (
                          <div
                            key={label}
                            className="rounded-xl border border-slate-100 p-4"
                          >
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                              <Icon className="h-4 w-4" />
                              {label}
                            </div>

                            <p
                              className={`mt-2 text-sm font-semibold ${
                                isDocument
                                  ? getDocumentStatusClass(
                                      documentValue
                                    )
                                  : "text-slate-900"
                              }`}
                            >
                              {value}
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>

                  {verification.rejectionReason && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                      <p className="text-xs font-semibold text-red-700">
                        Rejection Reason
                      </p>

                      <p className="mt-1 text-sm text-red-600">
                        {verification.rejectionReason}
                      </p>
                    </div>
                  )}

                  {verification.reviewedAt && (
                    <p className="mt-5 text-xs text-slate-500">
                      Reviewed on{" "}
                      {formatDate(
                        verification.reviewedAt
                      )}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {questionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Raise Question
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {selectedOrder?.orderNumber || "Order"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseQuestion}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close question dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {questionSubmitted ? (
              <div className="p-6 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />

                <h3 className="mt-4 font-semibold text-slate-900">
                  Question recorded
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Your question has been captured for this order.
                </p>

                <button
                  type="button"
                  onClick={handleCloseQuestion}
                  className="mt-5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmitQuestion}
                className="space-y-5 p-5"
              >
                <div>
                  <label
                    htmlFor="questionType"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Issue Type
                  </label>

                  <select
                    id="questionType"
                    value={questionType}
                    onChange={(event) =>
                      setQuestionType(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="Payment">
                      Payment
                    </option>

                    <option value="Order">
                      Order
                    </option>

                    <option value="Logistics">
                      Logistics
                    </option>

                    <option value="Quality">
                      Quality
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="questionText"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="questionText"
                    value={questionText}
                    onChange={(event) =>
                      setQuestionText(
                        event.target.value
                      )
                    }
                    rows={5}
                    maxLength={1000}
                    placeholder="Describe the issue..."
                    className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />

                  <p className="mt-1 text-right text-xs text-slate-400">
                    {questionText.length}/1000
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseQuestion}
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!questionText.trim()}
                    className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Submit Question
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}