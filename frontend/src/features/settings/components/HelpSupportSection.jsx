import {
  ChevronRight,
  CircleHelp,
  Headphones,
  MessageCircle,
} from "lucide-react";
import CardHeader from "../../../components/ui/CardHeader";

export default function HelpSupportSection({
  onHelp,
  onContactSupport,
  onFeedback,
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <CardHeader
        icon={CircleHelp}
        iconClass="text-blue-600"
        iconBg="bg-blue-50"
        title="Help & Support"
        subtitle="Get help or contact the BharatFasal team"
      />

      <div className="p-5 space-y-2">
        <button
          type="button"
          onClick={onHelp}
          className="w-full flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 text-left hover:bg-gray-50 transition"
        >
          <CircleHelp size={20} className="text-blue-600 shrink-0" />

          <span className="flex-1">
            <span className="block text-sm font-semibold text-gray-800">
              Help Center
            </span>
            <span className="block text-xs text-gray-500 mt-0.5">
              Find answers to common questions
            </span>
          </span>

          <ChevronRight size={18} className="text-gray-400" />
        </button>

        <button
          type="button"
          onClick={onContactSupport}
          className="w-full flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 text-left hover:bg-gray-50 transition"
        >
          <Headphones size={20} className="text-green-600 shrink-0" />

          <span className="flex-1">
            <span className="block text-sm font-semibold text-gray-800">
              Contact Support
            </span>
            <span className="block text-xs text-gray-500 mt-0.5">
              Get assistance from our support team
            </span>
          </span>

          <ChevronRight size={18} className="text-gray-400" />
        </button>

        <button
          type="button"
          onClick={onFeedback}
          className="w-full flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 text-left hover:bg-gray-50 transition"
        >
          <MessageCircle size={20} className="text-purple-600 shrink-0" />

          <span className="flex-1">
            <span className="block text-sm font-semibold text-gray-800">
              Send Feedback
            </span>
            <span className="block text-xs text-gray-500 mt-0.5">
              Tell us how we can improve BharatFasal
            </span>
          </span>

          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </div>
    </section>
  );
}