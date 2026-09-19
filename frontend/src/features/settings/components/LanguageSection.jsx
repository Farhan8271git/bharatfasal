import { Globe2, Languages } from "lucide-react";
import CardHeader from "../../../components/ui/CardHeader";

/** Render the language selector for application preferences. */
export default function LanguageSection({
  language,
  onManageLanguage,
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <CardHeader
        icon={Languages}
        iconClass="text-cyan-600"
        iconBg="bg-cyan-50"
        title="Language"
        subtitle="Choose your preferred language"
      />

      <div className="p-5">
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
            <Globe2 size={21} className="text-cyan-600" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-800">
              Preferred Language
            </p>
            <p className="text-sm text-gray-500 mt-0.5 truncate">
              {language || "English"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onManageLanguage}
          className="w-full mt-4 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Change Language
        </button>
      </div>
    </section>
  );
}
