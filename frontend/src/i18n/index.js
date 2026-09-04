import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import ur from "./locales/ur.json";
import ta from "./locales/ta.json";
import te from "./locales/te.json";
import bn from "./locales/bn.json";
import mr from "./locales/mr.json";
import gu from "./locales/gu.json";
import kn from "./locales/kn.json";
import pa from "./locales/pa.json";
import hinglish from "./locales/hinglish.json";

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  ur: { translation: ur },
  ta: { translation: ta },
  te: { translation: te },
  bn: { translation: bn },
  mr: { translation: mr },
  gu: { translation: gu },
  kn: { translation: kn },
  pa: { translation: pa },
  hinglish: { translation: hinglish },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,


    supportedLngs: [
      "en",
      "hi",
      "ur",
      "ta",
      "te",
      "bn",
      "mr",
      "gu",
      "kn",
      "pa",
      "hinglish",
    ],


    fallbackLng: "hi",

    interpolation: {
      escapeValue: false,
    },

    detection: {

      order: ["localStorage"],

  
      caches: ["localStorage"],


      lookupLocalStorage: "bf_language",
    },
  });

export default i18n;
