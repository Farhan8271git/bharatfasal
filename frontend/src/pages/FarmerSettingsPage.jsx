import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Settings,
  User,
  Sprout,
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
  Leaf,
  Truck,
  Package,
} from "lucide-react";

import SettingsLanguageSelector from "../components/SettingsLanguageSelector";

export default function FarmerSettingsPage({ user, onLogout }) {
  const { t, i18n } = useTranslation();

  const [showLang, setShowLang] = useState(false);

  const [notifications, setNotifications] = useState({
    prices: true,
    buyers: true,
    payments: true,
  });

  const [showProfile, setShowProfile] = useState(false);
  const [showBank, setShowBank] = useState(false);

  // Temporary frontend-only verification state.
  // Later this can be replaced with the MongoDB/backend API status.
  const [verificationStatus, setVerificationStatus] = useState(
    () => localStorage.getItem("bf_verification_status") || "not_verified",
  );
  const [showVerification, setShowVerification] = useState(false);
  const [verificationForm, setVerificationForm] = useState({
    fullName: user?.name || "",
    idType: "",
    idReference: "",
  });

  const handleVerificationSubmit = (e) => {
    e.preventDefault();

    if (
      !verificationForm.fullName.trim() ||
      !verificationForm.idType ||
      !verificationForm.idReference.trim()
    ) {
      return;
    }

    localStorage.setItem("bf_verification_status", "pending");
    setVerificationStatus("pending");
    setShowVerification(false);
  };

  const handleVerificationReset = () => {
    localStorage.removeItem("bf_verification_status");
    setVerificationStatus("not_verified");
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);

    document.documentElement.setAttribute("dir", lang === "ur" ? "rtl" : "ltr");

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
                Manage your farmer account and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* FARMER PROFILE */}
          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <User size={19} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">Farmer Profile</h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Your personal and farming information
                </p>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                  <User
                    size={38}
                    strokeWidth={1.8}
                    className="text-green-600"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 truncate">
                    {user?.name || "Farmer"}
                  </h3>

                  <div className="mt-1.5">
                    {verificationStatus === "verified" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                        <ShieldCheck size={13} />
                        Verified Farmer
                      </span>
                    ) : verificationStatus === "pending" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                        <ShieldCheck size={13} />
                        Verification Pending
                      </span>
                    ) : verificationStatus === "rejected" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                        Verification Rejected
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowVerification(true)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-800"
                      >
                        Verify your identity
                        <ChevronRight size={13} />
                      </button>
                    )}
                  </div>

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
                    <Sprout size={15} />
                    Farmer
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowProfile(true)}
                className="w-full mt-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Manage Profile
              </button>
            </div>
          </section>

          {/* VERIFICATION */}
          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">Farmer Verification</h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Verify your identity for trusted transactions
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

              <div className="flex items-center justify-between py-4 border-b border-gray-100 gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">
                    Identity Verification
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Government identity verification
                  </p>
                </div>

                {verificationStatus === "verified" ? (
                  <span className="shrink-0 text-xs font-semibold text-green-600 flex items-center gap-1">
                    <ShieldCheck size={14} />
                    Verified
                  </span>
                ) : verificationStatus === "pending" ? (
                  <span className="shrink-0 text-xs font-semibold text-amber-600">
                    Pending
                  </span>
                ) : verificationStatus === "rejected" ? (
                  <button
                    type="button"
                    onClick={() => setShowVerification(true)}
                    className="shrink-0 text-xs font-semibold text-red-600"
                  >
                    Re-verify
                    <ChevronRight size={13} className="inline ml-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowVerification(true)}
                    className="shrink-0 text-xs font-semibold text-green-700"
                  >
                    Verify Now
                    <ChevronRight size={13} className="inline ml-1" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Bank Verification
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Required for receiving payments
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowBank(true)}
                  className="text-xs font-semibold text-green-700"
                >
                  Manage
                  <ChevronRight size={13} className="inline ml-1" />
                </button>
              </div>
            </div>
          </section>

          {/* FARM & SELLING */}
          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <Leaf size={19} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Farm & Selling Preferences
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Manage your crop and selling preferences
                </p>
              </div>
            </div>

            <div className="px-5">
              <div className="py-4 border-b border-gray-100">
                <p className="text-xs text-gray-500">Main Crops</p>

                <p className="text-sm font-semibold text-gray-800 mt-1">
                  Wheat, Rice, Maize
                </p>
              </div>

              <div className="py-4 border-b border-gray-100">
                <p className="text-xs text-gray-500">Typical Lot Size</p>

                <p className="text-sm font-semibold text-gray-800 mt-1">
                  50–200 Quintals
                </p>
              </div>

              <div className="py-4 border-b border-gray-100">
                <p className="text-xs text-gray-500">Preferred Quality</p>

                <p className="text-sm font-semibold text-gray-800 mt-1">
                  A / Premium
                </p>
              </div>

              <div className="py-4">
                <div className="flex items-center gap-2">
                  <Truck size={15} className="text-gray-400" />

                  <p className="text-xs text-gray-500">Transportation</p>
                </div>

                <p className="text-sm font-semibold text-gray-800 mt-1">
                  Seller will arrange transportation
                </p>
              </div>
            </div>

            <div className="px-5 pb-5">
              <button
                type="button"
                className="w-full py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Manage Selling Preferences
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
                <h2 className="font-bold text-gray-900">Payments & Bank</h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Manage your payment settlement
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
                      Bank Account
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Bank account not added
                    </p>
                  </div>
                </div>

                <ChevronRight size={17} className="text-gray-400" />
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-between py-4 border-b border-gray-100 text-left"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-green-600" />

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Payment Settlement
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Track payments from your sales
                    </p>
                  </div>
                </div>

                <ChevronRight size={17} className="text-gray-400" />
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-between py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <WalletCards size={18} className="text-gray-500" />

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Payment History
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      View completed settlements
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
                <h2 className="font-bold text-gray-900">Notifications</h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Choose what updates you receive
                </p>
              </div>
            </div>

            <div className="px-5">
              {[
                {
                  key: "prices",
                  label: "Market Price Alerts",
                  icon: BarChart3,
                },
                {
                  key: "buyers",
                  label: "Buyer Messages",
                  icon: MessageCircle,
                },
                {
                  key: "payments",
                  label: "Payment Updates",
                  icon: WalletCards,
                },
              ].map((item, index, arr) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.key}
                    className={`flex items-center justify-between py-4 ${
                      index !== arr.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-gray-500" />

                      <span className="text-sm font-semibold text-gray-800">
                        {item.label}
                      </span>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[item.key]}
                        onChange={() => toggleNotification(item.key)}
                        className="sr-only peer"
                      />

                      <div className="w-11 h-6 rounded-full bg-gray-300 peer-checked:bg-green-600 transition" />

                      <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                    </label>
                  </div>
                );
              })}
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
                  <h2 className="font-bold text-gray-900">Language</h2>

                  <p className="text-sm text-gray-500 mt-0.5">
                    Change Language
                  </p>
                </div>
              </div>

              <ChevronRight
                size={20}
                className={`text-gray-400 transition ${
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
                <h2 className="font-bold text-gray-900">Help & Support</h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Get help with your farmer account
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
                <h2 className="font-bold text-gray-900">About</h2>

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
                <h3 className="font-bold text-gray-900">Farmer Profile</h3>

                <p className="text-xs text-gray-500 mt-0.5">
                  Your account information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="text-gray-400 text-xl"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Name</p>

                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm">
                  {user?.name || "Farmer"}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Mobile Number</p>

                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm">
                  {user?.phone || "Not available"}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Location</p>

                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm">
                  {user?.location || "India"}
                </div>
              </div>
            </div>

            <div className="px-5 pb-5">
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="w-full py-2.5 rounded-lg bg-green-600 text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VERIFICATION MODAL */}
      {showVerification && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">Farmer Verification</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Verify your identity for trusted transactions
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowVerification(false)}
                className="text-gray-400 text-xl"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleVerificationSubmit}>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={verificationForm.fullName}
                    onChange={(e) =>
                      setVerificationForm((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    placeholder="Enter your full name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Government ID Type
                  </label>
                  <select
                    value={verificationForm.idType}
                    onChange={(e) =>
                      setVerificationForm((prev) => ({
                        ...prev,
                        idType: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500"
                    required
                  >
                    <option value="">Select ID type</option>
                    <option value="aadhaar">Aadhaar</option>
                    <option value="voter_id">Voter ID</option>
                    <option value="driving_license">Driving Licence</option>
                    <option value="other">Other Government ID</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    ID Reference
                  </label>
                  <input
                    type="text"
                    value={verificationForm.idReference}
                    onChange={(e) =>
                      setVerificationForm((prev) => ({
                        ...prev,
                        idReference: e.target.value,
                      }))
                    }
                    placeholder="Enter ID reference"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500"
                    required
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Demo flow only. Do not enter sensitive real ID numbers.
                  </p>
                </div>

                <div className="rounded-lg bg-green-50 border border-green-100 p-3 text-xs text-green-800">
                  Your verification request will be submitted for review.
                </div>
              </div>

              <div className="flex gap-3 px-5 pb-5">
                <button
                  type="button"
                  onClick={() => setShowVerification(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BANK MODAL */}
      {showBank && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">Bank Account</h3>

                <p className="text-xs text-gray-500 mt-0.5">
                  Add account for payment settlement
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowBank(false)}
                className="text-gray-400 text-xl"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-4">
              <input
                type="text"
                placeholder="Account Holder Name"
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
                type="button"
                onClick={() => setShowBank(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
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
