import Modal from "../../../components/ui/Modal";
import InputField from "../../../components/ui/InputField";

export default function PaymentModal({
  open,
  onClose,
  paymentDetails,
  setPaymentDetails,
  onSave,
}) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Payment & Bank Details"
    >
      <div className="space-y-4">
        <InputField
          label="Bank Name"
          value={paymentDetails?.bankName || ""}
          onChange={(event) =>
            setPaymentDetails((prev) => ({ ...prev, bankName: event.target.value }))
          }
          placeholder="Enter bank name"
        />

        <InputField
          label="Account Number"
          value={paymentDetails?.accountNumber || ""}
          onChange={(event) =>
            setPaymentDetails((prev) => ({ ...prev, accountNumber: event.target.value }))
          }
          placeholder="Enter account number"
          type="text"
        />

        <InputField
          label="IFSC Code"
          value={paymentDetails?.ifsc || ""}
          onChange={(event) =>
            setPaymentDetails((prev) => ({ ...prev, ifsc: event.target.value }))
          }
          placeholder="Enter IFSC code"
          type="text"
        />

        <InputField
          label="UPI ID"
          value={paymentDetails?.upi || ""}
          onChange={(event) =>
            setPaymentDetails((prev) => ({ ...prev, upi: event.target.value }))
          }
          placeholder="Enter UPI ID"
          type="text"
        />

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="flex-1 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}