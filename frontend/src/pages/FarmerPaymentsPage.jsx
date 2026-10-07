import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  WalletCards,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  Package,
  MapPin,
  Truck,
  Eye,
  MessageCircle,
  ArrowRight,
  CircleHelp,
  AlertCircle,
  X,
} from "lucide-react";
import { getSellerOrders } from "../api/orders.api";

const formatCurrency = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatStatus = (status) => {
  if (!status) {
    return "Not available";
  }

  return String(status)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatPaymentStatus = (status) => {
  const normalizedStatus = String(status || "").toLowerCase();

  const labels = {
    pending: "Pending",
    paid: "Paid",
    failed: "Failed",
    refunded: "Refunded",
    partially_refunded: "Partially Refunded",
  };

  return labels[normalizedStatus] || formatStatus(status);
};

const formatDate = (date) => {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getBuyerName = (buyer) => {
  if (!buyer || typeof buyer !== "object") {
    return "Buyer not available";
  }

  return (
    buyer.organizationName ||
    buyer.name ||
    buyer.businessType ||
    "Buyer not available"
  );
};

const mapOrderToPayment = (order) => {
  const lot =
    order?.lotId && typeof order.lotId === "object"
      ? order.lotId
      : {};

  const buyer =
    order?.buyerId && typeof order.buyerId === "object"
      ? order.buyerId
      : {};

  return {
    rawOrder: order,
    id: order?.orderNumber || order?._id || "—",
    orderId: order?.orderNumber || order?._id || "—",
    lotId:
      typeof order?.lotId === "object"
        ? order?.lotId?._id || "—"
        : order?.lotId || "—",
    crop: lot?.commodity || "Commodity not available",
    quantity: Number(order?.quantity) || 0,
    unit: order?.unit || "quintal",
    buyer: getBuyerName(buyer),
    location:
      order?.pickupLocation ||
      lot?.pickupLocation ||
      "Location not available",
    amount: Number(order?.totalAmount) || 0,
    pricePerUnit: Number(order?.pricePerUnit) || 0,
    transport: formatStatus(order?.transportation),
    paymentStatus: formatPaymentStatus(order?.paymentStatus),
    orderStatus: formatStatus(order?.status),
    deliveryStatus: formatStatus(order?.fulfillmentStatus),
    orderDate: formatDate(order?.placedAt),
  };
};

const isPaymentCompleted = (payment) =>
  String(payment?.rawOrder?.paymentStatus || "").toLowerCase() === "paid";

const isPaymentPending = (payment) =>
  String(payment?.rawOrder?.paymentStatus || "").toLowerCase() === "pending";

const isDeliveryCompleted = (payment) =>
  ["delivered", "completed"].includes(
    String(payment?.rawOrder?.fulfillmentStatus || "").toLowerCase()
  );

function Status({ children, type = "green" }) {
  const styles = {
    green: "bg-green-50 text-green-700 border-green-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
    red: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        styles[type] || styles.gray
      }`}
    >
      {children}
    </span>
  );
}

export default function FarmerPaymentsPage() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [question, setQuestion] = useState(null);
  const [questionText, setQuestionText] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadSellerOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getSellerOrders({
          page: 1,
          limit: 20,
        });

        if (!mounted) {
          return;
        }

        const mappedOrders = Array.isArray(response?.orders)
          ? response.orders.map(mapOrderToPayment)
          : [];

        setPayments(mappedOrders);
      } catch (requestError) {
        if (!mounted) {
          return;
        }

        setError(
          requestError?.message ||
            "Unable to load your sales and payment records."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSellerOrders();

    return () => {
      mounted = false;
    };
  }, []);

  const totalReceived = payments
    .filter(isPaymentCompleted)
    .reduce((sum, payment) => sum + payment.amount, 0);

  const protectedAmount = payments
    .filter(isPaymentPending)
    .reduce((sum, payment) => sum + payment.amount, 0);

  const completedTransactions = payments.filter(
    isPaymentCompleted
  ).length;

  const activeTransactions = payments.filter(
    (payment) => !["cancelled"].includes(
      String(payment?.rawOrder?.status || "").toLowerCase()
    )
  ).length;

  const closeQuestion = () => {
    setQuestion(null);
    setQuestionText("");
  };

  const submitQuestion = () => {
    if (!questionText.trim()) {
      return;
    }

    closeQuestion();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              Seller Payments
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              Payments & Sales
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Track payments received from your crop sales.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={15} className="text-green-600" />
            Payment status from procurement orders
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<WalletCards size={19} />}
            iconClass="bg-green-50 text-green-600"
            label="Payments Received"
            value={formatCurrency(totalReceived)}
            description={`${completedTransactions} completed payment${
              completedTransactions === 1 ? "" : "s"
            }`}
          />

          <SummaryCard
            icon={<Clock3 size={19} />}
            iconClass="bg-amber-50 text-amber-600"
            label="Payment Pending"
            value={formatCurrency(protectedAmount)}
            description="Order value awaiting payment"
          />

          <SummaryCard
            icon={<Package size={19} />}
            iconClass="bg-blue-50 text-blue-600"
            label="Sales Transactions"
            value={activeTransactions}
            description={`${payments.length} orders loaded`}
          />
        </div>

        <div className="rounded-xl border border-green-200 bg-white p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Bharat Fasal Payment Tracking
                </h2>

                <p className="mt-1 max-w-3xl text-sm text-gray-500">
                  Payment and fulfillment status shown here is derived from
                  your procurement orders. Payment gateway settlement and
                  release workflows will be handled separately.
                </p>
              </div>
            </div>

            <Status type="green">
              Order Data Synced
            </Status>
          </div>
        </div>

        <section>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Sales
              </h2>

              <p className="mt-0.5 text-sm text-gray-500">
                Orders associated with your crop sales
              </p>
            </div>

            {!loading && (
              <span className="text-xs text-gray-400">
                {payments.length} transactions
              </span>
            )}
          </div>

          {loading && (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
              <div className="mx-auto h-8 w-8 rounded-full border-2 border-gray-200 border-t-green-600 animate-spin" />

              <p className="mt-4 text-sm font-medium text-gray-700">
                Loading sales and payment records...
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Fetching your latest seller orders.
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-white p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <AlertCircle size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Unable to load payment records
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && payments.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500">
                <Package size={22} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-gray-900">
                No sales transactions yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Accepted procurement orders will appear here.
              </p>
            </div>
          )}

          {!loading && !error && payments.length > 0 && (
            <div className="space-y-4">
              {payments.map((payment) => {
                const paymentCompleted = isPaymentCompleted(payment);
                const paymentPending = isPaymentPending(payment);
                const deliveryCompleted = isDeliveryCompleted(payment);

                return (
                  <div
                    key={payment.id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                  >
                    <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                          <Package size={19} />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-gray-900">
                              {payment.crop}
                            </h3>

                            <Status
                              type={
                                paymentCompleted
                                  ? "green"
                                  : paymentPending
                                  ? "amber"
                                  : "gray"
                              }
                            >
                              {payment.paymentStatus}
                            </Status>
                          </div>

                          <p className="mt-1 text-xs text-gray-400">
                            Order ID: {payment.orderId}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            Lot ID: {payment.lotId}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 sm:min-w-[180px]">
                        <p className="text-xs text-gray-500">
                          Sale Amount
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
                      <DetailItem
                        label="Buyer"
                        value={payment.buyer}
                      />

                      <DetailItem
                        label="Quantity"
                        value={`${payment.quantity} ${payment.unit}`}
                      />

                      <div>
                        <p className="text-xs text-gray-400">
                          Sale Location
                        </p>

                        <p className="mt-1 flex items-start gap-1 text-sm font-semibold text-gray-900">
                          <MapPin
                            size={14}
                            className="mt-0.5 shrink-0 text-gray-400"
                          />
                          {payment.location}
                        </p>
                      </div>

                      <DetailItem
                        label="Sale Date"
                        value={payment.orderDate}
                      />
                    </div>

                    <div className="mx-5 mb-5 overflow-hidden rounded-lg border border-gray-200">
                      <div className="border-b border-gray-100 bg-gray-50 px-4 py-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Transaction Status
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4">
                        <StatusItem
                          label="Payment"
                          value={payment.paymentStatus}
                          icon={
                            paymentCompleted ? (
                              <CheckCircle2 size={14} />
                            ) : (
                              <Clock3 size={14} />
                            )
                          }
                          type={
                            paymentCompleted
                              ? "green"
                              : paymentPending
                              ? "amber"
                              : "blue"
                          }
                        />

                        <StatusItem
                          label="Order"
                          value={payment.orderStatus}
                          icon={<Package size={14} />}
                          type="blue"
                        />

                        <StatusItem
                          label="Transportation"
                          value={payment.transport}
                          icon={<Truck size={14} />}
                          type="blue"
                        />

                        <StatusItem
                          label="Delivery"
                          value={payment.deliveryStatus}
                          icon={
                            deliveryCompleted ? (
                              <CheckCircle2 size={14} />
                            ) : (
                              <Truck size={14} />
                            )
                          }
                          type={
                            deliveryCompleted
                              ? "green"
                              : "blue"
                          }
                        />
                      </div>
                    </div>

                    <div className="mx-5 mb-5 rounded-lg border border-gray-200 p-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs text-gray-400">
                            Price per Unit
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {formatCurrency(payment.pricePerUnit)} /{" "}
                            {payment.unit}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Transportation
                          </p>

                          <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-gray-900">
                            <Truck size={16} className="text-gray-500" />
                            {payment.transport}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 bg-gray-50 px-5 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/orders/${payment.orderId}`)
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        <Eye size={14} />
                        View Order
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setQuestion(payment);
                          setQuestionText("");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        <MessageCircle size={14} />
                        Raise a Question
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CircleHelp size={19} className="text-gray-500" />

            <div>
              <p className="text-sm font-semibold text-gray-900">
                Need help with a payment?
              </p>

              <p className="text-xs text-gray-500">
                Open a dispute for transaction-related issues.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/disputes")}
            className="inline-flex items-center gap-1 text-sm font-semibold text-green-700"
          >
            Open support
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {question && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Payment Question
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {question.crop} · {question.orderId}
                </p>
              </div>

              <button
                type="button"
                onClick={closeQuestion}
                className="rounded-lg p-2 hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <textarea
              value={questionText}
              onChange={(event) => setQuestionText(event.target.value)}
              className="mt-4 min-h-[110px] w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-green-500"
              placeholder="Describe your question..."
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeQuestion}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submitQuestion}
                disabled={!questionText.trim()}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  iconClass,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-xs text-gray-500">
            {label}
          </p>

          <p className="mt-1 text-xl font-bold text-gray-900">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-gray-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}

function StatusItem({
  label,
  value,
  icon,
  type = "blue",
}) {
  const styles = {
    green: "text-green-700",
    amber: "text-amber-700",
    blue: "text-blue-700",
  };

  return (
    <div className="border-b border-gray-100 p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="text-xs text-gray-400">
        {label}
      </p>

      <div
        className={`mt-1 flex items-center gap-1.5 ${
          styles[type] || styles.blue
        }`}
      >
        {icon}

        <span className="text-sm font-semibold">
          {value}
        </span>
      </div>
    </div>
  );
}