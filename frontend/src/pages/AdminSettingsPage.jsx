import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Settings,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  Bell,
  BarChart3,
  MessageCircle,
  WalletCards,
  Globe,
  ChevronRight,
  CircleHelp,
  Mail,
  Info,
  LogOut,
  Users,
  FileCheck,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

import SettingsLanguageSelector from "../components/SettingsLanguageSelector";

export default function AdminSettingsPage({ user, onLogout }) {
  const { t, i18n } = useTranslation();

  const [showLang, setShowLang] = useState(false);

  const [notifications, setNotifications] = useState({
    prices: true,
    buyers: true,
    payments: true,
  });

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

            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Settings size={22} />
            </div>

            <div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {t("settings")}
              </h1>

              <p className="text-sm text-gray-500 mt-0.5">
                Manage platform administration and account settings
              </p>

            </div>

          </div>

        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

          {/* ADMIN PROFILE */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <ShieldCheck size={19} />
              </div>

              <div>

                <h2 className="font-bold text-gray-900">
                  Admin Profile
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Administrator account information
                </p>

              </div>

            </div>


            <div className="p-5">

              <div className="flex items-center gap-5">

                <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">

                  <ShieldCheck
                    size={38}
                    strokeWidth={1.8}
                    className="text-red-600"
                  />

                </div>


                <div>

                  <h3 className="text-xl font-bold text-gray-900">
                    {user?.name || "Administrator"}
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
                    <ShieldCheck size={15} />
                    Platform Administrator
                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* SECURITY */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <ShieldCheck size={19} />
              </div>

              <div>

                <h2 className="font-bold text-gray-900">
                  Security
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Manage administrator security
                </p>

              </div>

            </div>


            <div className="px-5">

              <button className="w-full flex items-center justify-between py-4 border-b border-gray-100 text-left">

                <div className="flex items-center gap-3">

                  <ShieldCheck size={18} className="text-green-600" />

                  <div>

                    <p className="text-sm font-semibold text-gray-800">
                      Two-Factor Authentication
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Additional account protection
                    </p>

                  </div>

                </div>

                <span className="text-xs font-semibold text-green-600">
                  Enabled
                </span>

              </button>


              <button className="w-full flex items-center justify-between py-4 border-b border-gray-100 text-left">

                <div className="flex items-center gap-3">

                  <User size={18} className="text-gray-500" />

                  <div>

                    <p className="text-sm font-semibold text-gray-800">
                      Login Sessions
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Review active sessions
                    </p>

                  </div>

                </div>

                <ChevronRight size={17} className="text-gray-400" />

              </button>


              <button className="w-full flex items-center justify-between py-4 text-left">

                <div className="flex items-center gap-3">

                  <ShieldCheck size={18} className="text-gray-500" />

                  <div>

                    <p className="text-sm font-semibold text-gray-800">
                      Access Control
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Manage administrator permissions
                    </p>

                  </div>

                </div>

                <ChevronRight size={17} className="text-gray-400" />

              </button>

            </div>

          </section>


          {/* PLATFORM MANAGEMENT */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users size={19} />
              </div>

              <div>

                <h2 className="font-bold text-gray-900">
                  Platform Management
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Manage Bharat Fasal operations
                </p>

              </div>

            </div>


            <div className="px-5">

              <button className="w-full flex items-center justify-between py-4 border-b border-gray-100 text-left">

                <div className="flex items-center gap-3">

                  <Users size={18} className="text-gray-500" />

                  <div>

                    <p className="text-sm font-semibold text-gray-800">
                      User Management
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Farmers, FPOs and buyers
                    </p>

                  </div>

                </div>

                <ChevronRight size={17} className="text-gray-400" />

              </button>


              <button className="w-full flex items-center justify-between py-4 border-b border-gray-100 text-left">

                <div className="flex items-center gap-3">

                  <FileCheck size={18} className="text-gray-500" />

                  <div>

                    <p className="text-sm font-semibold text-gray-800">
                      Verification Management
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Review submitted documents
                    </p>

                  </div>

                </div>

                <ChevronRight size={17} className="text-gray-400" />

              </button>


              <button className="w-full flex items-center justify-between py-4 text-left">

                <div className="flex items-center gap-3">

                  <AlertTriangle size={18} className="text-gray-500" />

                  <div>

                    <p className="text-sm font-semibold text-gray-800">
                      Dispute Management
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Review platform disputes
                    </p>

                  </div>

                </div>

                <ChevronRight size={17} className="text-gray-400" />

              </button>

            </div>

          </section>


          {/* TRANSACTIONS */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <WalletCards size={19} />
              </div>

              <div>

                <h2 className="font-bold text-gray-900">
                  Transaction Monitoring
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Monitor platform payments and settlements
                </p>

              </div>

            </div>


            <div className="px-5">

              <button className="w-full flex items-center justify-between py-4 border-b border-gray-100 text-left">

                <div className="flex items-center gap-3">

                  <WalletCards size={18} className="text-gray-500" />

                  <div>

                    <p className="text-sm font-semibold text-gray-800">
                      Payment Monitoring
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Platform payment activity
                    </p>

                  </div>

                </div>

                <ChevronRight size={17} className="text-gray-400" />

              </button>


              <button className="w-full flex items-center justify-between py-4 text-left">

                <div className="flex items-center gap-3">

                  <BarChart3 size={18} className="text-gray-500" />

                  <div>

                    <p className="text-sm font-semibold text-gray-800">
                      Platform Reports
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Transactions and marketplace activity
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
                  Choose administrative updates
                </p>

              </div>

            </div>


            <div className="px-5">

              {[
                ["prices", "Market Alerts", BarChart3],
                ["buyers", "User Messages", MessageCircle],
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
                  Platform administrator support
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

    </div>
  );
}