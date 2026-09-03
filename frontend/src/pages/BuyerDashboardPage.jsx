import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Handshake,
  IndianRupee,
  MapPin,
  Package,
  Plus,
  ShoppingCart,
  Star,
  Store,
  TrendingDown,
  TrendingUp,
  Wallet,
  BarChart3,
  ShieldCheck,
  X,
  AlertCircle,
  Truck,
  FileWarning,
  CheckCircle2,
} from "lucide-react";

import { mandiPrices } from "../data/mockPrices";
import { demandBoard } from "../data/mockBuyers";
import { commodities } from "../data/mockCommodities";
import { myLots } from "../data/mockLots";
import { payments } from "../data/mockLogistics";

import {
  formatCurrency,
  getStatusColor,
  formatDate,
} from "../utils/formatters";

export default function BuyerDashboardPage({ user }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // =====================================================
  // USER
  // =====================================================

  const buyerName =
    user?.name || "Buyer";

  const companyName =
    user?.companyName || "Buyer Organization";

  const buyerLocation =
    user?.location || "India";

  // Prototype verification status.
  const isVerified =
    user?.verificationStatus !== "unverified";

  // =====================================================
  // MODALS
  // =====================================================

  const [verificationOpen, setVerificationOpen] =
    useState(false);

  const [questionOpen, setQuestionOpen] =
    useState(false);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [questionType, setQuestionType] =
    useState("Quantity mismatch");

  const [questionText, setQuestionText] =
    useState("");

  const [questionSubmitted, setQuestionSubmitted] =
    useState(false);

  // =====================================================
  // DATA
  // =====================================================

  const getCommodity = (id) =>
    commodities.find(
      (commodity) => commodity.id === id
    );

  const activeDemands =
    demandBoard.slice(0, 4);

  const availableLots =
    myLots
      .filter((lot) => lot.status === "listed")
      .slice(0, 4);

  const marketWatch =
    mandiPrices.slice(0, 4);

  // =====================================================
  // RECENT PROCUREMENT
  // =====================================================
  // Demo data for prototype.
  // Lot ID is deliberately shown here because
  // disputes must identify the exact lot.

  const recentProcurement = [
    {
      id: "BF-ORD-1024",
      lotId: "BF-LOT-10452",
      commodity: "Wheat",
      quantity: "500 Quintals",
      amount: 1250000,
      status: "Delivered",
      payment: "Protected",
      quality: "Verified",
      transport: "Buyer arranged",
      date: "28 Aug 2026",
    },
    {
      id: "BF-ORD-1021",
      lotId: "BF-LOT-10431",
      commodity: "Rice",
      quantity: "300 Quintals",
      amount: 870000,
      status: "In Transit",
      payment: "Protected",
      quality: "Verified",
      transport: "Seller arranged",
      date: "30 Aug 2026",
    },
    {
      id: "BF-ORD-1018",
      lotId: "BF-LOT-10408",
      commodity: "Tomato",
      quantity: "120 Quintals",
      amount: 312000,
      status: "Delivered",
      payment: "Released",
      quality: "Verified",
      transport: "Buyer arranged",
      date: "26 Aug 2026",
    },
  ];

  // =====================================================
  // QUICK ACTIONS
  // =====================================================

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

  // =====================================================
  // OPEN QUESTION
  // =====================================================

  const openQuestion = (order) => {
    setSelectedOrder(order);
    setQuestionType("Quantity mismatch");
    setQuestionText("");
    setQuestionSubmitted(false);
    setQuestionOpen(true);
  };

  // =====================================================
  // SUBMIT QUESTION
  // =====================================================

  const submitQuestion = () => {
    if (!selectedOrder) return;

    if (!questionText.trim()) {
      alert("Please describe the issue.");
      return;
    }

    // Prototype submission.
    // Later this can be replaced with API call.
    console.log("RAISE QUESTION:", {
      orderId: selectedOrder.id,
      lotId: selectedOrder.lotId,
      issue: questionType,
      description: questionText,
    });

    setQuestionSubmitted(true);
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-7 pb-10">

      {/* =====================================================
          BUYER HEADER
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          rounded-2xl
          min-h-[210px]
          border
          border-green-100
          bg-gray-900
        "
      >

        {/* Buyer / business background */}

        <div
          className="
            absolute
            inset-0
            bg-cover
            bg-center
          "
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1800&q=85')",
          }}
        />

        {/* Soft overlay */}

        <div className="absolute inset-0 bg-white/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/65 to-white/25" />

        {/* Header content */}

        <div
          className="
            relative
            z-10
            min-h-[210px]
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-5
            px-6
            py-6
          "
        >

          <div>

            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
              <span>Buyer Dashboard</span>
              <span className="text-gray-300">/</span>
              <span>Overview</span>
            </div>

            {/* PERSON NAME */}

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {buyerName}
            </h1>

            {/* COMPANY NAME */}

            <p className="mt-1 text-base sm:text-lg font-semibold text-gray-700">
              {companyName}
            </p>

            {/* LOCATION + VERIFICATION */}

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">

              <span className="inline-flex items-center gap-1.5 text-gray-600">
                <MapPin size={15} />
                {buyerLocation}
              </span>

              {isVerified && (
                <button
                  type="button"
                  onClick={() =>
                    setVerificationOpen(true)
                  }
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    font-semibold
                    text-green-700
                    hover:text-green-800
                    hover:underline
                  "
                >
                  <BadgeCheck size={17} />
                  Verified Buyer
                </button>
              )}

            </div>

          </div>

          {/* POST DEMAND */}

          <button
            type="button"
            onClick={() =>
              navigate("/buyers")
            }
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-lg
              bg-green-600
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-green-700
            "
          >
            <Plus size={17} />
            Post New Demand
          </button>

        </div>

      </section>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">

        {/* ACTIVE DEMANDS */}

        <div className="rounded-xl border border-gray-200 bg-white px-4 py-4">

          <div className="flex items-center justify-between">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Package size={19} />
            </div>

          </div>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            6
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Active Demands
          </p>

        </div>

        {/* MATCHED LOTS */}

        <div className="rounded-xl border border-gray-200 bg-white px-4 py-4">

          <div className="flex items-center justify-between">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <Handshake size={19} />
            </div>

          </div>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            24
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Lots Matched
          </p>

        </div>

        {/* PURCHASED */}

        <div className="rounded-xl border border-gray-200 bg-white px-4 py-4">

          <div className="flex items-center justify-between">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <CircleDollarSign size={19} />
            </div>

          </div>

          <p className="mt-4 text-xl font-bold text-gray-900 sm:text-2xl">
            {formatCurrency(1250000)}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Total Purchased
          </p>

        </div>

        {/* RATING */}

        <div className="rounded-xl border border-gray-200 bg-white px-4 py-4">

          <div className="flex items-center justify-between">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Star size={19} />
            </div>

          </div>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            4.5
            <span className="ml-1 text-sm font-normal text-gray-400">
              / 5
            </span>
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Buyer Rating
          </p>

        </div>

      </section>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

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
                onClick={() =>
                  navigate(action.path)
                }
                className="
                  group
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  p-4
                  text-left
                  transition
                  hover:border-gray-300
                  hover:shadow-sm
                "
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

      {/* =====================================================
          ACTIVE DEMANDS + MARKET WATCH
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* ACTIVE DEMANDS */}

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
              onClick={() =>
                navigate("/buyers")
              }
              className="text-sm font-semibold text-green-700 hover:text-green-800"
            >
              View all
            </button>

          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

            {activeDemands.map(
              (demand, index) => {

                const isUrgent =
                  demand.status?.toLowerCase() ===
                  "urgent";

                return (
                  <div
                    key={index}
                    className={`
                      p-4
                      ${
                        index !==
                        activeDemands.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }
                      ${
                        isUrgent
                          ? "bg-red-50/30"
                          : ""
                      }
                    `}
                  >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                          <Package size={18} />
                        </div>

                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-semibold text-gray-900">
                              {t(demand.commodityId)}
                            </h3>

                            <span
                              className={`
                                rounded-full
                                px-2
                                py-0.5
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

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">

                            <span>
                              {demand.quantity}
                            </span>

                            <span>
                              Grade {demand.grade}
                            </span>

                            <span className="inline-flex items-center gap-1">
                              <CalendarDays size={12} />
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

                      </div>

                      <div className="text-left sm:text-right">

                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(
                            demand.priceOffered
                          )}
                        </p>

                        <p className="text-xs text-gray-500">
                          per quintal
                        </p>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </section>

        {/* MARKET WATCH */}

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
              onClick={() =>
                navigate("/prices")
              }
              className="text-sm font-semibold text-green-700"
            >
              View all
            </button>

          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

            {marketWatch.map(
              (price, index) => {

                const change =
                  Number(price.change || 0);

                return (
                  <div
                    key={index}
                    className={`
                      flex
                      items-center
                      justify-between
                      gap-3
                      p-4
                      ${
                        index !==
                        marketWatch.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }
                    `}
                  >

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                        <Store size={17} />
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-gray-900">
                          {t(price.commodityId)}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {price.mandi}
                        </p>

                      </div>

                    </div>

                    <div className="flex-shrink-0 text-right">

                      <p className="text-sm font-bold text-gray-900">
                        {formatCurrency(
                          price.price
                        )}
                      </p>

                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-0.5
                          text-[11px]
                          font-semibold
                          ${
                            change >= 0
                              ? "text-green-600"
                              : "text-red-500"
                          }
                        `}
                      >

                        {change >= 0 ? (
                          <TrendingUp size={11} />
                        ) : (
                          <TrendingDown size={11} />
                        )}

                        {Math.abs(change).toFixed(1)}%

                      </span>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </section>

      </div>

      {/* =====================================================
          AVAILABLE LOTS
      ===================================================== */}

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
            onClick={() =>
              navigate("/lots")
            }
            className="inline-flex items-center gap-1 text-sm font-semibold text-green-700"
          >
            Browse all
            <ChevronRight size={15} />
          </button>

        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

          {availableLots.map((lot) => {

            const commodity =
              getCommodity(lot.commodityId);

            return (
              <div
                key={lot.id}
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  p-4
                  transition
                  hover:border-gray-300
                  hover:shadow-sm
                "
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
                  {t(lot.commodityId)}
                </h3>

                {/* LOT ID */}

                <p className="mt-1 text-xs font-semibold text-green-700">
                  Lot ID: {lot.id}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {lot.quantity} {t("quintals")} · Grade {lot.grade}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Listed {formatDate(lot.createdAt)}
                </p>

                <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-3">

                  <div>

                    <p className="text-[11px] text-gray-400">
                      Expected price
                    </p>

                    <p className="mt-0.5 text-base font-bold text-gray-900">

                      {formatCurrency(
                        lot.expectedPrice
                      )}

                      <span className="ml-1 text-xs font-normal text-gray-400">
                        /q
                      </span>

                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/lots")
                    }
                    className="
                      rounded-lg
                      bg-green-600
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-white
                      hover:bg-green-700
                    "
                  >
                    Make Offer
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      </section>

      {/* =====================================================
          RECENT PROCUREMENT
      ===================================================== */}

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
            onClick={() =>
              navigate("/payments")
            }
            className="text-sm font-semibold text-green-700"
          >
            View all
          </button>

        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

          {recentProcurement.map(
            (order, index) => (

              <div
                key={order.id}
                className={`
                  p-4
                  ${
                    index !==
                    recentProcurement.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }
                `}
              >

                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                  {/* ORDER INFO */}

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Package size={18} />
                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-semibold text-gray-900">
                          {order.commodity}
                        </h3>

                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                          {order.status}
                        </span>

                      </div>

                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">

                        <span>
                          Order ID: {order.id}
                        </span>

                        <span className="font-semibold text-green-700">
                          Lot ID: {order.lotId}
                        </span>

                        <span>
                          {order.quantity}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* STATUS */}

                  <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4 xl:min-w-[520px]">

                    <div>

                      <p className="text-gray-400">
                        Payment
                      </p>

                      <p className="mt-1 flex items-center gap-1 font-semibold text-gray-700">
                        <ShieldCheck size={13} className="text-green-600" />
                        {order.payment}
                      </p>

                    </div>

                    <div>

                      <p className="text-gray-400">
                        Quality
                      </p>

                      <p className="mt-1 flex items-center gap-1 font-semibold text-gray-700">
                        <CheckCircle2 size={13} className="text-green-600" />
                        {order.quality}
                      </p>

                    </div>

                    <div>

                      <p className="text-gray-400">
                        Transportation
                      </p>

                      <p className="mt-1 flex items-center gap-1 font-semibold text-gray-700">
                        <Truck size={13} className="text-gray-500" />
                        {order.transport}
                      </p>

                    </div>

                    <div>

                      <p className="text-gray-400">
                        Amount
                      </p>

                      <p className="mt-1 font-bold text-gray-900">
                        {formatCurrency(order.amount)}
                      </p>

                    </div>

                  </div>

                  {/* QUESTION */}

                  <button
                    type="button"
                    onClick={() =>
                      openQuestion(order)
                    }
                    className="
                      inline-flex
                      w-fit
                      items-center
                      gap-2
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-gray-700
                      hover:border-red-200
                      hover:bg-red-50
                      hover:text-red-700
                    "
                  >
                    <AlertCircle size={15} />
                    Raise a Question
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      </section>

      {/* =====================================================
          VERIFICATION MODAL
      ===================================================== */}

      {verificationOpen && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

              <div>

                <h2 className="text-lg font-bold text-gray-900">
                  Buyer Verification
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Trust information for this buyer
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setVerificationOpen(false)
                }
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={19} />
              </button>

            </div>

            <div className="p-5">

              <div className="flex items-center gap-3 rounded-xl bg-green-50 border border-green-100 p-4">

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
                  ["Buyer Rating", "4.5 / 5"],
                  ["Completed Purchases", "24"],
                  ["Disputes", "0"],
                ].map(([label, value]) => (

                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-gray-100 pb-3"
                  >

                    <span className="text-sm text-gray-500">
                      {label}
                    </span>

                    <span className="text-sm font-semibold text-gray-900 text-right">
                      {value}
                    </span>

                  </div>

                ))}

              </div>

              <p className="mt-4 text-xs text-gray-400">
                Verification details shown here are demo data for the prototype.
              </p>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          RAISE QUESTION MODAL
      ===================================================== */}

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

                    <p className="text-xs text-gray-500 mt-1">
                      Report an issue with this procurement
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setQuestionOpen(false)
                    }
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                  >
                    <X size={19} />
                  </button>

                </div>

                <div className="p-5">

                  {/* ORDER / LOT */}

                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">

                    <div className="flex items-center gap-2">

                      <FileWarning
                        size={17}
                        className="text-gray-600"
                      />

                      <p className="text-sm font-semibold text-gray-900">
                        {selectedOrder.commodity}
                      </p>

                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-3 text-xs">

                      <div>

                        <p className="text-gray-400">
                          Order ID
                        </p>

                        <p className="mt-1 font-semibold text-gray-700">
                          {selectedOrder.id}
                        </p>

                      </div>

                      <div>

                        <p className="text-gray-400">
                          Lot ID
                        </p>

                        <p className="mt-1 font-semibold text-green-700">
                          {selectedOrder.lotId}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* ISSUE TYPE */}

                  <div className="mt-5">

                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      What is the issue?
                    </label>

                    <select
                      value={questionType}
                      onChange={(e) =>
                        setQuestionType(e.target.value)
                      }
                      className="
                        w-full
                        h-11
                        rounded-lg
                        border
                        border-gray-200
                        px-3
                        text-sm
                        outline-none
                        focus:border-green-500
                        focus:ring-2
                        focus:ring-green-100
                      "
                    >

                      <option>
                        Quantity mismatch
                      </option>

                      <option>
                        Quality issue
                      </option>

                      <option>
                        Delivery problem
                      </option>

                      <option>
                        Payment issue
                      </option>

                      <option>
                        Damaged produce
                      </option>

                      <option>
                        Other
                      </option>

                    </select>

                  </div>

                  {/* DESCRIPTION */}

                  <div className="mt-4">

                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Describe the issue
                    </label>

                    <textarea
                      value={questionText}
                      onChange={(e) =>
                        setQuestionText(e.target.value)
                      }
                      rows={4}
                      placeholder="Explain what happened..."
                      className="
                        w-full
                        rounded-lg
                        border
                        border-gray-200
                        px-3
                        py-3
                        text-sm
                        outline-none
                        resize-none
                        focus:border-green-500
                        focus:ring-2
                        focus:ring-green-100
                      "
                    />

                  </div>

                  {/* ACTIONS */}

                  <div className="mt-5 flex justify-end gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        setQuestionOpen(false)
                      }
                      className="
                        rounded-lg
                        border
                        border-gray-200
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-gray-700
                        hover:bg-gray-50
                      "
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={submitQuestion}
                      className="
                        rounded-lg
                        bg-red-600
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        hover:bg-red-700
                      "
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
                  Lot ID: {selectedOrder.lotId}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Prototype dispute reference: BF-DSP-{Date.now().toString().slice(-5)}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setQuestionOpen(false)
                  }
                  className="
                    mt-6
                    rounded-lg
                    bg-green-600
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    hover:bg-green-700
                  "
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