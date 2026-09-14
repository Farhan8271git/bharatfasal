import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  BarChart3,
  MessageCircle,
  WalletCards,
  LogOut,
} from "lucide-react";

import {
  getStoredProfile,
  getStoredVerification,
  saveProfile,
} from "../features/settings/utils/settingsStorage";

import { SETTINGS_ROLE_CONFIG } from "../features/settings/constants/settings.constants";

import SettingsHeader from "../features/settings/components/SettingsHeader";
import ProfileSection from "../features/settings/components/ProfileSection";
import VerificationSection from "../features/settings/components/VerificationSection";
import PreferencesSection from "../features/settings/components/PreferencesSection";
import PaymentSection from "../features/settings/components/PaymentSection";
import NotificationsSection from "../features/settings/components/NotificationsSection";
import LanguageSection from "../features/settings/components/LanguageSection";
import HelpSupportSection from "../features/settings/components/HelpSupportSection";
import AboutSection from "../features/settings/components/AboutSection";

import ProfileModal from "../features/settings/modals/ProfileModal";
import BusinessModal from "../features/settings/modals/BusinessModal";
import DocumentsModal from "../features/settings/modals/DocumentsModal";
import VerificationModal from "../features/settings/modals/VerificationModal";
import PreferencesModal from "../features/settings/modals/PreferencesModal";
import PaymentModal from "../features/settings/modals/PaymentModal";
import ProtectedPaymentModal from "../features/settings/modals/ProtectedPaymentModal";
import PaymentHistoryModal from "../features/settings/modals/PaymentHistoryModal";
// Main Component

