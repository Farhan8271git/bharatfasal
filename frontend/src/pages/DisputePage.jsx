import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  createDispute,
  getMyDisputes,
} from "../api/disputes.api";

import {
  getBuyerOrders,
  getSellerOrders,
} from "../api/orders.api";

import {
  formatDate,
  getStatusColor,
} from "../utils/formatters";

const disputeTypes = [
  {
    value: "payment_issue",
    label: "Payment Issue",
  },
  {
    value: "quality_dispute",
    label: "Quality Dispute",
  },
  {
    value: "delivery_issue",
    label: "Delivery Issue",
  },
  {
    value: "other_issue",
    label: "Other Issue",
  },
];

const getErrorMessage = (
  error,
  fallback
) => error?.message || fallback;

const formatStatus = (status) =>
  String(status || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );

export default function DisputePage({
  user,
}) {
  const { t } = useTranslation();

  const [disputes, setDisputes] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [form, setForm] = useState({
    orderId: "",
    type: "payment_issue",
    description: "",
  });

  useEffect(() => {
    let active = true;

    const loadDisputeData = async () => {
      setLoading(true);
      setError("");

      try {
        const disputeResponse =
          await getMyDisputes({
            page: 1,
            limit: 100,
          });

        const orderResponse =
          user?.role === "buyer"
            ? await getBuyerOrders({
                page: 1,
                limit: 100,
              })
            : await getSellerOrders({
                page: 1,
                limit: 100,
              });

        if (!active) {
          return;
        }

        setDisputes(
          Array.isArray(
            disputeResponse?.disputes
          )
            ? disputeResponse.disputes
            : []
        );

        setOrders(
          Array.isArray(orderResponse?.orders)
            ? orderResponse.orders
            : []
        );
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(
          getErrorMessage(
            loadError,
            "Unable to load disputes."
          )
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDisputeData();

    return () => {
      active = false;
    };
  }, [user?.role]);

  const handleFormChange = (
    field,
    value
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setFormError("");
    setSuccessMessage("");
  };

  const handleSubmit = async () => {
    if (!form.orderId) {
      setFormError(
        "Select an order for this dispute."
      );
      return;
    }

    if (!form.description.trim()) {
      setFormError(
        "Enter a description for the dispute."
      );
      return;
    }

    if (form.description.trim().length < 10) {
      setFormError(
        "Description must contain at least 10 characters."
      );
      return;
    }

    setFormLoading(true);
    setFormError("");
    setSuccessMessage("");

    try {
      const response =
        await createDispute({
          orderId: form.orderId,
          type: form.type,
          description: form.description,
        });

      if (response?.dispute) {
        setDisputes((previous) => [
          response.dispute,
          ...previous,
        ]);
      }

      setForm({
        orderId: "",
        type: "payment_issue",
        description: "",
      });

      setShowForm(false);

      setSuccessMessage(
        "Dispute filed successfully."
      );
    } catch (submitError) {
      setFormError(
        getErrorMessage(
          submitError,
          "Unable to file dispute."
        )
      );
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">
          📝 {t("disputes")}
        </h2>

        <button
          type="button"
          onClick={() =>
            setShowForm((previous) => !previous)
          }
          className="btn-primary px-3 py-2 text-sm"
        >
          ➕ {t("file_dispute")}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {showForm && (
        <div className="card border-red-200 bg-red-50/30">
          <h3 className="mb-4 font-bold">
            📝 {t("file_dispute")}
          </h3>

          {formError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Order
              </label>

              <select
                value={form.orderId}
                onChange={(event) =>
                  handleFormChange(
                    "orderId",
                    event.target.value
                  )
                }
                className="input-field"
              >
                <option value="">
                  Select an order
                </option>

                {orders.map((order) => (
                  <option
                    key={order._id}
                    value={order._id}
                  >
                    {order.orderNumber} ·{" "}
                    {order.lotId?.commodity ||
                      "Order"}{" "}
                    · ₹
                    {Number(
                      order.totalAmount || 0
                    ).toLocaleString("en-IN")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                {t("dispute_type")}
              </label>

              <select
                value={form.type}
                onChange={(event) =>
                  handleFormChange(
                    "type",
                    event.target.value
                  )
                }
                className="input-field"
              >
                {disputeTypes.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                {t("description")}
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  handleFormChange(
                    "description",
                    event.target.value
                  )
                }
                className="input-field"
                rows={5}
                maxLength={2000}
                placeholder="Describe the issue clearly."
              />

              <p className="mt-1 text-xs text-gray-500">
                {form.description.length}/2000
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-600">
              Photo/document attachments are not enabled
              yet. The dispute itself will be stored
              against the selected order.
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={formLoading}
                onClick={handleSubmit}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {formLoading
                  ? "Submitting..."
                  : `📤 ${t("submit")}`}
              </button>

              <button
                type="button"
                disabled={formLoading}
                onClick={() =>
                  setShowForm(false)
                }
                className="btn-secondary flex-1"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="card text-center text-gray-500">
          Loading disputes...
        </div>
      ) : disputes.length === 0 ? (
        <div className="card text-center text-gray-500">
          No disputes have been filed.
        </div>
      ) : (
        <div className="space-y-3">
          {disputes.map((dispute) => (
            <div
              key={dispute._id}
              className="card"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">
                      {dispute.disputeNumber}
                    </h3>

                    <span
                      className={`badge ${getStatusColor(
                        dispute.status
                      )}`}
                    >
                      {formatStatus(
                        dispute.status
                      )}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-600">
                    {dispute.orderId?.orderNumber ||
                      "Order"}
                    {" · "}
                    {dispute.type
                      ?.replace(/_/g, " ")}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {dispute.description}
                  </p>
                </div>

                <span className="text-xs text-gray-400">
                  {formatDate(
                    dispute.filedAt ||
                      dispute.createdAt
                  )}
                </span>
              </div>

              {dispute.orderId && (
                <div className="mb-3 rounded-lg bg-gray-50 p-3 text-sm">
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-gray-600">
                    <span>
                      Commodity:{" "}
                      {dispute.orderId.lotId
                        ?.commodity ||
                        "Unavailable"}
                    </span>

                    <span>
                      Quantity:{" "}
                      {dispute.orderId.quantity ||
                        0}{" "}
                      {dispute.orderId.unit ||
                        "quintal"}
                    </span>

                    <span>
                      Amount: ₹
                      {Number(
                        dispute.orderId
                          .totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              )}

              {Array.isArray(
                dispute.updates
              ) &&
                dispute.updates.length > 0 && (
                  <div className="border-t pt-3">
                    <div className="space-y-2">
                      {dispute.updates.map(
                        (update) => (
                          <div
                            key={update._id}
                            className="flex items-start gap-3"
                          >
                            <div
                              className={`mt-1.5 h-3 w-3 flex-shrink-0 rounded-full ${
                                update.status ===
                                "resolved"
                                  ? "bg-green-500"
                                  : update.status ===
                                    "under_review"
                                  ? "bg-yellow-500"
                                  : update.status ===
                                    "rejected"
                                  ? "bg-gray-500"
                                  : "bg-red-500"
                              }`}
                            />

                            <div>
                              <p className="text-sm">
                                {update.message}
                              </p>

                              <p className="text-xs text-gray-400">
                                {formatDate(
                                  update.createdAt
                                )}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      <div className="card border-blue-200 bg-blue-50">
        <h3 className="mb-2 font-bold text-blue-800">
          📞 {t("helpline")}
        </h3>

        <div className="space-y-2 text-sm">
          <p>
            📱 Toll Free: 1800-180-0000 /
            1800-180-0001
          </p>

          <p>
            💬 WhatsApp: +91 0000000000
          </p>

          <p>
            📧 Email:
            support@bharatfasal.demo
          </p>
        </div>
      </div>
    </div>
  );
}