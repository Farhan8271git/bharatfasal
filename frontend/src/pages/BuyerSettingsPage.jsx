import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Settings,
  Building2,
  MapPin,
  Phone,
  ShieldCheck,
  Landmark,
  WalletCards,
  Bell,
  BarChart3,
  MessageCircle,
  Globe,
  ChevronRight,
  CircleHelp,
  Mail,
  Info,
  LogOut,
  Package,
  Truck,
  IndianRupee,
  FileCheck,
} from "lucide-react";

import SettingsLanguageSelector from "../components/SettingsLanguageSelector";

export default function BuyerSettingsPage({ user, onLogout }) {
  const { t, i18n } = useTranslation();

  const [showLang, setShowLang] = useState(false);

  const [notifications, setNotifications] = useState({
    prices: true,
    buyers: true,
    payments: true,
  });

  const [showProfile, setShowProfile] = useState(false);
  const [showBank, setShowBank] = useState(false);

  const buyerName =
    user?.companyName ||
    user?.businessName ||
    user?.name ||
    "Buyer";

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);

    document.documentElement.setAttribute(
      "dir",
      lang === "ur" ? "rtl" : "ltr"
    );

    document.documentElement.setAttribute("lang", lang);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">

      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* HEADER */}

        <div className="mb-6">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <Settings size={22} />
            </div>

            <div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {t("settings")}
              </h1>

              <p className="text-sm text-gray-500 mt-0.5">
                Manage your business account and preferences
              </p>

            </div>

          </div>

        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

          {/* BUSINESS PROFILE */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 size={19} />
              </div>

              <div>

                <h2 className="font-bold text-gray-900">
                  Business Profile
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Your buyer account information
                </p>

              </div>

            </div>


            <div className="p-5">

              <div className="flex items-center gap-5">

                <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">

                  <Building2
                    size={38}
                    strokeWidth={1.8}
                    className="text-blue-600"
                  />

                </div>

                <div className="min-w-0">

                  <h3 className="text-xl font-bold text-gray-900 truncate">
                    {buyerName}
                  </h3>

                  {user?.phone && (
                    <p className="flex items-center gap-2 text-sm text-gray-500 mt-1.5">
                      <Phone size={15} />
                      {user.phone}
                    </p>
                  )}

                  <p className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <MapPin size={15} />
                    {user?.location || "India"}
                  </p>

                  <p className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Building2 size={15} />
                    Buyer
                  </p>

                </div>

              </div>


              <div className="flex flex-wrap gap-2 mt-5">

                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                  Buyer
                </span>

                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                  Verification Pending
                </span>

              </div>


              <button
                type="button"
                onClick={() => setShowProfile(true)}
                className="w-full mt-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Manage Profile
              </button>

            </div>

          </section>


          {/* BUSINESS VERIFICATION */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <ShieldCheck size={19} />
              </div>

              <div>

                <h2 className="font-bold text-gray-900">
                  Business Verification
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Build trust with farmers and FPOs
                </p>

              </div>

            </div>


            <div className="px-5">

              <div className="flex items-center justify-between py-4 border-b border-gray-100">

                <div>

                  <p className="text-sm font-semibold text-gray-800">
                    Mobile Number
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    {user?.phone || "Not added"}
                  </p>

                </div>

                <span className="text-xs font-semibold text-green-600">
                  ✓ Verified
                </span>

              </div>


              <div className="flex items-center justify-between py-4 border-b border-gray-100">

                <div>

                  <p className="text-sm font-semibold text-gray-800">
                    Business Details
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Company information
                  </p>

                </div>

                <span className="text-xs font-semibold text-amber-600">
                  Pending
                </span>

              </div>


              <div className="flex items-center justify-between py-4">

                <div>

                  <p className="text-sm font-semibold text-gray-800">
                    Business Documents
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    GSTIN / PAN / registration
                  </p>

                </div>

                <button className="text-xs font-semibold text-blue-600">
                  Manage
                  <ChevronRight size={13} className="inline ml-1" />
                </button>

              </div>

            </div>

          </section>


          {/* PROCUREMENT PREFERENCES */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <Package size={19} />
              </div>

              <div>

                <h2 className="font-bold text-gray-900">
                  Procurement Preferences
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Set your preferred procurement requirements
                </p>

              </div>

            </div>


            <div className="px-5">

              <div className="py-4 border-b border-gray-100">

                <p className="text-xs text-gray-500">
                  Preferred Crops
                </p>

                <p className="text-sm font-semibold text-gray-800 mt-1">
                  Rice, Wheat, Maize
                </p>

              </div>


              <div className="py-4 border-b border-gray-100">

                <p className="text-xs text-gray-500">
                  Preferred Grade
                </p>

                <p className="text-sm font-semibold text-gray-800 mt-1">
                  A / Premium
                </p>

              </div>


              <div className="py-4 border-b border-gray-100">

                <p className="text-xs text-gray-500">
                  Typical Purchase Quantity
                </p>

                <p className="text-sm font-semibold text-gray-800 mt-1">
                  100–500 Quintals
                </p>

              </div>


              <div className="py-4">

                <p className="text-xs text-gray-500">
                  Preferred Delivery Location
                </p>

                <p className="text-sm font-semibold text-gray-800 mt-1">
                  Uttar Pradesh • Delhi NCR
                </p>

              </div>

            </div>


            <div className="px-5 pb-5">

              <button
                type="button"
                className="w-full py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Manage Preferences
              </button>

            </div>

          </section>


          {/* PAYMENTS */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Landmark size={19} />
              </div>

              <div>

                <h2 className="font-bold text-gray-900">
                  Payments & Bank
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Manage payment methods and bank details
                </p>

              </div>

            </div>


            <div className="px-5">

              <button
                type="button"
                onClick={() => setShowBank(true)}
                className="w-full flex items-center justify-between py-4 border-b border-gray-100 text-left"
              >

                <div className="flex items-center gap-3">

                  <WalletCards size={18} className="text-gray-500" />

                  <div>

                    <p className="text-sm font-semibold text-gray-800">
                      Payment Methods
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Bank account not added • UPI not added
                    </p>

                  </div>

                </div>

                <ChevronRight size={17} className="text-gray-400" />

              </button>


              <button className="w-full flex items-center justify-between py-4 border-b border-gray-100 text-left">

                <div className="flex items-center gap-3">

                  <ShieldCheck size={18} className="text-green-600" />

                  <div>

                    <p className="text-sm font-semibold text-gray-800">
                      Protected Payments
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Payment protection for procurement orders
                    </p>

                  </div>

                </div>

                <ChevronRight size={17} className="text-gray-400" />

              </button>


              <button className="w-full flex items-center justify-between py-4 text-left">

                <div className="flex items-center gap-3">

                  <IndianRupee size={18} className="text-gray-500" />

                  <div>

                    <p className="text-sm font-semibold text-gray-800">
                      Payment History
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      View completed and protected payments
                    </p>

                  </div>

                </div>

                <ChevronRight size={17} className="text-gray-400" />

              </button>

            </div>

          </section>


          {/* NOTIFICATIONS */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <Bell size={19} />
              </div>

              <div>

                <h2 className="font-bold text-gray-900">
                  Notifications
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Choose what updates you receive
                </p>

              </div>

            </div>


            <div className="px-5">

              {[
                ["prices", "Price Alerts", BarChart3],
                ["buyers", "Buyer Messages", MessageCircle],
                ["payments", "Payment Updates", WalletCards],
              ].map(([key, label, Icon], index, arr) => (

                <div
                  key={key}
                  className={`flex items-center justify-between py-4 ${
                    index !== arr.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <Icon size={18} className="text-gray-500" />

                    <span className="text-sm font-semibold text-gray-800">
                      {label}
                    </span>

                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">

                    <input
                      type="checkbox"
                      checked={notifications[key]}
                      onChange={() => toggleNotification(key)}
                      className="sr-only peer"
                    />

                    <div className="w-11 h-6 rounded-full bg-gray-300 peer-checked:bg-green-600 transition" />

                    <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />

                  </label>

                </div>

              ))}

            </div>

          </section>


          {/* LANGUAGE */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <button
              type="button"
              onClick={() => setShowLang(!showLang)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
            >

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Globe size={19} />
                </div>

                <div>

                  <h2 className="font-bold text-gray-900">
                    {t("language")}
                  </h2>

                  <p className="text-sm text-gray-500 mt-0.5">
                    {t("change_language")}
                  </p>

                </div>

              </div>

              <ChevronRight
                size={20}
                className={`text-gray-400 ${
                  showLang ? "rotate-90" : ""
                }`}
              />

            </button>

            {showLang && (
              <div className="px-5 pb-5 pt-2 border-t border-gray-100">

                <SettingsLanguageSelector
                  selectedLang={i18n.language}
                  onSelect={handleLanguageChange}
                />

              </div>
            )}

          </section>


          {/* HELP */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                <CircleHelp size={19} />
              </div>

              <div>

                <h2 className="font-bold text-gray-900">
                  Help & Support
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Get help with your buyer account
                </p>

              </div>

            </div>

            <div className="px-5 py-4 space-y-3">

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone size={17} className="text-gray-400" />
                <span>Helpline: +91 9999999990</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail size={17} className="text-gray-400" />
                <span>support@bharatfasal.in</span>
              </div>

            </div>

          </section>


          {/* ABOUT */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-5 py-4 flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
                <Info size={19} />
              </div>

              <div>

                <h2 className="font-bold text-gray-900">
                  About
                </h2>

                <p className="text-sm text-gray-500 mt-0.5">
                  Bharat Fasal Version 1.0.0
                </p>

              </div>

            </div>

          </section>


          {/* LOGOUT */}

          <button
            type="button"
            onClick={onLogout}
            className="lg:col-span-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-200 bg-white text-red-600 font-semibold hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </div>


      {/* PROFILE MODAL */}

      {showProfile && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">

            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">

              <div>

                <h3 className="font-bold text-gray-900">
                  Business Profile
                </h3>

                <p className="text-xs text-gray-500 mt-0.5">
                  Your buyer account
                </p>

              </div>

              <button
                onClick={() => setShowProfile(false)}
                className="text-gray-400 text-xl"
              >
                ×
              </button>

            </div>


            <div className="p-5 space-y-4">

              <div>

                <p className="text-xs text-gray-500 mb-1">
                  Business Name
                </p>

                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm">
                  {buyerName}
                </div>

              </div>


              <div>

                <p className="text-xs text-gray-500 mb-1">
                  Mobile Number
                </p>

                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm">
                  {user?.phone || "Not available"}
                </div>

              </div>


              <div>

                <p className="text-xs text-gray-500 mb-1">
                  Location
                </p>

                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm">
                  {user?.location || "India"}
                </div>

              </div>

            </div>


            <div className="px-5 pb-5">

              <button
                onClick={() => setShowProfile(false)}
                className="w-full py-2.5 rounded-lg bg-green-600 text-white font-semibold"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}


      {/* BANK MODAL */}

      {showBank && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">

            <div className="px-5 py-4 border-b border-gray-100 flex justify-between">

              <div>

                <h3 className="font-bold text-gray-900">
                  Payment Methods
                </h3>

                <p className="text-xs text-gray-500 mt-0.5">
                  Manage business payment details
                </p>

              </div>

              <button
                onClick={() => setShowBank(false)}
                className="text-gray-400 text-xl"
              >
                ×
              </button>

            </div>


            <div className="p-5 space-y-4">

              <input
                type="text"
                placeholder="Account Holder / Business Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
              />

              <input
                type="text"
                placeholder="Account Number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
              />

              <input
                type="text"
                placeholder="IFSC Code"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm uppercase"
              />

            </div>


            <div className="flex gap-3 px-5 pb-5">

              <button
                onClick={() => setShowBank(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={() => setShowBank(false)}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold"
              >
                Save Details
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}