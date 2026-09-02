import { Check } from "lucide-react";

const languages = [
  { code: "hi", native: "हिन्दी", name: "Hindi" },
  { code: "en", native: "English", name: "English" },
  { code: "ur", native: "اردو", name: "Urdu" },
  { code: "ta", native: "தமிழ்", name: "Tamil" },
  { code: "te", native: "తెలుగు", name: "Telugu" },
  { code: "bn", native: "বাংলা", name: "Bengali" },
  { code: "mr", native: "मराठी", name: "Marathi" },
  { code: "gu", native: "ગુજરાતી", name: "Gujarati" },
  { code: "kn", native: "ಕನ್ನಡ", name: "Kannada" },
  { code: "pa", native: "ਪੰਜਾਬੀ", name: "Punjabi" },
  { code: "hinglish", native: "Hinglish", name: "Hinglish" },
];

export default function SettingsLanguageSelector({
  selectedLang,
  onSelect,
}) {
  return (
    <div className="border-t border-gray-100 bg-white">

      {/* Current Language */}

      <div className="px-5 py-4">

        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
          Current Language
        </p>

        <p className="mt-1 text-sm font-semibold text-gray-900">
          {
            languages.find(
              (lang) => lang.code === selectedLang
            )?.native || "English"
          }

          <span className="ml-2 font-normal text-gray-500">
            (
            {
              languages.find(
                (lang) => lang.code === selectedLang
              )?.name || "English"
            }
            )
          </span>
        </p>

      </div>

      {/* Language Options */}

      <div className="px-5 pb-5">

        <p className="mb-3 text-sm font-medium text-gray-600">
          Choose your preferred language
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">

          {languages.map((language) => {
            const active =
              selectedLang === language.code;

            return (
              <button
                key={language.code}
                type="button"
                onClick={() => onSelect(language.code)}
                className={`
                  relative
                  min-h-[58px]
                  rounded-xl
                  border
                  px-3
                  py-2.5
                  text-left
                  transition-all
                  duration-150
                  ${
                    active
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white hover:border-green-300 hover:bg-gray-50"
                  }
                `}
              >

                <div
                  className={`
                    text-sm font-semibold
                    ${
                      active
                        ? "text-green-700"
                        : "text-gray-900"
                    }
                  `}
                >
                  {language.native}
                </div>

                <div className="text-xs text-gray-500 mt-0.5">
                  {language.name}
                </div>

                {active && (
                  <span
                    className="
                      absolute
                      top-2
                      right-2
                      w-5
                      h-5
                      rounded-full
                      bg-green-600
                      text-white
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}

              </button>
            );
          })}

        </div>

      </div>

    </div>
  );
}