import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Settings,
  UserRound,
  MapPin,
  Sprout,
  Globe,
  ChevronRight,
  Bell,
  BarChart3,
  MessageCircle,
  WalletCards,
  CircleHelp,
  Phone,
  Mail,
  Info,
  LogOut,
  BriefcaseBusiness,
  Building2,
  Handshake,
  ShieldCheck,
  FileCheck,
  CreditCard,
  LockKeyhole,
  History,
  CheckCircle2,
  Clock3,
  AlertCircle,
  X,
  Save,
  IndianRupee,
  Package,
  Truck,
} from "lucide-react";

import SettingsLanguageSelector from "../components/SettingsLanguageSelector";

// ============================================================
// HELPERS
// ============================================================

const VERIFICATION_KEY = "bf_verification_requests";

const getStoredVerification = (user) => {
  try {
    const requests = JSON.parse(localStorage.getItem(VERIFICATION_KEY) || "[]");

    if (!Array.isArray(requests)) return null;

    return (
      requests.find(
        (item) => item.userId === user?.id || item.phone === user?.phone,
      ) || null
    );
  } catch {
    return null;
  }
};

const getStoredProfile = (user) => {
  try {
    const profiles = JSON.parse(
      localStorage.getItem("bf_user_profiles") || "{}",
    );

    return profiles[user?.id] || {};
  } catch {
    return {};
  }
};

