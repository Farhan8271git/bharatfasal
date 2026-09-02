import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  Package,
  Handshake,
  WalletCards,
  Truck,
  BarChart3,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Search,
  X,
  IndianRupee,
  MapPin,
  CalendarDays,
  Layers3,
  UserRound,
  FileCheck2,
  RefreshCw,
  ChevronRight,
  CircleHelp,
} from "lucide-react";

import { mandiPrices } from "../data/mockPrices";


// ============================================================
// DEMO FPO DATA
// ============================================================

const defaultMembers = [
  {
    id: "FPO-M001",
    name: "Farhan Nur",
    village: "Gopalganj",
    lots: 3,
    quantity: 120,
    payment: 185000,
    status: "Active",
  },
  {
    id: "FPO-M002",
    name: "Farhan Siddiqui",
    village: "Maharajganj",
    lots: 2,
    quantity: 80,
    payment: 124000,
    status: "Active",
  },
  {
    id: "FPO-M003",
    name: "Abuzer",
    village: "Azamgarh",
    lots: 4,
    quantity: 200,
    payment: 310000,
    status: "Active",
  },
  {
    id: "FPO-M004",
    name: "Rajesh Kumar",
    village: "Gorakhpur",
    lots: 2,
    quantity: 100,
    payment: 156000,
    status: "Active",
  },
  {
    id: "FPO-M005",
    name: "Shivam Yadav",
    village: "Deoria",
    lots: 1,
    quantity: 55,
    payment: 84000,
    status: "Active",
  },
];


const defaultLots = [
  {
    id: "BF-FPO-LOT-1042",
    crop: "Wheat",
    quantity: 500,
    members: 12,
    grade: "A",
    price: 2480,
    status: "Listed",
    buyer: "Agro Trade India",
    location: "Indore, Madhya Pradesh",
    availableDate: "2026-09-05",
    transport: "Seller will arrange transportation",
  },
  {
    id: "BF-FPO-LOT-1038",
    crop: "Soybean",
    quantity: 200,
    members: 8,
    grade: "Premium",
    price: 5150,
    status: "Offer Received",
    buyer: "Fresh Crop Foods",
    location: "Indore, Madhya Pradesh",
    availableDate: "2026-09-07",
    transport: "Buyer will arrange transportation",
  },
  {
    id: "BF-FPO-LOT-1031",
    crop: "Onion",
    quantity: 300,
    members: 15,
    grade: "A",
    price: 1950,
    status: "Sold",
    buyer: "National Food Traders",
    location: "Nashik, Maharashtra",
    availableDate: "2026-08-30",
    transport: "Seller will arrange transportation",
  },
  {
    id: "BF-FPO-LOT-1024",
    crop: "Rice",
    quantity: 350,
    members: 10,
    grade: "A",
    price: 2850,
    status: "Matched",
    buyer: "Tata Agri Corp",
    location: "Delhi NCR",
    availableDate: "2026-09-03",
    transport: "Buyer will arrange transportation",
  },
];


const defaultBuyerMatches = [
  {
    id: "MATCH-201",
    buyer: "Tata Agri Corp",
    crop: "Rice",
    quantity: 300,
    offeredPrice: 2850,
    location: "Delhi NCR",
    deadline: "2026-09-08",
    verified: true,
  },
  {
    id: "MATCH-202",
    buyer: "Agro Trade India",
    crop: "Wheat",
    quantity: 450,
    offeredPrice: 2480,
    location: "Indore",
    deadline: "2026-09-06",
    verified: true,
  },
  {
    id: "MATCH-203",
    buyer: "Fresh Crop Foods",
    crop: "Soybean",
    quantity: 200,
    offeredPrice: 5150,
    location: "Bhopal",
    deadline: "2026-09-09",
    verified: true,
  },
];


const defaultActivities = [
  {
    id: 1,
    type: "buyer",
    title: 'Buyer "Tata Agri Corp" matched with Rice lot',
    subtitle: "BF-FPO-LOT-1024 · 350 Quintals",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "lot",
    title: "Wheat aggregation completed",
    subtitle: "500 Quintals · 12 members",
    time: "4 hours ago",
  },
  {
    id: 3,
    type: "payment",
    title: "Member payout batch prepared",
    subtitle: "₹4,89,000 ready for distribution",
    time: "6 hours ago",
  },
  {
    id: 4,
    type: "transport",
    title: "Rice shipment scheduled",
    subtitle: "Destination: Delhi NCR",
    time: "Yesterday",
  },
];


