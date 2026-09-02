import { useState } from "react";
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
  IndianRupee,
  CircleHelp,
} from "lucide-react";

const payments = [
  {
    id: "BF-PAY-1024",
    orderId: "BF-ORD-1024",
    lotId: "BF-LOT-10452",
    crop: "Wheat",
    quantity: "500 Quintals",
    buyer: "Shiv Farmers FPO",
    location: "Gorakhpur, Uttar Pradesh",
    amount: 1250000,
    transport: "Buyer arranged",
    payment: "Protected",
    quality: "Verified",
    quantityStatus: "Verified",
    delivery: "In Transit",
    date: "5 Sep 2026",
  },
  {
    id: "BF-PAY-1021",
    orderId: "BF-ORD-1021",
    lotId: "BF-LOT-10431",
    crop: "Rice",
    quantity: "300 Quintals",
    buyer: "Eastern Grain FPO",
    location: "Karnal, Haryana",
    amount: 870000,
    transport: "Seller arranged",
    payment: "Protected",
    quality: "Verified",
    quantityStatus: "Verified",
    delivery: "In Transit",
    date: "4 Sep 2026",
  },
  {
    id: "BF-PAY-1012",
    orderId: "BF-ORD-1012",
    lotId: "BF-LOT-10392",
    crop: "Soybean",
    quantity: "200 Quintals",
    buyer: "Malwa Agro FPO",
    location: "Indore, Madhya Pradesh",
    amount: 1040000,
    transport: "Seller arranged",
    payment: "Released",
    quality: "Verified",
    quantityStatus: "Verified",
    delivery: "Delivered",
    date: "16 Aug 2026",
  },
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function Status({ children, type = "green" }) {
  const styles = {
    green: "bg-green-50 text-green-700 border-green-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[type]}`}
    >
      {children}
    </span>
  );
}

export default function FarmerPaymentsPage({ user }) {
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);

  const totalReceived = payments
    .filter((p) => p.payment === "Released")
    .reduce((sum, p) => sum + p.amount, 0);

  const protectedAmount = payments
    .filter((p) => p.payment === "Protected")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              SELLER PAYMENTS
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
            Protected transactions
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <WalletCards size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-500">Payments Received</p>
                <p className="mt-1 text-xl font-bold text-gray-900">
                  {money(totalReceived)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Clock3 size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-500">Payment Protected</p>
                <p className="mt-1 text-xl font-bold text-gray-900">
                  {money(protectedAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Package size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-500">Sales Transactions</p>
                <p className="mt-1 text-xl font-bold text-gray-900">
                  {payments.length}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* PROTECTED PAYMENT INFO */}
        <div className="rounded-xl border border-green-200 bg-white p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Bharat Fasal Protected Payment
                </h2>

                <p className="mt-1 max-w-3xl text-sm text-gray-500">
                  Buyer payment remains protected until the required
                  quantity, quality and delivery conditions are completed.
                </p>
              </div>
            </div>

            <Status>Transaction Protected</Status>
          </div>
        </div>

        {/* SALES */}
        <section>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Sales
              </h2>

              <p className="mt-0.5 text-sm text-gray-500">
                Payments linked to your crop sales
              </p>
            </div>

            <span className="text-xs text-gray-400">
              {payments.length} transactions
            </span>
          </div>

          <div className="space-y-4">

            {payments.map((payment) => (
              <div
                key={payment.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >

                {/* TOP */}
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

                        {payment.payment === "Protected" ? (
                          <Status type="amber">
                            Payment Protected
                          </Status>
                        ) : (
                          <Status>
                            Payment Released
                          </Status>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-gray-400">
                        Payment ID: {payment.id}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        Order ID: {payment.orderId} · Lot ID: {payment.lotId}
                      </p>
                    </div>

                  </div>

                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 sm:min-w-[180px]">
                    <p className="text-xs text-gray-500">
                      Sale Amount
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {money(payment.amount)}
                    </p>
                  </div>

                </div>

                {/* DETAILS */}
                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">

                  <div>
                    <p className="text-xs text-gray-400">
                      Buyer
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {payment.buyer}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Quantity
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {payment.quantity}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Sale Location
                    </p>

                    <p className="mt-1 flex items-start gap-1 text-sm font-semibold text-gray-900">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
                      {payment.location}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Sale Date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {payment.date}
                    </p>
                  </div>

                </div>

                {/* STATUS */}
                <div className="mx-5 mb-5 overflow-hidden rounded-lg border border-gray-200">

                  <div className="border-b border-gray-100 bg-gray-50 px-4 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Transaction Status
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4">

                    <div className="border-b border-gray-100 p-4 sm:border-b-0 sm:border-r">
                      <p className="text-xs text-gray-400">
                        Payment
                      </p>

                      <div className="mt-1 flex items-center gap-1.5">
                        {payment.payment === "Protected" ? (
                          <Clock3 size={14} className="text-amber-600" />
                        ) : (
                          <CheckCircle2 size={14} className="text-green-600" />
                        )}

                        <span className="text-sm font-semibold">
                          {payment.payment}
                        </span>
                      </div>
                    </div>

                    <div className="border-b border-gray-100 p-4 sm:border-b-0 sm:border-r">
                      <p className="text-xs text-gray-400">
                        Quality
                      </p>

                      <div className="mt-1 flex items-center gap-1.5 text-green-700">
                        <CheckCircle2 size={14} />
                        <span className="text-sm font-semibold">
                          {payment.quality}
                        </span>
                      </div>
                    </div>

                    <div className="border-b border-gray-100 p-4 sm:border-b-0 sm:border-r">
                      <p className="text-xs text-gray-400">
                        Quantity
                      </p>

                      <div className="mt-1 flex items-center gap-1.5 text-green-700">
                        <CheckCircle2 size={14} />
                        <span className="text-sm font-semibold">
                          {payment.quantityStatus}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="text-xs text-gray-400">
                        Delivery
                      </p>

                      <div className="mt-1 flex items-center gap-1.5 text-blue-700">
                        <Truck size={14} />
                        <span className="text-sm font-semibold">
                          {payment.delivery}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* TRANSPORT */}
                <div className="mx-5 mb-5 rounded-lg border border-gray-200 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">
                      <Truck size={18} className="text-gray-500" />

                      <div>
                        <p className="text-xs text-gray-400">
                          Transportation
                        </p>

                        <p className="text-sm font-semibold text-gray-900">
                          {payment.transport}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400">
                      Delivery: {payment.delivery}
                    </p>

                  </div>
                </div>

                {/* ACTIONS */}
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
                    onClick={() => setQuestion(payment)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <MessageCircle size={14} />
                    Raise a Question
                  </button>

                </div>

              </div>
            ))}

          </div>
        </section>

        {/* HELP */}
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CircleHelp size={19} className="text-gray-500" />

            <div>
              <p className="text-sm font-semibold text-gray-900">
                Need help with a payment?
              </p>

              <p className="text-xs text-gray-500">
                Contact Bharat Fasal support for transaction-related issues.
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

      {/* QUESTION MODAL */}
      {question && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="text-lg font-bold text-gray-900">
              Payment Question
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {question.crop} · {question.orderId}
            </p>

            <textarea
              className="mt-4 min-h-[110px] w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-green-500"
              placeholder="Describe your question..."
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setQuestion(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => setQuestion(null)}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
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