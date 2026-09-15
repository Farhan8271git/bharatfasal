import Modal from "../../../components/ui/Modal";
import InputField from "../../../components/ui/InputField";
import TextAreaField from "../../../components/ui/TextAreaField";

export default function PreferencesModal({
  open,
  onClose,
  preferences,
  setPreferences,
  onSave,
}) {
  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Procurement Preferences"
    >
      <div className="space-y-4">
        <InputField
          label="Preferred Crops"
          value={preferences?.crops || ""}
          onChange={(value) => updatePreference("crops", value)}
          placeholder="Enter preferred crops"
        />

        <InputField
          label="Preferred Grade"
          value={preferences?.grade || ""}
          onChange={(value) => updatePreference("grade", value)}
          placeholder="Enter preferred grade"
        />

        <InputField
          label="Typical Quantity"
          value={preferences?.quantity || ""}
          onChange={(value) => updatePreference("quantity", value)}
          placeholder="Enter typical quantity"
        />

        <InputField
          label="Preferred Location"
          value={preferences?.location || ""}
          onChange={(value) => updatePreference("location", value)}
          placeholder="Enter preferred procurement location"
        />

        <TextAreaField
          label="Transportation"
          value={preferences?.transportation || ""}
          onChange={(value) => updatePreference("transportation", value)}
          placeholder="Enter transportation preference"
          rows={3}
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