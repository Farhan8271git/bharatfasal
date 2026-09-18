import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  WalletCards,
} from "lucide-react";

import Modal from "../../../components/ui/Modal";

/** Render the form for editing the user's profile details. */
export default function ProtectedPaymentModal({
  open,
  onClose,
}) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Protected Payments"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-green-600"
          />

          <div>
            <p className="text-sm font-semibold text-gray-800">
              Payment Secured
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Your payment is protected until all verification conditions are
              completed.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
            <CheckCircle2
              size={18}
              className="shrink-0 text-green-600"
            />

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Quality & Quantity Verification
              </p>

              <p className="mt-0.5 text-xs text-gray-500">
                Goods are verified before payment release.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
            <Truck
              size={18}
              className="shrink-0 text-blue-600"
            />

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Delivery Confirmation
              </p>

              <p className="mt-0.5 text-xs text-gray-500">
                Delivery confirmation is required before settlement.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
            <WalletCards
              size={18}
              className="shrink-0 text-purple-600"
            />

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Payment Release
              </p>

              <p className="mt-0.5 text-xs text-gray-500">
                Payment is released after all required checks are completed.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-green-100 bg-green-50 p-4">
          <p className="text-xs font-semibold text-green-700">
            Protected Payment Flow
          </p>

          <p className="mt-1 text-xs text-green-700">
            This protected payment flow is currently available as a prototype
            and does not process real payments.
          </p>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
