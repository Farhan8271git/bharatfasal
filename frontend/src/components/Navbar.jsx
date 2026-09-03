import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sprout,
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
  Users,
  FileCheck,
} from "lucide-react";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const role = user?.role || "farmer";

  const isAdmin = role === "admin";
  const isBuyer = role === "buyer";
  const isFpo = role === "fpo";
  const isFarmer = role === "farmer";

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
          label: "Home",
          path: "/",
          icon: Home,
        },
        {
          label: "Prices",
          path: "/prices",
          icon: BarChart3,
        },
        {
          label: "Disputes",
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
          label: "Home",
          path: "/",
          icon: Home,
        },
        {
          label: "Prices",
          path: "/prices",
          icon: BarChart3,
        },
        {
          label: "Buyers",
          path: "/buyers",
          icon: Handshake,
        },
        {
          label: "Browse Lots",
          path: "/lots",
          icon: Package,
        },
        {
          label: "Logistics",
          path: "/logistics",
          icon: Truck,
        },
        {
          label: "Payments",
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
          label: "Home",
          path: "/",
          icon: Home,
        },
        {
          label: "Prices",
          path: "/prices",
          icon: BarChart3,
        },
        {
          label: "Buyers",
          path: "/buyers",
          icon: Handshake,
        },
        {
          label: "My Lots",
          path: "/lots",
          icon: Package,
        },
        {
          label: "Logistics",
          path: "/logistics",
          icon: Truck,
        },
        {
          label: "Payments",
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
        label: "Home",
        path: "/",
        icon: Home,
      },
      {
        label: "Prices",
        path: "/prices",
        icon: BarChart3,
      },
      {
        label: "Buyers",
        path: "/buyers",
        icon: Handshake,
      },
      {
        label: "My Lots",
        path: "/lots",
        icon: Package,
      },
      {
        label: "Logistics",
        path: "/logistics",
        icon: Truck,
      },
      {
        label: "Payments",
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
      farmer: "Farmer",
      fpo: "FPO",
      buyer: "Buyer",
      admin: "Administrator",
    }[role] || "User";

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
              <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white">
                <Sprout size={21} strokeWidth={2.2} />
              </div>

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

              {/* PROFILE */}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
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

                        <span>Profile & Settings</span>
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

                          <span>Verification Review</span>
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

                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* MOBILE MENU */}

              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
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

                <span>Profile & Settings</span>
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

                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
