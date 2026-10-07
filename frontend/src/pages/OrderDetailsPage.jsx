import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Package,
  Truck,
  User,
  CreditCard,
  ClipboardList,
} from "lucide-react";

import { getOrderById } from "../api/orders.api";

const formatCurrency = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "₹0";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatStatus = (value) => {
  if (!value) {
    return "Not available";
  }

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const getStatusClassName = (value) => {
  const status = String(value || "").toLowerCase();

  if (["completed", "delivered", "paid"].includes(status)) {
    return "bg-green-100 text-green-700";
  }

  if (
    ["confirmed", "processing", "ready_for_pickup", "in_transit"].includes(
      status
    )
  ) {
    return "bg-blue-100 text-blue-700";
  }

  if (["cancelled", "failed", "disputed"].includes(status)) {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
};

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 rounded-lg bg-gray-100 p-2">
      <Icon className="h-4 w-4 text-gray-600" />
    </div>

    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-gray-900">
        {value || "Not available"}
      </p>
    </div>
  </div>
);

function OrderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadOrder = async () => {
      if (!id) {
        setError("Order ID is required.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getOrderById(id);

        if (!response?.success || !response?.order) {
          throw new Error(
            response?.message || "Unable to retrieve order details."
          );
        }

        if (isMounted) {
          setOrder(response.order);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError?.message || "Unable to retrieve order details."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-800">
            Unable to load order
          </h1>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const lot = order.lotId || {};
  const buyer = order.buyerId || {};
  const seller = order.sellerId || {};

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Order</p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {order.orderNumber || order._id}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Placed on {formatDate(order.placedAt || order.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassName(
              order.status
            )}`}
          >
            {formatStatus(order.status)}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassName(
              order.paymentStatus
            )}`}
          >
            Payment: {formatStatus(order.paymentStatus)}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassName(
              order.fulfillmentStatus
            )}`}
          >
            Fulfillment: {formatStatus(order.fulfillmentStatus)}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <Package className="h-5 w-5 text-green-700" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Order Details
                </h2>
                <p className="text-sm text-gray-500">
                  Product and transaction information
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <DetailItem
                icon={Package}
                label="Commodity"
                value={lot.commodity}
              />

              <DetailItem
                icon={ClipboardList}
                label="Grade"
                value={lot.grade}
              />

              <DetailItem
                icon={Package}
                label="Quantity"
                value={
                  order.quantity
                    ? `${order.quantity} ${order.unit || ""}`.trim()
                    : "Not available"
                }
              />

              <DetailItem
                icon={CreditCard}
                label="Price Per Unit"
                value={formatCurrency(order.pricePerUnit)}
              />

              <DetailItem
                icon={CreditCard}
                label="Total Amount"
                value={formatCurrency(order.totalAmount)}
              />

              <DetailItem
                icon={Truck}
                label="Transportation"
                value={formatStatus(order.transportation)}
              />
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <MapPin className="h-5 w-5 text-blue-700" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Fulfillment Information
                </h2>
                <p className="text-sm text-gray-500">
                  Current pickup and delivery information
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <DetailItem
                icon={MapPin}
                label="Pickup Location"
                value={order.pickupLocation || lot.pickupLocation}
              />

              <DetailItem
                icon={MapPin}
                label="Delivery Location"
                value={order.deliveryLocation}
              />

              <DetailItem
                icon={Calendar}
                label="Placed At"
                value={formatDate(order.placedAt || order.createdAt)}
              />

              <DetailItem
                icon={Calendar}
                label="Confirmed At"
                value={formatDate(order.confirmedAt)}
              />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <User className="h-5 w-5 text-purple-700" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">Buyer</h2>
                <p className="text-sm text-gray-500">
                  Order counterparty
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <DetailItem
                icon={User}
                label="Name"
                value={buyer.name}
              />

              <DetailItem
                icon={User}
                label="Business Type"
                value={buyer.businessType}
              />

              <DetailItem
                icon={MapPin}
                label="Location"
                value={
                  [buyer.district, buyer.state].filter(Boolean).join(", ") ||
                  "Not available"
                }
              />

              <DetailItem
                icon={User}
                label="Email"
                value={buyer.email}
              />
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-orange-100 p-2">
                <User className="h-5 w-5 text-orange-700" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">Seller</h2>
                <p className="text-sm text-gray-500">
                  Order seller
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <DetailItem
                icon={User}
                label="Name"
                value={seller.name}
              />

              <DetailItem
                icon={MapPin}
                label="Location"
                value={
                  [seller.village, seller.district, seller.state]
                    .filter(Boolean)
                    .join(", ") || "Not available"
                }
              />

              <DetailItem
                icon={User}
                label="Email"
                value={seller.email}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;