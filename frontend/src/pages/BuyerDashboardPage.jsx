import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  BadgeCheck,
  ChevronRight,
  CircleDollarSign,
  Handshake,
  MapPin,
  Package,
  Plus,
  ShoppingCart,
  Star,
  Store,
  Wallet,
  BarChart3,
  ShieldCheck,
  X,
  AlertCircle,
  Truck,
  FileWarning,
  CheckCircle2,
} from "lucide-react";

import { getLots } from "../api/lots.api";
import { getMandiPrices } from "../api/mandiPrices.api";
import { getBuyerOrders } from "../api/orders.api";
import { getBuyerPurchaseRequests } from "../api/purchaseRequests.api";

import {
  formatCurrency,
  formatDate,
} from "../utils/formatters";

export default function BuyerDashboardPage({ user }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const buyerName = user?.name || "Buyer";
  const companyName =
    user?.companyName || user?.businessName || "Buyer Organization";
  const buyerLocation = user?.location || "India";

  const isVerified = user?.verificationStatus !== "unverified";

  const [verificationOpen, setVerificationOpen] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [questionType, setQuestionType] = useState("Quantity mismatch");
  const [questionText, setQuestionText] = useState("");
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  const [availableLots, setAvailableLots] = useState([]);
  const [marketWatch, setMarketWatch] = useState([]);
  const [recentProcurement, setRecentProcurement] = useState([]);
  const [activeDemandCount, setActiveDemandCount] = useState(0);

  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadDashboardData = async () => {
      setDashboardLoading(true);
      setDashboardError("");

      try {
        const [
          lotsResponse,
          mandiResponse,
          ordersResponse,
          purchaseRequestsResponse,
        ] = await Promise.all([
          getLots({
            status: "listed",
            page: 1,
            limit: 4,
          }),
          getMandiPrices(),
          getBuyerOrders({
            page: 1,
            limit: 4,
          }),
          getBuyerPurchaseRequests({
            status: "pending",
            page: 1,
            limit: 1,
          }),
        ]);

        if (cancelled) {
          return;
        }

        const lots = Array.isArray(lotsResponse?.lots)
          ? lotsResponse.lots
          : Array.isArray(lotsResponse?.data)
            ? lotsResponse.data
            : [];

        const mandiRecords = Array.isArray(mandiResponse?.records)
          ? mandiResponse.records
          : [];

        const orders = Array.isArray(ordersResponse?.orders)
          ? ordersResponse.orders
          : [];

        const pendingDemandTotal = Number(
          purchaseRequestsResponse?.pagination?.total
        );

        const activeDemandCount = Number.isFinite(pendingDemandTotal)
          ? pendingDemandTotal
          : Array.isArray(purchaseRequestsResponse?.requests)
            ? purchaseRequestsResponse.requests.length
            : 0;

        setAvailableLots(lots.slice(0, 4));
        setMarketWatch(mandiRecords.slice(0, 4));
        setRecentProcurement(orders.slice(0, 4));
        setActiveDemandCount(activeDemandCount);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setDashboardError(
          error?.message || "Unable to load buyer dashboard data."
        );
      } finally {
        if (!cancelled) {
          setDashboardLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalPurchased = useMemo(
    () =>
      recentProcurement.reduce(
        (total, order) => total + Number(order?.totalAmount || 0),
        0
      ),
    [recentProcurement]
  );

  const openQuestion = (order) => {
    setSelectedOrder(order);
    setQuestionType("Quantity mismatch");
    setQuestionText("");
    setQuestionSubmitted(false);
    setQuestionOpen(true);
  };

  const submitQuestion = () => {
    if (!selectedOrder) {
      return;
    }

    if (!questionText.trim()) {
      alert("Please describe the issue.");
      return;
    }

    console.log("RAISE QUESTION:", {
      orderId: selectedOrder._id,
      lotId: selectedOrder.lotId?._id || selectedOrder.lotId,
      issue: questionType,
      description: questionText,
    });

    setQuestionSubmitted(true);
  };

  const quickActions = [
    {
      title: "Post Demand",
      description: "Create a new requirement",
      icon: Plus,
      path: "/buyers",
    },
    {
      title: "Browse Lots",
      description: "View available produce",
      icon: ShoppingCart,
      path: "/lots",
    },
    {
      title: "Market Prices",
      description: "Check latest mandi rates",
      icon: BarChart3,
      path: "/prices",
    },
    {
      title: "Orders & Payments",
      description: "Manage procurement",
      icon: Wallet,
      path: "/payments",
    },
  ];

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-7 pb-10">
      <section className="relative overflow-hidden rounded-2xl min-h-[210px] border border-green-100 bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1800&q=85')",
          }}
        />

        <div className="absolute inset-0 bg-white/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/65 to-white/25" />

        <div className="relative z-10 min-h-[210px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 px-6 py-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
              <span>Buyer Dashboard</span>
              <span className="text-gray-300">/</span>
              <span>Overview</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {buyerName}
            </h1>

            <p className="mt-1 text-base sm:text-lg font-semibold text-gray-700">
              {companyName}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-1.5 text-gray-600">
                <MapPin size={15} />
                {buyerLocation}
              </span>

              {isVerified && (
                <button
                  type="button"
                  onClick={() => setVerificationOpen(true)}
                  className="inline-flex items-center gap-1.5 font-semibold text-green-700 hover:text-green-800 hover:underline"
                >
                  <BadgeCheck size={17} />
                  Verified Buyer
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/buyers")}
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
          >
            <Plus size={17} />
            Post New Demand
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Package size={19} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            {dashboardLoading ? "Loading..." : activeDemandCount}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Active Demands
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <Handshake size={19} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            —
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Lots Matched
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <CircleDollarSign size={19} />
            </div>
          </div>

          <p className="mt-4 text-xl font-bold text-gray-900 sm:text-2xl">
            {dashboardLoading
              ? "Loading..."
              : formatCurrency(totalPurchased)}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Total Purchased
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Star size={19} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            —
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Buyer Rating
          </p>
        </div>
      </section>

      <section>
        <div className="mb-3">
          <h2 className="text-lg font-bold text-gray-900">
            Quick Actions
          </h2>

          <p className="mt-0.5 text-sm text-gray-500">
            Common procurement activities
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                type="button"
                onClick={() => navigate(action.path)}
                className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-gray-300 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-600 group-hover:bg-green-50 group-hover:text-green-600">
                  <Icon size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {action.title}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {action.description}
                  </p>
                </div>

                <ChevronRight
                  size={16}
                  className="text-gray-300 group-hover:text-gray-500"
                />
              </button>
            );
          })}
        </div>
      </section>

      {dashboardError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {dashboardError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                My Active Demands
              </h2>

              <p className="mt-0.5 text-sm text-gray-500">
                Current procurement requirements
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/buyers")}
              className="text-sm font-semibold text-green-700 hover:text-green-800"
            >
              View all
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6 text-center text-sm text-gray-500">
              Active demand data is not available from the current backend.
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Market Watch
              </h2>

              <p className="mt-0.5 text-sm text-gray-500">
                Latest mandi prices
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/prices")}
              className="text-sm font-semibold text-green-700"
            >
              View all
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            {dashboardLoading ? (
              <div className="p-6 text-center text-sm text-gray-500">
                Loading market prices...
              </div>
            ) : marketWatch.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No market prices available.
              </div>
            ) : (
              marketWatch.map((price, index) => {
                const modalPrice = Number(price.modal_price || 0);

                return (
                  <div
                    key={`${price.commodity}-${price.market}-${price.state}`}
                    className={`flex items-center justify-between gap-3 p-4 ${
                      index !== marketWatch.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                        <Store size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {price.commodity}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {price.market}, {price.state}
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {formatCurrency(modalPrice)}
                      </p>

                      <p className="mt-0.5 text-[11px] text-gray-400">
                        Modal price
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Available Lots
            </h2>

            <p className="mt-0.5 text-sm text-gray-500">
              Produce currently listed by farmers
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/lots")}
            className="inline-flex items-center gap-1 text-sm font-semibold text-green-700"
          >
            Browse all
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {dashboardLoading ? (
            <div className="md:col-span-2 xl:col-span-4 rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
              Loading available lots...
            </div>
          ) : availableLots.length === 0 ? (
            <div className="md:col-span-2 xl:col-span-4 rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
              No listed lots are currently available.
            </div>
          ) : (
            availableLots.map((lot) => {
              const availableQuantity = Math.max(
                0,
                Number(lot.quantity || 0) -
                  Number(lot.reservedQuantity || 0)
              );

              return (
                <div
                  key={lot._id}
                  className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                      <Package size={17} />
                    </div>

                    <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-green-700">
                      Listed
                    </span>
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-900">
                    {lot.commodity}
                  </h3>

                  <p className="mt-1 text-xs font-semibold text-green-700">
                    Lot ID: {lot._id}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {availableQuantity} {lot.unit || "quintal"}
                    {availableQuantity !== 1 ? "s" : ""} · Grade{" "}
                    {lot.grade || "—"}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Listed{" "}
                    {lot.createdAt ? formatDate(lot.createdAt) : "—"}
                  </p>

                  <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-3">
                    <div>
                      <p className="text-[11px] text-gray-400">
                        Expected price
                      </p>

                      <p className="mt-0.5 text-base font-bold text-gray-900">
                        {formatCurrency(Number(lot.expectedPrice || 0))}
                        <span className="ml-1 text-xs font-normal text-gray-400">
                          /q
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/lots")}
                      className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
                    >
                      Make Offer
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Procurement
            </h2>

            <p className="mt-0.5 text-sm text-gray-500">
              Orders, lots, payment and delivery status
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/payments")}
            className="text-sm font-semibold text-green-700"
          >
            View all
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {dashboardLoading ? (
            <div className="p-6 text-center text-sm text-gray-500">
              Loading recent procurement...
            </div>
          ) : recentProcurement.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No procurement orders found.
            </div>
          ) : (
            recentProcurement.map((order, index) => {
              const lot = order.lotId;
              const paymentStatus = order.paymentStatus || "pending";
              const fulfillmentStatus =
                order.fulfillmentStatus || "pending";

              const paymentLabel = paymentStatus
                .replaceAll("_", " ")
                .replace(/\b\w/g, (char) => char.toUpperCase());

              const fulfillmentLabel = fulfillmentStatus
                .replaceAll("_", " ")
                .replace(/\b\w/g, (char) => char.toUpperCase());

              return (
                <div
                  key={order._id}
                  className={`p-4 ${
                    index !== recentProcurement.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Package size={18} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {lot?.commodity || "Procurement Order"}
                          </h3>

                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold capitalize text-gray-600">
                            {order.status || "confirmed"}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span>
                            Order ID: {order.orderNumber || order._id}
                          </span>

                          <span className="font-semibold text-green-700">
                            Lot ID: {lot?._id || "—"}
                          </span>

                          <span>
                            {order.quantity} {order.unit || "quintal"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-3 xl:min-w-[420px]">
                      <div>
                        <p className="text-gray-400">
                          Payment
                        </p>

                        <p className="mt-1 flex items-center gap-1 font-semibold capitalize text-gray-700">
                          <ShieldCheck
                            size={13}
                            className="text-green-600"
                          />
                          {paymentLabel}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400">
                          Delivery
                        </p>

                        <p className="mt-1 flex items-center gap-1 font-semibold capitalize text-gray-700">
                          <Truck
                            size={13}
                            className="text-gray-500"
                          />
                          {fulfillmentLabel}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400">
                          Amount
                        </p>

                        <p className="mt-1 font-bold text-gray-900">
                          {formatCurrency(
                            Number(order.totalAmount || 0)
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openQuestion(order)}
                      className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <AlertCircle size={15} />
                      Raise a Question
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {verificationOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Buyer Verification
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Trust information for this buyer
                </p>
              </div>

              <button
                type="button"
                onClick={() => setVerificationOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-green-600">
                  <BadgeCheck size={24} />
                </div>

                <div>
                  <p className="font-bold text-gray-900">
                    Verified Buyer
                  </p>

                  <p className="text-sm text-gray-600">
                    {companyName}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  ["Account", buyerName],
                  ["Organization", companyName],
                  ["Mobile", user?.phone || "Verified"],
                  ["Location", buyerLocation],
                  ["Buyer Rating", "—"],
                  ["Completed Purchases", "—"],
                  ["Disputes", "—"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-gray-100 pb-3"
                  >
                    <span className="text-sm text-gray-500">
                      {label}
                    </span>

                    <span className="text-right text-sm font-semibold text-gray-900">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-gray-400">
                Additional verification statistics are not available from the current backend.
              </p>
            </div>
          </div>
        </div>
      )}

      {questionOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            {!questionSubmitted ? (
              <>
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Raise a Question
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Report an issue with this procurement
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setQuestionOpen(false)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                  >
                    <X size={19} />
                  </button>
                </div>

                <div className="p-5">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center gap-2">
                      <FileWarning
                        size={17}
                        className="text-gray-600"
                      />

                      <p className="text-sm font-semibold text-gray-900">
                        {selectedOrder.lotId?.commodity ||
                          "Procurement Order"}
                      </p>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-400">
                          Order ID
                        </p>

                        <p className="mt-1 font-semibold text-gray-700">
                          {selectedOrder.orderNumber ||
                            selectedOrder._id}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400">
                          Lot ID
                        </p>

                        <p className="mt-1 font-semibold text-green-700">
                          {selectedOrder.lotId?._id || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      What is the issue?
                    </label>

                    <select
                      value={questionType}
                      onChange={(e) =>
                        setQuestionType(e.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    >
                      <option>Quantity mismatch</option>
                      <option>Quality issue</option>
                      <option>Delivery problem</option>
                      <option>Payment issue</option>
                      <option>Damaged produce</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Describe the issue
                    </label>

                    <textarea
                      value={questionText}
                      onChange={(e) =>
                        setQuestionText(e.target.value)
                      }
                      rows={4}
                      placeholder="Explain what happened..."
                      className="w-full resize-none rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div className="mt-5 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setQuestionOpen(false)}
                      className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={submitQuestion}
                      className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Submit Question
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-7 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle2 size={30} />
                </div>

                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  Question Submitted
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Your issue has been recorded against:
                </p>

                <p className="mt-2 text-sm font-semibold text-gray-900">
                  Lot ID:{" "}
                  {selectedOrder.lotId?._id || "—"}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Prototype dispute reference: BF-DSP-
                  {Date.now().toString().slice(-5)}
                </p>

                <button
                  type="button"
                  onClick={() => setQuestionOpen(false)}
                  className="mt-6 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}