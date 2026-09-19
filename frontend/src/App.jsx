import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";

import FarmerPaymentsPage from "./pages/FarmerPaymentsPage";
import FPOPaymentsPage from "./pages/FPOPaymentsPage";
import AdminPaymentsPage from "./pages/AdminPaymentsPage";

import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";

import LanguagePopup from "./components/landing/LanguagePopup";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerificationPage from "./pages/VerificationPage";

import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import FPODashboardPage from "./pages/FPODashboardPage";
import BuyerDashboardPage from "./pages/BuyerDashboardPage";

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

import { getCurrentUser, logoutUser } from "./api/auth.api";

function App() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLandingPage, setIsLandingPage] = useState(
    location.pathname === "/"
  );

  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("bf_logged_in") === "true"
  );

  const [userRole, setUserRole] = useState(
    sessionStorage.getItem("bf_user_role") || "farmer"
  );

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem("bf_registered_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [authLoading, setAuthLoading] = useState(true);

  const [showLanguagePopup, setShowLanguagePopup] = useState(true);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("bf_language");

    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    const restoreSession = async () => {
      const token = sessionStorage.getItem("bf_auth_token");

      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();

        if (!response?.success || !response?.user) {
          throw new Error("Invalid session.");
        }

        const backendUser = response.user;

        const user = {
          id: backendUser.id,
          name: backendUser.name || "",
          companyName: backendUser.organizationName || "",
          email: backendUser.email || "",
          role: backendUser.role,
          location: backendUser.village || "",
          phone: backendUser.mobile || "",
          district: backendUser.district || "",
          state: backendUser.state || "",
        };

        setCurrentUser(user);
        setUserRole(backendUser.role);
        setIsLoggedIn(true);

        sessionStorage.setItem("bf_logged_in", "true");
        sessionStorage.setItem("bf_user_role", backendUser.role);
        sessionStorage.setItem(
          "bf_registered_user",
          JSON.stringify(user)
        );
      } catch {
        sessionStorage.removeItem("bf_auth_token");
        sessionStorage.removeItem("bf_logged_in");
        sessionStorage.removeItem("bf_user_role");
        sessionStorage.removeItem("bf_registered_user");

        setIsLoggedIn(false);
        setCurrentUser(null);
        setUserRole("farmer");
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    const lang = i18n.language || "en";
    const dir = lang === "ur" ? "rtl" : "ltr";

    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [i18n.language]);

  useEffect(() => {
    setIsLandingPage(location.pathname === "/");
  }, [location.pathname]);

  const handleGetStarted = () => {
    navigate("/register");
  };

  const handleLandingLogin = () => {
    navigate("/login");
  };

  const handleLogin = (role = "farmer", user = null) => {
    sessionStorage.setItem("bf_logged_in", "true");
    sessionStorage.setItem("bf_user_role", role);

    if (user) {
      sessionStorage.setItem(
        "bf_registered_user",
        JSON.stringify(user)
      );
    }

    setUserRole(role);
    setCurrentUser(user);
    setIsLoggedIn(true);

    navigate("/");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Local authentication state must be cleared even if the server request fails.
    } finally {
      sessionStorage.removeItem("bf_logged_in");
      sessionStorage.removeItem("bf_user_role");
      sessionStorage.removeItem("bf_token");
      sessionStorage.removeItem("bf_auth_token");
      sessionStorage.removeItem("bf_registered_user");

      setIsLoggedIn(false);
      setUserRole("farmer");
      setCurrentUser(null);

      navigate("/");
    }
  };

  const handleLanguageComplete = () => {
    setShowLanguagePopup(false);
  };

  if (authLoading) {
    return null;
  }

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

  if (location.pathname === "/register" && !isLoggedIn) {
    return <RegisterPage onLogin={handleLogin} />;
  }

  if (location.pathname === "/login" && !isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (location.pathname === "/forgot-password" && !isLoggedIn) {
    return <ForgotPasswordPage />;
  }

  if (location.pathname === "/reset-password" && !isLoggedIn) {
    return <ResetPasswordPage />;
  }

  if (location.pathname === "/verification" && isLoggedIn) {
    return <VerificationPage user={currentUser} />;
  }

  if (location.pathname === "/prices" && !isLoggedIn) {
    return <MandiPricesPage />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

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

  return (
    <Layout onLogout={handleLogout} user={currentUser}>
      <Routes>
        <Route path="/" element={getDashboard()} />

        <Route
          path="/prices"
          element={<MandiPricesPage />}
        />

        <Route
          path="/prices/:commodityId"
          element={<PriceDetailPage />}
        />

        <Route
          path="/buyers"
          element={<BuyerMarketPage user={currentUser} />}
        />

        <Route
          path="/lots/create"
          element={<CreateLotPage />}
        />

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

        <Route
          path="/logistics"
          element={<LogisticsPage />}
        />

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

        <Route
          path="/disputes"
          element={<DisputePage />}
        />

        <Route
          path="/settings"
          element={
            <SettingsPage
              onLogout={handleLogout}
              user={currentUser}
            />
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Layout>
  );
}

export default App;