const defaultPendingActions = [
  {
    id: "PA-01",
    title: "Review buyer offer",
    subtitle: "Fresh Crop Foods · Soybean",
    action: "Review",
    type: "buyer",
  },
  {
    id: "PA-02",
    title: "Distribute member payment",
    subtitle: "12 members · ₹4,89,000",
    action: "Distribute",
    type: "payment",
  },
  {
    id: "PA-03",
    title: "Confirm transportation",
    subtitle: "Rice · Delhi NCR",
    action: "Confirm",
    type: "transport",
  },
];


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function FPODashboardPage({ user }) {
  const navigate = useNavigate();

  const [members, setMembers] = useState(defaultMembers);
  const [lots, setLots] = useState(defaultLots);
  const [buyerMatches] = useState(defaultBuyerMatches);

  const [activeModal, setActiveModal] = useState(null);
  const [selectedLot, setSelectedLot] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const [toast, setToast] = useState("");

  const [aggregationForm, setAggregationForm] = useState({
    crop: "Wheat",
    quantity: "",
    grade: "A",
    price: "",
    pickup: "",
    availableDate: "",
    transport: "seller",
  });

  const [paymentBatch, setPaymentBatch] = useState({
    memberIds: [],
  });

  const [searchMember, setSearchMember] = useState("");

  // ==========================================================
  // USER / FPO PROFILE
  // ==========================================================

  const fpoName =
    user?.companyName ||
    user?.businessName ||
    user?.name ||
    "Kisan Shakti FPO";

  const fpoLocation =
    user?.location ||
    "Indore, Madhya Pradesh";

  const memberCount = 156;

  // ==========================================================
  // TOP STATS
  // ==========================================================

  const totalAggregatedQuantity = lots.reduce(
    (sum, lot) => sum + Number(lot.quantity || 0),
    0,
  );

  const activeLots = lots.filter(
    (lot) =>
      lot.status !== "Sold",
  ).length;

  const pendingPayment = 246500;

  const avgPriceRealization = 12;

  // ==========================================================
  // MARKET PRICES
  // ==========================================================

  const topPrices = useMemo(() => {
    if (!Array.isArray(mandiPrices)) {
      return [
        {
          commodity: "Wheat",
          state: "Madhya Pradesh",
          modal_price: 2480,
          change: 4.2,
        },
        {
          commodity: "Rice",
          state: "Uttar Pradesh",
          modal_price: 2850,
          change: 3.8,
        },
        {
          commodity: "Soybean",
          state: "Madhya Pradesh",
          modal_price: 5150,
          change: 5.1,
        },
        {
          commodity: "Onion",
          state: "Maharashtra",
          modal_price: 1950,
          change: 2.4,
        },
      ];
    }

    return [...mandiPrices]
      .filter(
        (item) =>
          Number(
            item.modal_price ||
              item.modalPrice ||
              0,
          ) > 0,
      )
      .sort(
        (a, b) =>
          Number(
            b.change || 0,
          ) -
          Number(
            a.change || 0,
          ),
      )
      .slice(0, 4);
  }, []);

  // ==========================================================
  // MEMBER SEARCH
  // ==========================================================

  const filteredMembers = useMemo(() => {
    const query =
      searchMember
        .trim()
        .toLowerCase();

    if (!query) return members;

    return members.filter(
      (member) =>
        member.name
          .toLowerCase()
          .includes(query) ||
        member.village
          .toLowerCase()
          .includes(query),
    );
  }, [members, searchMember]);

  // ==========================================================
  // TOAST
  // ==========================================================

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(
      () => setToast(""),
      2800,
    );

    return () =>
      clearTimeout(timer);
  }, [toast]);

  // ==========================================================
  // MODAL
  // ==========================================================

  const closeModal = () => {
    setActiveModal(null);
    setSelectedLot(null);
    setSelectedMember(null);
  };

  // ==========================================================
  // QUICK ACTIONS
  // ==========================================================

  const handleAggregateLots = () => {
    setActiveModal("aggregate");
  };

  const handleFindBuyer = () => {
    navigate("/buyers");
  };

  const handleDistributePayment = () => {
    setPaymentBatch({
      memberIds: [],
    });

    setActiveModal("payment");
  };

  const handleMembers = () => {
    setActiveModal("members");
  };

  // ==========================================================
  // CREATE AGGREGATED LOT
  // ==========================================================

  const submitAggregation = (e) => {
    e.preventDefault();

    const quantity = Number(
      aggregationForm.quantity,
    );

    const price = Number(
      aggregationForm.price,
    );

    if (
      !aggregationForm.crop ||
      !quantity ||
      quantity <= 0 ||
      !price ||
      price <= 0 ||
      !aggregationForm.pickup ||
      !aggregationForm.availableDate
    ) {
      setToast(
        "Please complete all required lot details.",
      );

      return;
    }

    const newLot = {
      id: `BF-FPO-LOT-${Date.now()
        .toString()
        .slice(-4)}`,
      crop: aggregationForm.crop,
      quantity,
      members: 1,
      grade: aggregationForm.grade,
      price,
      status: "Draft",
      buyer: "",
      location:
        aggregationForm.pickup,
      availableDate:
        aggregationForm.availableDate,
      transport:
        aggregationForm.transport ===
        "buyer"
          ? "Buyer will arrange transportation"
          : "Seller will arrange transportation",
    };

    const updatedLots = [
      newLot,
      ...lots,
    ];

    setLots(updatedLots);

    localStorage.setItem(
      "bf_fpo_lots",
      JSON.stringify(
        updatedLots,
      ),
    );

    setAggregationForm({
      crop: "Wheat",
      quantity: "",
      grade: "A",
      price: "",
      pickup: "",
      availableDate: "",
      transport: "seller",
    });

    setActiveModal(null);

    setToast(
      `Lot ${newLot.id} created successfully.`,
    );
  };

  // ==========================================================
  // PAYMENT SELECTION
  // ==========================================================

  const toggleMemberPayment = (
    memberId,
  ) => {
    setPaymentBatch((prev) => {
      const exists =
        prev.memberIds.includes(
          memberId,
        );

      return {
        ...prev,
        memberIds: exists
          ? prev.memberIds.filter(
              (id) =>
                id !== memberId,
            )
          : [
              ...prev.memberIds,
              memberId,
            ],
      };
    });
  };

  const selectedPaymentMembers =
    members.filter((member) =>
      paymentBatch.memberIds.includes(
        member.id,
      ),
    );

  const selectedPaymentAmount =
    selectedPaymentMembers.reduce(
      (sum, member) =>
        sum +
        Number(
          member.payment || 0,
        ),
      0,
    );

  const confirmPaymentDistribution =
    () => {
      if (
        paymentBatch.memberIds
          .length === 0
      ) {
        setToast(
          "Select at least one member.",
        );

        return;
      }

      setActiveModal(null);

      setToast(
        `Payment batch of ₹${selectedPaymentAmount.toLocaleString(
          "en-IN",
        )} marked for distribution.`,
      );
    };

  // ==========================================================
  // LOT STATUS
  // ==========================================================

  const getLotStatusClass = (
    status,
  ) => {
    switch (status) {
      case "Sold":
        return "bg-green-50 text-green-700";

      case "Matched":
        return "bg-blue-50 text-blue-700";

      case "Offer Received":
        return "bg-amber-50 text-amber-700";

      case "Draft":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-purple-50 text-purple-700";
    }
  };

  // ==========================================================
  // ACTIVITY ICON
  // ==========================================================

  const getActivityIcon = (
    type,
  ) => {
    if (type === "buyer")
      return Handshake;

    if (type === "payment")
      return WalletCards;

    if (type === "transport")
      return Truck;

    return Package;
  };

  // ==========================================================
  // RETURN
  // ==========================================================

  return (
    <div className="w-full bg-gray-50 min-h-screen">

      {/* ======================================================
          PAGE CONTAINER
      ====================================================== */}

      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ====================================================
            FPO HEADER
        ==================================================== */}

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="px-5 sm:px-7 py-6">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div className="flex items-start gap-4">

                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">

                  <Building2 size={27} />

                </div>

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase">
                      FPO / Producer Group
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-semibold">
                      <ShieldCheck size={12} />
                      Platform Account
                    </span>

                  </div>


                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                    {fpoName}
                  </h1>


                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">

                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} />
                      {fpoLocation}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Users size={14} />
                      {memberCount} Members
                    </span>

                  </div>

                </div>

              </div>


              <div className="flex flex-wrap gap-2">

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/settings",
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <Building2 size={16} />
                  FPO Profile
                </button>


                <button
                  type="button"
                  onClick={
                    handleAggregateLots
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                >
                  <Plus size={16} />
                  Aggregate Lots
                </button>

              </div>

            </div>

          </div>

        </section>


        {/* ====================================================
            STATS
        ==================================================== */}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          <StatCard
            label="Total Members"
            value={memberCount}
            helper="+6 this month"
            icon={Users}
            iconClass="text-blue-600"
            iconBg="bg-blue-50"
          />

          <StatCard
            label="Aggregated Lots"
            value={lots.length}
            helper={`${activeLots} active listings`}
            icon={Package}
            iconClass="text-green-600"
            iconBg="bg-green-50"
          />

          <StatCard
            label="Pending Payments"
            value={`₹${pendingPayment.toLocaleString(
              "en-IN",
            )}`}
            helper="Member settlements"
            icon={WalletCards}
            iconClass="text-amber-600"
            iconBg="bg-amber-50"
          />

          <StatCard
            label="Avg Price Realization"
            value={`+${avgPriceRealization}%`}
            helper="Above reference price"
            icon={BarChart3}
            iconClass="text-purple-600"
            iconBg="bg-purple-50"
          />

        </section>


        {/* ====================================================
            QUICK ACTIONS
        ==================================================== */}

        <section>

          <SectionHeading
            title="Quick Actions"
            subtitle="Frequently used FPO operations"
          />


          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

            <QuickAction
              icon={Layers3}
              title="Aggregate Lots"
              subtitle="Combine member produce"
              onClick={
                handleAggregateLots
              }
            />

            <QuickAction
              icon={Handshake}
              title="Find Buyer"
              subtitle="View buyer demand"
              onClick={
                handleFindBuyer
              }
            />

            <QuickAction
              icon={WalletCards}
              title="Distribute Pay"
              subtitle="Settle member payments"
              onClick={
                handleDistributePayment
              }
            />

            <QuickAction
              icon={Users}
              title="Members"
              subtitle="Manage FPO members"
              onClick={
                handleMembers
              }
            />

          </div>

        </section>


        {/* ====================================================
            OPERATIONAL OVERVIEW
        ==================================================== */}

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* --------------------------------------------------
              PROCUREMENT PIPELINE
          -------------------------------------------------- */}

          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <CardHeader
              icon={BarChart3}
              iconBg="bg-blue-50"
              iconClass="text-blue-600"
              title="Procurement Pipeline"
              subtitle="Track your lots from aggregation to settlement"
            />


            <div className="p-5">

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                <PipelineCard
                  label="Draft"
                  value={
                    lots.filter(
                      (lot) =>
                        lot.status ===
                        "Draft",
                    ).length
                  }
                  icon={FileCheck2}
                />

                <PipelineCard
                  label="Listed"
                  value={
                    lots.filter(
                      (lot) =>
                        lot.status ===
                        "Listed",
                    ).length
                  }
                  icon={Package}
                />

                <PipelineCard
                  label="Matched"
                  value={
                    lots.filter(
                      (lot) =>
                        lot.status ===
                          "Matched" ||
                        lot.status ===
                          "Offer Received",
                    ).length
                  }
                  icon={Handshake}
                />

                <PipelineCard
                  label="Sold"
                  value={
                    lots.filter(
                      (lot) =>
                        lot.status ===
                        "Sold",
                    ).length
                  }
                  icon={CheckCircle2}
                />

              </div>


              <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <div>

                  <p className="text-sm font-semibold text-gray-900">
                    {totalAggregatedQuantity.toLocaleString(
                      "en-IN",
                    )}{" "}
                    Quintals aggregated
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Across {lots.length} FPO lots
                  </p>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/lots",
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 hover:text-green-800"
                >
                  View All Lots
                  <ArrowRight
                    size={15}
                  />
                </button>

              </div>

            </div>

          </div>


          {/* --------------------------------------------------
              PENDING ACTIONS
          -------------------------------------------------- */}

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <CardHeader
              icon={Clock3}
              iconBg="bg-amber-50"
              iconClass="text-amber-600"
              title="Pending Actions"
              subtitle="Items that need your attention"
            />


            <div className="divide-y divide-gray-100">

              {defaultPendingActions.map(
                (item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {

                      if (
                        item.type ===
                        "buyer"
                      ) {
                        navigate(
                          "/buyers",
                        );
                        return;
                      }

                      if (
                        item.type ===
                        "payment"
                      ) {
                        setActiveModal(
                          "payment",
                        );
                        return;
                      }

                      navigate(
                        "/logistics",
                      );

                    }}
                    className="w-full text-left p-4 hover:bg-gray-50 transition"
                  >

                    <div className="flex items-start gap-3">

                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">

                        {item.type ===
                        "buyer" ? (
                          <Handshake
                            size={16}
                            className="text-blue-600"
                          />
                        ) : item.type ===
                          "payment" ? (
                          <WalletCards
                            size={16}
                            className="text-amber-600"
                          />
                        ) : (
                          <Truck
                            size={16}
                            className="text-purple-600"
                          />
                        )}

                      </div>


                      <div className="flex-1 min-w-0">

                        <p className="text-sm font-semibold text-gray-800">
                          {item.title}
                        </p>

                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.subtitle}
                        </p>

                      </div>


                      <ChevronRight
                        size={16}
                        className="text-gray-400 mt-1"
                      />

                    </div>

                  </button>
                ),
              )}

            </div>

          </div>

        </section>


        {/* ====================================================
            MEMBERS + AGGREGATED LOTS
        ==================================================== */}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* --------------------------------------------------
              MEMBERS
          -------------------------------------------------- */}

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <CardHeader
              icon={Users}
              iconBg="bg-purple-50"
              iconClass="text-purple-600"
              title="FPO Members"
              subtitle="Members contributing produce"
              action={
                <button
                  type="button"
                  onClick={
                    handleMembers
                  }
                  className="text-xs font-semibold text-green-700"
                >
                  View all
                </button>
              }
            />


            <div className="p-4">

              <div className="relative mb-3">

                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={
                    searchMember
                  }
                  onChange={(e) =>
                    setSearchMember(
                      e.target.value,
                    )
                  }
                  placeholder="Search member or village"
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-green-500"
                />

              </div>


              <div className="space-y-2">

                {filteredMembers
                  .slice(0, 4)
                  .map(
                    (member) => (
                      <button
                        key={
                          member.id
                        }
                        type="button"
                        onClick={() => {
                          setSelectedMember(
                            member,
                          );
                          setActiveModal(
                            "member",
                          );
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-left"
                      >

                        <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">

                          <UserRound
                            size={17}
                          />

                        </div>


                        <div className="flex-1 min-w-0">

                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {member.name}
                          </p>

                          <p className="text-xs text-gray-500 mt-0.5">
                            {member.village} ·{" "}
                            {member.lots} lots
                          </p>

                        </div>


                        <div className="text-right">

                          <p className="text-xs font-bold text-green-700">
                            {member.quantity} q
                          </p>

                          <p className="text-[10px] text-gray-400">
                            contributed
                          </p>

                        </div>

                      </button>
                    ),
                  )}

              </div>


              {filteredMembers.length ===
                0 && (
                <EmptyState
                  title="No members found"
                  text="Try another member or village name."
                />
              )}

            </div>

          </div>


          {/* --------------------------------------------------
              AGGREGATED LOTS
          -------------------------------------------------- */}

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <CardHeader
              icon={Package}
              iconBg="bg-green-50"
              iconClass="text-green-600"
              title="Aggregated Lots"
              subtitle="Buyer-ready FPO inventory"
              action={
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/lots",
                    )
                  }
                  className="text-xs font-semibold text-green-700"
                >
                  View all
                </button>
              }
            />


            <div className="divide-y divide-gray-100">

              {lots
                .slice(0, 4)
                .map((lot) => (
                  <button
                    key={lot.id}
                    type="button"
                    onClick={() => {
                      setSelectedLot(
                        lot,
                      );
                      setActiveModal(
                        "lot",
                      );
                    }}
                    className="w-full p-4 text-left hover:bg-gray-50 transition"
                  >

                    <div className="flex items-start gap-3">

                      <div className="w-10 h-10 rounded-lg bg-green-50 text-green-700 flex items-center justify-center shrink-0">

                        <Package
                          size={18}
                        />

                      </div>


                      <div className="flex-1 min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <p className="text-sm font-semibold text-gray-900">
                            {lot.crop}
                          </p>

                          <span
                            className={`
                              px-2 py-0.5 rounded-full
                              text-[10px]
                              font-semibold
                              ${getLotStatusClass(
                                lot.status,
                              )}
                            `}
                          >
                            {lot.status}
                          </span>

                        </div>


                        <p className="text-xs text-gray-500 mt-1">
                          {lot.quantity} Quintals ·{" "}
                          {lot.members} members · Grade{" "}
                          {lot.grade}
                        </p>


                        <p className="text-xs text-gray-500 mt-1">
                          {lot.id}
                        </p>

                      </div>


                      <div className="text-right shrink-0">

                        <p className="text-sm font-bold text-gray-900">
                          ₹
                          {Number(
                            lot.price,
                          ).toLocaleString(
                            "en-IN",
                          )}
                          /q
                        </p>

                        <ChevronRight
                          size={15}
                          className="ml-auto mt-1 text-gray-400"
                        />

                      </div>

                    </div>

                  </button>
                ))}

            </div>

          </div>

        </section>


        {/* ====================================================
            BUYER MATCHES
        ==================================================== */}

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          <CardHeader
            icon={Handshake}
            iconBg="bg-blue-50"
            iconClass="text-blue-600"
            title="Buyer Matches"
            subtitle="Verified buyer requirements matching your aggregated produce"
            action={
              <button
                type="button"
                onClick={
                  handleFindBuyer
                }
                className="text-xs font-semibold text-green-700"
              >
                View Buyer Marketplace
              </button>
            }
          />


          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-5">

            {buyerMatches.map(
              (match) => (
                <div
                  key={match.id}
                  className="border border-gray-200 rounded-xl p-4"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-2">

                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Handshake
                          size={15}
                        />
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-gray-900">
                          {match.buyer}
                        </p>

                        {match.verified && (
                          <p className="flex items-center gap-1 text-[10px] text-green-600 font-semibold mt-0.5">
                            <ShieldCheck
                              size={11}
                            />
                            Verified Buyer
                          </p>
                        )}

                      </div>

                    </div>

                  </div>


                  <div className="mt-4 space-y-2">

                    <div className="flex justify-between text-xs">

                      <span className="text-gray-500">
                        Requirement
                      </span>

                      <span className="font-semibold text-gray-800">
                        {match.crop} ·{" "}
                        {match.quantity} q
                      </span>

                    </div>


                    <div className="flex justify-between text-xs">

                      <span className="text-gray-500">
                        Offered Price
                      </span>

                      <span className="font-bold text-green-700">
                        ₹
                        {match.offeredPrice.toLocaleString(
                          "en-IN",
                        )}
                        /q
                      </span>

                    </div>


                    <div className="flex justify-between text-xs">

                      <span className="text-gray-500">
                        Delivery
                      </span>

                      <span className="font-medium text-gray-700">
                        {match.location}
                      </span>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={
                      handleFindBuyer
                    }
                    className="w-full mt-4 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    View Buyer
                  </button>

                </div>
              ),
            )}

          </div>

        </section>


        {/* ====================================================
            LOGISTICS + PAYMENT
        ==================================================== */}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* --------------------------------------------------
              LOGISTICS
          -------------------------------------------------- */}

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <CardHeader
              icon={Truck}
              iconBg="bg-purple-50"
              iconClass="text-purple-600"
              title="Logistics Overview"
              subtitle="Transportation status for active lots"
              action={
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/logistics",
                    )
                  }
                  className="text-xs font-semibold text-green-700"
                >
                  Manage Logistics
                </button>
              }
            />


            <div className="p-5 space-y-3">

              <LogisticsRow
                crop="Rice"
                route="Indore → Delhi NCR"
                status="Scheduled"
                statusClass="bg-blue-50 text-blue-700"
                quantity="350 q"
              />

              <LogisticsRow
                crop="Wheat"
                route="Indore → Bhopal"
                status="Transport Required"
                statusClass="bg-amber-50 text-amber-700"
                quantity="500 q"
              />

              <LogisticsRow
                crop="Onion"
                route="Nashik → Delhi"
                status="Delivered"
                statusClass="bg-green-50 text-green-700"
                quantity="300 q"
              />

            </div>

          </div>


          {/* --------------------------------------------------
              PAYMENTS
          -------------------------------------------------- */}

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            <CardHeader
              icon={WalletCards}
              iconBg="bg-amber-50"
              iconClass="text-amber-600"
              title="Payment & Settlement"
              subtitle="Track buyer payments and member distribution"
              action={
                <button
                  type="button"
                  onClick={
                    handleDistributePayment
                  }
                  className="text-xs font-semibold text-green-700"
                >
                  Distribute
                </button>
              }
            />


            <div className="p-5">

              <div className="grid grid-cols-2 gap-3">

                <PaymentMetric
                  label="Buyer Payment Held"
                  value="₹8,40,000"
                  icon={ShieldCheck}
                />

                <PaymentMetric
                  label="Ready for Members"
                  value="₹4,89,000"
                  icon={Users}
                />

                <PaymentMetric
                  label="Released"
                  value="₹6,24,000"
                  icon={CheckCircle2}
                />

                <PaymentMetric
                  label="Pending"
                  value="₹2,46,500"
                  icon={Clock3}
                />

              </div>


              <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-100">

                <div className="flex items-start gap-2">

                  <ShieldCheck
                    size={17}
                    className="text-green-600 mt-0.5"
                  />

                  <div>

                    <p className="text-xs font-semibold text-gray-900">
                      Protected payment workflow
                    </p>

                    <p className="text-[11px] text-gray-600 mt-1 leading-5">
                      Buyer payment can remain protected
                      until quality, quantity and delivery
                      requirements are completed.
                    </p>

                  </div>

                </div>

              </div>


              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/payments",
                  )
                }
                className="w-full mt-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                View Payments
              </button>

            </div>

          </div>

        </section>


        {/* ====================================================
            RECENT ACTIVITY
        ==================================================== */}

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          <CardHeader
            icon={RefreshCw}
            iconBg="bg-gray-100"
            iconClass="text-gray-600"
            title="Recent Activity"
            subtitle="Latest FPO operations"
          />


          <div className="divide-y divide-gray-100">

            {defaultActivities.map(
              (activity) => {

                const Icon =
                  getActivityIcon(
                    activity.type,
                  );

                return (
                  <div
                    key={
                      activity.id
                    }
                    className="flex items-center gap-3 px-5 py-4"
                  >

                    <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">

                      <Icon
                        size={17}
                        className="text-gray-600"
                      />

                    </div>


                    <div className="flex-1 min-w-0">

                      <p className="text-sm font-semibold text-gray-800">
                        {activity.title}
                      </p>

                      <p className="text-xs text-gray-500 mt-0.5">
                        {activity.subtitle}
                      </p>

                    </div>


                    <span className="text-[11px] text-gray-400 shrink-0">
                      {activity.time}
                    </span>

                  </div>
                );
              },
            )}

          </div>

        </section>


        {/* ====================================================
            MARKET PRICES
        ==================================================== */}

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          <CardHeader
            icon={BarChart3}
            iconBg="bg-green-50"
            iconClass="text-green-600"
            title="Top Market Prices Today"
            subtitle="Use current market signals while deciding when and where to sell"
            action={
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/prices",
                  )
                }
                className="text-xs font-semibold text-green-700"
              >
                View Mandi Prices
              </button>
            }
          />


          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-5">

            {topPrices.map(
              (price, index) => {

                const crop =
                  price.commodity ||
                  price.Commodity ||
                  "Crop";

                const state =
                  price.state ||
                  price.State ||
                  "India";

                const modalPrice =
                  Number(
                    price.modal_price ||
                      price.modalPrice ||
                      0,
                  );

                const change =
                  Number(
                    price.change ||
                      0,
                  );

                return (
                  <button
                    key={
                      `${crop}-${index}`
                    }
                    type="button"
                    onClick={() =>
                      navigate(
                        `/prices/${encodeURIComponent(
                          crop
                            .toLowerCase()
                            .replace(
                              /\s+/g,
                              "-",
                            ),
                        )}`,
                      )
                    }
                    className="text-left border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition"
                  >

                    <p className="text-sm font-bold text-gray-900 truncate">
                      {crop}
                    </p>

                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {state}
                    </p>

                    <p className="text-xl font-bold text-green-700 mt-4">
                      ₹
                      {modalPrice.toLocaleString(
                        "en-IN",
                      )}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-1">

                      <span className="text-[11px] text-gray-400">
                        Modal / quintal
                      </span>

                      <span className="text-[11px] font-semibold text-green-600">
                        {change >= 0
                          ? "↗"
                          : "↘"}{" "}
                        {Math.abs(
                          change,
                        ).toFixed(1)}
                        %
                      </span>

                    </div>

                  </button>
                );
              },
            )}

          </div>

        </section>


        {/* ====================================================
            FPO TRUST / SUPPORT STRIP
        ==================================================== */}

        <section className="bg-white border border-gray-200 rounded-xl px-5 py-4">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div className="flex items-start gap-3">

              <ShieldCheck
                size={18}
                className="text-green-600 mt-0.5"
              />

              <div>

                <p className="text-sm font-semibold text-gray-900">
                  FPO transactions are tracked end-to-end
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Lots, buyer matching, logistics, payments
                  and disputes remain connected to the procurement record.
                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={() =>
                navigate(
                  "/disputes",
                )
              }
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 shrink-0"
            >
              Need help?
              <CircleHelp
                size={14}
              />
            </button>

          </div>

        </section>

      </div>


      {/* ======================================================
          AGGREGATE LOT MODAL
      ====================================================== */}

      {activeModal ===
        "aggregate" && (
        <Modal
          title="Aggregate Member Produce"
          subtitle="Create a buyer-ready FPO lot from member produce."
          onClose={
            closeModal
          }
        >

          <form
            onSubmit={
              submitAggregation
            }
            className="space-y-4"
          >

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <FormField
                label="Crop"
              >

                <select
                  value={
                    aggregationForm.crop
                  }
                  onChange={(e) =>
                    setAggregationForm(
                      (prev) => ({
                        ...prev,
                        crop: e.target.value,
                      }),
                    )
                  }
                  className="form-input"
                >

                  <option>
                    Wheat
                  </option>

                  <option>
                    Rice
                  </option>

                  <option>
                    Maize
                  </option>

                  <option>
                    Soybean
                  </option>

                  <option>
                    Chickpea
                  </option>

                  <option>
                    Onion
                  </option>

                  <option>
                    Tomato
                  </option>

                  <option>
                    Cotton
                  </option>

                </select>

              </FormField>


              <FormField
                label="Available Quantity (Quintals)"
              >

                <input
                  type="number"
                  min="1"
                  value={
                    aggregationForm.quantity
                  }
                  onChange={(e) =>
                    setAggregationForm(
                      (prev) => ({
                        ...prev,
                        quantity:
                          e.target.value,
                      }),
                    )
                  }
                  placeholder="e.g. 500"
                  className="form-input"
                />

              </FormField>


              <FormField
                label="Quality Grade"
              >

                <select
                  value={
                    aggregationForm.grade
                  }
                  onChange={(e) =>
                    setAggregationForm(
                      (prev) => ({
                        ...prev,
                        grade: e.target.value,
                      }),
                    )
                  }
                  className="form-input"
                >

                  <option>
                    A
                  </option>

                  <option>
                    Premium
                  </option>

                  <option>
                    B
                  </option>

                  <option>
                    C
                  </option>

                </select>

              </FormField>


              <FormField
                label="Expected Price / Quintal"
              >

                <input
                  type="number"
                  min="1"
                  value={
                    aggregationForm.price
                  }
                  onChange={(e) =>
                    setAggregationForm(
                      (prev) => ({
                        ...prev,
                        price:
                          e.target.value,
                      }),
                    )
                  }
                  placeholder="e.g. 2480"
                  className="form-input"
                />

              </FormField>


              <FormField
                label="Pickup Location"
              >

                <input
                  type="text"
                  value={
                    aggregationForm.pickup
                  }
                  onChange={(e) =>
                    setAggregationForm(
                      (prev) => ({
                        ...prev,
                        pickup:
                          e.target.value,
                      }),
                    )
                  }
                  placeholder="District / market"
                  className="form-input"
                />

              </FormField>


              <FormField
                label="Available From"
              >

                <input
                  type="date"
                  value={
                    aggregationForm.availableDate
                  }
                  onChange={(e) =>
                    setAggregationForm(
                      (prev) => ({
                        ...prev,
                        availableDate:
                          e.target.value,
                      }),
                    )
                  }
                  className="form-input"
                />

              </FormField>

            </div>


            <div>

              <p className="text-xs font-semibold text-gray-700 mb-2">
                Transportation
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <TransportOption
                  selected={
                    aggregationForm.transport ===
                    "buyer"
                  }
                  title="Buyer will arrange"
                  text="Buyer arranges transporter after order confirmation."
                  onClick={() =>
                    setAggregationForm(
                      (prev) => ({
                        ...prev,
                        transport:
                          "buyer",
                      }),
                    )
                  }
                />

                <TransportOption
                  selected={
                    aggregationForm.transport ===
                    "seller"
                  }
                  title="Seller will arrange"
                  text="FPO arranges delivery to the buyer location."
                  onClick={() =>
                    setAggregationForm(
                      (prev) => ({
                        ...prev,
                        transport:
                          "seller",
                      }),
                    )
                  }
                />

              </div>

            </div>


            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">

              <div className="flex items-start gap-2">

                <Layers3
                  size={17}
                  className="text-green-600 mt-0.5"
                />

                <p className="text-xs text-gray-600 leading-5">
                  The lot will remain in the FPO lot
                  workflow and can later be matched with
                  buyer requirements based on crop,
                  quantity, quality, location and price.
                </p>

              </div>

            </div>


            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">

              <button
                type="button"
                onClick={
                  closeModal
                }
                className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>


              <button
                type="submit"
                className="px-4 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 inline-flex items-center justify-center gap-2"
              >

                <Plus size={16} />

                Create FPO Lot

              </button>

            </div>

          </form>

        </Modal>
      )}


      {/* ======================================================
          MEMBERS MODAL
      ====================================================== */}

      {activeModal ===
        "members" && (
        <Modal
          title="FPO Members"
          subtitle="View member contributions and settlement status."
          onClose={
            closeModal
          }
        >

          <div className="space-y-3">

            <div className="grid grid-cols-3 gap-2">

              <MiniStat
                label="Members"
                value={memberCount}
              />

              <MiniStat
                label="Active"
                value={memberCount}
              />

              <MiniStat
                label="Lots"
                value={lots.length}
              />

            </div>


            <div className="space-y-2">

              {members.map(
                (member) => (
                  <button
                    key={
                      member.id
                    }
                    type="button"
                    onClick={() => {
                      setSelectedMember(
                        member,
                      );
                      setActiveModal(
                        "member",
                      );
                    }}
                    className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-xl text-left hover:bg-gray-50"
                  >

                    <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
                      <UserRound
                        size={17}
                      />
                    </div>


                    <div className="flex-1">

                      <p className="text-sm font-semibold text-gray-900">
                        {member.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {member.village} ·{" "}
                        {member.lots} lots
                      </p>

                    </div>


                    <div className="text-right">

                      <p className="text-xs font-bold text-green-700">
                        {member.quantity} q
                      </p>

                      <p className="text-[10px] text-gray-400">
                        contributed
                      </p>

                    </div>

                  </button>
                ),
              )}

            </div>

          </div>

        </Modal>
      )}


      {/* ======================================================
          MEMBER DETAIL MODAL
      ====================================================== */}

      {activeModal ===
        "member" &&
        selectedMember && (
          <Modal
            title={
              selectedMember.name
            }
            subtitle="FPO member contribution details."
            onClose={
              closeModal
            }
          >

            <div className="space-y-4">

              <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 border border-purple-100">

                <div className="w-12 h-12 rounded-full bg-white text-purple-700 flex items-center justify-center">
                  <UserRound
                    size={22}
                  />
                </div>

                <div>

                  <p className="font-bold text-gray-900">
                    {
                      selectedMember.name
                    }
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {
                      selectedMember.village
                    }
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-2 gap-3">

                <MiniStat
                  label="Lots"
                  value={
                    selectedMember.lots
                  }
                />

                <MiniStat
                  label="Quantity"
                  value={`${selectedMember.quantity} q`}
                />

                <MiniStat
                  label="Settlement"
                  value={`₹${selectedMember.payment.toLocaleString(
                    "en-IN",
                  )}`}
                />

                <MiniStat
                  label="Status"
                  value={
                    selectedMember.status
                  }
                />

              </div>


              <button
                type="button"
                onClick={() => {
                  setPaymentBatch({
                    memberIds: [
                      selectedMember.id,
                    ],
                  });

                  setActiveModal(
                    "payment",
                  );
                }}
                className="w-full py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
              >
                Prepare Member Payment
              </button>

            </div>

          </Modal>
        )}


      {/* ======================================================
          PAYMENT MODAL
      ====================================================== */}

      {activeModal ===
        "payment" && (
        <Modal
          title="Distribute Member Payments"
          subtitle="Select members for the next settlement batch."
          onClose={
            closeModal
          }
        >

          <div className="space-y-3">

            {members.map(
              (member) => {

                const selected =
                  paymentBatch.memberIds.includes(
                    member.id,
                  );

                return (
                  <label
                    key={
                      member.id
                    }
                    className={`
                      flex items-center gap-3 p-3 rounded-xl border cursor-pointer
                      ${
                        selected
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }
                    `}
                  >

                    <input
                      type="checkbox"
                      checked={
                        selected
                      }
                      onChange={() =>
                        toggleMemberPayment(
                          member.id,
                        )
                      }
                      className="w-4 h-4 accent-green-600"
                    />


                    <div className="flex-1">

                      <p className="text-sm font-semibold text-gray-900">
                        {member.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {member.quantity} q ·{" "}
                        {member.village}
                      </p>

                    </div>


                    <p className="text-sm font-bold text-gray-800">
                      ₹
                      {member.payment.toLocaleString(
                        "en-IN",
                      )}
                    </p>

                  </label>
                );
              },
            )}


            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">

              <span className="text-sm font-semibold text-gray-700">
                Selected settlement
              </span>

              <span className="text-lg font-bold text-green-700">
                ₹
                {selectedPaymentAmount.toLocaleString(
                  "en-IN",
                )}
              </span>

            </div>


            <button
              type="button"
              onClick={
                confirmPaymentDistribution
              }
              className="w-full py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
            >
              Prepare Payment Batch
            </button>

          </div>

        </Modal>
      )}


      {/* ======================================================
          LOT DETAIL MODAL
      ====================================================== */}

      {activeModal ===
        "lot" &&
        selectedLot && (
          <Modal
            title={
              selectedLot.crop
            }
            subtitle={
              selectedLot.id
            }
            onClose={
              closeModal
            }
          >

            <div className="space-y-4">

              <div className="grid grid-cols-2 gap-3">

                <DetailBox
                  label="Quantity"
                  value={`${selectedLot.quantity} Quintals`}
                />

                <DetailBox
                  label="Quality"
                  value={`Grade ${selectedLot.grade}`}
                />

                <DetailBox
                  label="Expected Price"
                  value={`₹${Number(
                    selectedLot.price,
                  ).toLocaleString(
                    "en-IN",
                  )}/q`}
                />

                <DetailBox
                  label="Members"
                  value={
                    selectedLot.members
                  }
                />

              </div>


              <DetailBox
                label="Pickup Location"
                value={
                  selectedLot.location
                }
              />


              <DetailBox
                label="Available From"
                value={
                  selectedLot.availableDate
                }
              />


              <DetailBox
                label="Transportation"
                value={
                  selectedLot.transport
                }
              />


              {selectedLot.buyer && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">

                  <p className="text-xs text-gray-500">
                    Buyer
                  </p>

                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {
                      selectedLot.buyer
                    }
                  </p>

                </div>
              )}


              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/lots",
                    )
                  }
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Open Lots
                </button>


                <button
                  type="button"
                  onClick={
                    handleFindBuyer
                  }
                  className="flex-1 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                >
                  Find Buyer
                </button>

              </div>

            </div>

          </Modal>
        )}


      {/* ======================================================
          TOAST
      ====================================================== */}

      {toast && (

        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[200]">

          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-900 text-white shadow-xl text-sm font-medium">

            <CheckCircle2
              size={17}
              className="text-green-400"
            />

            {toast}

          </div>

        </div>

      )}

    </div>
  );
}


// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  iconClass,
  iconBg,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">

      <div className="flex items-start justify-between gap-3">

        <div>

          <p className="text-xs text-gray-500">
            {label}
          </p>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            {value}
          </p>

          <p className="text-[11px] text-green-600 font-medium mt-2">
            {helper}
          </p>

        </div>


        <div
          className={`
            w-10 h-10 rounded-xl
            ${iconBg}
            ${iconClass}
            flex items-center justify-center
          `}
        >
          <Icon size={19} />
        </div>

      </div>

    </div>
  );
}


// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeading({
  title,
  subtitle,
}) {
  return (
    <div className="mb-3">

      <h2 className="text-lg font-bold text-gray-900">
        {title}
      </h2>

      <p className="text-xs text-gray-500 mt-0.5">
        {subtitle}
      </p>

    </div>
  );
}


// ============================================================
// CARD HEADER
// ============================================================

function CardHeader({
  icon: Icon,
  iconBg,
  iconClass,
  title,
  subtitle,
  action,
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">

      <div className="flex items-center gap-3">

        <div
          className={`
            w-9 h-9 rounded-lg
            ${iconBg}
            ${iconClass}
            flex items-center justify-center
          `}
        >
          <Icon size={18} />
        </div>


        <div>

          <h2 className="text-sm font-bold text-gray-900">
            {title}
          </h2>

          <p className="text-[11px] text-gray-500 mt-0.5">
            {subtitle}
          </p>

        </div>

      </div>


      {action}

    </div>
  );
}


