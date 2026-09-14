import Modal from "../../../components/ui/Modal";
import InputField from "../../../components/ui/InputField";
import TextAreaField from "../../../components/ui/TextAreaField";

export default function BusinessModal({
  open,
  onClose,
  businessDetails,
  setBusinessDetails,
  onSave,
}) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Business Details"
    >
      <div className="space-y-4">
        <InputField
          label="Business Name"
          value={businessDetails.businessName || ""}
          onChange={(e) =>
            setBusinessDetails((prev) => ({
              ...prev,
              businessName: e.target.value,
            }))
          }
          placeholder="Enter business name"
        />

        <InputField
          label="Business Type"
          value={businessDetails.businessType || ""}
          onChange={(e) =>
            setBusinessDetails((prev) => ({
              ...prev,
              businessType: e.target.value,
            }))
          }
          placeholder="Enter business type"
        />

        <InputField
          label="GSTIN"
          value={businessDetails.gstin || ""}
          onChange={(e) =>
            setBusinessDetails((prev) => ({
              ...prev,
              gstin: e.target.value,
            }))
          }
          placeholder="Enter GSTIN"
        />

        <TextAreaField
          label="Business Address"
          value={businessDetails.address || ""}
          onChange={(e) =>
            setBusinessDetails((prev) => ({
              ...prev,
              address: e.target.value,
            }))
          }
          placeholder="Enter complete business address"
          rows={4}
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