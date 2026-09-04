import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatNumber } from "../utils/formatters";

import {
  Building2,
  CheckCircle2,
  Star,
  MapPin,
  RefreshCw,
  Phone,
  Mail,
  X,
  Send,
  Handshake,
} from "lucide-react";

export default function BuyerCard({ buyer }) {
  const { t } = useTranslation();

  const [modal, setModal] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [negotiation, setNegotiation] = useState({
    quantity: "",
    offerPrice: "",
    message: "",
  });

  const getBuyerIcon = () => {
    switch (buyer.type) {
      case "processor":
        return <Building2 size={22} />;
      case "trader":
        return <Building2 size={22} />;
      case "institutional":
        return <Building2 size={22} />;
      default:
        return <Building2 size={22} />;
    }
  };

  const handleContact = () => {
    setSubmitted(false);
    setModal("contact");
  };

  const handleNegotiate = () => {
    setSubmitted(false);
    setNegotiation({
      quantity: "",
      offerPrice: "",
      message: "",
    });
    setModal("negotiate");
  };

  const handleNegotiationChange = (e) => {
    const { name, value } = e.target;

    setNegotiation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNegotiationSubmit = (e) => {
    e.preventDefault();

    if (
      !negotiation.quantity ||
      !negotiation.offerPrice ||
      !negotiation.message
    ) {
      return;
    }

    console.log("Negotiation offer:", {
      buyer,
      ...negotiation,
    });

    setSubmitted(true);
  };

  const closeModal = () => {
    setModal(null);
    setSubmitted(false);
  };

  return (
    <>
      {/* =====================================================
          BUYER CARD
      ===================================================== */}

      <div className="card">
        <div className="flex items-start gap-3">
          {/* BUYER ICON */}
          <div
            className="
              w-11
              h-11
              rounded-xl
              bg-green-50
              border
              border-green-100
              flex
              items-center
              justify-center
              shrink-0
              text-green-600
            "
          >
            {getBuyerIcon()}
          </div>

          <div className="flex-1 min-w-0">
            {/* BUYER NAME */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900">{buyer.name}</h3>

              {buyer.verified && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    badge
                    badge-green
                    text-xs
                  "
                >
                  <CheckCircle2 size={13} />
                  {t("verified")}
                </span>
              )}
            </div>

            {/* LOCATION */}
            <p className="text-sm text-gray-500 mt-0.5">{buyer.location}</p>

            {/* BUYER STATS */}
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-x-4
                gap-y-2
                mt-2
                text-sm
                text-gray-600
              "
            >
              <span className="inline-flex items-center gap-1.5">
                <Star
                  size={15}
                  className="text-amber-500"
                  fill="currentColor"
                />
                {buyer.rating}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <MapPin size={15} className="text-gray-500" />
                {buyer.distance} {t("km_away")}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <RefreshCw size={14} className="text-gray-500" />
                {formatNumber(buyer.totalTransactions)}
              </span>
            </div>

            {/* COMMODITIES */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {buyer.commodities.map((c) => (
                <span key={c} className="badge badge-blue text-xs">
                  {t(c)}
                </span>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                onClick={handleContact}
                className="btn-primary text-sm py-2 px-4"
              >
                {t("contact_buyer")}
              </button>

              <button
                type="button"
                onClick={handleNegotiate}
                className="btn-secondary text-sm py-2 px-4 inline-flex items-center gap-1.5"
              >
                <Handshake size={15} />
                {t("negotiate")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTACT BUYER MODAL
      ===================================================== */}

      {modal === "contact" && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            px-4
          "
          onClick={closeModal}
        >
          <div
            className="
              w-full
              max-w-md
              bg-white
              rounded-2xl
              shadow-xl
              overflow-hidden
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div
              className="
                flex
                items-center
                justify-between
                px-5
                py-4
                border-b
                border-gray-100
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-green-50
                    flex
                    items-center
                    justify-center
                    text-green-600
                  "
                >
                  <Building2 size={19} />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    {t("contact_buyer")}
                  </h3>

                  <p className="text-xs text-gray-500 mt-0.5">{buyer.name}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="
                  w-8
                  h-8
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  text-gray-500
                  hover:bg-gray-100
                  hover:text-gray-700
                "
              >
                <X size={18} />
              </button>
            </div>

            {/* CONTACT CONTENT */}
            <div className="p-5">
              <div
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-4
                "
              >
                <h4 className="font-semibold text-gray-900">{buyer.name}</h4>

                <p className="text-sm text-gray-500 mt-1">{buyer.location}</p>
              </div>

              <div className="mt-4 space-y-3">
                {/* PHONE */}
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    p-3
                    rounded-xl
                    border
                    border-gray-200
                  "
                >
                  <div
                    className="
                      w-9
                      h-9
                      rounded-lg
                      bg-green-50
                      flex
                      items-center
                      justify-center
                      text-green-600
                    "
                  >
                    <Phone size={17} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Phone</p>

                    <p className="text-sm font-semibold text-gray-800">
                      {buyer.phone || '+91 98765 43210'}
                    </p>
                  </div>
                </div>

                {/* EMAIL */}
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    p-3
                    rounded-xl
                    border
                    border-gray-200
                  "
                >
                  <div
                    className="
                      w-9
                      h-9
                      rounded-lg
                      bg-green-50
                      flex
                      items-center
                      justify-center
                      text-green-600
                    "
                  >
                    <Mail size={17} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Email</p>

                    <p className="text-sm font-semibold text-gray-800 break-all">
                      {buyer.email || 'user@user.com'}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Contact details are shown only when they are available for the
                verified buyer.
              </p>

              <button
                type="button"
                onClick={closeModal}
                className="
                  w-full
                  mt-5
                  py-2.5
                  rounded-lg
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  text-sm
                  font-semibold
                  transition
                "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          NEGOTIATION MODAL
      ===================================================== */}

      {modal === "negotiate" && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            px-4
          "
          onClick={closeModal}
        >
          <div
            className="
              w-full
              max-w-lg
              bg-white
              rounded-2xl
              shadow-xl
              overflow-hidden
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div
              className="
                flex
                items-center
                justify-between
                px-5
                py-4
                border-b
                border-gray-100
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-green-50
                    flex
                    items-center
                    justify-center
                    text-green-600
                  "
                >
                  <Handshake size={19} />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">{t("negotiate")}</h3>

                  <p className="text-xs text-gray-500 mt-0.5">{buyer.name}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="
                  w-8
                  h-8
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  text-gray-500
                  hover:bg-gray-100
                  hover:text-gray-700
                "
              >
                <X size={18} />
              </button>
            </div>

            {/* SUCCESS STATE */}
            {submitted ? (
              <div className="p-8 text-center">
                <div
                  className="
                    w-14
                    h-14
                    rounded-full
                    bg-green-50
                    flex
                    items-center
                    justify-center
                    mx-auto
                  "
                >
                  <CheckCircle2 size={30} className="text-green-600" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mt-4">
                  Offer Sent Successfully
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Your negotiation offer has been sent to {buyer.name}.
                </p>

                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    mt-6
                    px-5
                    py-2.5
                    rounded-lg
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    text-sm
                    font-semibold
                  "
                >
                  Done
                </button>
              </div>
            ) : (
              /* NEGOTIATION FORM */
              <form
                onSubmit={handleNegotiationSubmit}
                className="p-5 space-y-5"
              >
                {/* BUYER INFO */}
                <div
                  className="
                    rounded-xl
                    bg-gray-50
                    border
                    border-gray-200
                    p-4
                  "
                >
                  <p className="text-xs text-gray-500">Negotiating with</p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {buyer.name}
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    {buyer.location}
                  </p>
                </div>

                {/* QUANTITY */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      name="quantity"
                      value={negotiation.quantity}
                      onChange={handleNegotiationChange}
                      min="1"
                      placeholder="e.g. 100"
                      className="
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        px-3
                        py-2.5
                        pr-20
                        text-sm
                        outline-none
                        focus:border-green-500
                        focus:ring-2
                        focus:ring-green-100
                      "
                      required
                    />

                    <span
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-xs
                        text-gray-400
                      "
                    >
                      Quintals
                    </span>
                  </div>
                </div>

                {/* OFFER PRICE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Offer Price
                  </label>

                  <div className="relative">
                    <span
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-sm
                        text-gray-500
                      "
                    >
                      ₹
                    </span>

                    <input
                      type="number"
                      name="offerPrice"
                      value={negotiation.offerPrice}
                      onChange={handleNegotiationChange}
                      min="1"
                      placeholder="e.g. 2400"
                      className="
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        pl-8
                        pr-20
                        py-2.5
                        text-sm
                        outline-none
                        focus:border-green-500
                        focus:ring-2
                        focus:ring-green-100
                      "
                      required
                    />

                    <span
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-xs
                        text-gray-400
                      "
                    >
                      / quintal
                    </span>
                  </div>
                </div>

                {/* MESSAGE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>

                  <textarea
                    name="message"
                    value={negotiation.message}
                    onChange={handleNegotiationChange}
                    rows="4"
                    placeholder="Write your offer or negotiation terms..."
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      px-3
                      py-2.5
                      text-sm
                      resize-none
                      outline-none
                      focus:border-green-500
                      focus:ring-2
                      focus:ring-green-100
                    "
                    required
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="
                      flex-1
                      py-2.5
                      rounded-lg
                      border
                      border-gray-200
                      text-gray-700
                      text-sm
                      font-semibold
                      hover:bg-gray-50
                      transition
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="
                      flex-1
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      py-2.5
                      rounded-lg
                      bg-green-600
                      hover:bg-green-700
                      text-white
                      text-sm
                      font-semibold
                      transition
                    "
                  >
                    <Send size={15} />
                    Send Offer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