// ============================================================
// QUICK ACTION
// ============================================================

function QuickAction({
  icon: Icon,
  title,
  subtitle,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-gray-300 hover:shadow-sm transition group"
    >

      <div className="flex items-start justify-between gap-3">

        <div className="w-9 h-9 rounded-lg bg-gray-50 text-gray-700 flex items-center justify-center">
          <Icon size={18} />
        </div>

        <ArrowRight
          size={15}
          className="text-gray-300 group-hover:text-gray-500 transition"
        />

      </div>


      <p className="text-sm font-semibold text-gray-900 mt-4">
        {title}
      </p>

      <p className="text-[11px] text-gray-500 mt-1">
        {subtitle}
      </p>

    </button>
  );
}


// ============================================================
// PIPELINE CARD
// ============================================================

function PipelineCard({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">

      <div className="flex items-center justify-between gap-2">

        <p className="text-xs text-gray-500">
          {label}
        </p>

        <Icon
          size={15}
          className="text-gray-400"
        />

      </div>

      <p className="text-xl font-bold text-gray-900 mt-2">
        {value}
      </p>

    </div>
  );
}


// ============================================================
// LOGISTICS ROW
// ============================================================

function LogisticsRow({
  crop,
  route,
  status,
  statusClass,
  quantity,
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">

      <div className="w-9 h-9 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center">
        <Truck size={17} />
      </div>


      <div className="flex-1 min-w-0">

        <div className="flex items-center gap-2">

          <p className="text-sm font-semibold text-gray-900">
            {crop}
          </p>

          <span className="text-[10px] text-gray-400">
            {quantity}
          </span>

        </div>

        <p className="text-xs text-gray-500 mt-0.5 truncate">
          {route}
        </p>

      </div>


      <span
        className={`
          px-2 py-1 rounded-full
          text-[10px] font-semibold
          ${statusClass}
        `}
      >
        {status}
      </span>

    </div>
  );
}


