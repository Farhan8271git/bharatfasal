import { useEffect, useState } from "react";

import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import MarketPreview from "../components/landing/MarketPreview";
import HowItWorks from "../components/landing/HowItWorks";
import UserTypes from "../components/landing/UserTypes";
import WhyBharatFasal from "../components/landing/WhyBharatFasal";
import CTASection from "../components/landing/CTASection";
import LandingFooter from "../components/landing/LandingFooter";
import LanguagePopup from "../components/landing/LanguagePopup";

const LandingPage = ({ onGetStarted, onLogin }) => {
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);

  useEffect(() => {
    // Always start landing page from top
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    // Check if language has already been selected
    const savedLanguage = localStorage.getItem("bf_language");

    if (!savedLanguage) {
      setShowLanguagePopup(true);
    }

    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);

  const handleLanguageComplete = () => {
    setShowLanguagePopup(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] text-gray-900">
      {/* Navbar */}
      <LandingNavbar onLogin={onLogin} />

      <main>
        {/* Hero */}
        <HeroSection onGetStarted={onGetStarted} />

        {/* Market Snapshot */}
        <MarketPreview />

        {/* Features */}
        <FeaturesSection />

        {/* How It Works */}
        <HowItWorks />

        {/* User Types */}
        <UserTypes />

        {/* Why Bharat Fasal */}
        <WhyBharatFasal />

        {/* CTA */}
        <CTASection onGetStarted={onGetStarted} />
      </main>

      {/* Footer */}
      <LandingFooter />

      {/* First Visit Language Popup */}
      {showLanguagePopup && (
        <LanguagePopup onComplete={handleLanguageComplete} />
      )}
    </div>
  );
};

export default LandingPage;