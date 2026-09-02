import { useState } from "react";
import {
  ShieldCheck,
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  MapPin,
  FileText,
  MessageCircle,
  X,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const procurementOrders = [
  {
    orderId: "BF-ORD-1024",
    lotId: "BF-LOT-10452",
    crop: "Wheat",
    quantity: 500,
    grade: "Grade A",
    seller: "Shiv Farmers FPO",
    location: "Gorakhpur, Uttar Pradesh",
    produceCost: 1250000,
    transportCost: 18000,
    paymentStatus: "Protected",
    qualityStatus: "Verified",
    quantityStatus: "Verified",
    transport: "Buyer arranged",
    deliveryStatus: "In Transit",
    orderDate: "25 Aug 2026",
    expectedDelivery: "5 Sep 2026",
  },
  {
    orderId: "BF-ORD-1021",
    lotId: "BF-LOT-10431",
    crop: "Rice",
    quantity: 300,
    grade: "Grade A",
    seller: "Eastern Grain FPO",
    location: "Karnal, Haryana",
    produceCost: 870000,
    transportCost: 22000,
    paymentStatus: "Protected",
    qualityStatus: "Verified",
    quantityStatus: "Verified",
    transport: "Seller arranged",
    deliveryStatus: "In Transit",
    orderDate: "22 Aug 2026",
    expectedDelivery: "4 Sep 2026",
  },
  {
    orderId: "BF-ORD-1018",
    lotId: "BF-LOT-10408",
    crop: "Tomato",
    quantity: 120,
    grade: "Grade A",
    seller: "Fresh Harvest FPO",
    location: "Nashik, Maharashtra",
    produceCost: 312000,
    transportCost: 12000,
    paymentStatus: "Released",
    qualityStatus: "Verified",
    quantityStatus: "Verified",
    transport: "Buyer arranged",
    deliveryStatus: "Delivered",
    orderDate: "15 Aug 2026",
    expectedDelivery: "20 Aug 2026",
  },
  {
    orderId: "BF-ORD-1012",
    lotId: "BF-LOT-10392",
    crop: "Soybean",
    quantity: 200,
    grade: "Grade A",
    seller: "Malwa Agro FPO",
    location: "Indore, Madhya Pradesh",
    produceCost: 1040000,
    transportCost: 16000,
    paymentStatus: "Released",
    qualityStatus: "Verified",
    quantityStatus: "Verified",
    transport: "Seller arranged",
    deliveryStatus: "Delivered",
    orderDate: "10 Aug 2026",
    expectedDelivery: "16 Aug 2026",
  },
];

export default function PaymentsPage({ user }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionOrder, setQuestionOrder] = useState(null);
  const [questionType, setQuestionType] = useState("Payment");
  const [questionText, setQuestionText] = useState("");
  const [questionSent, setQuestionSent] = useState(false);

  const formatCurrency = (value) => {
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  const getLandedCost = (order) => {
    return order.produceCost + order.transportCost;
  };

  const totalPaymentHeld = procurementOrders
    .filter((order) => order.paymentStatus === "Protected")
    .reduce((total, order) => total + order.produceCost, 0);

  const totalPaymentReleased = procurementOrders
    .filter((order) => order.paymentStatus === "Released")
    .reduce((total, order) => total + order.produceCost, 0);

  const activeOrders = procurementOrders.filter(
    (order) => order.deliveryStatus !== "Delivered"
  ).length;

  const openQuestionModal = (order) => {
    setQuestionOrder(order);
    setQuestionType("Payment");
    setQuestionText("");
    setQuestionSent(false);
    setShowQuestionModal(true);
  };

  const closeQuestionModal = () => {
    setShowQuestionModal(false);
    setQuestionOrder(null);
    setQuestionText("");
    setQuestionSent(false);
  };

  const submitQuestion = () => {
    if (!questionText.trim()) return;
    setQuestionSent(true);
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-10">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-7">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-1">
            Buyer Procurement
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Orders & Payments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Track your purchases, protected payments and payment releases.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-600">
          <ShieldCheck size={17} className="text-green-600" />
          Protected procurement transactions
        </div>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">

        <SummaryCard
          icon={<Package size={20} />}
          iconClass="bg-blue-50 text-blue-600"
          label="Active Orders"
          value={activeOrders}
          description="Orders currently in progress"
        />

        <SummaryCard
          icon={<ShieldCheck size={20} />}
          iconClass="bg-amber-50 text-amber-600"
          label="Payment Held"
          value={formatCurrency(totalPaymentHeld)}
          description="Produce payments currently protected"
        />

        <SummaryCard
          icon={<CheckCircle2 size={20} />}
          iconClass="bg-green-50 text-green-600"
          label="Payment Released"
          value={formatCurrency(totalPaymentReleased)}
          description="Completed procurement payments"
        />
      </div>

      {/* =====================================================
          PROTECTED PAYMENT BANNER
      ====================================================== */}
      <div className="bg-white border border-green-200 rounded-2xl p-5 mb-8 shadow-sm">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div className="flex items-start gap-3">

            <div className="h-11 w-11 shrink-0 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Bharat Fasal Protected Payment
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl leading-5">
                Payment remains protected until delivery and successful
                quantity and quality verification. Once the procurement
                conditions are satisfied, the payment can be released.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
            <CheckCircle2 size={15} />
            Transaction Protected
          </div>
        </div>
      </div>

      {/* =====================================================
          PROCUREMENT ORDERS HEADER
      ====================================================== */}
      <div className="flex items-end justify-between mb-4">

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Procurement Orders
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Orders, verification, transportation and delivery status
          </p>
        </div>

        <span className="text-xs font-medium text-gray-500">
          {procurementOrders.length} orders
        </span>
      </div>

      {/* =====================================================
          ORDER CARDS
      ====================================================== */}
      <div className="space-y-5">

        {procurementOrders.map((order) => {

          const landedCost = getLandedCost(order);
          const landedPerQuintal = landedCost / order.quantity;

          const isDelivered =
            order.deliveryStatus === "Delivered";

          return (
            <div
              key={order.orderId}
              className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                overflow-hidden
                shadow-sm
              "
            >

              {/* =================================================
                  ORDER HEADER
              ================================================== */}
              <div className="px-5 py-4 bg-gray-50/80 border-b border-gray-200">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                  <div className="flex items-start gap-3">

                    <div className="h-11 w-11 shrink-0 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-green-700">
                      <Package size={21} />
                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                          {order.crop}
                        </h3>

                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold">
                          {order.grade}
                        </span>

                        <span
                          className={`
                            px-2.5 py-1 rounded-full text-[11px] font-semibold
                            ${
                              order.paymentStatus === "Protected"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-green-50 text-green-700"
                            }
                          `}
                        >
                          {order.paymentStatus === "Protected"
                            ? "Payment Protected"
                            : "Payment Released"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">

                        <span>
                          Order ID: {order.orderId}
                        </span>

                        <span>
                          Lot ID: {order.lotId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* LANDED COST */}
                  <div className="lg:text-right bg-white border border-gray-200 rounded-xl px-4 py-3">

                    <p className="text-[11px] font-medium text-gray-500">
                      Estimated Landed Cost
                    </p>

                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(landedCost)}
                    </p>

                    <p className="text-[11px] text-gray-500">
                      {formatCurrency(landedPerQuintal)} / quintal
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  ORDER DETAILS
              ================================================== */}
              <div className="p-5">

                {/* BASIC INFO */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-600 mb-5">

                  <span>
                    <strong className="text-gray-800">
                      {order.quantity}
                    </strong>{" "}
                    Quintals
                  </span>

                  <span>
                    <strong className="text-gray-800">
                      {order.grade}
                    </strong>
                  </span>

                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {order.location}
                  </span>

                  <span>
                    Seller:{" "}
                    <strong className="text-gray-800">
                      {order.seller}
                    </strong>
                  </span>
                </div>

                {/* =================================================
                    COST SECTION
                ================================================== */}
                <div className="rounded-xl border border-gray-200 overflow-hidden mb-5">

                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                      Procurement Cost
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">

                    {/* PRODUCE */}
                    <div className="p-4">

                      <p className="text-xs text-gray-500">
                        Produce Cost
                      </p>

                      <p className="text-base font-bold text-gray-900 mt-1">
                        {formatCurrency(order.produceCost)}
                      </p>

                      <p className="text-[11px] text-gray-500 mt-1">
                        Crop purchase value
                      </p>
                    </div>

                    {/* TRANSPORT */}
                    <div className="p-4">

                      <p className="text-xs text-gray-500">
                        Estimated Transportation
                      </p>

                      <p className="text-base font-bold text-gray-900 mt-1 flex items-center gap-1.5">
                        <Truck size={15} className="text-gray-500" />
                        {formatCurrency(order.transportCost)}
                      </p>

                      <p className="text-[11px] text-gray-500 mt-1">
                        {order.transport}
                      </p>
                    </div>

                    {/* LANDED */}
                    <div className="p-4 bg-green-50/60">

                      <p className="text-xs text-green-700">
                        Estimated Landed Cost
                      </p>

                      <p className="text-base font-bold text-green-800 mt-1">
                        {formatCurrency(landedCost)}
                      </p>

                      <p className="text-[11px] text-green-700 mt-1">
                        {formatCurrency(landedPerQuintal)} / quintal
                      </p>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    STATUS SECTION
                ================================================== */}
                <div className="rounded-xl border border-gray-200 overflow-hidden mb-5">

                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
                      Procurement Status
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4">

                    <StatusBox
                      title="Payment"
                      value={order.paymentStatus}
                      icon={
                        order.paymentStatus === "Protected" ? (
                          <ShieldCheck size={15} />
                        ) : (
                          <CheckCircle2 size={15} />
                        )
                      }
                      tone={
                        order.paymentStatus === "Protected"
                          ? "amber"
                          : "green"
                      }
                    />

                    <StatusBox
                      title="Quality"
                      value={order.qualityStatus}
                      icon={<CheckCircle2 size={15} />}
                      tone="green"
                    />

                    <StatusBox
                      title="Quantity"
                      value={order.quantityStatus}
                      icon={<CheckCircle2 size={15} />}
                      tone="green"
                    />

                    <StatusBox
                      title="Delivery"
                      value={order.deliveryStatus}
                      icon={
                        isDelivered ? (
                          <CheckCircle2 size={15} />
                        ) : (
                          <Truck size={15} />
                        )
                      }
                      tone={isDelivered ? "green" : "blue"}
                    />
                  </div>
                </div>

                {/* =================================================
                    TRANSPORT + DELIVERY SECTION
                ================================================== */}
                <div className="rounded-xl border border-gray-200 bg-white p-4 mb-5">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* TRANSPORT */}
                    <div className="flex items-start gap-3">

                      <div className="h-9 w-9 shrink-0 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600">
                        <Truck size={17} />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Transportation
                        </p>

                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                          {order.transport}
                        </p>

                        <p className="text-xs text-gray-500 mt-0.5">
                          Estimated cost:{" "}
                          <span className="font-semibold text-gray-700">
                            {formatCurrency(order.transportCost)}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* DELIVERY */}
                    <div className="flex items-start gap-3 md:border-l md:border-gray-200 md:pl-4">

                      <div className="h-9 w-9 shrink-0 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600">
                        <Clock3 size={17} />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Expected Delivery
                        </p>

                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                          {order.expectedDelivery}
                        </p>

                        <p className="text-xs text-gray-500 mt-0.5">
                          Current status:{" "}
                          <span className="font-semibold text-gray-700">
                            {order.deliveryStatus}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    ACTIONS
                ================================================== */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-1">

                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="
                      h-10
                      px-4
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      text-sm
                      font-semibold
                      text-gray-700
                      hover:bg-gray-50
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    View Order
                    <ArrowRight size={15} />
                  </button>

                  {isDelivered &&
                    order.paymentStatus === "Released" && (
                      <button
                        type="button"
                        className="
                          h-10
                          px-4
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          text-sm
                          font-semibold
                          text-gray-700
                          hover:bg-gray-50
                          flex
                          items-center
                          justify-center
                          gap-2
                        "
                      >
                        <FileText size={15} />
                        Receipt
                      </button>
                    )}

                  <button
                    type="button"
                    onClick={() => openQuestionModal(order)}
                    className="
                      h-10
                      px-4
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      text-sm
                      font-semibold
                      text-gray-700
                      hover:bg-gray-50
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    <MessageCircle size={15} />
                    Raise a Question
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================
          ORDER DETAILS MODAL
      ====================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* HEADER */}
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedOrder.crop} Procurement
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {selectedOrder.orderId} • {selectedOrder.lotId}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5">

              {/* SELLER + LOT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="rounded-xl border border-gray-200 p-4">

                  <p className="text-xs text-gray-500">
                    Seller
                  </p>

                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {selectedOrder.seller}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {selectedOrder.location}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">

                  <p className="text-xs text-gray-500">
                    Quantity & Quality
                  </p>

                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {selectedOrder.quantity} Quintals
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {selectedOrder.grade}
                  </p>
                </div>
              </div>

              {/* COST */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">

                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">
                    Procurement Cost
                  </p>
                </div>

                <div className="p-4 space-y-3">

                  <CostRow
                    label="Produce Cost"
                    value={formatCurrency(selectedOrder.produceCost)}
                  />

                  <CostRow
                    label="Estimated Transportation"
                    value={formatCurrency(selectedOrder.transportCost)}
                  />

                  <div className="border-t border-gray-100 pt-3 flex justify-between">

                    <span className="text-sm font-semibold text-gray-900">
                      Estimated Landed Cost
                    </span>

                    <span className="text-base font-bold text-green-700">
                      {formatCurrency(
                        getLandedCost(selectedOrder)
                      )}
                    </span>
                  </div>

                  <p className="text-right text-xs text-gray-500">
                    {formatCurrency(
                      getLandedCost(selectedOrder) /
                        selectedOrder.quantity
                    )}{" "}
                    / quintal
                  </p>
                </div>
              </div>

              {/* PROTECTION */}
              <div className="rounded-xl border border-green-200 bg-green-50 p-4">

                <div className="flex items-start gap-3">

                  <ShieldCheck
                    size={20}
                    className="text-green-600 mt-0.5"
                  />

                  <div>

                    <p className="text-sm font-semibold text-green-800">
                      {selectedOrder.paymentStatus === "Protected"
                        ? "Payment is Protected"
                        : "Payment Released"}
                    </p>

                    <p className="text-xs text-green-700 mt-1 leading-5">
                      {selectedOrder.paymentStatus === "Protected"
                        ? "Payment remains protected while delivery and verification are completed."
                        : "Payment was released after the procurement conditions were completed."}
                    </p>
                  </div>
                </div>
              </div>

              {/* STATUS FLOW */}
              <div className="rounded-xl border border-gray-200 p-4">

                <p className="text-sm font-semibold text-gray-900 mb-4">
                  Procurement Status
                </p>

                <div className="space-y-3">

                  <StatusStep
                    title="Purchase Confirmed"
                    completed
                  />

                  <StatusStep
                    title="Payment Protected"
                    completed
                  />

                  <StatusStep
                    title="Quality & Quantity Verified"
                    completed
                  />

                  <StatusStep
                    title="Transportation"
                    completed
                  />

                  <StatusStep
                    title="Delivery"
                    completed={
                      selectedOrder.deliveryStatus === "Delivered"
                    }
                    active={
                      selectedOrder.deliveryStatus === "In Transit"
                    }
                  />

                  <StatusStep
                    title="Payment Released"
                    completed={
                      selectedOrder.paymentStatus === "Released"
                    }
                    active={
                      selectedOrder.paymentStatus === "Protected"
                    }
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="
                  w-full
                  h-11
                  rounded-xl
                  bg-gray-900
                  text-white
                  font-semibold
                  hover:bg-gray-800
                "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          QUESTION MODAL
      ====================================================== */}
      {showQuestionModal && questionOrder && (
        <div className="fixed inset-0 z-[110] bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">

            <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Raise a Question
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {questionOrder.orderId} • {questionOrder.lotId}
                </p>
              </div>

              <button
                type="button"
                onClick={closeQuestionModal}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {!questionSent ? (
              <div className="p-5">

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-5">

                  <p className="text-xs text-gray-500">
                    Procurement
                  </p>

                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {questionOrder.crop} •{" "}
                    {questionOrder.quantity} Quintals
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Lot ID: {questionOrder.lotId}
                  </p>
                </div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Issue Type
                </label>

                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="
                    w-full
                    h-11
                    rounded-xl
                    border
                    border-gray-200
                    px-3
                    text-sm
                    bg-white
                    outline-none
                    focus:border-green-500
                  "
                >
                  <option>Payment</option>
                  <option>Quality</option>
                  <option>Quantity</option>
                  <option>Transportation</option>
                  <option>Delivery</option>
                  <option>Other</option>
                </select>

                <label className="block text-sm font-semibold text-gray-700 mt-5 mb-2">
                  Describe your question
                </label>

                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Describe the issue or question..."
                  rows={4}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    px-4
                    py-3
                    text-sm
                    resize-none
                    outline-none
                    focus:border-green-500
                    focus:ring-2
                    focus:ring-green-100
                  "
                />

                <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">

                  <AlertCircle size={15} className="mt-0.5 shrink-0" />

                  <p>
                    Your question will be associated with this order
                    and lot for easier resolution.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={submitQuestion}
                  disabled={!questionText.trim()}
                  className="
                    w-full
                    h-11
                    mt-5
                    rounded-xl
                    bg-green-600
                    text-white
                    font-semibold
                    hover:bg-green-700
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  Submit Question
                </button>
              </div>
            ) : (
              <div className="p-8 text-center">

                <div className="
                  h-14
                  w-14
                  mx-auto
                  rounded-full
                  bg-green-50
                  flex
                  items-center
                  justify-center
                  text-green-600
                ">
                  <CheckCircle2 size={30} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mt-4">
                  Question Submitted
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Your{" "}
                  <span className="font-semibold text-gray-800">
                    {questionType.toLowerCase()}
                  </span>{" "}
                  question has been linked to{" "}
                  <span className="font-semibold text-gray-800">
                    {questionOrder.lotId}
                  </span>
                  .
                </p>

                <button
                  type="button"
                  onClick={closeQuestionModal}
                  className="
                    mt-6
                    h-10
                    px-6
                    rounded-lg
                    bg-gray-900
                    text-white
                    text-sm
                    font-semibold
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

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon,
  iconClass,
  label,
  value,
  description,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

      <div className="flex items-start gap-3">

        <div
          className={`
            h-10
            w-10
            shrink-0
            rounded-xl
            flex
            items-center
            justify-center
            ${iconClass}
          `}
        >
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-xs text-gray-500">
            {label}
          </p>

          <p className="text-xl font-bold text-gray-900 mt-0.5 truncate">
            {value}
          </p>

          <p className="text-[11px] text-gray-500 mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STATUS BOX
========================================================= */

function StatusBox({
  title,
  value,
  icon,
  tone,
}) {
  const styles = {
    green: {
      wrapper: "bg-green-50/70 border-green-100",
      icon: "text-green-600",
      value: "text-green-800",
    },
    amber: {
      wrapper: "bg-amber-50/70 border-amber-100",
      icon: "text-amber-600",
      value: "text-amber-800",
    },
    blue: {
      wrapper: "bg-blue-50/70 border-blue-100",
      icon: "text-blue-600",
      value: "text-blue-800",
    },
  };

  const current = styles[tone] || styles.green;

  return (
    <div
      className={`
        rounded-xl
        border
        p-3
        ${current.wrapper}
      `}
    >
      <p className="text-xs text-gray-500">
        {title}
      </p>

      <p
        className={`
          text-sm
          font-semibold
          mt-1
          flex
          items-center
          gap-1.5
          ${current.value}
        `}
      >
        <span className={current.icon}>
          {icon}
        </span>

        {value}
      </p>
    </div>
  );
}

/* =========================================================
   COST ROW
========================================================= */

function CostRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">

      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-medium text-gray-900">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   STATUS STEP
========================================================= */

function StatusStep({
  title,
  completed = false,
  active = false,
}) {
  return (
    <div className="flex items-center gap-3">

      <div
        className={`
          h-7
          w-7
          rounded-full
          flex
          items-center
          justify-center
          shrink-0
          ${
            completed
              ? "bg-green-100 text-green-700"
              : active
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-400"
          }
        `}
      >
        {completed ? (
          <CheckCircle2 size={16} />
        ) : active ? (
          <Clock3 size={16} />
        ) : (
          <span className="h-2 w-2 rounded-full bg-current" />
        )}
      </div>

      <div
        className={`
          text-sm
          ${
            completed
              ? "font-semibold text-gray-900"
              : active
              ? "font-semibold text-blue-700"
              : "text-gray-400"
          }
        `}
      >
        {title}
      </div>
    </div>
  );
}