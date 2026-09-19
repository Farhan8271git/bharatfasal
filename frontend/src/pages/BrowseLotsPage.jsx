import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";

import { getLots } from "../api/lots.api";
import { createPurchaseRequest } from "../api/purchaseRequests.api";

const formatCurrency = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "₹0";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date);
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getCropName = (commodity) => {
  if (!commodity) {
    return "Crop";
  }

  return String(commodity)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const getGradeLabel = (grade) => {
  if (!grade) {
    return "—";
  }

  const value = String(grade).trim();

  if (value.toLowerCase().startsWith("grade")) {
    return value;
  }

  return `Grade ${value}`;
};

const getTransportationLabel = (transportation) => {
  switch (transportation) {
    case "seller":
      return "Seller will arrange";

    case "buyer":
      return "Buyer will arrange";

    case "platform":
      return "Platform will arrange";

    default:
      return "Not specified";
  }
};

const getSellerName = (seller) => {
  if (!seller) {
    return "Verified Seller";
  }

  return seller.organizationName || seller.name || "Verified Seller";
};

const getSellerType = (seller) => {
  if (!seller) {
    return "Seller";
  }

  if (seller.organizationName) {
    return "FPO";
  }

  return seller.role === "fpo" ? "FPO" : "Farmer";
};

const getSellerRating = () => {
  return null;
};

const normalizeLot = (lot) => {
  const totalQuantity = Number(lot.quantity) || 0;
  const reservedQuantity = Number(lot.reservedQuantity) || 0;
  const availableQuantity = Math.max(
    0,
    totalQuantity - reservedQuantity
  );
  const price = Number(lot.expectedPrice) || 0;

  return {
    id: lot._id,
    crop: getCropName(lot.commodity),
    variety: "",
    quantity: availableQuantity,
    grade: getGradeLabel(lot.grade),
    price,
    location: lot.pickupLocation || "Location not specified",
    seller: getSellerName(lot.sellerId),
    sellerType: getSellerType(lot.sellerId),
    rating: getSellerRating(lot.sellerId),
    availableDate: formatDate(lot.availableDate),
    transport: getTransportationLabel(lot.transportation),
    transportCost: null,
    description: "",
  };
};

export default function BrowseLotsPage({ user }) {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [crop, setCrop] = useState("All Crops");
  const [grade, setGrade] = useState("All Grades");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [selectedLot, setSelectedLot] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestQuantity, setRequestQuantity] = useState("");
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [purchaseRequest, setPurchaseRequest] = useState(null);

  const buyerName =
    user?.companyName ||
    user?.businessName ||
    user?.name ||
    "Buyer";

  useEffect(() => {
    let isMounted = true;

    const loadLots = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getLots({
          status: "listed",
          page: 1,
          limit: 100,
        });

        if (!response?.success) {
          throw new Error(
            response?.message || "Unable to load available lots."
          );
        }

        if (isMounted) {
          setLots((response.lots || []).map(normalizeLot));
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError?.message ||
              "Unable to load available lots."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadLots();

    return () => {
      isMounted = false;
    };
  }, []);

  const cropOptions = useMemo(() => {
    const uniqueCrops = Array.from(
      new Set(lots.map((lot) => lot.crop).filter(Boolean))
    ).sort((first, second) =>
      first.localeCompare(second)
    );

    return ["All Crops", ...uniqueCrops];
  }, [lots]);

  const gradeOptions = useMemo(() => {
    const uniqueGrades = Array.from(
      new Set(lots.map((lot) => lot.grade).filter(Boolean))
    ).sort((first, second) =>
      first.localeCompare(second)
    );

    return ["All Grades", ...uniqueGrades];
  }, [lots]);

  const getProduceCost = (lot) => {
    return lot.quantity * lot.price;
  };

  const getLandedCost = (lot) => {
    return getProduceCost(lot) + lot.transportCost;
  };

  const getLandedPricePerQuintal = (lot) => {
    const landedCost = getLandedCost(lot);

    if (!lot.quantity || landedCost === null) {
      return null;
    }

    return landedCost / lot.quantity;
  };

  const filteredLots = useMemo(() => {
    const searchText = search.toLowerCase().trim();
    const locationText = location.toLowerCase().trim();
    const priceLimit = Number(maxPrice);

    return lots.filter((lot) => {
      const matchesSearch =
        !searchText ||
        lot.crop.toLowerCase().includes(searchText) ||
        lot.variety.toLowerCase().includes(searchText) ||
        lot.location.toLowerCase().includes(searchText) ||
        lot.seller.toLowerCase().includes(searchText) ||
        String(lot.id).toLowerCase().includes(searchText);

      const matchesCrop =
        crop === "All Crops" || lot.crop === crop;

      const matchesGrade =
        grade === "All Grades" || lot.grade === grade;

      const matchesLocation =
        !locationText ||
        lot.location.toLowerCase().includes(locationText);

      const matchesPrice =
        !maxPrice ||
        (Number.isFinite(priceLimit) &&
          lot.price <= priceLimit);

      return (
        matchesSearch &&
        matchesCrop &&
        matchesGrade &&
        matchesLocation &&
        matchesPrice
      );
    });
  }, [
    lots,
    search,
    crop,
    grade,
    location,
    maxPrice,
  ]);

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
    setRequestQuantity(String(lot.quantity));
    setRequestError("");
    setPurchaseRequest(null);
  };

  const openRequest = (lot) => {
    setSelectedLot(lot);
    setShowRequestModal(true);
    setRequestSent(false);
    setRequestQuantity(String(lot.quantity));
    setRequestError("");
    setPurchaseRequest(null);
  };

  const closeModal = () => {
    if (requestSubmitting) {
      return;
    }

    setSelectedLot(null);
    setShowRequestModal(false);
    setRequestSent(false);
    setRequestQuantity("");
    setRequestError("");
    setPurchaseRequest(null);
  };

  const handleRequest = async () => {
    const quantity = Number(requestQuantity);

    if (!selectedLot) {
      return;
    }

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      quantity > selectedLot.quantity
    ) {
      setRequestError(
        `Quantity must be greater than 0 and cannot exceed ${selectedLot.quantity} quintals.`
      );
      return;
    }

    try {
      setRequestSubmitting(true);
      setRequestError("");

      const response = await createPurchaseRequest({
        lotId: selectedLot.id,
        quantity,
      });

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to create the purchase request."
        );
      }

      setPurchaseRequest(response.purchaseRequest || null);
      setRequestSent(true);
    } catch (error) {
      setRequestError(
        error?.message ||
          "Unable to send the purchase request. Please try again."
      );
    } finally {
      setRequestSubmitting(false);
    }
  };

  const requestedProduceCost = selectedLot
    ? Number(requestQuantity || 0) * selectedLot.price
    : 0;

  const requestedLandedCost =
    selectedLot && selectedLot.transportCost !== null
      ? requestedProduceCost + selectedLot.transportCost
      : null;

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-10">
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

      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
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
            onClick={() =>
              setShowFilters((previous) => !previous)
            }
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

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Crop
              </label>

              <select
                value={crop}
                onChange={(event) => setCrop(event.target.value)}
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

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Quality / Grade
              </label>

              <select
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
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

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
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

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Maximum Price / Quintal
              </label>

              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(event.target.value)
                }
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

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <Package
            size={36}
            className="mx-auto text-gray-300 mb-3"
          />

          <h3 className="font-semibold text-gray-900">
            Loading available lots...
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Fetching current marketplace listings.
          </p>
        </div>
      ) : error ? (
        <div className="bg-white border border-red-200 rounded-2xl p-10 text-center">
          <X
            size={36}
            className="mx-auto text-red-400 mb-3"
          />

          <h3 className="font-semibold text-red-700">
            Unable to load lots
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="
              mt-4
              h-10
              px-5
              rounded-lg
              bg-gray-900
              text-white
              text-sm
              font-semibold
              hover:bg-gray-800
            "
          >
            Retry
          </button>
        </div>
      ) : (
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
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex gap-4">
                      <div
                        className="
                          h-12
                          w-12
                          shrink-0
                          rounded-xl
                          bg-green-50
                          flex
                          items-center
                          justify-center
                          text-green-700
                        "
                      >
                        <Package size={23} />
                      </div>

                      <div>
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

                        <p className="text-xs text-gray-500 mt-1">
                          {lot.id}
                          {lot.variety
                            ? ` • ${lot.variety}`
                            : ""}
                        </p>

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

                    <div className="lg:text-right shrink-0">
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(lot.price)}
                      </p>

                      <p className="text-xs text-gray-500">
                        crop price / quintal
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 my-4" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500 mb-1">
                        Transportation
                      </p>

                      <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                        <Truck
                          size={16}
                          className="text-gray-500"
                        />
                        {lot.transport}
                      </p>

                      <p className="text-sm font-bold text-gray-900 mt-1">
                        {lot.transportCost > 0
                          ? `Estimated: ${formatCurrency(
                              lot.transportCost
                            )}`
                          : "Cost calculated during procurement"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-green-50 border border-green-100 p-4">
                      <p className="text-xs text-green-700 mb-1">
                        Estimated Landed Cost
                      </p>

                      <p className="text-lg font-bold text-gray-900">
                        {landedCost === null
                          ? "Not calculated"
                          : formatCurrency(landedCost)}
                      </p>

                      <p className="text-xs text-green-700 mt-1">
                        {landedPerQuintal === null
                          ? "Transportation cost pending"
                          : `${formatCurrency(
                              landedPerQuintal
                            )} / quintal`}
                      </p>
                    </div>
                  </div>

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
                          className="text-amber-500"
                        />

                        {lot.rating
                          ? `${lot.rating} rating • `
                          : ""}
                        {lot.sellerType}
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
      )}

      {selectedLot && !showRequestModal && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
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

            <div className="p-5 space-y-5">
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

              <div>
                <p className="text-xs text-gray-500">
                  Seller
                </p>

                <p className="font-semibold text-gray-900 mt-1">
                  {selectedLot.seller}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedLot.sellerType}
                  {selectedLot.rating
                    ? ` • ${selectedLot.rating} rating`
                    : ""}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Pickup Location
                </p>

                <p className="text-sm font-medium text-gray-800 mt-1 flex items-center gap-2">
                  <MapPin size={16} />
                  {selectedLot.location}
                </p>
              </div>

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
                    {selectedLot.transportCost > 0
                      ? formatCurrency(
                          selectedLot.transportCost
                        )
                      : "Calculated during procurement"}
                  </p>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Estimated transportation cost for this lot
                </p>
              </div>

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
                      {selectedLot.transportCost > 0
                        ? formatCurrency(
                            selectedLot.transportCost
                          )
                        : "Calculated during procurement"}
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

              <div>
                <p className="text-xs text-gray-500">
                  Description
                </p>

                {selectedLot.description ? (
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedLot.description}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    No description provided by the seller.
                  </p>
                )}
              </div>

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

      {showRequestModal && selectedLot && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
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
                <div className="mb-4">
                  <p className="text-xs text-gray-500">
                    Buyer
                  </p>

                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {buyerName}
                  </p>
                </div>

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
                      Transportation
                    </span>

                    <span className="text-sm font-semibold">
                      {selectedLot.transport}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                    <span className="text-sm font-semibold">
                      Estimated purchase cost
                    </span>

                    <span className="text-sm font-bold text-green-700">
                      {requestedLandedCost === null
                        ? "Produce cost only"
                        : formatCurrency(requestedLandedCost)}
                    </span>
                  </div>

                  <p className="text-right text-xs text-gray-500 mt-1">
                    Transportation cost is calculated during procurement.
                  </p>
                </div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity you want to purchase
                </label>

                <input
                  type="number"
                  value={requestQuantity}
                  onChange={(event) =>
                    setRequestQuantity(event.target.value)
                  }
                  min="0.01"
                  max={selectedLot.quantity}
                  step="0.01"
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

                {requestError && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
                    <p className="text-sm font-medium text-red-700">
                      {requestError}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleRequest}
                  disabled={
                    requestSubmitting ||
                    !requestQuantity ||
                    !Number.isFinite(Number(requestQuantity)) ||
                    Number(requestQuantity) <= 0 ||
                    Number(requestQuantity) > selectedLot.quantity
                  }
                  className="
                    w-full
                    h-11
                    mt-5
                    rounded-xl
                    bg-green-600
                    text-white
                    font-semibold
                    hover:bg-green-700
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {requestSubmitting
                    ? "Sending Request..."
                    : "Send Purchase Request"}
                </button>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div
                  className="
                    h-14
                    w-14
                    mx-auto
                    rounded-full
                    bg-green-50
                    flex
                    items-center
                    justify-center
                    text-green-600
                  "
                >
                  <CheckCircle2 size={30} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mt-4">
                  Purchase Request Ready
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Your purchase request has been submitted successfully for{" "}
                  <span className="font-semibold text-gray-800">
                    {selectedLot.id}
                  </span>
                  .
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
                      Requested quantity
                    </span>

                    <span className="font-semibold">
                      {requestQuantity} Quintals
                    </span>
                  </div>

                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">
                      Estimated cost
                    </span>

                    <span className="font-semibold text-green-700">
                      {requestedLandedCost === null
                        ? formatCurrency(requestedProduceCost)
                        : formatCurrency(requestedLandedCost)}
                    </span>
                  </div>

                  {purchaseRequest?._id && (
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500">
                        Request ID
                      </span>

                      <span className="font-semibold text-gray-900">
                        {purchaseRequest._id}
                      </span>
                    </div>
                  )}

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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}