import {
  BellRing,
  ClipboardList,
  MapPinned,
  SlidersHorizontal,
} from "lucide-react";
import CardHeader from "../../../components/ui/CardHeader";
import PreferenceRow from "../../../components/ui/PreferenceRow";

/** Render a summary of the user's marketplace preferences. */
export default function PreferencesSection({
  preferences,
  onOpenPreferences,
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
          label="Preferred Crops"
          value={preferences?.crops || "Not configured"}
        />

        <PreferenceRow
          label="Preferred Grade"
          value={preferences?.grade || "Not configured"}
        />

        <PreferenceRow
          label="Typical Quantity"
          value={preferences?.quantity || "Not configured"}
        />

        <PreferenceRow
          label="Preferred Location"
          value={preferences?.location || "Not configured"}
        />

        <PreferenceRow
          label="Transportation"
          value={preferences?.transportation || "Not configured"}
        />

        <button
          type="button"
          onClick={onOpenPreferences}
          className="w-full mt-4 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Manage Preferences
        </button>
      </div>
    </section>
  );
}