// ============================================================
// PAYMENT METRIC
// ============================================================

function PaymentMetric({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="p-3 rounded-xl border border-gray-200">

      <div className="flex items-center gap-2">

        <Icon
          size={15}
          className="text-gray-400"
        />

        <p className="text-[11px] text-gray-500">
          {label}
        </p>

      </div>

      <p className="text-base font-bold text-gray-900 mt-2">
        {value}
      </p>

    </div>
  );
}


// ============================================================
// FORM FIELD
// ============================================================

function FormField({
  label,
  children,
}) {
  return (
    <div>

      <label className="text-xs font-semibold text-gray-700">
        {label}
      </label>

      <div className="mt-1.5">
        {children}
      </div>

    </div>
  );
}


// ============================================================
// TRANSPORT OPTION
// ============================================================

function TransportOption({
  selected,
  title,
  text,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        text-left p-3 rounded-xl border transition
        ${
          selected
            ? "border-green-500 bg-green-50"
            : "border-gray-200 hover:border-gray-300"
        }
      `}
    >

      <div className="flex items-start gap-2">

        <div
          className={`
            w-4 h-4 mt-0.5 rounded-full border-2
            flex items-center justify-center shrink-0
            ${
              selected
                ? "border-green-600"
                : "border-gray-300"
            }
          `}
        >

          {selected && (
            <div className="w-2 h-2 rounded-full bg-green-600" />
          )}

        </div>


        <div>

          <p className="text-xs font-semibold text-gray-900">
            {title}
          </p>

          <p className="text-[10px] text-gray-500 mt-1 leading-4">
            {text}
          </p>

        </div>

      </div>

    </button>
  );
}


// ============================================================
// DETAIL BOX
// ============================================================

function DetailBox({
  label,
  value,
}) {
  return (
    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">

      <p className="text-[11px] text-gray-500">
        {label}
      </p>

      <p className="text-sm font-semibold text-gray-900 mt-1">
        {value}
      </p>

    </div>
  );
}


// ============================================================
// MINI STAT
// ============================================================

function MiniStat({
  label,
  value,
}) {
  return (
    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">

      <p className="text-[10px] text-gray-500">
        {label}
      </p>

      <p className="text-sm font-bold text-gray-900 mt-1">
        {value}
      </p>

    </div>
  );
}


// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState({
  title,
  text,
}) {
  return (
    <div className="text-center py-8">

      <div className="w-10 h-10 rounded-full bg-gray-100 mx-auto flex items-center justify-center">
        <Search
          size={17}
          className="text-gray-400"
        />
      </div>

      <p className="text-sm font-semibold text-gray-700 mt-3">
        {title}
      </p>

      <p className="text-xs text-gray-400 mt-1">
        {text}
      </p>

    </div>
  );
}


// ============================================================
// MODAL
// ============================================================

function Modal({
  title,
  subtitle,
  children,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (
          e.target ===
          e.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">

        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-gray-100">

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              {title}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              {subtitle}
            </p>

          </div>


          <button
            type="button"
            onClick={
              onClose
            }
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>

        </div>


        <div className="p-5">
          {children}
        </div>

      </div>

    </div>
  );
}