const saveProfile = (userId, profile) => {
  try {
    const profiles = JSON.parse(
      localStorage.getItem("bf_user_profiles") || "{}",
    );

    profiles[userId] = profile;

    localStorage.setItem("bf_user_profiles", JSON.stringify(profiles));
  } catch (error) {
    console.error("Unable to save profile", error);
  }
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function SettingsPage({ onLogout, user }) {
  const { t, i18n } = useTranslation();

  const role = user?.role || "farmer";

  const isBuyer = role === "buyer";
  const isFarmer = role === "farmer";
  const isFpo = role === "fpo";
  const isAdmin = role === "admin";

  // ==========================================================
  // MODALS
  // ==========================================================

  const [activeModal, setActiveModal] = useState(null);

  // ==========================================================
  // LANGUAGE
  // ==========================================================

  const [showLang, setShowLang] = useState(false);

  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

  const [notifications, setNotifications] = useState({
    prices: true,
    buyers: true,
    payments: true,
  });

  // ==========================================================
  // PROFILE
  // ==========================================================

  const storedProfile = getStoredProfile(user);

  const [profile, setProfile] = useState({
    name: storedProfile.name || user?.name || "",
    companyName:
      storedProfile.companyName ||
      user?.companyName ||
      user?.businessName ||
      "",
    phone: storedProfile.phone || user?.phone || "",
    location: storedProfile.location || user?.location || "",
    email: storedProfile.email || user?.email || "",
  });

  // ==========================================================
  // BUYER BUSINESS DETAILS
  // ==========================================================

  const [businessDetails, setBusinessDetails] = useState({
    businessName:
      storedProfile.businessName ||
      user?.companyName ||
      user?.businessName ||
      "",
    businessType: storedProfile.businessType || "Agricultural Buyer",
    gstin: storedProfile.gstin || "",
    pan: storedProfile.pan || "",
    address: storedProfile.address || "",
  });

  // ==========================================================
  // DOCUMENTS
  // ==========================================================

  const [documents, setDocuments] = useState({
    pan: false,
    gst: false,
    businessProof: false,
    bankProof: false,
  });

  // ==========================================================
  // PROCUREMENT PREFERENCES
  // ==========================================================

  const [preferences, setPreferences] = useState({
    crops: storedProfile.preferredCrops || "Rice, Wheat, Maize",
    grade: storedProfile.preferredGrade || "A / Premium",
    quantity: storedProfile.typicalQuantity || "100–500 Quintals",
    location: storedProfile.deliveryLocation || "Uttar Pradesh · Delhi NCR",
    transportation:
      storedProfile.transportation || "I will arrange transportation",
  });

  // ==========================================================
  // PAYMENT DETAILS
  // ==========================================================

  const [paymentDetails, setPaymentDetails] = useState({
    bankName: storedProfile.bankName || "",
    accountNumber: storedProfile.accountNumber || "",
    ifsc: storedProfile.ifsc || "",
    upi: storedProfile.upi || "",
  });

  // ==========================================================
  // VERIFICATION
  // ==========================================================

  const [verification, setVerification] = useState(() =>
    getStoredVerification(user),
  );

  // Identity verification details
  const [identityDetails, setIdentityDetails] = useState({
    documentType: "",
    documentNumber: "",
  });
  const [identityError, setIdentityError] = useState("");

  // ==========================================================
  // SYNC VERIFICATION
  // ==========================================================

  useEffect(() => {
    const syncVerification = () => {
      setVerification(getStoredVerification(user));
    };

    window.addEventListener("bf-verification-updated", syncVerification);

    window.addEventListener("storage", syncVerification);

    const interval = setInterval(syncVerification, 2000);

    return () => {
      window.removeEventListener("bf-verification-updated", syncVerification);

      window.removeEventListener("storage", syncVerification);

      clearInterval(interval);
    };
  }, [user]);

  // ==========================================================
  // ROLE CONTENT
  // ==========================================================

  const roleInfo = useMemo(() => {
    if (isBuyer) {
      return {
        label: "Buyer",
        title: "Buyer Settings",
        subtitle: "Manage your business account and procurement preferences.",
        icon: Handshake,
        color: "text-blue-600",
        bg: "bg-blue-50",
        profileTitle: "Business Profile",
        profileSubtitle: "Your buyer account information",
      };
    }

    if (isFpo) {
      return {
        label: "FPO",
        title: "FPO Settings",
        subtitle: "Manage your FPO account and selling preferences.",
        icon: Building2,
        color: "text-purple-600",
        bg: "bg-purple-50",
        profileTitle: "FPO Profile",
        profileSubtitle: "Your FPO account information",
      };
    }

    if (isAdmin) {
      return {
        label: "Admin",
        title: "Admin Settings",
        subtitle: "Manage administrator account preferences.",
        icon: ShieldCheck,
        color: "text-red-600",
        bg: "bg-red-50",
        profileTitle: "Administrator Profile",
        profileSubtitle: "Your administrator account information",
      };
    }

    return {
      label: "Farmer",
      title: "Farmer Settings",
      subtitle: "Manage your farming account and preferences.",
      icon: Sprout,
      color: "text-green-600",
      bg: "bg-green-50",
      profileTitle: "Farmer Profile",
      profileSubtitle: "Your personal and farming information",
    };
  }, [isBuyer, isFpo, isAdmin]);

  const RoleIcon = roleInfo.icon;

  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const notificationItems = [
    {
      key: "prices",
      label: isBuyer ? "Market Price Alerts" : "Market Price Alerts",
      icon: BarChart3,
    },
    {
      key: "buyers",
      label: isBuyer ? "Buyer Messages" : "Buyer Messages",
      icon: MessageCircle,
    },
    {
      key: "payments",
      label: "Payment Updates",
      icon: WalletCards,
    },
  ];

  // ==========================================================
  // LANGUAGE
  // ==========================================================

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);

    document.documentElement.setAttribute("lang", lang);

    document.documentElement.setAttribute("dir", lang === "ur" ? "rtl" : "ltr");

    setShowLang(false);
  };

  // ==========================================================
  // SAVE PROFILE
  // ==========================================================

  const handleSaveProfile = () => {
    const updated = {
      ...profile,
      businessName: businessDetails.businessName,
    };

    saveProfile(user?.id, updated);

    setActiveModal(null);
  };

  // ==========================================================
  // SAVE BUSINESS DETAILS
  // ==========================================================

  const handleSaveBusiness = () => {
    const updatedProfile = {
      ...profile,
      businessName: businessDetails.businessName,
      businessType: businessDetails.businessType,
      gstin: businessDetails.gstin,
      pan: businessDetails.pan,
      address: businessDetails.address,
    };

    setProfile(updatedProfile);

    saveProfile(user?.id, updatedProfile);

    setActiveModal(null);
  };

  // ==========================================================
  // SAVE PREFERENCES
  // ==========================================================

  const handleSavePreferences = () => {
    const updatedProfile = {
      ...profile,
      preferredCrops: preferences.crops,
      preferredGrade: preferences.grade,
      typicalQuantity: preferences.quantity,
      deliveryLocation: preferences.location,
      transportation: preferences.transportation,
    };

    saveProfile(user?.id, updatedProfile);

    setActiveModal(null);
  };

  // ==========================================================
  // SAVE PAYMENT
  // ==========================================================

  const handleSavePayment = () => {
    const updatedProfile = {
      ...profile,
      bankName: paymentDetails.bankName,
      accountNumber: paymentDetails.accountNumber,
      ifsc: paymentDetails.ifsc,
      upi: paymentDetails.upi,
    };

    saveProfile(user?.id, updatedProfile);

    setActiveModal(null);
  };

  // ==========================================================
  // VERIFICATION SUBMISSION
  // ==========================================================

  const submitVerification = () => {
    if (!isBuyer) {
      const type = identityDetails.documentType;
      const number = identityDetails.documentNumber.trim().toUpperCase();

      if (!type) {
        setIdentityError("Please select a document type.");
        return;
      }

      if (!number) {
        setIdentityError("Please enter your document number.");
        return;
      }

      const rules = {
        aadhaar: /^\d{12}$/,
        pan: /^[A-Z]{5}\d{4}[A-Z]$/,
        voter: /^[A-Z]{3,4}\d{6,10}$/,
        driving: /^[A-Z]{2}\d{2}\s?\d{4,13}$/,
      };

      if (rules[type] && !rules[type].test(number)) {
        setIdentityError(
          type === "aadhaar"
            ? "Aadhaar number must contain 12 digits."
            : type === "pan"
              ? "Enter a valid PAN format, e.g. ABCDE1234F."
              : "Please enter a valid document number.",
        );
        return;
      }

      const request = {
        id: `VER-${Date.now()}`,
        userId: user?.id || `user-${Date.now()}`,
        type: role,
        name: profile.name || user?.name || "",
        phone: profile.phone || user?.phone || "",
        email: profile.email || user?.email || "",
        location: profile.location || user?.location || "India",
        identity: {
          documentType: type,
          documentNumber: number,
        },
        status: "pending",
        verificationStatus: "pending",
        submittedAt: new Date().toISOString(),
      };

      try {
        const existing = JSON.parse(
          localStorage.getItem(VERIFICATION_KEY) || "[]",
        );

        const requests = Array.isArray(existing) ? existing : [];
        const existingIndex = requests.findIndex(
          (item) =>
            item.userId === request.userId || item.phone === request.phone,
        );

        if (existingIndex >= 0) {
          requests[existingIndex] = {
            ...requests[existingIndex],
            ...request,
            id: requests[existingIndex].id || request.id,
          };
        } else {
          requests.push(request);
        }

        localStorage.setItem(VERIFICATION_KEY, JSON.stringify(requests));
        setVerification(request);
        setIdentityError("");
        setActiveModal(null);

        window.dispatchEvent(
          new CustomEvent("bf-verification-submitted", {
            detail: request,
          }),
        );
      } catch (error) {
        console.error("Verification submission failed", error);
        setIdentityError("Unable to submit verification. Please try again.");
      }
      return;
    }

    // Existing buyer verification flow
    const request = {
      id: `VER-${Date.now()}`,
      userId: user?.id || `buyer-${Date.now()}`,
      type: "buyer",
      name: profile.name || user?.name || "",
      phone: profile.phone || user?.phone || "",
      email: profile.email || user?.email || "",
      businessName: businessDetails.businessName || profile.companyName || "",
      companyName: businessDetails.businessName || profile.companyName || "",
      businessType: businessDetails.businessType,
      location: profile.location || user?.location || "India",
      address: businessDetails.address,
      pan: businessDetails.pan,
      gstin: businessDetails.gstin,
      documents: {
        pan: documents.pan,
        gst: documents.gst,
        businessProof: documents.businessProof,
        bankProof: documents.bankProof,
      },
      bankAccount: paymentDetails.accountNumber ? "Submitted" : "",
      status: "pending",
      verificationStatus: "pending",
      submittedAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem(VERIFICATION_KEY) || "[]",
      );
      const requests = Array.isArray(existing) ? existing : [];
      const existingIndex = requests.findIndex(
        (item) =>
          item.userId === request.userId || item.phone === request.phone,
      );

      if (existingIndex >= 0) {
        requests[existingIndex] = {
          ...requests[existingIndex],
          ...request,
          id: requests[existingIndex].id || request.id,
        };
      } else {
        requests.push(request);
      }

      localStorage.setItem(VERIFICATION_KEY, JSON.stringify(requests));
      setVerification(request);

      window.dispatchEvent(
        new CustomEvent("bf-verification-submitted", {
          detail: request,
        }),
      );

      setActiveModal(null);
    } catch (error) {
      console.error("Verification submission failed", error);
    }
  };
  // ==========================================================
  // VERIFICATION STATUS
  // ==========================================================

  const verificationStatus =
    verification?.status || verification?.verificationStatus || "not_submitted";

  const isVerified = verificationStatus === "approved";

  const isVerificationPending =
    verificationStatus === "pending" || verificationStatus === "under_review";

  // ==========================================================
  // MODAL CLOSE
  // ==========================================================

  const closeModal = () => {
    setActiveModal(null);
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* ======================================================
          PAGE
      ====================================================== */}

      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="flex items-center gap-3">
          <div
            className={`
              w-11 h-11
              rounded-xl
              ${roleInfo.bg}
              ${roleInfo.color}
              flex items-center justify-center
            `}
          >
            <Settings size={22} />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {roleInfo.title}
            </h1>

            <p className="text-sm text-gray-500 mt-0.5">{roleInfo.subtitle}</p>
          </div>
        </div>

        {/* ====================================================
            MAIN GRID
        ==================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* ==================================================
              PROFILE
          ================================================== */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader
              icon={RoleIcon}
              iconClass={roleInfo.color}
              iconBg={roleInfo.bg}
              title={roleInfo.profileTitle}
              subtitle={roleInfo.profileSubtitle}
            />

            <div className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                  <UserRound
                    size={38}
                    strokeWidth={1.8}
                    className={roleInfo.color}
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 truncate">
                    {isBuyer
                      ? profile.companyName ||
                        businessDetails.businessName ||
                        profile.name ||
                        "Business Name not added"
                      : profile.name || "User"}
                  </h3>

                  {isBuyer && profile.name && (
                    <p className="text-sm text-gray-500 mt-1">{profile.name}</p>
                  )}

                  {profile.phone && (
                    <p className="flex items-center gap-2 text-sm text-gray-500 mt-1.5">
                      <Phone size={14} />
                      {profile.phone}
                    </p>
                  )}

                  <p className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <MapPin size={14} />
                    {profile.location || "India"}
                  </p>

                  <p className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <RoleIcon size={14} className={roleInfo.color} />

                    {roleInfo.label}
                  </p>
                </div>
              </div>

              {/* STATUS */}

              <div className="flex flex-wrap gap-2 mt-5">
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                  {roleInfo.label}
                </span>

                {isBuyer && (
                  <VerificationBadge
                    status={isVerified ? "approved" : verificationStatus}
                  />
                )}
              </div>

              <button
                type="button"
                onClick={() => setActiveModal("profile")}
                className="w-full mt-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Manage Profile
              </button>
            </div>
          </section>

          {/* ==================================================
              VERIFICATION
          ================================================== */}

          {isBuyer ? (
            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <CardHeader
                icon={ShieldCheck}
                iconClass="text-green-600"
                iconBg="bg-green-50"
                title="Business Verification"
                subtitle="Build trust with farmers and FPOs"
              />

              <div className="p-5 space-y-4">
                {/* MOBILE */}

                <InfoRow
                  label="Mobile Number"
                  value={profile.phone ? profile.phone : "Not added"}
                  right={
                    profile.phone ? (
                      <span className="text-xs font-semibold text-green-600">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-amber-600">
                        Pending
                      </span>
                    )
                  }
                />

                {/* BUSINESS */}

                <InfoRow
                  label="Business Details"
                  value={
                    businessDetails.businessName
                      ? `${businessDetails.businessName} · ${businessDetails.businessType}`
                      : "Company information"
                  }
                  right={
                    isVerified ? (
                      <span className="text-xs font-semibold text-green-600">
                        Verified
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-amber-600">
                        Pending
                      </span>
                    )
                  }
                  onClick={() => setActiveModal("business")}
                />

                {/* DOCUMENTS */}

                <InfoRow
                  label="Business Documents"
                  value="PAN / GSTIN / business registration"
                  right={
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                      Manage
                      <ChevronRight size={14} />
                    </span>
                  }
                  onClick={() => setActiveModal("documents")}
                />

                {/* VERIFICATION STATUS */}

                <div
                  className={`
                    rounded-xl border p-4
                    ${
                      isVerified
                        ? "border-green-200 bg-green-50"
                        : "border-amber-200 bg-amber-50"
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {isVerified ? (
                      <CheckCircle2
                        size={19}
                        className="text-green-600 mt-0.5"
                      />
                    ) : (
                      <Clock3 size={19} className="text-amber-600 mt-0.5" />
                    )}

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {isVerified
                          ? "Buyer Verified"
                          : isVerificationPending
                            ? "Verification Pending"
                            : "Verification Rejected"}
                      </p>

                      <p className="text-xs text-gray-600 mt-1">
                        {isVerified
                          ? "Your business information has been approved by the admin."
                          : isVerificationPending
                            ? "Submit your business details and documents for admin review."
                            : "Your verification was rejected. Update your information and submit again."}
                      </p>
                    </div>
                  </div>
                </div>

                {!isVerified && (
                  <button
                    type="button"
                    onClick={() => setActiveModal("verification")}
                    className="w-full py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                  >
                    {isVerificationPending
                      ? "View Verification"
                      : "Complete Verification"}
                  </button>
                )}
              </div>
            </section>
          ) : (
            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <CardHeader
                icon={ShieldCheck}
                iconClass="text-green-600"
                iconBg="bg-green-50"
                title={
                  isFarmer
                    ? "Farmer Verification"
                    : isFpo
                      ? "FPO Verification"
                      : "Account Verification"
                }
                subtitle={
                  isFarmer
                    ? "Verify your identity for trusted transactions"
                    : isFpo
                      ? "Verify your FPO for trusted transactions"
                      : "Manage account verification"
                }
              />

              <div className="p-5 space-y-4">
                <InfoRow
                  label="Mobile Number"
                  value={profile.phone || "Not added"}
                  right={
                    profile.phone ? (
                      <span className="text-xs font-semibold text-green-600">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-amber-600">
                        Pending
                      </span>
                    )
                  }
                />

                <InfoRow
                  label="Identity Verification"
                  value={
                    verificationStatus === "approved"
                      ? "Government identity verified"
                      : verificationStatus === "pending" ||
                          verificationStatus === "under_review"
                        ? "Verification submitted for review"
                        : verificationStatus === "rejected"
                          ? "Verification rejected — update and resubmit"
                          : "Not submitted"
                  }
                  right={
                    verificationStatus === "approved" ? (
                      <span className="text-xs font-semibold text-green-600">
                        ✓ Verified
                      </span>
                    ) : verificationStatus === "pending" ||
                      verificationStatus === "under_review" ? (
                      <span className="text-xs font-semibold text-amber-600">
                        Pending
                      </span>
                    ) : verificationStatus === "rejected" ? (
                      <span className="text-xs font-semibold text-red-600">
                        Rejected
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-gray-500">
                        Not Submitted
                      </span>
                    )
                  }
                />

                {verificationStatus !== "approved" && (
                  <button
                    type="button"
                    onClick={() => {
                      setIdentityError("");
                      setActiveModal("verification");
                    }}
                    className="w-full py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                  >
                    {isVerificationPending
                      ? "View Verification"
                      : verificationStatus === "rejected"
                        ? "Resubmit Verification"
                        : "Start Verification"}
                  </button>
                )}

                <InfoRow
                  label="Bank Verification"
                  value="Required for receiving payments"
                  right={
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                      Manage
                      <ChevronRight size={14} />
                    </span>
                  }
                  onClick={() => setActiveModal("payment")}
                />
              </div>
            </section>
          )}

          {/* ==================================================
              BUYER PROCUREMENT
          ================================================== */}

          {isBuyer ? (
            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <CardHeader
                icon={Package}
                iconClass="text-green-600"
                iconBg="bg-green-50"
                title="Procurement Preferences"
                subtitle="Set your preferred procurement requirements"
              />

              <div className="px-5">
                <PreferenceRow
                  label="Preferred Crops"
                  value={preferences.crops}
                />

                <PreferenceRow
                  label="Preferred Grade"
                  value={preferences.grade}
                />

                <PreferenceRow
                  label="Typical Purchase Quantity"
                  value={preferences.quantity}
                />

                <PreferenceRow
                  label="Preferred Delivery Location"
                  value={preferences.location}
                />

                <PreferenceRow
                  label="Transportation"
                  value={preferences.transportation}
                />

                <button
                  type="button"
                  onClick={() => setActiveModal("preferences")}
                  className="w-full my-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Manage Preferences
                </button>
              </div>
            </section>
          ) : (
            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <CardHeader
                icon={Sprout}
                iconClass="text-green-600"
                iconBg="bg-green-50"
                title={
                  isFpo
                    ? "FPO & Selling Preferences"
                    : "Farm & Selling Preferences"
                }
                subtitle={
                  isFpo
                    ? "Manage your FPO selling preferences"
                    : "Manage your crop and selling preferences"
                }
              />

              <div className="px-5">
                <PreferenceRow
                  label={isFpo ? "Main Crops" : "Main Crops"}
                  value="Wheat, Rice, Maize"
                />

                <PreferenceRow
                  label="Typical Lot Size"
                  value="50–200 Quintals"
                />

                <PreferenceRow label="Preferred Quality" value="A / Premium" />

                <PreferenceRow
                  label="Transportation"
                  value="Seller will arrange transportation"
                />

                <button
                  type="button"
                  onClick={() => setActiveModal("preferences")}
                  className="w-full my-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Manage Selling Preferences
                </button>
              </div>
            </section>
          )}

          {/* ==================================================
              PAYMENTS
          ================================================== */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader
              icon={WalletCards}
              iconClass="text-purple-600"
              iconBg="bg-purple-50"
              title="Payments & Bank"
              subtitle={
                isBuyer
                  ? "Manage payment methods and procurement payments"
                  : "Manage your payment settlement"
              }
            />

            <div className="divide-y divide-gray-100">
              <ActionRow
                icon={CreditCard}
                title={isBuyer ? "Payment Methods" : "Bank Account"}
                subtitle={
                  paymentDetails.accountNumber
                    ? "Bank account added"
                    : "Bank account not added"
                }
                onClick={() => setActiveModal("payment")}
              />

              <ActionRow
                icon={LockKeyhole}
                title={isBuyer ? "Protected Payments" : "Payment Settlement"}
                subtitle={
                  isBuyer
                    ? "Payment protection for procurement orders"
                    : "Track payments from your sales"
                }
                onClick={() => setActiveModal("protected")}
              />

              <ActionRow
                icon={History}
                title="Payment History"
                subtitle={
                  isBuyer
                    ? "View completed and protected payments"
                    : "View completed settlements"
                }
                onClick={() => setActiveModal("history")}
              />
            </div>
          </section>

          {/* ==================================================
              NOTIFICATIONS
          ================================================== */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader
              icon={Bell}
              iconClass="text-amber-600"
              iconBg="bg-amber-50"
              title="Notifications"
              subtitle="Choose what updates you receive"
            />

            <div className="px-5">
              {notificationItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.key}
                    className={`
                        flex
                        items-center
                        justify-between
                        py-4
                        ${
                          index !== notificationItems.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }
                      `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-gray-500" />

                      <span className="text-sm font-semibold text-gray-800">
                        {item.label}
                      </span>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications[item.key]}
                      onClick={() => toggleNotification(item.key)}
                      className={`
                          relative
                          w-11 h-6
                          rounded-full
                          transition
                          ${
                            notifications[item.key]
                              ? "bg-green-600"
                              : "bg-gray-300"
                          }
                        `}
                    >
                      <span
                        className={`
                            absolute
                            top-0.5
                            w-5 h-5
                            rounded-full
                            bg-white
                            shadow-sm
                            transition
                            ${notifications[item.key] ? "left-5" : "left-0.5"}
                          `}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ==================================================
              LANGUAGE
          ================================================== */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowLang((prev) => !prev)}
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
                size={19}
                className={`
                  text-gray-400
                  transition-transform
                  ${showLang ? "rotate-90" : ""}
                `}
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

          {/* ==================================================
              HELP
          ================================================== */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader
              icon={CircleHelp}
              iconClass="text-red-500"
              iconBg="bg-red-50"
              title="Help & Support"
              subtitle={`Get help with your ${roleInfo.label.toLowerCase()} account`}
            />

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

          {/* ==================================================
              ABOUT
          ================================================== */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4">
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

          {/* ==================================================
              LOGOUT
          ================================================== */}

          <button
            type="button"
            onClick={onLogout}
            className="lg:col-span-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-200 bg-white text-red-600 font-semibold hover:bg-red-50 hover:border-red-300 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* ======================================================
          MODALS
      ====================================================== */}

      {activeModal === "profile" && (
        <Modal
          title="Manage Profile"
          subtitle="Update your account information."
          onClose={closeModal}
        >
          <div className="space-y-4">
            <InputField
              label={isBuyer ? "Contact Person" : "Name"}
              value={profile.name}
              onChange={(value) =>
                setProfile((prev) => ({
                  ...prev,
                  name: value,
                }))
              }
            />

            {isBuyer && (
              <InputField
                label="Business / Company Name"
                value={profile.companyName}
                onChange={(value) =>
                  setProfile((prev) => ({
                    ...prev,
                    companyName: value,
                  }))
                }
              />
            )}

            <InputField
              label="Mobile Number"
              value={profile.phone}
              onChange={(value) =>
                setProfile((prev) => ({
                  ...prev,
                  phone: value,
                }))
              }
            />

            <InputField
              label="Email"
              value={profile.email}
              onChange={(value) =>
                setProfile((prev) => ({
                  ...prev,
                  email: value,
                }))
              }
            />

            <InputField
              label="Location"
              value={profile.location}
              onChange={(value) =>
                setProfile((prev) => ({
                  ...prev,
                  location: value,
                }))
              }
            />

            <ModalButton
              onClick={handleSaveProfile}
              icon={Save}
              label="Save Profile"
            />
          </div>
        </Modal>
      )}

      {/* ======================================================
          BUSINESS DETAILS
      ====================================================== */}

      {activeModal === "business" && (
        <Modal
          title="Business Details"
          subtitle="Add the information required for buyer verification."
          onClose={closeModal}
        >
          <div className="space-y-4">
            <InputField
              label="Business / Company Name"
              value={businessDetails.businessName}
              onChange={(value) =>
                setBusinessDetails((prev) => ({
                  ...prev,
                  businessName: value,
                }))
              }
            />

            <InputField
              label="Business Type"
              value={businessDetails.businessType}
              onChange={(value) =>
                setBusinessDetails((prev) => ({
                  ...prev,
                  businessType: value,
                }))
              }
            />

            <InputField
              label="GSTIN"
              value={businessDetails.gstin}
              onChange={(value) =>
                setBusinessDetails((prev) => ({
                  ...prev,
                  gstin: value.toUpperCase(),
                }))
              }
              placeholder="Enter GSTIN"
            />

            <InputField
              label="PAN"
              value={businessDetails.pan}
              onChange={(value) =>
                setBusinessDetails((prev) => ({
                  ...prev,
                  pan: value.toUpperCase(),
                }))
              }
              placeholder="Enter PAN"
            />

            <TextAreaField
              label="Business Address"
              value={businessDetails.address}
              onChange={(value) =>
                setBusinessDetails((prev) => ({
                  ...prev,
                  address: value,
                }))
              }
            />

            <ModalButton
              onClick={handleSaveBusiness}
              icon={Save}
              label="Save Business Details"
            />
          </div>
        </Modal>
      )}

      {/* ======================================================
          DOCUMENTS
      ====================================================== */}

      {activeModal === "documents" && (
        <Modal
          title="Business Documents"
          subtitle="Mark the documents you have prepared for verification."
          onClose={closeModal}
        >
          <div className="space-y-3">
            <DocumentCheck
              label="PAN Card"
              checked={documents.pan}
              onChange={(value) =>
                setDocuments((prev) => ({
                  ...prev,
                  pan: value,
                }))
              }
            />

            <DocumentCheck
              label="GST Registration"
              checked={documents.gst}
              onChange={(value) =>
                setDocuments((prev) => ({
                  ...prev,
                  gst: value,
                }))
              }
            />

            <DocumentCheck
              label="Business Registration / Proof"
              checked={documents.businessProof}
              onChange={(value) =>
                setDocuments((prev) => ({
                  ...prev,
                  businessProof: value,
                }))
              }
            />

            <DocumentCheck
              label="Bank Account Proof"
              checked={documents.bankProof}
              onChange={(value) =>
                setDocuments((prev) => ({
                  ...prev,
                  bankProof: value,
                }))
              }
            />

            <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-500 flex gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />

              <span>
                This prototype records document readiness. Real document upload
                and KYC validation should be connected to secure backend storage
                and verification services.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal("verification")}
              className="w-full mt-2 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
            >
              Continue to Verification
            </button>
          </div>
        </Modal>
      )}

      {/* ======================================================
          VERIFICATION
      ====================================================== */}

      {activeModal === "verification" && (
        <Modal
          title={isBuyer ? "Buyer Verification" : "Identity Verification"}
          subtitle={
            isBuyer
              ? "Submit your business information for admin review."
              : "Verify your identity to build trust on Bharat Fasal."
          }
          onClose={closeModal}
        >
          {isBuyer ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-start gap-3">
                  <FileCheck size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      What will be submitted?
                    </p>
                    <p className="text-xs text-gray-600 mt-1 leading-5">
                      Your contact information, business details, PAN, GSTIN,
                      document readiness and payment details will be sent to the
                      Admin verification queue.
                    </p>
                  </div>
                </div>
              </div>

              <ReviewValue
                label="Business"
                value={businessDetails.businessName || "Not provided"}
              />
              <ReviewValue
                label="Contact Person"
                value={profile.name || "Not provided"}
              />
              <ReviewValue
                label="PAN"
                value={businessDetails.pan || "Not provided"}
              />
              <ReviewValue
                label="GSTIN"
                value={businessDetails.gstin || "Not provided"}
              />
              <ReviewValue
                label="Documents"
                value={
                  [
                    documents.pan && "PAN",
                    documents.gst && "GST",
                    documents.businessProof && "Business Proof",
                    documents.bankProof && "Bank Proof",
                  ]
                    .filter(Boolean)
                    .join(", ") || "No documents marked"
                }
              />

              <button
                type="button"
                onClick={submitVerification}
                className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold flex items-center justify-center gap-2"
              >
                <ShieldCheck size={17} />
                Submit for Admin Verification
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={21} className="text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Government ID verification
                    </p>
                    <p className="text-xs text-gray-600 mt-1 leading-5">
                      Enter your document details. We will validate the format
                      first and send the submission for verification review.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Document Type
                </label>
                <select
                  value={identityDetails.documentType}
                  onChange={(e) => {
                    setIdentityDetails((prev) => ({
                      ...prev,
                      documentType: e.target.value,
                    }));
                    setIdentityError("");
                  }}
                  className="w-full mt-1.5 h-11 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Select document type</option>
                  <option value="aadhaar">Aadhaar Card</option>
                  <option value="voter">Voter ID</option>
                  <option value="driving">Driving Licence</option>
                  <option value="pan">PAN Card</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Document Number
                </label>
                <input
                  type="text"
                  value={identityDetails.documentNumber}
                  onChange={(e) => {
                    setIdentityDetails((prev) => ({
                      ...prev,
                      documentNumber: e.target.value.toUpperCase(),
                    }));
                    setIdentityError("");
                  }}
                  placeholder={
                    identityDetails.documentType === "aadhaar"
                      ? "Enter 12-digit Aadhaar number"
                      : identityDetails.documentType === "pan"
                        ? "Enter PAN (e.g. ABCDE1234F)"
                        : "Enter document number"
                  }
                  className={`w-full mt-1.5 h-11 px-3 rounded-lg border bg-white text-sm text-gray-800 outline-none focus:ring-2 ${
                    identityError
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                  }`}
                />
                {identityError && (
                  <p className="text-xs text-red-600 mt-1.5">{identityError}</p>
                )}
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <AlertCircle
                  size={15}
                  className="text-gray-500 shrink-0 mt-0.5"
                />
                <p className="text-xs text-gray-500 leading-5">
                  Format validation happens before submission. Actual identity
                  verification requires an authorized verification service or
                  admin review.
                </p>
              </div>

              <button
                type="button"
                onClick={submitVerification}
                className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition"
              >
                <ShieldCheck size={17} />
                Submit for Verification
              </button>
            </div>
          )}
        </Modal>
      )}

      {/* ======================================================
          PREFERENCES
      ====================================================== */}

      {activeModal === "preferences" && (
        <Modal
          title="Procurement Preferences"
          subtitle="Set the requirements you commonly use while buying."
          onClose={closeModal}
        >
          <div className="space-y-4">
            <InputField
              label="Preferred Crops"
              value={preferences.crops}
              onChange={(value) =>
                setPreferences((prev) => ({
                  ...prev,
                  crops: value,
                }))
              }
            />

            <InputField
              label="Preferred Grade"
              value={preferences.grade}
              onChange={(value) =>
                setPreferences((prev) => ({
                  ...prev,
                  grade: value,
                }))
              }
            />

            <InputField
              label="Typical Purchase Quantity"
              value={preferences.quantity}
              onChange={(value) =>
                setPreferences((prev) => ({
                  ...prev,
                  quantity: value,
                }))
              }
            />

            <InputField
              label="Preferred Delivery Location"
              value={preferences.location}
              onChange={(value) =>
                setPreferences((prev) => ({
                  ...prev,
                  location: value,
                }))
              }
            />

            <div>
              <label className="text-xs font-semibold text-gray-700">
                Transportation
              </label>

              <select
                value={preferences.transportation}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    transportation: e.target.value,
                  }))
                }
                className="w-full mt-1.5 h-11 px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-green-500"
              >
                <option>I will arrange transportation</option>

                <option>Seller should arrange transportation</option>
              </select>
            </div>

            <ModalButton
              onClick={handleSavePreferences}
              icon={Save}
              label="Save Preferences"
            />
          </div>
        </Modal>
      )}

      {/* ======================================================
          PAYMENT
      ====================================================== */}

      {activeModal === "payment" && (
        <Modal
          title={isBuyer ? "Payment Methods" : "Bank Account"}
          subtitle={
            isBuyer
              ? "Add the account used for procurement payments."
              : "Add your settlement account."
          }
          onClose={closeModal}
        >
          <div className="space-y-4">
            <InputField
              label="Bank Name"
              value={paymentDetails.bankName}
              onChange={(value) =>
                setPaymentDetails((prev) => ({
                  ...prev,
                  bankName: value,
                }))
              }
            />

            <InputField
              label="Account Number"
              value={paymentDetails.accountNumber}
              onChange={(value) =>
                setPaymentDetails((prev) => ({
                  ...prev,
                  accountNumber: value,
                }))
              }
            />

            <InputField
              label="IFSC"
              value={paymentDetails.ifsc}
              onChange={(value) =>
                setPaymentDetails((prev) => ({
                  ...prev,
                  ifsc: value.toUpperCase(),
                }))
              }
            />

            <InputField
              label="UPI ID"
              value={paymentDetails.upi}
              onChange={(value) =>
                setPaymentDetails((prev) => ({
                  ...prev,
                  upi: value,
                }))
              }
              placeholder="example@upi"
            />

            <ModalButton
              onClick={handleSavePayment}
              icon={Save}
              label="Save Payment Details"
            />
          </div>
        </Modal>
      )}

      {/* ======================================================
          PROTECTED PAYMENTS
      ====================================================== */}

      {activeModal === "protected" && (
        <Modal
          title="Protected Payments"
          subtitle="Understand how payment protection works on Bharat Fasal."
          onClose={closeModal}
        >
          <div className="space-y-4">
            <ProtectedStep
              number="1"
              title="Payment Secured"
              text="Buyer payment is marked as protected for the procurement order."
            />

            <ProtectedStep
              number="2"
              title="Quality & Quantity Verification"
              text="Order information and delivery evidence are checked."
            />

            <ProtectedStep
              number="3"
              title="Delivery Confirmation"
              text="Delivery and buyer inspection are completed."
            />

            <ProtectedStep
              number="4"
              title="Payment Release"
              text="Settlement is released after successful completion."
            />

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-800">
              Prototype only: actual escrow/payment holding requires a compliant
              payment provider and backend integration.
            </div>
          </div>
        </Modal>
      )}

      {/* ======================================================
          PAYMENT HISTORY
      ====================================================== */}

      {activeModal === "history" && (
        <Modal
          title="Payment History"
          subtitle="Your recent procurement payment activity."
          onClose={closeModal}
        >
          <div className="space-y-3">
            <PaymentHistoryItem
              order="BF-ORD-1024"
              crop="Rice"
              amount="₹4,50,000"
              status="Protected"
            />

            <PaymentHistoryItem
              order="BF-ORD-1018"
              crop="Wheat"
              amount="₹3,20,000"
              status="Released"
            />

            <PaymentHistoryItem
              order="BF-ORD-1009"
              crop="Maize"
              amount="₹2,64,000"
              status="Completed"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// CARD HEADER
// ============================================================

function CardHeader({ icon: Icon, iconClass, iconBg, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
      <div
        className={`
          w-9 h-9
          rounded-lg
          ${iconBg}
          ${iconClass}
          flex items-center justify-center
        `}
      >
        <Icon size={19} />
      </div>

      <div>
        <h2 className="font-bold text-gray-900">{title}</h2>

        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

// ============================================================
// INFO ROW
// ============================================================

function InfoRow({ label, value, right, onClick }) {
  const content = (
    <div className="py-3.5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800">{label}</p>

          <p className="text-xs text-gray-500 mt-0.5 truncate">{value}</p>
        </div>

        {right}
      </div>
    </div>
  );

  if (!onClick) {
    return (
      <div className="border-b border-gray-100 last:border-b-0">{content}</div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
    >
      {content}
    </button>
  );
}

// ============================================================
// ACTION ROW
// ============================================================

function ActionRow({ icon: Icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition"
    >
      <Icon size={18} className="text-gray-500 shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{title}</p>

        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>

      <ChevronRight size={17} className="text-gray-400 shrink-0" />
    </button>
  );
}

// ============================================================
// PREFERENCE ROW
// ============================================================

function PreferenceRow({ label, value }) {
  return (
    <div className="py-3.5 border-b border-gray-100">
      <p className="text-[11px] text-gray-400">{label}</p>

      <p className="text-sm font-semibold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

// ============================================================
// VERIFICATION BADGE
// ============================================================

function VerificationBadge({ status }) {
  if (status === "approved") {
    return (
      <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
        ✓ Verified
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold">
        Verification Rejected
      </span>
    );
  }

  return (
    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
      Verification Pending
    </span>
  );
}

// ============================================================
// MODAL
// ============================================================

function Modal({ title, subtitle, children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>

            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ============================================================
// INPUT
// ============================================================

function InputField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-700">{label}</label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1.5 h-11 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}

// ============================================================
// TEXT AREA
// ============================================================

function TextAreaField({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-700">{label}</label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none"
      />
    </div>
  );
}

// ============================================================
// MODAL BUTTON
// ============================================================

function ModalButton({ onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full mt-2 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold flex items-center justify-center gap-2"
    >
      <Icon size={16} />

      {label}
    </button>
  );
}

// ============================================================
// DOCUMENT CHECK
// ============================================================

function DocumentCheck({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-green-600"
      />

      <FileCheck size={17} className="text-gray-500" />

      <span className="text-sm font-medium text-gray-800">{label}</span>
    </label>
  );
}

// ============================================================
// REVIEW VALUE
// ============================================================

function ReviewValue({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-100">
      <span className="text-xs text-gray-500">{label}</span>

      <span className="text-sm font-semibold text-gray-800 text-right max-w-[65%] break-words">
        {value}
      </span>
    </div>
  );
}

// ============================================================
// PROTECTED PAYMENT STEP
// ============================================================

function ProtectedStep({ number, title, text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-green-50 text-green-700 flex items-center justify-center text-xs font-bold shrink-0">
        {number}
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>

        <p className="text-xs text-gray-500 mt-1 leading-5">{text}</p>
      </div>
    </div>
  );
}

// ============================================================
// PAYMENT HISTORY
// ============================================================

function PaymentHistoryItem({ order, crop, amount, status }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200">
      <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
        <IndianRupee size={18} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{order}</p>

        <p className="text-xs text-gray-500 mt-0.5">
          {crop} · {amount}
        </p>
      </div>

      <span
        className={`
          px-2 py-1
          rounded-full
          text-[10px]
          font-semibold
          ${
            status === "Released" || status === "Completed"
              ? "bg-green-50 text-green-700"
              : "bg-blue-50 text-blue-700"
          }
        `}
      >
        {status}
      </span>
    </div>
  );
}
