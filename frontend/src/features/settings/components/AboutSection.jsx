import {
  ExternalLink,
  Info,
  ShieldCheck,
} from "lucide-react";
import CardHeader from "../../../components/ui/CardHeader";

/** Render product and legal information for the settings page. */
export default function AboutSection({
  appVersion,
  onTerms,
  onPrivacy,
  onAbout,
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <CardHeader
        icon={Info}
        iconClass="text-gray-600"
        iconBg="bg-gray-100"
        title="About BharatFasal"
        subtitle="Information about the platform"
      />

      <div className="p-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
            <ShieldCheck size={24} className="text-green-600" />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900">
              BharatFasal
            </h3>

            <p className="text-sm text-gray-500 mt-0.5">
              Agricultural marketplace and procurement platform
            </p>

            {appVersion && (
              <p className="text-xs text-gray-400 mt-1">
                Version {appVersion}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={onAbout}
            className="w-full flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 text-left hover:bg-gray-50 transition"
          >
            <Info size={19} className="text-gray-600 shrink-0" />

            <span className="flex-1 text-sm font-semibold text-gray-800">
              About BharatFasal
            </span>

            <ExternalLink size={17} className="text-gray-400" />
          </button>

          <button
            type="button"
            onClick={onTerms}
            className="w-full flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 text-left hover:bg-gray-50 transition"
          >
            <ShieldCheck size={19} className="text-green-600 shrink-0" />

            <span className="flex-1 text-sm font-semibold text-gray-800">
              Terms & Conditions
            </span>

            <ExternalLink size={17} className="text-gray-400" />
          </button>

          <button
            type="button"
            onClick={onPrivacy}
            className="w-full flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 text-left hover:bg-gray-50 transition"
          >
            <ShieldCheck size={19} className="text-blue-600 shrink-0" />

            <span className="flex-1 text-sm font-semibold text-gray-800">
              Privacy Policy
            </span>

            <ExternalLink size={17} className="text-gray-400" />
          </button>
        </div>
      </div>
    </section>
  );
}
