import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../utils/constants";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  BarChart3,
  Handshake,
  Package,
  Truck,
  WalletCards,
  AlertTriangle,
  Settings,
  UserRound,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Globe2,
  Users,
  FileCheck,
} from "lucide-react";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const role = user?.role || "farmer";

  const isAdmin = role === "admin";
  const isBuyer = role === "buyer";
  const isFpo = role === "fpo";
  const isFarmer = role === "farmer";

  // =========================================================
  // NAVBAR TRANSLATIONS
  // =========================================================

  const currentLang = (i18n.language || "en").split("-")[0];

  const navbarTranslations = {
    en: {
      home: "Home",
      prices: "Prices",
      buyers: "Buyers",
      myLots: "My Lots",
      browseLots: "Browse Lots",
      logistics: "Logistics",
      payments: "Payments",
      disputes: "Disputes",
      language: "Language",
      farmer: "Farmer",
      fpo: "FPO",
      buyer: "Buyer",
      administrator: "Administrator",
      user: "User",
      profileSettings: "Profile & Settings",
      verificationReview: "Verification Review",
      logout: "Logout",
      admin: "Admin",
    },
    hi: {
      home: "होम",
      prices: "भाव",
      buyers: "खरीदार",
      myLots: "मेरी लॉट्स",
      browseLots: "लॉट्स देखें",
      logistics: "लॉजिस्टिक्स",
      payments: "भुगतान",
      disputes: "विवाद",
      language: "भाषा",
      farmer: "किसान",
      fpo: "FPO",
      buyer: "खरीदार",
      administrator: "प्रशासक",
      user: "उपयोगकर्ता",
      profileSettings: "प्रोफ़ाइल और सेटिंग्स",
      verificationReview: "सत्यापन समीक्षा",
      logout: "लॉग आउट",
      admin: "एडमिन",
    },
    ur: {
      home: "ہوم",
      prices: "قیمتیں",
      buyers: "خریدار",
      myLots: "میری لاٹس",
      browseLots: "لاٹس دیکھیں",
      logistics: "لاجسٹکس",
      payments: "ادائیگیاں",
      disputes: "تنازعات",
      language: "زبان",
      farmer: "کسان",
      fpo: "FPO",
      buyer: "خریدار",
      administrator: "منتظم",
      user: "صارف",
      profileSettings: "پروفائل اور ترتیبات",
      verificationReview: "تصدیق کا جائزہ",
      logout: "لاگ آؤٹ",
      admin: "ایڈمن",
    },
    ta: {
      home: "முகப்பு",
      prices: "விலைகள்",
      buyers: "வாங்குபவர்கள்",
      myLots: "என் லாட்கள்",
      browseLots: "லாட்களைப் பார்க்க",
      logistics: "தளவாடம்",
      payments: "பணம்",
      disputes: "சர்ச்சைகள்",
      language: "மொழி",
      farmer: "விவசாயி",
      fpo: "FPO",
      buyer: "வாங்குபவர்",
      administrator: "நிர்வாகி",
      user: "பயனர்",
      profileSettings: "சுயவிவரம் மற்றும் அமைப்புகள்",
      verificationReview: "சரிபார்ப்பு மதிப்பாய்வு",
      logout: "வெளியேறு",
      admin: "நிர்வாகம்",
    },
    te: {
      home: "హోమ్",
      prices: "ధరలు",
      buyers: "కొనుగోలుదారులు",
      myLots: "నా లాట్లు",
      browseLots: "లాట్లను చూడండి",
      logistics: "లాజిస్టిక్స్",
      payments: "చెల్లింపులు",
      disputes: "వివాదాలు",
      language: "భాష",
      farmer: "రైతు",
      fpo: "FPO",
      buyer: "కొనుగోలుదారు",
      administrator: "నిర్వాహకుడు",
      user: "వినియోగదారు",
      profileSettings: "ప్రొఫైల్ & సెట్టింగ్స్",
      verificationReview: "ధృవీకరణ సమీక్ష",
      logout: "లాగ్ అవుట్",
      admin: "అడ్మిన్",
    },
    bn: {
      home: "হোম",
      prices: "দাম",
      buyers: "ক্রেতারা",
      myLots: "আমার লট",
      browseLots: "লট দেখুন",
      logistics: "লজিস্টিকস",
      payments: "পেমেন্ট",
      disputes: "বিরোধ",
      language: "ভাষা",
      farmer: "কৃষক",
      fpo: "FPO",
      buyer: "ক্রেতা",
      administrator: "প্রশাসক",
      user: "ব্যবহারকারী",
      profileSettings: "প্রোফাইল ও সেটিংস",
      verificationReview: "যাচাইকরণ পর্যালোচনা",
      logout: "লগ আউট",
      admin: "অ্যাডমিন",
    },
    mr: {
      home: "मुख्यपृष्ठ",
      prices: "भाव",
      buyers: "खरेदीदार",
      myLots: "माझे लॉट्स",
      browseLots: "लॉट्स पहा",
      logistics: "लॉजिस्टिक्स",
      payments: "पेमेंट",
      disputes: "वाद",
      language: "भाषा",
      farmer: "शेतकरी",
      fpo: "FPO",
      buyer: "खरेदीदार",
      administrator: "प्रशासक",
      user: "वापरकर्ता",
      profileSettings: "प्रोफाइल आणि सेटिंग्ज",
      verificationReview: "पडताळणी पुनरावलोकन",
      logout: "लॉग आउट",
      admin: "अॅडमिन",
    },
    gu: {
      home: "હોમ",
      prices: "ભાવ",
      buyers: "ખરીદદારો",
      myLots: "મારા લોટ્સ",
      browseLots: "લોટ્સ જુઓ",
      logistics: "લોજિસ્ટિક્સ",
      payments: "ચુકવણી",
      disputes: "વિવાદો",
      language: "ભાષા",
      farmer: "ખેડૂત",
      fpo: "FPO",
      buyer: "ખરીદદાર",
      administrator: "વહીવટકર્તા",
      user: "વપરાશકર્તા",
      profileSettings: "પ્રોફાઇલ અને સેટિંગ્સ",
      verificationReview: "ચકાસણી સમીક્ષા",
      logout: "લૉગ આઉટ",
      admin: "એડમિન",
    },
    kn: {
      home: "ಮುಖಪುಟ",
      prices: "ಬೆಲೆಗಳು",
      buyers: "ಖರೀದಿದಾರರು",
      myLots: "ನನ್ನ ಲಾಟ್‌ಗಳು",
      browseLots: "ಲಾಟ್‌ಗಳನ್ನು ನೋಡಿ",
      logistics: "ಲಾಜಿಸ್ಟಿಕ್ಸ್",
      payments: "ಪಾವತಿಗಳು",
      disputes: "ವಿವಾದಗಳು",
      language: "ಭಾಷೆ",
      farmer: "ರೈತ",
      fpo: "FPO",
      buyer: "ಖರೀದಿದಾರ",
      administrator: "ನಿರ್ವಾಹಕರು",
      user: "ಬಳಕೆದಾರ",
      profileSettings: "ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      verificationReview: "ಪರಿಶೀಲನೆ ವಿಮರ್ಶೆ",
      logout: "ಲಾಗ್ ಔಟ್",
      admin: "ಅಡ್ಮಿನ್",
    },
    pa: {
      home: "ਹੋਮ",
      prices: "ਭਾਅ",
      buyers: "ਖਰੀਦਦਾਰ",
      myLots: "ਮੇਰੇ ਲਾਟ",
      browseLots: "ਲਾਟ ਵੇਖੋ",
      logistics: "ਲੌਜਿਸਟਿਕਸ",
      payments: "ਭੁਗਤਾਨ",
      disputes: "ਵਿਵਾਦ",
      language: "ਭਾਸ਼ਾ",
      farmer: "ਕਿਸਾਨ",
      fpo: "FPO",
      buyer: "ਖਰੀਦਦਾਰ",
      administrator: "ਪ੍ਰਬੰਧਕ",
      user: "ਉਪਭੋਗਤਾ",
      profileSettings: "ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਸੈਟਿੰਗਾਂ",
      verificationReview: "ਤਸਦੀਕ ਸਮੀਖਿਆ",
      logout: "ਲੌਗ ਆਊਟ",
      admin: "ਐਡਮਿਨ",
    },
    hinglish: {
      home: "Home",
      prices: "Bhav",
      buyers: "Buyers",
      myLots: "Meri Lots",
      browseLots: "Lots Dekho",
      logistics: "Logistics",
      payments: "Payments",
      disputes: "Disputes",
      language: "Language",
      farmer: "Kisan",
      fpo: "FPO",
      buyer: "Buyer",
      administrator: "Admin",
      user: "User",
      profileSettings: "Profile & Settings",
      verificationReview: "Verification Review",
      logout: "Logout",
      admin: "Admin",
    },
  };

  const navText = navbarTranslations[currentLang] || navbarTranslations.en;

  // =========================================================
  // NAVIGATION
  // =========================================================

  const getNavItems = () => {
    // -------------------------------------------------------
    // ADMIN
    // -------------------------------------------------------

    if (isAdmin) {
      return [
        {
          label: navText.home,
          path: "/",
          icon: Home,
        },
        {
          label: navText.prices,
          path: "/prices",
          icon: BarChart3,
        },
        {
          label: navText.disputes,
          path: "/disputes",
          icon: AlertTriangle,
        },
      ];
    }

    // -------------------------------------------------------
    // BUYER
    // -------------------------------------------------------

    if (isBuyer) {
      return [
        {
          label: navText.home,
          path: "/",
          icon: Home,
        },
        {
          label: navText.prices,
          path: "/prices",
          icon: BarChart3,
        },
        {
          label: navText.buyers,
          path: "/buyers",
          icon: Handshake,
        },
        {
          label: navText.browseLots,
          path: "/lots",
          icon: Package,
        },
        {
          label: navText.logistics,
          path: "/logistics",
          icon: Truck,
        },
        {
          label: navText.payments,
          path: "/payments",
          icon: WalletCards,
        },
      ];
    }

    // -------------------------------------------------------
    // FPO
    // -------------------------------------------------------

    if (isFpo) {
      return [
        {
          label: navText.home,
          path: "/",
          icon: Home,
        },
        {
          label: navText.prices,
          path: "/prices",
          icon: BarChart3,
        },
        {
          label: navText.buyers,
          path: "/buyers",
          icon: Handshake,
        },
        {
          label: navText.myLots,
          path: "/lots",
          icon: Package,
        },
        {
          label: navText.logistics,
          path: "/logistics",
          icon: Truck,
        },
        {
          label: navText.payments,
          path: "/payments",
          icon: WalletCards,
        },
      ];
    }

    // -------------------------------------------------------
    // FARMER
    // -------------------------------------------------------

    return [
      {
        label: navText.home,
        path: "/",
        icon: Home,
      },
      {
        label: navText.prices,
        path: "/prices",
        icon: BarChart3,
      },
      {
        label: navText.buyers,
        path: "/buyers",
        icon: Handshake,
      },
      {
        label: navText.myLots,
        path: "/lots",
        icon: Package,
      },
      {
        label: navText.logistics,
        path: "/logistics",
        icon: Truck,
      },
      {
        label: navText.payments,
        path: "/payments",
        icon: WalletCards,
      },
    ];
  };

  const navItems = getNavItems();

  // =========================================================
  // ACTIVE CHECK
  // =========================================================

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  // =========================================================
  // PROFILE DATA
  // =========================================================

  const displayName =
    user?.companyName ||
    user?.businessName ||
    user?.name ||
    (isAdmin ? "Administrator" : "User");

  const roleLabel =
    {
      farmer: navText.farmer,
      fpo: navText.fpo,
      buyer: navText.buyer,
      admin: navText.administrator,
    }[role] || navText.user;

  const handleProfile = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    navigate("/settings");
  };

  const handleLogout = () => {
    setProfileOpen(false);
    setMobileOpen(false);

    if (onLogout) {
      onLogout();
    }
  };

  // =========================================================
  // CLOSE MOBILE NAV
  // =========================================================

  const handleNavigation = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* =====================================================
          DESKTOP / MAIN NAVBAR
      ===================================================== */}

      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[76px] flex items-center justify-between gap-4">
            {/* =================================================
                BRAND
            ================================================= */}

            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 shrink-0"
              aria-label="Bharat Fasal Home"
            >
              <img
                src="/images/bharat-fasal-logo.png"
                alt="Bharat Fasal"
                className="h-10 w-auto max-w-[180px] object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              <span className="text-lg font-bold text-green-700 hidden sm:block">
                Bharat Fasal
              </span>
            </button>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <NavLink
                    key={item.path + item.label}
                    to={item.path}
                    className={`
                      inline-flex items-center gap-2
                      px-3.5 py-2
                      rounded-lg
                      text-sm font-medium
                      transition-colors
                      ${
                        active
                          ? "bg-green-50 text-green-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />

                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="flex items-center gap-2">
              {/* ADMIN BADGE */}

              {isAdmin && (
                <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
                  <ShieldCheck size={15} className="text-gray-700" />

                  <span className="text-xs font-semibold text-gray-700">
                    Admin
                  </span>
                </div>
              )}

              {/* LANGUAGE */}

              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => {
                    setLanguageOpen((prev) => !prev);
                    setProfileOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  aria-label="Change language"
                >
                  <Globe2 size={18} strokeWidth={1.8} />
                  <span className="text-xs font-medium uppercase">
                    {(i18n.language || "en").split("-")[0]}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`text-gray-400 transition-transform ${
                      languageOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {languageOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close language menu"
                      onClick={() => setLanguageOpen(false)}
                      className="fixed inset-0 z-40 cursor-default"
                    />

                    <div className="absolute right-0 top-[52px] z-50 w-48 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500">
                          {navText.language}
                        </p>
                      </div>

                      <div className="max-h-64 overflow-y-auto p-1.5">
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => {
                              i18n.changeLanguage(lang.code);
                              localStorage.setItem("bf_language", lang.code);
                              document.documentElement.setAttribute(
                                "lang",
                                lang.code,
                              );
                              document.documentElement.setAttribute(
                                "dir",
                                lang.dir || "ltr",
                              );
                              setLanguageOpen(false);
                            }}
                            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                              (i18n.language || "en") === lang.code
                                ? "bg-green-50 text-green-700 font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span>{lang.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* PROFILE */}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen((prev) => !prev);
                    setLanguageOpen(false);
                  }}
                  className={`
                    flex items-center gap-2
                    px-2.5 py-2
                    rounded-lg
                    transition-colors
                    ${profileOpen ? "bg-gray-100" : "hover:bg-gray-50"}
                  `}
                  aria-label="Open profile menu"
                >
                  <div className="w-9 h-9 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-700">
                    {isAdmin ? (
                      <ShieldCheck size={17} />
                    ) : (
                      <UserRound size={17} />
                    )}
                  </div>

                  <div className="hidden sm:block text-left max-w-[150px]">
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {displayName}
                    </p>

                    <p className="text-[10px] text-gray-400">{roleLabel}</p>
                  </div>

                  <ChevronDown
                    size={14}
                    className={`
                      hidden sm:block
                      text-gray-400
                      transition-transform
                      ${profileOpen ? "rotate-180" : ""}
                    `}
                  />
                </button>

                {/* PROFILE DROPDOWN */}

                {profileOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close profile menu"
                      onClick={() => setProfileOpen(false)}
                      className="fixed inset-0 z-40 cursor-default"
                    />

                    <div className="absolute right-0 top-[52px] z-50 w-64 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      {/* USER */}

                      <div className="px-4 py-4 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {displayName}
                        </p>

                        <p className="text-xs text-gray-500 mt-0.5">
                          {roleLabel}
                        </p>

                        {user?.phone && (
                          <p className="text-[11px] text-gray-400 mt-1">
                            +91 {user.phone}
                          </p>
                        )}
                      </div>

                      {/* PROFILE */}

                      <button
                        type="button"
                        onClick={handleProfile}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <UserRound size={17} className="text-gray-500" />

                        <span>{navText.profileSettings}</span>
                      </button>

                      {/* ADMIN VERIFICATIONS */}

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(false);
                            navigate("/");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <FileCheck size={17} className="text-gray-500" />

                          <span>{navText.verificationReview}</span>
                        </button>
                      )}

                      {/* LOGOUT */}

                      <div className="border-t border-gray-100">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>

                          <span>{navText.logout}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* MOBILE MENU */}

              <button
                type="button"
                onClick={() => {
                  setMobileOpen((prev) => !prev);
                  setProfileOpen(false);
                  setLanguageOpen(false);
                }}
                className="md:hidden w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            MOBILE NAVIGATION
        ===================================================== */}

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <NavLink
                    key={item.path + item.label}
                    to={item.path}
                    onClick={handleNavigation}
                    className={`
                      flex items-center gap-3
                      px-3 py-3
                      rounded-lg
                      text-sm font-medium
                      ${
                        active
                          ? "bg-green-50 text-green-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }
                    `}
                  >
                    <Icon size={18} />

                    <span>{item.label}</span>
                  </NavLink>
                );
              })}

              {/* MOBILE PROFILE */}

              <button
                type="button"
                onClick={handleProfile}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <Settings size={18} />

                <span>{navText.profileSettings}</span>
              </button>

              {/* MOBILE LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>

                <span>{navText.logout}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
