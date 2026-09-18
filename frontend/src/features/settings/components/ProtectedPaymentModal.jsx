import { LockKeyhole, ShieldCheck } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import InputField from "../../../components/ui/InputField";

/** Explain the protected-payment process in a modal. */
export default function ProtectedPaymentModal({
  isOpen,
  onClose,
  password,
  onPasswordChange,
  error,
  onVerify,
  paymentDetails,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Protected Payment Details"
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 flex items-start gap-3">
          <ShieldCheck
            size={21}
            className="text-amber-600 shrink-0 mt-0.5"
          />

          <div>
            <p className="text-sm font-semibold text-gray-800">
              Protected information
            </p>

            <p className="text-xs text-gray-600 mt-1">
              Verify your account before viewing sensitive payment details.
            </p>
          </div>
        </div>

        <InputField
          label="Account Password"
          type="password"
          value={password || ""}
          onChange={(event) => onPasswordChange(event.target.value)}
          placeholder="Enter your password"
          error={error}
        />

        {paymentDetails && (
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <LockKeyhole
                size={18}
                className="text-gray-600"
              />

              <p className="text-sm font-semibold text-gray-800">
                Payment Information
              </p>
            </div>

            {paymentDetails.bankName && (
              <p className="text-sm text-gray-600">
                Bank: {paymentDetails.bankName}
              </p>
            )}

            {paymentDetails.accountNumber && (
              <p className="text-sm text-gray-600">
                Account: {paymentDetails.accountNumber}
              </p>
            )}

            {paymentDetails.ifsc && (
              <p className="text-sm text-gray-600">
                IFSC: {paymentDetails.ifsc}
              </p>
            )}

            {paymentDetails.upi && (
              <p className="text-sm text-gray-600">
                UPI: {paymentDetails.upi}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onVerify}
            className="flex-1 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition"
          >
            Verify & Continue
          </button>
        </div>
      </div>
    </Modal>
  );
}