export default function SettingsPage({ onLogout, user }) {
  const { i18n } = useTranslation();

  const role = user?.role || "farmer";

  const isBuyer = role === "buyer";
  const isFarmer = role === "farmer";
  const isFpo = role === "fpo";
  const isAdmin = role === "admin";

  // Modal state
  const [activeModal, setActiveModal] = useState(null);

  // Language state
  const [showLang, setShowLang] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState({
    prices: true,
    buyers: true,
    payments: true,
  });

  // Profile state
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

  // Buyer business details
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

  // Documents
  const [documents, setDocuments] = useState({
    pan: false,
    gst: false,
    businessProof: false,
    bankProof: false,
  });

  // Procurement preferences
  const [preferences, setPreferences] = useState({
    crops: storedProfile.preferredCrops || "Rice, Wheat, Maize",
    grade: storedProfile.preferredGrade || "A / Premium",
    quantity: storedProfile.typicalQuantity || "100–500 Quintals",
    location: storedProfile.deliveryLocation || "Uttar Pradesh · Delhi NCR",
    transportation:
      storedProfile.transportation || "I will arrange transportation",
  });

  // Payment details
  const [paymentDetails, setPaymentDetails] = useState({
    bankName: storedProfile.bankName || "",
    accountNumber: storedProfile.accountNumber || "",
    ifsc: storedProfile.ifsc || "",
    upi: storedProfile.upi || "",
  });

  // Verification state
  const [verification, setVerification] = useState(() =>
    getStoredVerification(user),
  );

  const [identityDetails, setIdentityDetails] = useState({
    documentType: "",
    documentNumber: "",
  });

  const [identityError, setIdentityError] = useState("");

  // Sync verification status

  useEffect(() => {
    const syncVerification = () => {
      setVerification(getStoredVerification(user));
    };

    window.addEventListener("bf-verification-updated", syncVerification);
    window.addEventListener("storage", syncVerification);

    const interval = setInterval(syncVerification, 2000);

    return () => {
      window.removeEventListener(
        "bf-verification-updated",
        syncVerification,
      );

      window.removeEventListener("storage", syncVerification);

      clearInterval(interval);
    };
  }, [user]);

  // Role configuration

  const roleKey = isBuyer
    ? "buyer"
    : isFpo
      ? "fpo"
      : isAdmin
        ? "admin"
        : "farmer";

  const roleInfo = SETTINGS_ROLE_CONFIG[roleKey];

  // Notification handlers

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const notificationItems = [
    {
      key: "prices",
      label: "Market Price Alerts",
    },
    {
      key: "buyers",
      label: "Buyer Messages",
    },
    {
      key: "payments",
      label: "Payment Updates",
    },
  ];

  // Language handler

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);

    document.documentElement.setAttribute("lang", lang);

    document.documentElement.setAttribute(
      "dir",
      lang === "ur" ? "rtl" : "ltr",
    );

    setShowLang(false);
  };

  // Save profile

  const handleSaveProfile = () => {
    const updated = {
      ...profile,
      businessName: businessDetails.businessName,
    };

    saveProfile(user?.id, updated);

    setActiveModal(null);
  };

  // Save business details

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

  // Save preferences

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

  // Save payment details

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

  // Submit verification

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
          localStorage.getItem("bf_verification_requests") || "[]",
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

        localStorage.setItem(
          "bf_verification_requests",
          JSON.stringify(requests),
        );

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
        localStorage.getItem("bf_verification_requests") || "[]",
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

      localStorage.setItem(
        "bf_verification_requests",
        JSON.stringify(requests),
      );

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

  // Verification status

  const verificationStatus =
    verification?.status ||
    verification?.verificationStatus ||
    "not_submitted";

  const isVerified = verificationStatus === "approved";

  const isVerificationPending =
    verificationStatus === "pending" ||
    verificationStatus === "under_review";

  // Close modal

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}

        <SettingsHeader roleInfo={roleInfo} />

        {/* Main grid */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Profile */}

          <ProfileSection
            roleInfo={roleInfo}
            isBuyer={isBuyer}
            profile={profile}
            businessDetails={businessDetails}
            isVerified={isVerified}
            verificationStatus={verificationStatus}
            onManageProfile={() => setActiveModal("profile")}
          />

          {/* Verification */}

          <VerificationSection
            isBuyer={isBuyer}
            verificationStatus={verificationStatus}
            isVerified={isVerified}
            verification={verification}
            roleInfo={roleInfo}
            onOpenVerification={() => {
              setIdentityError("");
              setActiveModal("verification");
            }}
          />

          {/* Preferences */}

          <PreferencesSection
            isBuyer={isBuyer}
            isFpo={isFpo}
            preferences={preferences}
            onOpenPreferences={() => setActiveModal("preferences")}
          />

          {/* Payments */}

          <PaymentSection
            isBuyer={isBuyer}
            paymentDetails={paymentDetails}
            onOpenModal={setActiveModal}
          />

          {/* Notifications */}

          <NotificationsSection
            notificationItems={notificationItems}
            notifications={notifications}
            onToggle={toggleNotification}
          />

          {/* Language */}

          <LanguageSection
            showLang={showLang}
            currentLanguage={i18n.language}
            onToggle={() => setShowLang((prev) => !prev)}
            onLanguageChange={handleLanguageChange}
          />

          {/* Help */}

          <HelpSupportSection roleInfo={roleInfo} />

          {/* About */}

          <AboutSection />

          {/* Logout */}

          <button
            type="button"
            onClick={onLogout}
            className="lg:col-span-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-200 bg-white text-red-600 font-semibold hover:bg-red-50 hover:border-red-300 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Modals */}

      <ProfileModal
        open={activeModal === "profile"}
        isBuyer={isBuyer}
        profile={profile}
        setProfile={setProfile}
        onSave={handleSaveProfile}
        onClose={closeModal}
      />

      <BusinessModal
        open={activeModal === "business"}
        businessDetails={businessDetails}
        setBusinessDetails={setBusinessDetails}
        onSave={handleSaveBusiness}
        onClose={closeModal}
      />

      <DocumentsModal
        open={activeModal === "documents"}
        documents={documents}
        setDocuments={setDocuments}
        onContinue={() => setActiveModal("verification")}
        onClose={closeModal}
      />

      <VerificationModal
        open={activeModal === "verification"}
        isBuyer={isBuyer}
        businessDetails={businessDetails}
        profile={profile}
        documents={documents}
        identityDetails={identityDetails}
        setIdentityDetails={setIdentityDetails}
        identityError={identityError}
        setIdentityError={setIdentityError}
        onSubmit={submitVerification}
        onClose={closeModal}
      />

      <PreferencesModal
        open={activeModal === "preferences"}
        preferences={preferences}
        setPreferences={setPreferences}
        onSave={handleSavePreferences}
        onClose={closeModal}
      />

      <PaymentModal
        open={activeModal === "payment"}
        isBuyer={isBuyer}
        paymentDetails={paymentDetails}
        setPaymentDetails={setPaymentDetails}
        onSave={handleSavePayment}
        onClose={closeModal}
      />

      <ProtectedPaymentModal
        open={activeModal === "protected"}
        onClose={closeModal}
      />

      <PaymentHistoryModal
        open={activeModal === "history"}
        isBuyer={isBuyer}
        onClose={closeModal}
      />
    </div>
  );
}