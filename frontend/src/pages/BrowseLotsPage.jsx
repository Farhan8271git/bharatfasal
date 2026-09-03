import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Package,
  Star,
  Truck,
  CalendarDays,
  ShieldCheck,
  SlidersHorizontal,
  X,
  ArrowRight,
  CheckCircle2,
  IndianRupee,
} from "lucide-react";

/*
  Prototype lot data.

  transportCost is the estimated transportation cost
  for the complete lot, not per quintal.
*/
const availableLots = [
  {
    id: "LOT-101",
    crop: "Wheat",
    variety: "Lokwan",
    quantity: 50,
    grade: "Grade A",
    price: 2500,
    location: "Gorakhpur, Uttar Pradesh",
    seller: "Shiv Farmers FPO",
    sellerType: "FPO",
    rating: 4.8,
    availableDate: "5 Sep 2026",
    transport: "Seller will arrange",
    transportCost: 8500,
    description:
      "Clean and properly dried wheat suitable for bulk procurement.",
  },
  {
    id: "LOT-102",
    crop: "Soybean",
    variety: "Yellow Soybean",
    quantity: 30,
    grade: "Grade A",
    price: 5200,
    location: "Indore, Madhya Pradesh",
    seller: "Malwa Agro FPO",
    sellerType: "FPO",
    rating: 4.7,
    availableDate: "8 Sep 2026",
    transport: "Buyer will arrange",
    transportCost: 7200,
    description:
      "Good quality soybean lot available for institutional procurement.",
  },
  {
    id: "LOT-103",
    crop: "Onion",
    variety: "Red Onion",
    quantity: 100,
    grade: "Grade B",
    price: 1900,
    location: "Nashik, Maharashtra",
    seller: "Nashik Growers Group",
    sellerType: "Farmer Group",
    rating: 4.6,
    availableDate: "10 Sep 2026",
    transport: "Seller will arrange",
    transportCost: 12500,
    description:
      "Fresh red onion suitable for wholesale and food processing buyers.",
  },
  {
    id: "LOT-104",
    crop: "Cotton",
    variety: "Long Staple",
    quantity: 20,
    grade: "Grade A",
    price: 7400,
    location: "Rajkot, Gujarat",
    seller: "Saurashtra Cotton FPO",
    sellerType: "FPO",
    rating: 4.9,
    availableDate: "12 Sep 2026",
    transport: "Buyer will arrange",
    transportCost: 6800,
    description:
      "Long staple cotton with consistent quality for textile procurement.",
  },
  {
    id: "LOT-105",
    crop: "Chickpea",
    variety: "Desi Chickpea",
    quantity: 40,
    grade: "Grade A",
    price: 6100,
    location: "Bhopal, Madhya Pradesh",
    seller: "Bhopal Farmer Collective",
    sellerType: "FPO",
    rating: 4.7,
    availableDate: "14 Sep 2026",
    transport: "Seller will arrange",
    transportCost: 7900,
    description:
      "Well-cleaned chickpea lot available for bulk purchase.",
  },
];

const cropOptions = [
  "All Crops",
  "Wheat",
  "Soybean",
  "Onion",
  "Cotton",
  "Chickpea",
];

const gradeOptions = [
  "All Grades",
  "Grade A",
  "Grade B",
];

