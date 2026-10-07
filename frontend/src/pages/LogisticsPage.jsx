import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  createLogisticsBooking,
  getMyLogisticsBookings,
  getTransportProviders,
  getWarehouses,
} from "../api/logistics.api";
import { formatCurrency } from "../utils/formatters";

const initialBookingState = {
  quantity: 50,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: "",
  pickupLocation: "",
  destination: "",
  distanceKm: "",
};

const getErrorMessage = (error, fallback) =>
  error?.message || fallback;

const formatBookingStatus = (status) =>
  String(status || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

export default function LogisticsPage() {
  const { t } = useTranslation();

  const [tab, setTab] = useState("storage");

  const [warehouses, setWarehouses] = useState([]);
  const [transportProviders, setTransportProviders] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  const [calcQty, setCalcQty] = useState(50);
  const [calcDays, setCalcDays] = useState(30);

  const [selectedWarehouse, setSelectedWarehouse] =
    useState(null);
  const [selectedTransportProvider, setSelectedTransportProvider] =
    useState(null);

  const [booking, setBooking] = useState(
    initialBookingState
  );

  useEffect(() => {
    let active = true;

    const loadLogisticsData = async () => {
      setLoading(true);
      setError("");

      try {
        const [
          warehouseResponse,
          transportResponse,
          bookingResponse,
        ] = await Promise.all([
          getWarehouses({
            page: 1,
            limit: 100,
          }),
          getTransportProviders({
            page: 1,
            limit: 100,
          }),
          getMyLogisticsBookings({
            page: 1,
            limit: 20,
          }),
        ]);

        if (!active) {
          return;
        }

        setWarehouses(
          Array.isArray(warehouseResponse?.warehouses)
            ? warehouseResponse.warehouses
            : []
        );

        setTransportProviders(
          Array.isArray(
            transportResponse?.transportProviders
          )
            ? transportResponse.transportProviders
            : []
        );

        setBookings(
          Array.isArray(bookingResponse?.bookings)
            ? bookingResponse.bookings
            : []
        );
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(
          getErrorMessage(
            loadError,
            "Unable to load logistics services."
          )
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadLogisticsData();

    return () => {
      active = false;
    };
  }, []);

  const storageCostEstimate = useMemo(() => {
    const quantity = Number(calcQty);
    const days = Number(calcDays);

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      !Number.isFinite(days) ||
      days <= 0
    ) {
      return 0;
    }

    if (!selectedWarehouse) {
      return 0;
    }

    return (
      quantity *
      Number(selectedWarehouse.ratePerQuintal || 0) *
      (days / 30)
    );
  }, [calcQty, calcDays, selectedWarehouse]);

  const handleBookingChange = (field, value) => {
    setBooking((previous) => ({
      ...previous,
      [field]: value,
    }));

    setBookingError("");
    setBookingSuccess("");
  };

  const openStorageBooking = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setSelectedTransportProvider(null);

    setBooking({
      ...initialBookingState,
      quantity: Math.min(
        Number(initialBookingState.quantity),
        Number(warehouse.availableCapacity || 0)
      ),
      pickupLocation: warehouse.location || "",
    });

    setBookingError("");
    setBookingSuccess("");
  };

  const openTransportBooking = (provider) => {
    setSelectedTransportProvider(provider);
    setSelectedWarehouse(null);

    setBooking({
      ...initialBookingState,
      quantity: Math.min(
        Number(initialBookingState.quantity),
        Number(provider.vehicleCapacity || 0)
      ),
    });

    setBookingError("");
    setBookingSuccess("");
  };

  const closeBooking = () => {
    if (bookingLoading) {
      return;
    }

    setSelectedWarehouse(null);
    setSelectedTransportProvider(null);
    setBookingError("");
  };

  const handleStorageBooking = async () => {
    if (!selectedWarehouse) {
      return;
    }

    const quantity = Number(booking.quantity);

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      setBookingError(
        "Enter a valid storage quantity."
      );
      return;
    }

    if (
      quantity >
      Number(selectedWarehouse.availableCapacity || 0)
    ) {
      setBookingError(
        "Requested quantity exceeds available warehouse capacity."
      );
      return;
    }

    if (!booking.startDate) {
      setBookingError("Start date is required.");
      return;
    }

    if (
      booking.endDate &&
      new Date(booking.endDate) <
        new Date(booking.startDate)
    ) {
      setBookingError(
        "End date cannot be before the start date."
      );
      return;
    }

    setBookingLoading(true);
    setBookingError("");
    setBookingSuccess("");

    try {
      const response = await createLogisticsBooking({
        type: "storage",
        warehouseId: selectedWarehouse._id,
        quantity,
        pickupLocation:
          booking.pickupLocation ||
          selectedWarehouse.location ||
          "",
        destination: booking.destination || "",
        startDate: booking.startDate,
        endDate: booking.endDate || null,
      });

      const createdBooking = response?.booking;

      if (createdBooking) {
        setBookings((previous) => [
          createdBooking,
          ...previous,
        ]);
      }

      setBookingSuccess(
        "Storage booking created successfully."
      );

      setSelectedWarehouse(null);
    } catch (bookingErrorResponse) {
      setBookingError(
        getErrorMessage(
          bookingErrorResponse,
          "Unable to create storage booking."
        )
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const handleTransportBooking = async () => {
    if (!selectedTransportProvider) {
      return;
    }

    const quantity = Number(booking.quantity);
    const distanceKm = Number(booking.distanceKm);

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      setBookingError(
        "Enter a valid transport quantity."
      );
      return;
    }

    if (
      quantity >
      Number(selectedTransportProvider.vehicleCapacity || 0)
    ) {
      setBookingError(
        "Requested quantity exceeds vehicle capacity."
      );
      return;
    }

    if (
      !Number.isFinite(distanceKm) ||
      distanceKm <= 0
    ) {
      setBookingError(
        "Enter a valid transport distance."
      );
      return;
    }

    if (!booking.startDate) {
      setBookingError("Start date is required.");
      return;
    }

    setBookingLoading(true);
    setBookingError("");
    setBookingSuccess("");

    try {
      const response = await createLogisticsBooking({
        type: "transport",
        transportProviderId:
          selectedTransportProvider._id,
        quantity,
        pickupLocation:
          booking.pickupLocation || "",
        destination:
          booking.destination || "",
        startDate: booking.startDate,
        endDate: booking.endDate || null,
        distanceKm,
      });

      const createdBooking = response?.booking;

      if (createdBooking) {
        setBookings((previous) => [
          createdBooking,
          ...previous,
        ]);
      }

      setBookingSuccess(
        "Transport booking created successfully."
      );

      setSelectedTransportProvider(null);
    } catch (bookingErrorResponse) {
      setBookingError(
        getErrorMessage(
          bookingErrorResponse,
          "Unable to create transport booking."
        )
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">
          🚚 {t("logistics")}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Find storage and transport services and create
          real logistics bookings.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {bookingSuccess && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {bookingSuccess}
        </div>
      )}

      <div className="flex overflow-hidden rounded-xl border-2 border-gray-200">
        <button
          type="button"
          onClick={() => setTab("storage")}
          className={`flex-1 py-3 font-semibold ${
            tab === "storage"
              ? "bg-primary-600 text-white"
              : "bg-white"
          }`}
        >
          🏗️ {t("nearby_warehouses")}
        </button>

        <button
          type="button"
          onClick={() => setTab("transport")}
          className={`flex-1 py-3 font-semibold ${
            tab === "transport"
              ? "bg-primary-600 text-white"
              : "bg-white"
          }`}
        >
          🚛 {t("transport")}
        </button>
      </div>

      {loading ? (
        <div className="card text-center text-gray-500">
          Loading logistics services...
        </div>
      ) : (
        <>
          {tab === "storage" && (
            <>
              <div className="card border-blue-200 bg-blue-50">
                <h3 className="mb-3 font-bold">
                  🧮 {t("storage_calculator")}
                </h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-sm font-semibold">
                      {t("quintals")}
                    </label>

                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={calcQty}
                      onChange={(event) =>
                        setCalcQty(event.target.value)
                      }
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">
                      {t("days")}
                    </label>

                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={calcDays}
                      onChange={(event) =>
                        setCalcDays(event.target.value)
                      }
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">
                      Warehouse rate
                    </label>

                    <select
                      value={selectedWarehouse?._id || ""}
                      onChange={(event) => {
                        const warehouse =
                          warehouses.find(
                            (item) =>
                              item._id ===
                              event.target.value
                          );

                        setSelectedWarehouse(
                          warehouse || null
                        );
                      }}
                      className="input-field"
                    >
                      <option value="">
                        Select warehouse
                      </option>

                      {warehouses.map((warehouse) => (
                        <option
                          key={warehouse._id}
                          value={warehouse._id}
                        >
                          {warehouse.name} - ₹
                          {warehouse.ratePerQuintal}/quintal
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="mt-3 text-lg font-bold text-blue-800">
                  {t("estimated_cost")}:{" "}
                  {selectedWarehouse
                    ? formatCurrency(
                        storageCostEstimate
                      )
                    : "Select a warehouse"}
                </p>
              </div>

              {warehouses.length === 0 ? (
                <div className="card text-center text-gray-500">
                  No warehouses are currently available.
                </div>
              ) : (
                <div className="space-y-3">
                  {warehouses.map((warehouse) => (
                    <div
                      key={warehouse._id}
                      className="card"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">
                              {warehouse.type ===
                              "cold_storage"
                                ? "❄️"
                                : "🏗️"}
                            </span>

                            <div>
                              <h3 className="font-bold">
                                {warehouse.name}
                              </h3>

                              <p className="text-sm text-gray-500">
                                {warehouse.location}
                              </p>

                              <p className="mt-1 text-sm text-gray-500">
                                {warehouse.district},{" "}
                                {warehouse.state}
                              </p>
                            </div>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                            <span>
                              📦{" "}
                              {warehouse.availableCapacity}
                              /
                              {warehouse.capacity}{" "}
                              {t("quintals")}
                            </span>

                            <span>
                              ⭐{" "}
                              {Number(
                                warehouse.rating || 0
                              ).toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-lg font-bold">
                            {formatCurrency(
                              warehouse.ratePerQuintal
                            )}
                          </p>

                          <p className="text-xs text-gray-500">
                            {t("per_quintal")}/month
                          </p>

                          <button
                            type="button"
                            disabled={
                              warehouse.availableCapacity <=
                              0
                            }
                            onClick={() =>
                              openStorageBooking(
                                warehouse
                              )
                            }
                            className="btn-primary mt-2 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {t("book_now")}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === "transport" && (
            <div className="space-y-3">
              {transportProviders.length === 0 ? (
                <div className="card text-center text-gray-500">
                  No transport providers are currently
                  available.
                </div>
              ) : (
                transportProviders.map((provider) => (
                  <div
                    key={provider._id}
                    className={`card ${
                      !provider.available
                        ? "opacity-60"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">
                            🚛
                          </span>

                          <div>
                            <h3 className="font-bold">
                              {provider.providerName}
                            </h3>

                            <p className="text-sm text-gray-500">
                              {provider.vehicleType}
                            </p>

                            <p className="text-sm text-gray-500">
                              🧑 {provider.driverName}
                            </p>
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>
                            📦 Capacity:{" "}
                            {provider.vehicleCapacity}{" "}
                            {t("quintals")}
                          </span>

                          <span>
                            ⭐{" "}
                            {Number(
                              provider.rating || 0
                            ).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-lg font-bold">
                          {formatCurrency(
                            provider.pricePerKm
                          )}
                          /km
                        </p>

                        <span
                          className={`badge ${
                            provider.available
                              ? "badge-green"
                              : "badge-red"
                          } mt-1`}
                        >
                          {provider.available
                            ? "Available"
                            : "Busy"}
                        </span>

                        {provider.available && (
                          <button
                            type="button"
                            onClick={() =>
                              openTransportBooking(
                                provider
                              )
                            }
                            className="btn-primary mt-2 block px-3 py-1.5 text-sm"
                          >
                            {t("book_now")}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {bookings.length > 0 && (
        <section className="space-y-3">
          <div>
            <h3 className="text-lg font-bold">
              My Logistics Bookings
            </h3>

            <p className="text-sm text-gray-500">
              Your latest storage and transport bookings.
            </p>
          </div>

          {bookings.map((item) => (
            <div
              key={item._id}
              className="card"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-bold">
                    {item.bookingNumber}
                  </p>

                  <p className="text-sm text-gray-500">
                    {item.type === "storage"
                      ? item.warehouseId?.name ||
                        "Storage booking"
                      : item.transportProviderId
                          ?.providerName ||
                        "Transport booking"}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Quantity: {item.quantity} quintals
                  </p>

                  <p className="text-sm text-gray-600">
                    {item.type === "transport"
                      ? `Distance: ${item.distanceKm || 0} km`
                      : `Start: ${new Date(
                          item.startDate
                        ).toLocaleDateString()}`}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="font-bold">
                    {formatCurrency(
                      item.estimatedAmount
                    )}
                  </p>

                  <span className="badge badge-green mt-1">
                    {formatBookingStatus(
                      item.status
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {(selectedWarehouse ||
        selectedTransportProvider) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">
                  {selectedWarehouse
                    ? "Book Storage"
                    : "Book Transport"}
                </h3>

                <p className="text-sm text-gray-500">
                  {selectedWarehouse
                    ? selectedWarehouse.name
                    : selectedTransportProvider?.providerName}
                </p>
              </div>

              <button
                type="button"
                onClick={closeBooking}
                disabled={bookingLoading}
                className="text-xl text-gray-500"
              >
                ×
              </button>
            </div>

            {bookingError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {bookingError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold">
                  Quantity (quintals)
                </label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={
                    selectedWarehouse
                      ? selectedWarehouse.availableCapacity
                      : selectedTransportProvider?.vehicleCapacity
                  }
                  value={booking.quantity}
                  onChange={(event) =>
                    handleBookingChange(
                      "quantity",
                      event.target.value
                    )
                  }
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  Pickup location
                </label>

                <input
                  type="text"
                  value={booking.pickupLocation}
                  onChange={(event) =>
                    handleBookingChange(
                      "pickupLocation",
                      event.target.value
                    )
                  }
                  className="input-field"
                  placeholder="Pickup location"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  Destination
                </label>

                <input
                  type="text"
                  value={booking.destination}
                  onChange={(event) =>
                    handleBookingChange(
                      "destination",
                      event.target.value
                    )
                  }
                  className="input-field"
                  placeholder="Destination"
                />
              </div>

              {selectedTransportProvider && (
                <div>
                  <label className="text-sm font-semibold">
                    Distance (km)
                  </label>

                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={booking.distanceKm}
                    onChange={(event) =>
                      handleBookingChange(
                        "distanceKm",
                        event.target.value
                      )
                    }
                    className="input-field"
                    placeholder="Enter distance"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold">
                    Start date
                  </label>

                  <input
                    type="date"
                    value={booking.startDate}
                    onChange={(event) =>
                      handleBookingChange(
                        "startDate",
                        event.target.value
                      )
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    End date
                  </label>

                  <input
                    type="date"
                    value={booking.endDate}
                    min={booking.startDate}
                    onChange={(event) =>
                      handleBookingChange(
                        "endDate",
                        event.target.value
                      )
                    }
                    className="input-field"
                  />
                </div>
              </div>

              {selectedWarehouse && (
                <div className="rounded-lg bg-gray-50 p-3 text-sm">
                  <div className="flex justify-between">
                    <span>Rate</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        selectedWarehouse.ratePerQuintal
                      )}
                      /quintal/month
                    </span>
                  </div>
                </div>
              )}

              {selectedTransportProvider && (
                <div className="rounded-lg bg-gray-50 p-3 text-sm">
                  <div className="flex justify-between">
                    <span>Rate</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        selectedTransportProvider.pricePerKm
                      )}
                      /km
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeBooking}
                  disabled={bookingLoading}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={bookingLoading}
                  onClick={
                    selectedWarehouse
                      ? handleStorageBooking
                      : handleTransportBooking
                  }
                  className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {bookingLoading
                    ? "Booking..."
                    : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}