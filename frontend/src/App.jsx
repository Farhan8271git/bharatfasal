import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";

// Payment pages
import FarmerPaymentsPage from "./pages/FarmerPaymentsPage";
import FPOPaymentsPage from "./pages/FPOPaymentsPage";
import AdminPaymentsPage from "./pages/AdminPaymentsPage";

// Layout and landing
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";

// Language popup
import LanguagePopup from "./components/landing/LanguagePopup";

// Authentication
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";



// Dashboards
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import FPODashboardPage from "./pages/FPODashboardPage";
import BuyerDashboardPage from "./pages/BuyerDashboardPage";

// Marketplace pages
import MandiPricesPage from "./pages/MandiPricesPage";
import PriceDetailPage from "./pages/PriceDetailPage";
import BuyerMarketPage from "./pages/BuyerMarketPage";
import MyLotsPage from "./pages/MyLotsPage";
import BrowseLotsPage from "./pages/BrowseLotsPage";
import CreateLotPage from "./pages/CreateLotPage";
import LogisticsPage from "./pages/LogisticsPage";
import PaymentsPage from "./pages/PaymentsPage";
import DisputePage from "./pages/DisputePage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLandingPage, setIsLandingPage] = useState(
    location.pathname === "/"
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userRole, setUserRole] = useState(
    localStorage.getItem("bf_user_role") || "farmer"
  );

  const [currentUser, setCurrentUser] = useState(null);

  // Language popup
  const [showLanguagePopup, setShowLanguagePopup] = useState(true);

  // Language initialization
  useEffect(() => {
    const savedLanguage = localStorage.getItem("bf_language");

    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  // Language direction
  useEffect(() => {
    const lang = i18n.language || "en";
    const dir = lang === "ur" ? "rtl" : "ltr";

    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [i18n.language]);

  // Landing page check
  useEffect(() => {
    if (location.pathname === "/") {
      setIsLandingPage(true);
    } else {
      setIsLandingPage(false);
    }
  }, [location.pathname]);

  // Get started
  const handleGetStarted = () => {
    navigate("/register");
  };

  // Landing page login
  const handleLandingLogin = () => {
    navigate("/login");
  };

  // Login
  const handleLogin = (role = "farmer", user = null) => {
    localStorage.setItem("bf_logged_in", "true");
    localStorage.setItem("bf_user_role", role);

    setUserRole(role);
    setCurrentUser(user);
    setIsLoggedIn(true);

    navigate("/");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("bf_logged_in");
    localStorage.removeItem("bf_user_role");

    setIsLoggedIn(false);
    setUserRole("farmer");
    setCurrentUser(null);

    navigate("/");
  };

  // Language popup complete
  const handleLanguageComplete = () => {
    setShowLanguagePopup(false);
  };

  // Landing page
  if (location.pathname === "/" && !isLoggedIn) {
    return (
      <>
        <LandingPage
          onGetStarted={handleGetStarted}
          onLogin={handleLandingLogin}
        />

        {showLanguagePopup && (
          <LanguagePopup onComplete={handleLanguageComplete} />
        )}
      </>
    );
  }

  // Register
  if (location.pathname === "/register" && !isLoggedIn) {
    return <RegisterPage />;
  }

  // Login
  if (location.pathname === "/login" && !isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Forgot password
  if (location.pathname === "/forgot-password" && !isLoggedIn) {
    return <ForgotPasswordPage />;
  }

  // reset password
  if (location.pathname === "/reset-password" && !isLoggedIn) {
    return <ResetPasswordPage />;
  }

  // Public mandi prices
  if (location.pathname === "/prices" && !isLoggedIn) {
    return <MandiPricesPage />;
  }

  // Redirect unauthenticated users
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Dashboard
  const getDashboard = () => {
    switch (userRole) {
      case "admin":
        return <AdminDashboardPage user={currentUser} />;

      case "fpo":
        return <FPODashboardPage user={currentUser} />;

      case "buyer":
        return <BuyerDashboardPage user={currentUser} />;

      case "farmer":
      default:
        return <DashboardPage user={currentUser} />;
    }
  };

  // Authenticated application
  return (
    <Layout onLogout={handleLogout} user={currentUser}>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={getDashboard()} />

        {/* Mandi prices */}
        <Route path="/prices" element={<MandiPricesPage />} />

        {/* Price details */}
        <Route
          path="/prices/:commodityId"
          element={<PriceDetailPage />}
        />

        {/* Buyers */}
        <Route
          path="/buyers"
          element={<BuyerMarketPage user={currentUser} />}
        />

        {/* Create lot */}
        <Route path="/lots/create" element={<CreateLotPage />} />

        {/* Lots */}
        <Route
          path="/lots"
          element={
            userRole === "buyer" ? (
              <BrowseLotsPage user={currentUser} />
            ) : (
              <MyLotsPage user={currentUser} />
            )
          }
        />

        {/* Logistics */}
        <Route path="/logistics" element={<LogisticsPage />} />

        {/* Payments */}
        <Route
          path="/payments"
          element={
            userRole === "farmer" ? (
              <FarmerPaymentsPage user={currentUser} />
            ) : userRole === "fpo" ? (
              <FPOPaymentsPage user={currentUser} />
            ) : userRole === "buyer" ? (
              <PaymentsPage user={currentUser} />
            ) : userRole === "admin" ? (
              <AdminPaymentsPage user={currentUser} />
            ) : (
              <FarmerPaymentsPage user={currentUser} />
            )
          }
        />

        {/* Disputes */}
        <Route path="/disputes" element={<DisputePage />} />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <SettingsPage
              onLogout={handleLogout}
              user={currentUser}
            />
          }
        />

        {/* Unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;