export default function BrowseLotsPage({ user }) {
  const [search, setSearch] = useState("");
  const [crop, setCrop] = useState("All Crops");
  const [grade, setGrade] = useState("All Grades");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [selectedLot, setSelectedLot] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const buyerName =
    user?.companyName ||
    user?.businessName ||
    user?.name ||
    "Buyer";

  const formatCurrency = (value) => {
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  /*
    Produce cost = quantity × price per quintal
  */
  const getProduceCost = (lot) => {
    return lot.quantity * lot.price;
  };

  /*
    Landed cost = produce cost + estimated transportation
  */
  const getLandedCost = (lot) => {
    return getProduceCost(lot) + lot.transportCost;
  };

  /*
    Landed cost per quintal
  */
  const getLandedPricePerQuintal = (lot) => {
    return getLandedCost(lot) / lot.quantity;
  };

  const filteredLots = useMemo(() => {
    return availableLots.filter((lot) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        lot.crop.toLowerCase().includes(searchText) ||
        lot.variety.toLowerCase().includes(searchText) ||
        lot.location.toLowerCase().includes(searchText) ||
        lot.seller.toLowerCase().includes(searchText) ||
        lot.id.toLowerCase().includes(searchText);

      const matchesCrop =
        crop === "All Crops" || lot.crop === crop;

      const matchesGrade =
        grade === "All Grades" || lot.grade === grade;

      const matchesLocation =
        !location ||
        lot.location
          .toLowerCase()
          .includes(location.toLowerCase());

      const matchesPrice =
        !maxPrice || lot.price <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesCrop &&
        matchesGrade &&
        matchesLocation &&
        matchesPrice
      );
    });
  }, [search, crop, grade, location, maxPrice]);

  const clearFilters = () => {
    setSearch("");
    setCrop("All Crops");
    setGrade("All Grades");
    setLocation("");
    setMaxPrice("");
  };

  const openDetails = (lot) => {
    setSelectedLot(lot);
    setShowRequestModal(false);
    setRequestSent(false);
  };

  const openRequest = (lot) => {
    setSelectedLot(lot);
    setShowRequestModal(true);
    setRequestSent(false);
  };

  const closeModal = () => {
    setSelectedLot(null);
    setShowRequestModal(false);
    setRequestSent(false);
  };

  const handleRequest = () => {
    /*
      Prototype behaviour.
      In production this will create a purchase request
      in the backend/database.
    */
    setRequestSent(true);
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-10">

      {/* =========================
          PAGE HEADER
      ========================== */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">

        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">
            Buyer Marketplace
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Browse Available Lots
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Find verified produce from farmers and FPOs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ShieldCheck
            size={17}
            className="text-green-600"
          />

          <span>
            Verified sellers • Quality & quantity verification
          </span>
        </div>
      </div>

      {/* =========================
          SEARCH + FILTERS
      ========================== */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-5">

        <div className="flex flex-col md:flex-row gap-3">

          {/* SEARCH */}
          <div className="relative flex-1">

            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search crop, lot ID, seller or location..."
              className="
                w-full
                h-11
                rounded-xl
                border border-gray-200
                pl-10
                pr-4
                text-sm
                outline-none
                focus:border-green-500
                focus:ring-2
                focus:ring-green-100
              "
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className="
              h-11
              px-4
              rounded-xl
              border border-gray-200
              text-sm
              font-medium
              text-gray-700
              hover:bg-gray-50
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="
              h-11
              px-4
              rounded-xl
              text-sm
              font-medium
              text-gray-500
              hover:bg-gray-50
            "
          >
            Clear
          </button>
        </div>

        {/* FILTER PANEL */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">

            {/* CROP */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Crop
              </label>

              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="
                  w-full
                  h-10
                  rounded-lg
                  border border-gray-200
                  px-3
                  text-sm
                  bg-white
                  outline-none
                  focus:border-green-500
                "
              >
                {cropOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* GRADE */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Quality / Grade
              </label>

              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="
                  w-full
                  h-10
                  rounded-lg
                  border border-gray-200
                  px-3
                  text-sm
                  bg-white
                  outline-none
                  focus:border-green-500
                "
              >
                {gradeOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* LOCATION */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Gorakhpur"
                className="
                  w-full
                  h-10
                  rounded-lg
                  border border-gray-200
                  px-3
                  text-sm
                  outline-none
                  focus:border-green-500
                "
              />
            </div>

            {/* MAX PRICE */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Maximum Price / Quintal
              </label>

              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g. 5000"
                className="
                  w-full
                  h-10
                  rounded-lg
                  border border-gray-200
                  px-3
                  text-sm
                  outline-none
                  focus:border-green-500
                "
              />
            </div>
          </div>
        )}
      </div>

      {/* =========================
          RESULT SUMMARY
      ========================== */}
      <div className="flex items-center justify-between mb-4">

        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">
            {filteredLots.length}
          </span>{" "}
          available lots
        </p>

        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
          <CheckCircle2
            size={15}
            className="text-green-600"
          />

          Verified procurement listings
        </div>
      </div>

      {/* =========================
          LOT LIST
      ========================== */}
      <div className="space-y-4">

        {filteredLots.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

            <Package
              size={36}
              className="mx-auto text-gray-300 mb-3"
            />

            <h3 className="font-semibold text-gray-900">
              No matching lots found
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-sm font-semibold text-green-700 hover:text-green-800"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filteredLots.map((lot) => {
            const produceCost = getProduceCost(lot);
            const landedCost = getLandedCost(lot);
            const landedPerQuintal =
              getLandedPricePerQuintal(lot);

            return (
              <div
                key={lot.id}
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-2xl
                  p-5
                  hover:border-green-200
                  transition
                "
              >

                {/* =========================
                    LOT TOP
                ========================== */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                  <div className="flex gap-4">

                    {/* ICON */}
                    <div className="
                      h-12
                      w-12
                      shrink-0
                      rounded-xl
                      bg-green-50
                      flex
                      items-center
                      justify-center
                      text-green-700
                    ">
                      <Package size={23} />
                    </div>

                    <div>

                      {/* CROP + BADGES */}
                      <div className="flex flex-wrap items-center gap-2">

                        <h2 className="text-lg font-bold text-gray-900">
                          {lot.crop}
                        </h2>

                        <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                          {lot.grade}
                        </span>

                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                          Verified Seller
                        </span>
                      </div>

                      {/* LOT ID */}
                      <p className="text-xs text-gray-500 mt-1">
                        {lot.id} • {lot.variety}
                      </p>

                      {/* BASIC DETAILS */}
                      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-gray-600">

                        <span className="flex items-center gap-1.5">
                          <Package size={15} />
                          {lot.quantity} Quintals
                        </span>

                        <span className="flex items-center gap-1.5">
                          <MapPin size={15} />
                          {lot.location}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={15} />
                          Available {lot.availableDate}
                        </span>

                      </div>
                    </div>
                  </div>

                  {/* CROP PRICE */}
                  <div className="lg:text-right shrink-0">

                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(lot.price)}
                    </p>

                    <p className="text-xs text-gray-500">
                      crop price / quintal
                    </p>
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="border-t border-gray-100 my-4" />

                {/* =========================
                    COST BREAKDOWN
                ========================== */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  {/* PRODUCE COST */}
                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs text-gray-500 mb-1">
                      Produce Cost
                    </p>

                    <p className="text-base font-bold text-gray-900">
                      {formatCurrency(produceCost)}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {lot.quantity} Quintals ×{" "}
                      {formatCurrency(lot.price)}
                    </p>
                  </div>

                  {/* TRANSPORT COST */}
                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs text-gray-500 mb-1">
                      Transportation
                    </p>

                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Truck size={16} className="text-gray-500" />
                      {lot.transport}
                    </p>

                    <p className="text-sm font-bold text-gray-900 mt-1">
                      Estimated: {formatCurrency(lot.transportCost)}
                    </p>
                  </div>

                  {/* LANDED COST */}
                  <div className="rounded-xl bg-green-50 border border-green-100 p-4">

                    <p className="text-xs text-green-700 mb-1">
                      Estimated Landed Cost
                    </p>

                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(landedCost)}
                    </p>

                    <p className="text-xs text-green-700 mt-1">
                      {formatCurrency(landedPerQuintal)} / quintal
                    </p>
                  </div>
                </div>

                {/* =========================
                    SELLER INFORMATION
                ========================== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Seller
                    </p>

                    <p className="text-sm font-semibold text-gray-900">
                      {lot.seller}
                    </p>

                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">

                      <Star
                        size={13}
                        className="fill-current text-amber-500"
                      />

                      {lot.rating} rating • {lot.sellerType}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Lot Description
                    </p>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {lot.description}
                    </p>
                  </div>
                </div>

                {/* =========================
                    ACTIONS
                ========================== */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-5">

                  <button
                    type="button"
                    onClick={() => openDetails(lot)}
                    className="
                      h-10
                      px-4
                      rounded-lg
                      border
                      border-gray-200
                      text-sm
                      font-semibold
                      text-gray-700
                      hover:bg-gray-50
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    View Details
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => openRequest(lot)}
                    className="
                      h-10
                      px-5
                      rounded-lg
                      bg-green-600
                      text-white
                      text-sm
                      font-semibold
                      hover:bg-green-700
                      transition
                    "
                  >
                    Request to Buy
                  </button>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ==================================================
          DETAILS MODAL
      ================================================== */}
      {selectedLot && !showRequestModal && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedLot.crop} Lot Details
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {selectedLot.id}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-5 space-y-5">

              {/* BASIC INFO */}
              <div className="grid grid-cols-2 gap-4">

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">
                    Available Quantity
                  </p>

                  <p className="font-semibold mt-1">
                    {selectedLot.quantity} Quintals
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">
                    Crop Price
                  </p>

                  <p className="font-semibold mt-1">
                    {formatCurrency(selectedLot.price)} / quintal
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">
                    Grade
                  </p>

                  <p className="font-semibold mt-1">
                    {selectedLot.grade}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">
                    Available From
                  </p>

                  <p className="font-semibold mt-1">
                    {selectedLot.availableDate}
                  </p>
                </div>
              </div>

              {/* SELLER */}
              <div>
                <p className="text-xs text-gray-500">
                  Seller
                </p>

                <p className="font-semibold text-gray-900 mt-1">
                  {selectedLot.seller}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedLot.sellerType} • {selectedLot.rating} rating
                </p>
              </div>

              {/* LOCATION */}
              <div>
                <p className="text-xs text-gray-500">
                  Pickup Location
                </p>

                <p className="text-sm font-medium text-gray-800 mt-1 flex items-center gap-2">
                  <MapPin size={16} />
                  {selectedLot.location}
                </p>
              </div>

              {/* TRANSPORT */}
              <div className="bg-gray-50 rounded-xl p-4">

                <p className="text-xs text-gray-500">
                  Transportation
                </p>

                <div className="flex items-center justify-between gap-3 mt-2">

                  <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                    <Truck size={17} />
                    {selectedLot.transport}
                  </p>

                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(selectedLot.transportCost)}
                  </p>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Estimated transportation cost for this lot
                </p>
              </div>

              {/* COST SUMMARY */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">

                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">
                    Estimated Cost Summary
                  </p>
                </div>

                <div className="p-4 space-y-3">

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Produce Cost
                    </span>

                    <span className="font-medium text-gray-900">
                      {formatCurrency(
                        getProduceCost(selectedLot)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Transportation
                    </span>

                    <span className="font-medium text-gray-900">
                      {formatCurrency(
                        selectedLot.transportCost
                      )}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between">

                    <span className="text-sm font-semibold text-gray-900">
                      Estimated Landed Cost
                    </span>

                    <span className="text-base font-bold text-green-700">
                      {formatCurrency(
                        getLandedCost(selectedLot)
                      )}
                    </span>
                  </div>

                  <div className="text-right text-xs text-gray-500">
                    {formatCurrency(
                      getLandedPricePerQuintal(selectedLot)
                    )}{" "}
                    / quintal
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <p className="text-xs text-gray-500">
                  Description
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  {selectedLot.description}
                </p>
              </div>

              {/* PROTECTED PAYMENT */}
              <div className="p-4 rounded-xl bg-green-50 border border-green-100">

                <div className="flex items-start gap-3">

                  <ShieldCheck
                    size={20}
                    className="text-green-600 mt-0.5"
                  />

                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      Bharat Fasal Protected Payment
                    </p>

                    <p className="text-xs text-green-700 mt-1">
                      Payment can be held securely until delivery,
                      quantity and quality verification are completed.
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTION */}
              <button
                type="button"
                onClick={() => openRequest(selectedLot)}
                className="
                  w-full
                  h-11
                  rounded-xl
                  bg-green-600
                  text-white
                  font-semibold
                  hover:bg-green-700
                "
              >
                Request to Buy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          REQUEST MODAL
      ================================================== */}
      {showRequestModal && selectedLot && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* HEADER */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Request to Buy
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {selectedLot.crop} • {selectedLot.id}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {!requestSent ? (
              <div className="p-5">

                {/* BUYER */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500">
                    Buyer
                  </p>

                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {buyerName}
                  </p>
                </div>

                {/* LOT SUMMARY */}
                <div className="bg-gray-50 rounded-xl p-4 mb-5">

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Crop
                    </span>

                    <span className="text-sm font-semibold">
                      {selectedLot.crop}
                    </span>
                  </div>

                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">
                      Available quantity
                    </span>

                    <span className="text-sm font-semibold">
                      {selectedLot.quantity} Quintals
                    </span>
                  </div>

                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">
                      Crop price
                    </span>

                    <span className="text-sm font-semibold">
                      {formatCurrency(selectedLot.price)} / quintal
                    </span>
                  </div>

                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">
                      Estimated transport
                    </span>

                    <span className="text-sm font-semibold">
                      {formatCurrency(selectedLot.transportCost)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">

                    <span className="text-sm font-semibold">
                      Estimated landed cost
                    </span>

                    <span className="text-sm font-bold text-green-700">
                      {formatCurrency(
                        getLandedCost(selectedLot)
                      )}
                    </span>
                  </div>

                  <p className="text-right text-xs text-gray-500 mt-1">
                    {formatCurrency(
                      getLandedPricePerQuintal(selectedLot)
                    )}{" "}
                    / quintal
                  </p>
                </div>

                {/* QUANTITY */}
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity you want to purchase
                </label>

                <input
                  type="number"
                  defaultValue={selectedLot.quantity}
                  min="1"
                  max={selectedLot.quantity}
                  className="
                    w-full
                    h-11
                    rounded-xl
                    border
                    border-gray-200
                    px-4
                    outline-none
                    focus:border-green-500
                    focus:ring-2
                    focus:ring-green-100
                  "
                />

                <p className="text-xs text-gray-500 mt-1">
                  Maximum available: {selectedLot.quantity} Quintals
                </p>

                {/* PAYMENT */}
                <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-100">

                  <div className="flex items-start gap-2">

                    <ShieldCheck
                      size={18}
                      className="text-green-600 mt-0.5"
                    />

                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        Bharat Fasal Protected Payment
                      </p>

                      <p className="text-xs text-green-700 mt-1">
                        Payment can be held securely until delivery
                        and verification are completed.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="button"
                  onClick={handleRequest}
                  className="
                    w-full
                    h-11
                    mt-5
                    rounded-xl
                    bg-green-600
                    text-white
                    font-semibold
                    hover:bg-green-700
                  "
                >
                  Send Purchase Request
                </button>

              </div>
            ) : (
              /* =========================
                 REQUEST SUCCESS
              ========================== */
              <div className="p-8 text-center">

                <div className="
                  h-14
                  w-14
                  mx-auto
                  rounded-full
                  bg-green-50
                  flex
                  items-center
                  justify-center
                  text-green-600
                ">
                  <CheckCircle2 size={30} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mt-4">
                  Purchase Request Sent
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Your request for{" "}
                  <span className="font-semibold text-gray-800">
                    {selectedLot.id}
                  </span>{" "}
                  has been recorded.
                </p>

                <div className="mt-4 bg-gray-50 rounded-xl p-4 text-left">

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Crop
                    </span>

                    <span className="font-semibold">
                      {selectedLot.crop}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">
                      Estimated landed cost
                    </span>

                    <span className="font-semibold text-green-700">
                      {formatCurrency(
                        getLandedCost(selectedLot)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">
                      Payment
                    </span>

                    <span className="font-semibold text-green-700">
                      Protected
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  The seller can review the request and respond.
                </p>

                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    mt-6
                    h-10
                    px-6
                    rounded-lg
                    bg-gray-900
                    text-white
                    text-sm
                    font-semibold
                  "
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}