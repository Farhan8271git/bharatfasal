import {
  ShieldCheck,
  WalletCards,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
} from "lucide-react";

const transactions = [
  {
    id: "BF-ORD-1024",
    buyer: "Shiv Farmers FPO",
    seller: "Gorakhpur Farmer Group",
    crop: "Wheat",
    amount: 1250000,
    status: "Protected",
    verification: "Verified",
  },
  {
    id: "BF-ORD-1021",
    buyer: "Eastern Grain FPO",
    seller: "Haryana Grain Group",
    crop: "Rice",
    amount: 870000,
    status: "Protected",
    verification: "Verified",
  },
  {
    id: "BF-ORD-1012",
    buyer: "Malwa Agro FPO",
    seller: "Indore Farmer Group",
    crop: "Soybean",
    amount: 1040000,
    status: "Released",
    verification: "Verified",
  },
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function AdminPaymentsPage() {
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
          <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
            ADMINISTRATION
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Payment Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor protected transactions and payment releases.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-xs text-gray-500">
              Total Transactions
            </p>

            <p className="mt-2 text-2xl font-bold">
              {transactions.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-xs text-gray-500">
              Protected Payments
            </p>

            <p className="mt-2 text-2xl font-bold">
              {money(protectedAmount)}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-xs text-gray-500">
              Released Payments
            </p>

            <p className="mt-2 text-2xl font-bold">
              {money(releasedAmount)}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-xs text-gray-500">
              Disputes
            </p>

            <p className="mt-2 flex items-center gap-2 text-2xl font-bold">
              1
              <AlertTriangle size={20} className="text-amber-500" />
            </p>
          </div>

        </div>

        <div className="rounded-xl border border-blue-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Transaction Monitoring
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review payment protection, verification and release status
                across the Bharat Fasal marketplace.
              </p>
            </div>
          </div>
        </div>

        <section>
          <div className="mb-3">
            <h2 className="text-lg font-bold text-gray-900">
              All Payment Transactions
            </h2>

            <p className="text-sm text-gray-500">
              Marketplace-wide payment activity.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

            {transactions.map((item, index) => (
              <div
                key={item.id}
                className={`p-5 ${
                  index !== transactions.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-gray-600">
                      <WalletCards size={19} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {item.crop}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            item.status === "Protected"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-gray-400">
                        {item.id}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        Buyer: {item.buyer}
                      </p>

                      <p className="text-sm text-gray-600">
                        Seller: {item.seller}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-6">

                    <div>
                      <p className="text-xs text-gray-400">
                        Transaction Amount
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {money(item.amount)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Verification
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-green-700">
                        <CheckCircle2 size={14} />
                        {item.verification}
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>
        </section>

      </div>
    </div>
  );
}