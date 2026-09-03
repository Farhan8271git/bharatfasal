import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FarmerPaymentsPage from "./pages/FarmerPaymentsPage";
import FPOPaymentsPage from "./pages/FPOPaymentsPage";
// import BuyerPaymentsPage from "./pages/BuyerPaymentsPage";
import AdminPaymentsPage from "./pages/AdminPaymentsPage";
import Layout from "./components/Layout";
import CreateLotPage from "./pages/CreateLotPage";
import LanguageSelectPage from "./pages/LanguageSelectPage";
import LoginPage from "./pages/LoginPage";

import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import FPODashboardPage from "./pages/FPODashboardPage";
import BuyerDashboardPage from "./pages/BuyerDashboardPage";

import MandiPricesPage from "./pages/MandiPricesPage";
import PriceDetailPage from "./pages/PriceDetailPage";
import BuyerMarketPage from "./pages/BuyerMarketPage";
import MyLotsPage from "./pages/MyLotsPage";
import BrowseLotsPage from "./pages/BrowseLotsPage";
import LogisticsPage from "./pages/LogisticsPage";
import PaymentsPage from "./pages/PaymentsPage";
import DisputePage from "./pages/DisputePage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const { i18n } = useTranslation();

  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("farmer");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const lang = i18n.language || "en";
    const dir = lang === "ur" ? "rtl" : "ltr";

    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [i18n.language]);

  const handleLanguageSelected = () => {
    setIsFirstVisit(false);
  };

  const handleLogin = (role = "farmer", user = null) => {
    localStorage.setItem("bf_logged_in", "true");
    localStorage.setItem("bf_user_role", role);

    setUserRole(role);
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("bf_logged_in");
    localStorage.removeItem("bf_user_role");

    setIsLoggedIn(false);
    setUserRole("farmer");
    setCurrentUser(null);

    setIsFirstVisit(true);
  };

  if (isFirstVisit) {
    return <LanguageSelectPage onComplete={handleLanguageSelected} />;
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
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

        <Route path="/prices" element={<MandiPricesPage />} />

        <Route path="/prices/:commodityId" element={<PriceDetailPage />} />

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

        <Route path="/logistics" element={<LogisticsPage />} />

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

        <Route path="/disputes" element={<DisputePage />} />

        <Route
          path="/settings"
          element={<SettingsPage onLogout={handleLogout} user={currentUser} />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;




