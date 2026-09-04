import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import { LANGUAGES } from "../../utils/constants";

const LandingNavbar = ({ onLogin }) => {
  const { t, i18n } = useTranslation();

  const [languageOpen, setLanguageOpen] = useState(false);

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === i18n.language) ||
    LANGUAGES.find((lang) => lang.code === "en");

  const handleLanguageChange = async (code) => {
    try {
      await i18n.changeLanguage(code);

      localStorage.setItem("bf_language", code);

      const selectedLanguage = LANGUAGES.find((lang) => lang.code === code);

      document.documentElement.setAttribute(
        "dir",
        selectedLanguage?.dir || "ltr",
      );

      document.documentElement.setAttribute("lang", code);

      setLanguageOpen(false);
    } catch (error) {
      console.error("Language change error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* =========================
            LOGO / BRAND
        ========================== */}

        <Link to="/" className="flex items-center gap-2">
          <img
            src="/images/bharat-fasal-logo.png"
            alt="Bharat Fasal"
            className="h-10 w-auto"
          />

          {/* IMPORTANT:
              BRAND NAME NEVER TRANSLATES
          */}
          <span className="text-xl font-bold text-green-800">Bharat Fasal</span>
        </Link>

        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#home"
            className="text-sm font-medium text-gray-700 transition hover:text-green-700"
          >
            {t("nav_home")}
          </a>

          <a
            href="#features"
            className="text-sm font-medium text-gray-700 transition hover:text-green-700"
          >
            {t("nav_features")}
          </a>

          <a
            href="#how-it-works"
            className="text-sm font-medium text-gray-700 transition hover:text-green-700"
          >
            {t("nav_how_it_works")}
          </a>

          <a
            href="#about"
            className="text-sm font-medium text-gray-700 transition hover:text-green-700"
          >
            {t("nav_about")}
          </a>
        </nav>

        {/* =========================
            RIGHT SIDE
        ========================== */}

        <div className="flex items-center gap-3">
          {/* LANGUAGE */}

          <div className="relative">
            <button
              type="button"
              onClick={() => setLanguageOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-green-600 hover:text-green-700"
              aria-expanded={languageOpen}
              aria-haspopup="menu"
            >
              <span>{currentLanguage?.english || "English"}</span>

              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  languageOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {languageOpen && (
              <div className="absolute right-0 mt-2 max-h-80 w-44 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {LANGUAGES.map((language) => (
                  <button
                    key={language.code}
                    type="button"
                    onClick={() => handleLanguageChange(language.code)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-green-50 ${
                      i18n.language === language.code
                        ? "font-semibold text-green-700 bg-green-50"
                        : "text-gray-700"
                    }`}
                  >
                    <span>{language.name}</span>

                    {i18n.language === language.code && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LOGIN */}

          <button
            type="button"
            onClick={onLogin}
            className="rounded-lg border border-green-700 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-700 hover:text-white"
          >
            {t("nav_login")}
          </button>

          {/* REGISTER */}

          <Link
            to="/register"
            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"
          >
            {t("nav_register")}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
