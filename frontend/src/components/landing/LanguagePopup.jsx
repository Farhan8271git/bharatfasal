import { useEffect, useState } from "react";
import { ArrowRight, Volume2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../LanguageSelector";

const speechLanguages = {
  en: "en-IN",
  hi: "hi-IN",
  bn: "bn-IN",
  mr: "mr-IN",
  pa: "pa-IN",
  gu: "gu-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  or: "or-IN",
  ur: "ur-IN",
};

const speechMessages = {
  en: "Select your language and continue",
  hi: "अपनी भाषा चुनें और आगे बढ़ें",
  bn: "আপনার ভাষা নির্বাচন করুন এবং এগিয়ে যান",
  mr: "तुमची भाषा निवडा आणि पुढे जा",
  pa: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ ਅਤੇ ਅੱਗੇ ਵਧੋ",
  gu: "તમારી ભાષા પસંદ કરો અને આગળ વધો",
  ta: "உங்கள் மொழியைத் தேர்ந்தெடுத்து தொடரவும்",
  te: "మీ భాషను ఎంచుకుని కొనసాగండి",
  kn: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಮುಂದುವರಿಯಿರಿ",
  ml: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുത്ത് തുടരുക",
  or: "ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ ଏବଂ ଆଗକୁ ବଢ଼ନ୍ତୁ",
  ur: "اپنی زبان منتخب کریں اور آگے بڑھیں",
};

const LanguagePopup = ({ onComplete }) => {
  const { i18n } = useTranslation();

  const [selected, setSelected] = useState(i18n.language || "en");
  const [voices, setVoices] = useState([]);

  // Load browser voices
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      loadVoices
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        loadVoices
      );
    };
  }, []);

  const handleLanguageSelect = (lang) => {
    setSelected(lang);
    i18n.changeLanguage(lang);
  };

  const speakInstruction = () => {
    if (!("speechSynthesis" in window)) {
      alert("Speech is not supported in this browser.");
      return;
    }

    const languageCode = speechLanguages[selected] || "en-IN";

    const text =
      speechMessages[selected] || speechMessages.en;

    // Find exact language voice first
    let voice = voices.find(
      (v) => v.lang.toLowerCase() === languageCode.toLowerCase()
    );

    // If exact voice is not available,
    // try matching language prefix
    if (!voice) {
      const languagePrefix = languageCode
        .split("-")[0]
        .toLowerCase();

      voice = voices.find(
        (v) =>
          v.lang.toLowerCase().split("-")[0] === languagePrefix
      );
    }

    // Don't speak in the wrong language
    if (!voice) {
      alert(
        `Voice for ${
          selected === "hi"
            ? "Hindi"
            : selected === "en"
            ? "English"
            : selected
        } is not available on this device.`
      );
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.voice = voice;
    speech.lang = voice.lang;
    speech.rate = 0.85;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  };

  const handleContinue = () => {
    localStorage.setItem("bf_language", selected);
    i18n.changeLanguage(selected);
    onComplete();
  };

 return (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 px-4">
    <div className="w-full max-w-sm rounded-xl border border-white/50 bg-white/90 px-5 py-5 shadow-xl backdrop-blur-md">

      {/* Logo & Heading */}
      <div className="text-center">
        <img
          src="/images/bharat-fasal-logo.png"
          alt="Bharat Fasal"
          className="mx-auto mb-2 h-10 w-auto"
        />

        <h2 className="text-xl font-bold text-gray-900">
          भारत फसल
        </h2>

        <p className="mt-0.5 text-sm font-medium text-green-700">
          Bharat Fasal
        </p>

        <p className="mt-2 text-sm font-medium text-gray-800">
          अपनी भाषा चुनें
        </p>

        <p className="mt-0.5 text-[11px] text-gray-500">
          Select your preferred language
        </p>
      </div>

      {/* Language Selector */}
      <div className="mt-4">
        <LanguageSelector
          selectedLang={selected}
          onSelect={handleLanguageSelect}
        />
      </div>

      {/* Voice */}
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={speakInstruction}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-white hover:text-green-700"
        >
          <Volume2 size={15} />
          <span>सुनकर समझें / Listen</span>
        </button>
      </div>

      {/* Continue */}
      <button
        type="button"
        onClick={handleContinue}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
      >
        <span>आगे बढ़ें</span>
        <span className="text-white/70">Continue</span>
        <ArrowRight size={17} />
      </button>

      <p className="mt-2 text-center text-[10px] text-gray-400">
        Your language preference will be saved on this device.
      </p>
    </div>
  </div>
);
}

export default LanguagePopup;