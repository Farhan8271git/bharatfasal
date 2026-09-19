import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  MapPin,
  CalendarDays,
  IndianRupee,
  Truck,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { createLot } from "../api/lots.api";

const initialForm = {
  crop: "",
  quantity: "",
  grade: "",
  expectedPrice: "",
  pickupLocation: "",
  availableDate: "",
  transportation: "",
};

const cropOptions = [
  { id: "wheat", name: "Wheat" },
  { id: "rice", name: "Rice" },
  { id: "maize", name: "Maize" },
  { id: "soybean", name: "Soybean" },
  { id: "chickpea", name: "Chickpea" },
  { id: "onion", name: "Onion" },
  { id: "tomato", name: "Tomato" },
  { id: "cotton", name: "Cotton" },
  { id: "turmeric", name: "Turmeric" },
];

export default function CreateLotPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (submitError) {
      setSubmitError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.crop) {
      newErrors.crop = "Please select a crop.";
    }

    if (!formData.quantity) {
      newErrors.quantity = "Please enter available quantity.";
    } else if (
      !Number.isFinite(Number(formData.quantity)) ||
      Number(formData.quantity) <= 0
    ) {
      newErrors.quantity = "Quantity must be greater than 0.";
    }

    if (!formData.grade) {
      newErrors.grade = "Please select the quality grade.";
    }

    if (!formData.expectedPrice) {
      newErrors.expectedPrice = "Please enter expected price.";
    } else if (
      !Number.isFinite(Number(formData.expectedPrice)) ||
      Number(formData.expectedPrice) <= 0
    ) {
      newErrors.expectedPrice = "Price must be greater than 0.";
    }

    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = "Please enter pickup location.";
    }

    if (!formData.availableDate) {
      newErrors.availableDate = "Please select available date.";
    }

    if (!formData.transportation) {
      newErrors.transportation =
        "Please select transportation responsibility.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        commodity: formData.crop,
        quantity: Number(formData.quantity),
        unit: "quintal",
        grade: formData.grade,
        expectedPrice: Number(formData.expectedPrice),
        pickupLocation: formData.pickupLocation.trim(),
        availableDate: formData.availableDate,
        transportation: formData.transportation,
      };

      const response = await createLot(payload);

      if (!response?.success || !response?.lot) {
        throw new Error(
          response?.message || "Unable to create the lot."
        );
      }

      setSubmitted(true);

      window.setTimeout(() => {
        navigate("/lots");
      }, 900);
    } catch (error) {
      setSubmitError(
        error?.message || "Unable to create the lot. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2
              size={32}
              className="text-green-600"
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Lot Created Successfully
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your crop lot has been listed successfully.
          </p>

          <p className="mt-4 text-sm font-semibold text-green-700">
            Redirecting to My Lots...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-5">
        <button
          type="button"
          onClick={() => navigate("/lots")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft size={16} />
          Back to My Lots
        </button>

        <div className="bg-white border border-gray-200 rounded-xl px-5 sm:px-7 py-5">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
              <Package
                size={21}
                className="text-green-600"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Lot
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                List your produce for verified buyers on Bharat Fasal.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl overflow-hidden"
      >
        <section className="p-5 sm:p-7">
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-900">
              Produce Details
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Tell buyers what produce you have available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Crop
                <span className="text-red-500 ml-1">*</span>
              </label>

              <select
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                className={`
                  w-full rounded-lg border bg-white px-3 py-2.5
                  text-sm outline-none focus:border-green-500
                  focus:ring-2 focus:ring-green-100
                  ${
                    errors.crop
                      ? "border-red-300"
                      : "border-gray-300"
                  }
                `}
              >
                <option value="">Select crop</option>

                {cropOptions.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name}
                  </option>
                ))}
              </select>

              {errors.crop && (
                <p className="text-xs text-red-500 mt-1.5">
                  {errors.crop}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Available Quantity
                <span className="text-red-500 ml-1">*</span>
              </label>

              <div className="relative">
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  placeholder="e.g. 100"
                  className={`
                    w-full rounded-lg border bg-white px-3 py-2.5
                    pr-20 text-sm outline-none focus:border-green-500
                    focus:ring-2 focus:ring-green-100
                    ${
                      errors.quantity
                        ? "border-red-300"
                        : "border-gray-300"
                    }
                  `}
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  Quintals
                </span>
              </div>

              {errors.quantity && (
                <p className="text-xs text-red-500 mt-1.5">
                  {errors.quantity}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quality Grade
                <span className="text-red-500 ml-1">*</span>
              </label>

              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className={`
                  w-full rounded-lg border bg-white px-3 py-2.5
                  text-sm outline-none focus:border-green-500
                  focus:ring-2 focus:ring-green-100
                  ${
                    errors.grade
                      ? "border-red-300"
                      : "border-gray-300"
                  }
                `}
              >
                <option value="">Select quality</option>
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
                <option value="Premium">Premium</option>
              </select>

              {errors.grade && (
                <p className="text-xs text-red-500 mt-1.5">
                  {errors.grade}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expected Price
                <span className="text-red-500 ml-1">*</span>
              </label>

              <div className="relative">
                <IndianRupee
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="number"
                  name="expectedPrice"
                  value={formData.expectedPrice}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  placeholder="e.g. 2500"
                  className={`
                    w-full rounded-lg border bg-white pl-9 pr-16
                    py-2.5 text-sm outline-none focus:border-green-500
                    focus:ring-2 focus:ring-green-100
                    ${
                      errors.expectedPrice
                        ? "border-red-300"
                        : "border-gray-300"
                    }
                  `}
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  / Quintal
                </span>
              </div>

              {errors.expectedPrice && (
                <p className="text-xs text-red-500 mt-1.5">
                  {errors.expectedPrice}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="border-t border-gray-100 p-5 sm:p-7">
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-900">
              Pickup & Availability
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Help buyers understand where and when the lot is available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pickup Location
                <span className="text-red-500 ml-1">*</span>
              </label>

              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  placeholder="Village, District, State"
                  className={`
                    w-full rounded-lg border bg-white pl-9 pr-3
                    py-2.5 text-sm outline-none focus:border-green-500
                    focus:ring-2 focus:ring-green-100
                    ${
                      errors.pickupLocation
                        ? "border-red-300"
                        : "border-gray-300"
                    }
                  `}
                />
              </div>

              {errors.pickupLocation && (
                <p className="text-xs text-red-500 mt-1.5">
                  {errors.pickupLocation}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Available From
                <span className="text-red-500 ml-1">*</span>
              </label>

              <div className="relative">
                <CalendarDays
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="date"
                  name="availableDate"
                  value={formData.availableDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`
                    w-full rounded-lg border bg-white pl-9 pr-3
                    py-2.5 text-sm outline-none focus:border-green-500
                    focus:ring-2 focus:ring-green-100
                    ${
                      errors.availableDate
                        ? "border-red-300"
                        : "border-gray-300"
                    }
                  `}
                />
              </div>

              {errors.availableDate && (
                <p className="text-xs text-red-500 mt-1.5">
                  {errors.availableDate}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="border-t border-gray-100 p-5 sm:p-7">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <Truck
                size={18}
                className="text-gray-500"
              />

              <h2 className="text-base font-bold text-gray-900">
                Transportation
              </h2>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Select who will arrange transportation after the order is confirmed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label
              className={`
                flex items-start gap-3 p-4 rounded-xl border cursor-pointer
                transition-colors
                ${
                  formData.transportation === "buyer"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <input
                type="radio"
                name="transportation"
                value="buyer"
                checked={formData.transportation === "buyer"}
                onChange={handleChange}
                className="sr-only"
              />

              <div
                className={`
                  w-5 h-5 rounded-full border-2 flex items-center
                  justify-center shrink-0 mt-0.5
                  ${
                    formData.transportation === "buyer"
                      ? "border-green-600"
                      : "border-gray-300"
                  }
                `}
              >
                {formData.transportation === "buyer" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Buyer will arrange
                </p>

                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Buyer will arrange the transporter after the order is confirmed.
                </p>
              </div>
            </label>

            <label
              className={`
                flex items-start gap-3 p-4 rounded-xl border cursor-pointer
                transition-colors
                ${
                  formData.transportation === "seller"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <input
                type="radio"
                name="transportation"
                value="seller"
                checked={formData.transportation === "seller"}
                onChange={handleChange}
                className="sr-only"
              />

              <div
                className={`
                  w-5 h-5 rounded-full border-2 flex items-center
                  justify-center shrink-0 mt-0.5
                  ${
                    formData.transportation === "seller"
                      ? "border-green-600"
                      : "border-gray-300"
                  }
                `}
              >
                {formData.transportation === "seller" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Seller will arrange
                </p>

                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Seller will arrange delivery to the buyer's specified location.
                </p>
              </div>
            </label>
          </div>

          {errors.transportation && (
            <p className="text-xs text-red-500 mt-2">
              {errors.transportation}
            </p>
          )}
        </section>

        <section className="border-t border-gray-100 p-5 sm:p-7">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start gap-3">
              <Package
                size={18}
                className="text-gray-500 mt-0.5 shrink-0"
              />

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  What happens after listing?
                </p>

                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Your lot becomes available to suitable buyers. Buyers can review the lot, submit a purchase request and proceed through verification, protected payment, transportation and delivery.
                </p>
              </div>
            </div>
          </div>
        </section>

        {submitError && (
          <div className="mx-5 sm:mx-7 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">
              {submitError}
            </p>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 px-5 sm:px-7 py-4 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={() => navigate("/lots")}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <CheckCircle2 size={16} />
            {isSubmitting ? "Creating Lot..." : "Create Lot"}
          </button>
        </div>
      </form>
    </div>
  );
}