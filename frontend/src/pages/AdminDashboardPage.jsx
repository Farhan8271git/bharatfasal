import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Users,
  UserCheck,
  Building2,
  IndianRupee,
  AlertTriangle,
  Package,
  ShoppingCart,
  FileCheck,
  Clock3,
  ChevronRight,
  BarChart3,
  Store,
  Activity,
  CheckCircle2,
  Search,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Eye,
  Check,
  XCircle,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboardPage({ user }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [selectedVerification, setSelectedVerification] = useState(null);

  // =========================================================
  // VERIFICATION STORAGE
  // =========================================================

  const readVerificationRequests = () => {
    const possibleKeys = [
      "bf_verification_requests",
      "bf_buyer_verifications",
      "bf_verification_submissions",
    ];

    const allRequests = [];

    possibleKeys.forEach((key) => {
      try {
        const raw = localStorage.getItem(key);

        if (!raw) return;

        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
          parsed.forEach((item) => {
            allRequests.push(item);
          });
        } else if (parsed && typeof parsed === "object") {
          allRequests.push(parsed);
        }
      } catch (error) {
        console.error(`Unable to read ${key}`, error);
      }
    });

    // Remove duplicate requests
    const unique = [];

    allRequests.forEach((item) => {
      const id =
        item.id ||
        item.requestId ||
        item.userId ||
        `${item.name}-${item.phone}`;

      const alreadyExists = unique.some(
        (existing) =>
          (existing.id ||
            existing.requestId ||
            existing.userId ||
            `${existing.name}-${existing.phone}`) === id,
      );

      if (!alreadyExists) {
        unique.push({
          ...item,
          id,
        });
      }
    });

    return unique;
  };

  const [verificationRequests, setVerificationRequests] = useState(() =>
    readVerificationRequests(),
  );

  // =========================================================
  // REFRESH VERIFICATION DATA
  // =========================================================

  const refreshVerifications = () => {
    setVerificationRequests(readVerificationRequests());
  };

  useEffect(() => {
    refreshVerifications();

    const handleStorage = () => {
      refreshVerifications();
    };

    window.addEventListener("storage", handleStorage);

    const interval = setInterval(() => {
      refreshVerifications();
    }, 2000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  // =========================================================
  // UPDATE VERIFICATION
  // =========================================================

  const updateVerificationStatus = (request, status) => {
    const requestId =
      request.id ||
      request.requestId ||
      request.userId ||
      `${request.name}-${request.phone}`;

    const updatedRequest = {
      ...request,
      status,
      verificationStatus: status,
      reviewedBy: user?.name || "Admin",
      reviewedAt: new Date().toISOString(),
    };

    const possibleKeys = [
      "bf_verification_requests",
      "bf_buyer_verifications",
      "bf_verification_submissions",
    ];

    possibleKeys.forEach((key) => {
      try {
        const raw = localStorage.getItem(key);

        if (!raw) return;

        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
          const updated = parsed.map((item) => {
            const itemId =
              item.id ||
              item.requestId ||
              item.userId ||
              `${item.name}-${item.phone}`;

            return itemId === requestId
              ? {
                  ...item,
                  status,
                  verificationStatus: status,
                  reviewedBy: user?.name || "Admin",
                  reviewedAt: new Date().toISOString(),
                }
              : item;
          });

          localStorage.setItem(key, JSON.stringify(updated));
        }
      } catch (error) {
        console.error(`Unable to update ${key}`, error);
      }
    });

    // Store decision separately.
    localStorage.setItem(
      `bf_verification_status_${requestId}`,
      JSON.stringify(updatedRequest),
    );

    // Broadcast event for same-tab listeners.
    window.dispatchEvent(
      new CustomEvent("bf-verification-updated", {
        detail: updatedRequest,
      }),
    );

    setVerificationRequests((prev) =>
      prev.map((item) => {
        const itemId =
          item.id ||
          item.requestId ||
          item.userId ||
          `${item.name}-${item.phone}`;

        return itemId === requestId ? updatedRequest : item;
      }),
    );

    setSelectedVerification(null);
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const getStatus = (item) => {
    return (
      item.status ||
      item.verificationStatus ||
      item.reviewStatus ||
      "pending"
    ).toLowerCase();
  };

  const pendingVerifications = verificationRequests.filter(
    (item) => getStatus(item) === "pending",
  );

  const verifiedBuyers = verificationRequests.filter(
    (item) => getStatus(item) === "approved",
  );

  // =========================================================
  // SUMMARY STATS
  // =========================================================

  const stats = [
    {
      label: "Total Farmers",
      value: "12,450",
      change: "+4.8%",
      positive: true,
      icon: Users,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Verified Buyers",
      value: String(8 + verifiedBuyers.length),
      change:
        verifiedBuyers.length > 0
          ? `+${verifiedBuyers.length} reviewed`
          : "+2 this month",
      positive: true,
      icon: UserCheck,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Total Transactions",
      value: "₹6,14,500",
      change: "+8.2%",
      positive: true,
      icon: IndianRupee,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Pending Disputes",
      value: "1",
      change: "Needs attention",
      positive: false,
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  // =========================================================
  // PLATFORM METRICS
  // =========================================================

  const metrics = [
    {
      title: "Active Listings",
      value: "3,245",
      subtitle: "+12% this week",
      icon: Package,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Trades Completed",
      value: "1,892",
      subtitle: "+8% this week",
      icon: CheckCircle2,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "FPOs Registered",
      value: "156",
      subtitle: "+5 this month",
      icon: Building2,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Avg. Price Realization",
      value: "+8.5%",
      subtitle: "Above MSP / reference price",
      icon: BarChart3,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  // =========================================================
  // RECENT ACTIVITY
  // =========================================================

  const recentActivity = [
    {
      id: 1,
      title: 'New buyer "Tata Agri Corp" verified',
      description: "Buyer verification completed",
      time: "2 hours ago",
      icon: UserCheck,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      id: 2,
      title: "Lot LOT-1245 matched with buyer",
      description: "Rice · 250 Quintals",
      time: "3 hours ago",
      icon: Package,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: 3,
      title: "Dispute DSP-089 escalated to admin",
      description: "Quantity verification issue",
      time: "5 hours ago",
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      id: 4,
      title: "Payment of ₹4,50,000 settled",
      description: "Protected procurement transaction",
      time: "6 hours ago",
      icon: IndianRupee,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      id: 5,
      title: "45 new farmers registered today",
      description: "Registration activity",
      time: "8 hours ago",
      icon: Users,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  // =========================================================
  // STATIC USERS
  // =========================================================

  const users = [
    {
      name: "Rajesh Kumar",
      role: "Farmer",
      location: "Gorakhpur, UP",
      status: "Verified",
    },
    {
      name: "Shiv Shakti FPO",
      role: "FPO",
      location: "Lucknow, UP",
      status: "Pending",
    },
    {
      name: "Tata Agri Corp",
      role: "Buyer",
      location: "Delhi NCR",
      status: "Verified",
    },
  ];

  // =========================================================
  // TRANSACTIONS
  // =========================================================

  const transactions = [
    {
      id: "TXN-2401",
      buyer: "Tata Agri Corp",
      commodity: "Rice",
      quantity: "250 Q",
      amount: "₹4,50,000",
      status: "Settled",
    },
    {
      id: "TXN-2400",
      buyer: "Agro Foods India",
      commodity: "Wheat",
      quantity: "180 Q",
      amount: "₹3,96,000",
      status: "Protected",
    },
    {
      id: "TXN-2399",
      buyer: "Fresh Harvest Ltd.",
      commodity: "Maize",
      quantity: "120 Q",
      amount: "₹2,64,000",
      status: "Verification",
    },
  ];

  // =========================================================
  // DISPUTES
  // =========================================================

  const disputes = [
    {
      id: "DSP-089",
      subject: "Quantity mismatch",
      parties: "Farmer vs Buyer",
      amount: "₹85,000",
      status: "Escalated",
    },
    {
      id: "DSP-087",
      subject: "Quality grade disagreement",
      parties: "FPO vs Buyer",
      amount: "₹1,20,000",
      status: "Under Review",
    },
  ];

  // =========================================================
  // MANDIS
  // =========================================================

  const mandis = [
    {
      market: "Gorakhpur Mandi",
      state: "Uttar Pradesh",
      commodity: "Wheat",
      price: "₹2,420/Q",
      change: "+3.2%",
    },
    {
      market: "Lucknow Mandi",
      state: "Uttar Pradesh",
      commodity: "Rice",
      price: "₹3,180/Q",
      change: "+1.8%",
    },
    {
      market: "Azadpur Mandi",
      state: "Delhi",
      commodity: "Tomato",
      price: "₹2,950/Q",
      change: "-2.1%",
    },
  ];

  // =========================================================
  // TABS
  // =========================================================

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
    },
    {
      id: "verifications",
      label: "Verifications",
      icon: FileCheck,
      badge: pendingVerifications.length,
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: IndianRupee,
    },
    {
      id: "disputes",
      label: "Disputes",
      icon: AlertTriangle,
    },
    {
      id: "mandis",
      label: "Mandis",
      icon: Store,
    },
  ];

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredUsers = useMemo(() => {
    const text = search.toLowerCase().trim();

    if (!text) return users;

    return users.filter(
      (item) =>
        item.name.toLowerCase().includes(text) ||
        item.role.toLowerCase().includes(text) ||
        item.location.toLowerCase().includes(text),
    );
  }, [search]);

  const filteredTransactions = useMemo(() => {
    const text = search.toLowerCase().trim();

    if (!text) return transactions;

    return transactions.filter(
      (item) =>
        item.id.toLowerCase().includes(text) ||
        item.buyer.toLowerCase().includes(text) ||
        item.commodity.toLowerCase().includes(text),
    );
  }, [search]);

  const filteredDisputes = useMemo(() => {
    const text = search.toLowerCase().trim();

    if (!text) return disputes;

    return disputes.filter(
      (item) =>
        item.id.toLowerCase().includes(text) ||
        item.subject.toLowerCase().includes(text) ||
        item.parties.toLowerCase().includes(text),
    );
  }, [search]);

  const filteredVerifications = useMemo(() => {
    const text = search.toLowerCase().trim();

    if (!text) return verificationRequests;

    return verificationRequests.filter((item) => {
      return (
        String(item.name || "")
          .toLowerCase()
          .includes(text) ||
        String(item.businessName || "")
          .toLowerCase()
          .includes(text) ||
        String(item.companyName || "")
          .toLowerCase()
          .includes(text) ||
        String(item.phone || "")
          .toLowerCase()
          .includes(text) ||
        String(item.gstin || "")
          .toLowerCase()
          .includes(text) ||
        String(item.pan || "")
          .toLowerCase()
          .includes(text)
      );
    });
  }, [verificationRequests, search]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* =====================================================
          ADMIN HEADER
      ===================================================== */}

      <section className="w-full bg-white border-b border-gray-200">
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center shrink-0">
                <ShieldCheck size={25} />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
                  Admin Panel
                </span>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                  Bharat Fasal Administration
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Platform management, verification and transaction oversight
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-100">
                <span className="w-2 h-2 rounded-full bg-green-500" />

                <span className="text-xs font-semibold text-green-700">
                  Platform Operational
                </span>
              </div>

              <div className="px-3 py-2 rounded-lg border border-gray-200 bg-white">
                <p className="text-[11px] text-gray-400">Administrator</p>

                <p className="text-sm font-semibold text-gray-800">
                  {user?.name || "Admin"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ===================================================
            SUMMARY STATS
        =================================================== */}

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>

                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {stat.value}
                      </p>
                    </div>

                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconBg} ${stat.iconColor}`}
                    >
                      <Icon size={21} />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-3">
                    {stat.positive ? (
                      <ArrowUpRight size={14} className="text-green-600" />
                    ) : (
                      <Clock3 size={14} className="text-red-600" />
                    )}

                    <span
                      className={`text-xs font-semibold ${
                        stat.positive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================================================
            TABS
        =================================================== */}

        <section>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearch("");
                    }}
                    className={`
                      inline-flex items-center gap-2
                      px-4 py-2.5
                      rounded-lg
                      text-sm font-semibold
                      whitespace-nowrap
                      border
                      transition
                      ${
                        active
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                  >
                    <Icon size={16} />

                    {tab.label}

                    {tab.badge > 0 && (
                      <span
                        className={`
                          min-w-5 h-5 px-1.5
                          rounded-full
                          text-[10px]
                          flex items-center justify-center
                          ${
                            active
                              ? "bg-white text-gray-900"
                              : "bg-red-50 text-red-600"
                          }
                        `}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {activeTab !== "overview" && (
              <div className="relative w-full lg:w-72">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${activeTab}...`}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </div>
            )}
          </div>
        </section>

        {/* ===================================================
            OVERVIEW
        =================================================== */}

        {activeTab === "overview" && (
          <>
            {/* PLATFORM METRICS */}

            <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">
                  <BarChart3 size={18} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">Platform Metrics</h2>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Current marketplace performance
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {metrics.map((metric) => {
                  const Icon = metric.icon;

                  return (
                    <div
                      key={metric.title}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            {metric.title}
                          </p>

                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {metric.value}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {metric.subtitle}
                          </p>
                        </div>

                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${metric.iconBg} ${metric.iconColor}`}
                        >
                          <Icon size={19} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ACTIVITY + VERIFICATION */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* RECENT ACTIVITY */}

              <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Activity size={18} />
                    </div>

                    <div>
                      <h2 className="font-bold text-gray-900">
                        Recent Activity
                      </h2>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Latest platform events
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-gray-400">
                    Live
                  </span>
                </div>

                <div>
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;

                    return (
                      <div
                        key={activity.id}
                        className={`flex items-start gap-3 px-5 py-4 ${
                          index !== recentActivity.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${activity.iconBg} ${activity.iconColor}`}
                        >
                          <Icon size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {activity.title}
                          </p>

                          <p className="text-xs text-gray-500 mt-0.5">
                            {activity.description}
                          </p>

                          <p className="text-[11px] text-gray-400 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* PENDING VERIFICATION */}

              <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <FileCheck size={18} />
                    </div>

                    <div>
                      <h2 className="font-bold text-gray-900">
                        Pending Verification
                      </h2>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Accounts awaiting admin review
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold">
                    {pendingVerifications.length} Pending
                  </span>
                </div>

                {pendingVerifications.length === 0 ? (
                  <div className="px-5 py-12 text-center">
                    <CheckCircle2
                      size={30}
                      className="mx-auto text-green-500"
                    />

                    <p className="mt-3 text-sm font-semibold text-gray-800">
                      No pending verifications
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      New buyer verification requests will appear here.
                    </p>
                  </div>
                ) : (
                  <div>
                    {pendingVerifications.slice(0, 3).map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedVerification(item)}
                        className={`w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition ${
                          index !== Math.min(pendingVerifications.length, 3) - 1
                            ? "border-b border-gray-100"
                            : ""
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center shrink-0">
                          {item.type === "fpo" ? (
                            <Building2 size={18} />
                          ) : (
                            <ShoppingCart size={18} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {item.businessName ||
                              item.companyName ||
                              item.name ||
                              "Buyer"}
                          </p>

                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.type || "Buyer"}{" "}
                            {item.location ? `· ${item.location}` : ""}
                          </p>

                          <p className="text-[11px] text-gray-400 mt-1">
                            {item.gstin
                              ? `GSTIN: ${item.gstin}`
                              : item.pan
                                ? `PAN: ${item.pan}`
                                : "Documents submitted"}
                          </p>
                        </div>

                        <ChevronRight
                          size={17}
                          className="text-gray-300 shrink-0"
                        />
                      </button>
                    ))}

                    <div className="px-5 py-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setActiveTab("verifications")}
                        className="w-full py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Review All Verifications
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* QUICK ACTIONS */}

            <section>
              <div className="mb-3">
                <h2 className="text-lg font-bold text-gray-900">
                  Quick Actions
                </h2>

                <p className="text-sm text-gray-500 mt-0.5">
                  Frequently used administration tools
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("users")}
                  className="group bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-gray-300 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-green-50 group-hover:text-green-600 transition">
                      <Users size={19} />
                    </div>

                    <ArrowUpRight
                      size={16}
                      className="text-gray-300 group-hover:text-gray-500"
                    />
                  </div>

                  <p className="text-sm font-semibold text-gray-900 mt-4">
                    Manage Users
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Farmers, FPOs and buyers
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("verifications")}
                  className="group bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-gray-300 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="relative w-10 h-10 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-amber-50 group-hover:text-amber-600 transition">
                      <FileCheck size={19} />

                      {pendingVerifications.length > 0 && (
                        <span className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center">
                          {pendingVerifications.length}
                        </span>
                      )}
                    </div>

                    <ArrowUpRight
                      size={16}
                      className="text-gray-300 group-hover:text-gray-500"
                    />
                  </div>

                  <p className="text-sm font-semibold text-gray-900 mt-4">
                    Review Verifications
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Review buyer and business documents
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("transactions")}
                  className="group bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-gray-300 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                      <IndianRupee size={19} />
                    </div>

                    <ArrowUpRight
                      size={16}
                      className="text-gray-300 group-hover:text-gray-500"
                    />
                  </div>

                  <p className="text-sm font-semibold text-gray-900 mt-4">
                    Transactions
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Monitor marketplace payments
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("disputes")}
                  className="group bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-gray-300 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-red-50 group-hover:text-red-600 transition">
                      <AlertTriangle size={19} />
                    </div>

                    <ArrowUpRight
                      size={16}
                      className="text-gray-300 group-hover:text-gray-500"
                    />
                  </div>

                  <p className="text-sm font-semibold text-gray-900 mt-4">
                    Disputes
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Review unresolved disputes
                  </p>
                </button>
              </div>
            </section>
          </>
        )}

        {/* ===================================================
            USERS
        =================================================== */}

        {activeTab === "users" && (
          <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">User Management</h2>

              <p className="text-xs text-gray-500 mt-0.5">
                Manage farmers, FPOs and buyers
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredUsers.map((item) => (
                <div
                  key={item.name}
                  className="px-5 py-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                    {item.role === "Farmer" ? (
                      <Users size={18} />
                    ) : item.role === "FPO" ? (
                      <Building2 size={18} />
                    ) : (
                      <ShoppingCart size={18} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.role} · {item.location}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.status === "Verified"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===================================================
            VERIFICATIONS
        =================================================== */}

        {activeTab === "verifications" && (
          <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="font-bold text-gray-900">
                  Buyer Verification Requests
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Review submitted business and identity information before
                  approving a buyer.
                </p>
              </div>

              <button
                type="button"
                onClick={refreshVerifications}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw size={15} />
                Refresh
              </button>
            </div>

            {filteredVerifications.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gray-50 flex items-center justify-center">
                  <FileCheck size={27} className="text-gray-400" />
                </div>

                <h3 className="mt-4 text-base font-bold text-gray-800">
                  No verification requests
                </h3>

                <p className="max-w-md mx-auto mt-1 text-sm text-gray-500">
                  When a buyer submits their verification form, the request will
                  appear here for admin review.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredVerifications.map((item) => {
                  const status = getStatus(item);

                  const businessName =
                    item.businessName ||
                    item.companyName ||
                    item.name ||
                    "Buyer";

                  return (
                    <div
                      key={item.id}
                      className="px-5 py-5 flex flex-col lg:flex-row lg:items-center gap-4"
                    >
                      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <ShoppingCart size={20} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-gray-900">
                            {businessName}
                          </h3>

                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-semibold">
                            Buyer
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              status === "approved"
                                ? "bg-green-50 text-green-700"
                                : status === "rejected"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {status === "approved"
                              ? "Approved"
                              : status === "rejected"
                                ? "Rejected"
                                : "Pending"}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-xs text-gray-500">
                          {item.name && <span>Contact: {item.name}</span>}

                          {item.phone && <span>+91 {item.phone}</span>}

                          {item.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={11} />
                              {item.location}
                            </span>
                          )}

                          {item.gstin && <span>GSTIN: {item.gstin}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedVerification(item)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          <Eye size={15} />
                          Review
                        </button>

                        {status === "pending" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateVerificationStatus(item, "approved")
                            }
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                          >
                            <Check size={15} />
                            Approve
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ===================================================
            TRANSACTIONS
        =================================================== */}

        {activeTab === "transactions" && (
          <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">
                Transaction Monitoring
              </h2>

              <p className="text-xs text-gray-500 mt-0.5">
                Monitor protected payments and completed settlements
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                      Transaction
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                      Buyer
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                      Commodity
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                      Quantity
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                      Amount
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredTransactions.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                        {item.id}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {item.buyer}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {item.commodity}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {item.quantity}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                        {item.amount}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            item.status === "Settled"
                              ? "bg-green-50 text-green-700"
                              : item.status === "Protected"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ===================================================
            DISPUTES
        =================================================== */}

        {activeTab === "disputes" && (
          <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Dispute Management</h2>

              <p className="text-xs text-gray-500 mt-0.5">
                Review disputes requiring administrator attention
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredDisputes.map((item) => (
                <div
                  key={item.id}
                  className="px-5 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <AlertTriangle size={19} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">
                        {item.id}
                      </p>

                      <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-semibold">
                        {item.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mt-1">{item.subject}</p>

                    <p className="text-xs text-gray-500 mt-1">
                      {item.parties} · Amount involved {item.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===================================================
            MANDIS
        =================================================== */}

        {activeTab === "mandis" && (
          <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Mandi Monitoring</h2>

              <p className="text-xs text-gray-500 mt-0.5">
                Market data currently visible on the platform
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {mandis.map((mandi) => {
                const positive = mandi.change.startsWith("+");

                return (
                  <div
                    key={`${mandi.market}-${mandi.commodity}`}
                    className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                      <Store size={18} />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {mandi.market}
                      </p>

                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <MapPin size={11} />
                        {mandi.state}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {mandi.commodity}
                      </p>

                      <p className="text-xs text-gray-500 mt-0.5">
                        {mandi.price}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        positive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {positive ? (
                        <ArrowUpRight size={14} />
                      ) : (
                        <ArrowDownRight size={14} />
                      )}

                      {mandi.change}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* =====================================================
          VERIFICATION REVIEW MODAL
      ===================================================== */}

      {selectedVerification && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedVerification(null);
            }
          }}
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            {/* MODAL HEADER */}

            <div className="px-5 sm:px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FileCheck size={19} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Verification Review
                  </h2>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Review buyer information before making a decision.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedVerification(null)}
                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X size={18} />
              </button>
            </div>

            {/* MODAL CONTENT */}

            <div className="p-5 sm:p-6 space-y-5">
              {/* BUSINESS */}

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <p className="text-sm font-bold text-gray-900">
                    Business Information
                  </p>
                </div>

                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Detail
                    label="Business / Company"
                    value={
                      selectedVerification.businessName ||
                      selectedVerification.companyName ||
                      selectedVerification.name
                    }
                  />

                  <Detail
                    label="Buyer Type"
                    value={
                      selectedVerification.type ||
                      selectedVerification.buyerType ||
                      "Buyer"
                    }
                  />

                  <Detail
                    label="Contact Person"
                    value={selectedVerification.name || "Not provided"}
                  />

                  <Detail
                    label="Phone"
                    value={
                      selectedVerification.phone
                        ? `+91 ${selectedVerification.phone}`
                        : "Not provided"
                    }
                  />

                  <Detail
                    label="Location"
                    value={selectedVerification.location || "Not provided"}
                  />

                  <Detail
                    label="Email"
                    value={selectedVerification.email || "Not provided"}
                  />
                </div>
              </div>

              {/* DOCUMENTS */}

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <p className="text-sm font-bold text-gray-900">
                    Verification Documents
                  </p>
                </div>

                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DocumentDetail
                    label="PAN"
                    value={
                      selectedVerification.pan ||
                      selectedVerification.panNumber ||
                      "Not submitted"
                    }
                  />

                  <DocumentDetail
                    label="GSTIN"
                    value={
                      selectedVerification.gstin ||
                      selectedVerification.gstNumber ||
                      "Not submitted"
                    }
                  />

                  <DocumentDetail
                    label="Bank Account"
                    value={
                      selectedVerification.bankAccount ||
                      selectedVerification.accountNumber
                        ? "Submitted"
                        : "Not submitted"
                    }
                  />

                  <DocumentDetail
                    label="Business Document"
                    value={
                      selectedVerification.businessDocument ||
                      selectedVerification.businessProof
                        ? "Submitted"
                        : "Not submitted"
                    }
                  />
                </div>
              </div>

              {/* DECISION */}

              {getStatus(selectedVerification) === "pending" ? (
                <div className="border-t border-gray-100 pt-5">
                  <p className="text-sm font-semibold text-gray-900">
                    Admin Decision
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Approve only after checking the submitted information and
                    documents.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() =>
                        updateVerificationStatus(
                          selectedVerification,
                          "rejected",
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 py-3 rounded-lg border border-red-200 text-red-600 bg-white hover:bg-red-50 text-sm font-semibold"
                    >
                      <XCircle size={17} />
                      Reject Verification
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateVerificationStatus(
                          selectedVerification,
                          "approved",
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold"
                    >
                      <Check size={17} />
                      Approve Buyer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 p-4">
                  {getStatus(selectedVerification) === "approved" ? (
                    <CheckCircle2 size={20} className="text-green-600" />
                  ) : (
                    <XCircle size={20} className="text-red-600" />
                  )}

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Verification{" "}
                      {getStatus(selectedVerification) === "approved"
                        ? "Approved"
                        : "Rejected"}
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Reviewed by {selectedVerification.reviewedBy || "Admin"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================
// DETAIL COMPONENT
// =========================================================

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-[11px] text-gray-400 uppercase tracking-wide">
        {label}
      </p>

      <p className="text-sm font-semibold text-gray-800 mt-1 break-words">
        {value || "Not provided"}
      </p>
    </div>
  );
}

// =========================================================
// DOCUMENT DETAIL
// =========================================================

function DocumentDetail({ label, value }) {
  const submitted = value && value !== "Not submitted";

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-200">
      <div>
        <p className="text-xs text-gray-400">{label}</p>

        <p className="text-sm font-semibold text-gray-800 mt-0.5 break-all">
          {value}
        </p>
      </div>

      <span
        className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-semibold ${
          submitted ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
        }`}
      >
        {submitted ? "Submitted" : "Missing"}
      </span>
    </div>
  );
}
