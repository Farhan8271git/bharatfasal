import {
  Building2,
  BriefcaseBusiness,
  MapPin,
  ReceiptText,
} from "lucide-react";
import CardHeader from "../../../components/ui/CardHeader";
import InfoRow from "../../../components/ui/InfoRow";

export default function BusinessSection({
  businessDetails,
  onManageBusiness,
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <CardHeader
        icon={Building2}
        iconClass="text-purple-600"
        iconBg="bg-purple-50"
        title="Business Details"
        subtitle="Manage your business information"
      />

      <div className="p-5 space-y-1">
        <InfoRow
          icon={Building2}
          label="Business Name"
          value={businessDetails.businessName || "Not added"}
        />

        <InfoRow
          icon={BriefcaseBusiness}
          label="Business Type"
          value={businessDetails.businessType || "Not added"}
        />

        <InfoRow
          icon={ReceiptText}
          label="GSTIN"
          value={businessDetails.gstin || "Not added"}
        />

        <InfoRow
          icon={MapPin}
          label="Business Address"
          value={businessDetails.address || "Not added"}
        />

        <button
          type="button"
          onClick={onManageBusiness}
          className="w-full mt-4 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Manage Business Details
        </button>
      </div>
    </section>
  );
}