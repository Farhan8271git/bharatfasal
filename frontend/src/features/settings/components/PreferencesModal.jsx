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
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Procurement Preferences"
    >
      <div className="space-y-4">
        <InputField
          label="Preferred Crops"
          value={preferences?.preferredCrops || ""}
          onChange={(event) =>
            setPreferences((prev) => ({ ...prev, preferredCrops: event.target.value }))
          }
          placeholder="Enter preferred crops"
        />

        <InputField
          label="Preferred Location"
          value={preferences?.preferredLocation || ""}
          onChange={(event) =>
            onChange("preferredLocation", event.target.value)
          }
          placeholder="Enter preferred procurement location"
        />

        <TextAreaField
          label="Additional Requirements"
          value={preferences?.additionalRequirements || ""}
          onChange={(event) =>
            onChange("additionalRequirements", event.target.value)
          }
          placeholder="Enter additional procurement requirements"
          rows={4}
        />

        <label className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(preferences?.procurementAlerts)}
            onChange={(event) =>
              onChange("procurementAlerts", event.target.checked)
            }
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />

          <span>
            <span className="block text-sm font-semibold text-gray-800">
              Procurement Alerts
            </span>

            <span className="block text-xs text-gray-500 mt-0.5">
              Receive updates related to procurement opportunities.
            </span>
          </span>
        </label>

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