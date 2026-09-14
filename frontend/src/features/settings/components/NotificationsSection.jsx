import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
} from "lucide-react";
import CardHeader from "../../../components/ui/CardHeader";
import PreferenceRow from "../../../components/ui/PreferenceRow";

export default function NotificationsSection({
  notifications,
  onManageNotifications,
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <CardHeader
        icon={Bell}
        iconClass="text-amber-600"
        iconBg="bg-amber-50"
        title="Notifications"
        subtitle="Control how you receive BharatFasal updates"
      />

      <div className="p-5 space-y-1">
        <PreferenceRow
          icon={Smartphone}
          label="Push Notifications"
          value={
            notifications?.push
              ? "Enabled"
              : "Disabled"
          }
        />

        <PreferenceRow
          icon={Mail}
          label="Email Notifications"
          value={
            notifications?.email
              ? "Enabled"
              : "Disabled"
          }
        />

        <PreferenceRow
          icon={MessageSquare}
          label="SMS Notifications"
          value={
            notifications?.sms
              ? "Enabled"
              : "Disabled"
          }
        />

        <button
          type="button"
          onClick={onManageNotifications}
          className="w-full mt-4 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Manage Notifications
        </button>
      </div>
    </section>
  );
}