import {
  BellRing,
  ClipboardList,
  MapPinned,
  SlidersHorizontal,
} from "lucide-react";
import CardHeader from "../../../components/ui/CardHeader";
import PreferenceRow from "../../../components/ui/PreferenceRow";

export default function PreferencesSection({
  preferences,
  onManagePreferences,
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <CardHeader
        icon={SlidersHorizontal}
        iconClass="text-indigo-600"
        iconBg="bg-indigo-50"
        title="Procurement Preferences"
        subtitle="Customize your procurement requirements"
      />

      <div className="p-5 space-y-1">
        <PreferenceRow
          icon={ClipboardList}
          label="Preferred Crops"
          value={
            preferences?.preferredCrops?.length
              ? preferences.preferredCrops.join(", ")
              : "Not configured"
          }
        />

        <PreferenceRow
          icon={MapPinned}
          label="Preferred Location"
          value={preferences?.preferredLocation || "Not configured"}
        />

        <PreferenceRow
          icon={BellRing}
          label="Procurement Alerts"
          value={
            preferences?.procurementAlerts
              ? "Enabled"
              : "Disabled"
          }
        />

        <button
          type="button"
          onClick={onManagePreferences}
          className="w-full mt-4 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Manage Preferences
        </button>
      </div>
    </section>
  );
}