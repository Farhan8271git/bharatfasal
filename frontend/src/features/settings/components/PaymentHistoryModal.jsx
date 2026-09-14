import Modal from "../../../components/ui/Modal";
import PaymentHistoryItem from "../../../components/ui/PaymentHistoryItem";

export default function PaymentHistoryModal({
  open,
  onClose,
}) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Payment History"
      subtitle="Your recent procurement payment activity."
    >
      <div className="space-y-3">
        <PaymentHistoryItem
          order="BF-ORD-1024"
          crop="Rice"
          amount="₹4,50,000"
          status="Protected"
        />

        <PaymentHistoryItem
          order="BF-ORD-1018"
          crop="Wheat"
          amount="₹3,20,000"
          status="Released"
        />

        <PaymentHistoryItem
          order="BF-ORD-1009"
          crop="Maize"
          amount="₹2,64,000"
          status="Completed"
        />
      </div>
    </Modal>
  );
}