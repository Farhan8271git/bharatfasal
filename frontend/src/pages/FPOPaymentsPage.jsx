import { useNavigate } from "react-router-dom";
import {
  WalletCards,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  Package,
  Users,
  Truck,
  Eye,
  ArrowRight,
  IndianRupee,
} from "lucide-react";

const transactions = [
  {
    id: "BF-FPO-PAY-2041",
    orderId: "BF-ORD-2041",
    lotId: "BF-LOT-20452",
    crop: "Wheat",
    quantity: "850 Quintals",
    buyer: "National Grain Buyers",
    amount: 2125000,
    status: "Protected",
    verification: "Verified",
    delivery: "In Transit",
    transport: "Buyer arranged",
  },
  {
    id: "BF-FPO-PAY-2035",
    orderId: "BF-ORD-2035",
    lotId: "BF-LOT-20391",
    crop: "Rice",
    quantity: "600 Quintals",
    buyer: "Eastern Foods Ltd.",
    amount: 1740000,
    status: "Released",
    verification: "Verified",
    delivery: "Delivered",
    transport: "Seller arranged",
  },
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function FPOPaymentsPage({ user }) {
  const navigate = useNavigate();

  const protectedAmount = transactions
    .filter((x) => x.status === "Protected")
    .reduce((sum, x) => sum + x.amount, 0);

  const releasedAmount = transactions
    .filter((x) => x.status === "Released")
    .reduce((sum, x) => sum + x.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">
            FPO SELLER PAYMENTS
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Sales & Payments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage payments received for FPO procurement and farmer lots.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-xs text-gray-500">
              Active Transactions
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {transactions.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-xs text-gray-500">
              Payment Protected
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {money(protectedAmount)}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-xs text-gray-500">
              Payment Released
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {money(releasedAmount)}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-xs text-gray-500">
              Total Sales
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {money(protectedAmount + releasedAmount)}
            </p>
          </div>

        </div>

        <div className="rounded-xl border border-purple-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                FPO Protected Payments
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Payments are tracked against lot verification,
                quantity, quality and delivery completion.
              </p>
            </div>
          </div>
        </div>

        <section>
          <div className="mb-3">
            <h2 className="text-lg font-bold text-gray-900">
              FPO Sales Transactions
            </h2>

            <p className="text-sm text-gray-500">
              Buyer payments associated with your FPO lots.
            </p>
          </div>

          <div className="space-y-4">

            {transactions.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >

                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                      <Package size={19} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-gray-900">
                          {item.crop}
                        </h3>

                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                          {item.status}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-gray-400">
                        Order ID: {item.orderId} · Lot ID: {item.lotId}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Transaction Value
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-900">
                      {money(item.amount)}
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5">

                  <div>
                    <p className="text-xs text-gray-400">Buyer</p>
                    <p className="mt-1 text-sm font-semibold">
                      {item.buyer}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Quantity</p>
                    <p className="mt-1 text-sm font-semibold">
                      {item.quantity}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Verification</p>
                    <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-green-700">
                      <CheckCircle2 size={14} />
                      {item.verification}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Delivery</p>
                    <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-blue-700">
                      <Truck size={14} />
                      {item.delivery}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Transport</p>
                    <p className="mt-1 text-sm font-semibold">
                      {item.transport}
                    </p>
                  </div>

                </div>

                <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50 px-5 py-3">

                  <button
                    type="button"
                    onClick={() => navigate(`/orders/${item.orderId}`)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700"
                  >
                    <Eye size={14} />
                    View Order
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/disputes")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700"
                  >
                    Support
                    <ArrowRight size={14} />
                  </button>

                </div>

              </div>
            ))}

          </div>
        </section>

      </div>
    </div>
  );
}