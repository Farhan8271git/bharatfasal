import {
  FileCheck2,
  FileText,
  ShieldCheck,
} from "lucide-react";
import CardHeader from "../../../components/ui/CardHeader";
import DocumentCheck from "../../../components/ui/DocumentCheck";

export default function DocumentsSection({
  documents,
  onManageDocuments,
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <CardHeader
        icon={FileText}
        iconClass="text-orange-600"
        iconBg="bg-orange-50"
        title="Documents"
        subtitle="Manage your business and verification documents"
      />

      <div className="p-5">
        <div className="space-y-3">
          <DocumentCheck
            label="PAN Card"
            checked={Boolean(documents?.pan)}
          />

          <DocumentCheck
            label="GST Certificate"
            checked={Boolean(documents?.gst)}
          />

          <DocumentCheck
            label="Business Proof"
            checked={Boolean(documents?.businessProof)}
          />

          <DocumentCheck
            label="Bank Proof"
            checked={Boolean(documents?.bankProof)}
          />
        </div>

        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4 flex items-start gap-3">
          <ShieldCheck
            size={20}
            className="text-green-600 shrink-0 mt-0.5"
          />

          <div>
            <p className="text-sm font-semibold text-gray-800">
              Document verification
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Submitted documents are reviewed as part of the verification
              process.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onManageDocuments}
          className="w-full mt-5 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Manage Documents
        </button>
      </div>
    </section>
  );
}