import {
  Building2,
  CreditCard,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";
import CardHeader from "../../../components/ui/CardHeader";
import InfoRow from "../../../components/ui/InfoRow";

/** Render a summary of saved payment details and recent history. */
export default function PaymentSection({
  paymentDetails,
  onManagePayment,
  onOpenProtectedPayment,
  onOpenPaymentHistory,
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <CardHeader
        icon={CreditCard}
        iconClass="text-emerald-600"
        iconBg="bg-emerald-50"
        title="Payments & Bank Details"
        subtitle="Manage your payment and settlement information"
      />

      <div className="p-5 space-y-1">
        <InfoRow
          icon={Building2}
          label="Bank Name"
          value={paymentDetails?.bankName || "Not added"}
        />

        <InfoRow
          icon={CreditCard}
          label="Account Number"
          value={paymentDetails?.accountNumber || "Not added"}
        />

        <InfoRow
          icon={CreditCard}
          label="IFSC Code"
          value={paymentDetails?.ifsc || "Not added"}
        />

        <InfoRow
          icon={IndianRupee}
          label="UPI ID"
          value={paymentDetails?.upi || "Not added"}
        />

        <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-4 flex items-start gap-3">
          <ShieldCheck
            size={20}
            className="text-green-600 shrink-0 mt-0.5"
          />

          <div>
            <p className="text-sm font-semibold text-gray-800">
              Protected payment details
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Your payment information is protected and should only be
              accessed when required.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          <button
            type="button"
            onClick={onManagePayment}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Manage Payment Details
          </button>

          <button
            type="button"
            onClick={onOpenProtectedPayment}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Protected Payment
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenPaymentHistory}
          className="w-full mt-3 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
        >
          View Payment History
        </button>
      </div>
    </section>
  );
}
