import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, FileCheck, ShieldCheck } from "lucide-react";

const VERIFICATION_KEY = "bf_verification_requests";

const VerificationPage = ({ user }) => {
  const navigate = useNavigate();

  const role = user?.role || "farmer";
  const isBuyer = role === "buyer";

  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [identityError, setIdentityError] = useState("");

  const submitVerification = () => {
    if (!isBuyer) {
      const type = documentType;
      const number = documentNumber.trim().toUpperCase();

      if (!type) {
        setIdentityError("Please select a document type.");
        return;
      }

      if (!number) {
        setIdentityError("Please enter your document number.");
        return;
      }

      const rules = {
        aadhaar: /^\d{12}$/,
        pan: /^[A-Z]{5}\d{4}[A-Z]$/,
        voter: /^[A-Z]{3,4}\d{6,10}$/,
        driving: /^[A-Z]{2}\d{2}\s?\d{4,13}$/,
      };

      if (rules[type] && !rules[type].test(number)) {
        setIdentityError(
          type === "aadhaar"
            ? "Aadhaar number must contain 12 digits."
            : type === "pan"
              ? "Enter a valid PAN format, e.g. ABCDE1234F."
              : "Please enter a valid document number.",
        );
        return;
      }

      const request = {
        id: `VER-${Date.now()}`,
        userId: user?.id || `user-${Date.now()}`,
        type: role,
        name: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        location: user?.location || "India",
        identity: {
          documentType: type,
          documentNumber: number,
        },
        status: "pending",
        verificationStatus: "pending",
        submittedAt: new Date().toISOString(),
      };

      try {
        const existing = JSON.parse(
          localStorage.getItem(VERIFICATION_KEY) || "[]",
        );

        const requests = Array.isArray(existing) ? existing : [];

        const existingIndex = requests.findIndex(
          (item) =>
            item.userId === request.userId || item.phone === request.phone,
        );

        if (existingIndex >= 0) {
          requests[existingIndex] = {
            ...requests[existingIndex],
            ...request,
            id: requests[existingIndex].id || request.id,
          };
        } else {
          requests.push(request);
        }

        localStorage.setItem(
          VERIFICATION_KEY,
          JSON.stringify(requests),
        );

        window.dispatchEvent(
          new CustomEvent("bf-verification-submitted", {
            detail: request,
          }),
        );

        navigate("/settings");
      } catch (error) {
        console.error("Verification submission failed:", error);
        setIdentityError(
          "Unable to submit verification. Please try again.",
        );
      }

      return;
    }

    const request = {
      id: `VER-${Date.now()}`,
      userId: user?.id || `buyer-${Date.now()}`,
      type: "buyer",
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      businessName:
        user?.companyName || user?.businessName || "",
      companyName:
        user?.companyName || user?.businessName || "",
      location: user?.location || "India",
      status: "pending",
      verificationStatus: "pending",
      submittedAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem(VERIFICATION_KEY) || "[]",
      );

      const requests = Array.isArray(existing) ? existing : [];

      const existingIndex = requests.findIndex(
        (item) =>
          item.userId === request.userId || item.phone === request.phone,
      );

      if (existingIndex >= 0) {
        requests[existingIndex] = {
          ...requests[existingIndex],
          ...request,
          id: requests[existingIndex].id || request.id,
        };
      } else {
        requests.push(request);
      }

      localStorage.setItem(
        VERIFICATION_KEY,
        JSON.stringify(requests),
      );

      window.dispatchEvent(
        new CustomEvent("bf-verification-submitted", {
          detail: request,
        }),
      );

      navigate("/settings");
    } catch (error) {
      console.error("Verification submission failed:", error);
      setIdentityError(
        "Unable to submit verification. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={17} />
          Back to Settings
        </button>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                <ShieldCheck
                  size={22}
                  className="text-green-600"
                />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {isBuyer
                    ? "Buyer Verification"
                    : "Identity Verification"}
                </h1>

                <p className="mt-0.5 text-sm text-gray-500">
                  {isBuyer
                    ? "Submit your business information for admin review."
                    : "Verify your identity to build trust on Bharat Fasal."}
                </p>
              </div>
            </div>
          </div>

          {isBuyer ? (
            <div className="space-y-4 p-5">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <FileCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Buyer verification
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      Your account information will be submitted
                      for admin verification.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Business
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {user?.companyName ||
                    user?.businessName ||
                    "Business information not added"}
                </p>
              </div>

              <button
                type="button"
                onClick={submitVerification}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <ShieldCheck size={17} />
                Submit for Admin Verification
              </button>
            </div>
          ) : (
            <div className="space-y-5 p-5">
              <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={21}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Government ID verification
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      Enter your document details. Format validation
                      will happen before submission.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Document Type
                </label>

                <select
                  value={documentType}
                  onChange={(e) => {
                    setDocumentType(e.target.value);
                    setIdentityError("");
                  }}
                  className="mt-1.5 h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">
                    Select document type
                  </option>

                  <option value="aadhaar">
                    Aadhaar Card
                  </option>

                  <option value="voter">
                    Voter ID
                  </option>

                  <option value="driving">
                    Driving Licence
                  </option>

                  <option value="pan">
                    PAN Card
                  </option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Document Number
                </label>

                <input
                  type="text"
                  value={documentNumber}
                  onChange={(e) => {
                    setDocumentNumber(
                      e.target.value.toUpperCase(),
                    );
                    setIdentityError("");
                  }}
                  placeholder={
                    documentType === "aadhaar"
                      ? "Enter 12-digit Aadhaar number"
                      : documentType === "pan"
                        ? "Enter PAN (e.g. ABCDE1234F)"
                        : "Enter document number"
                  }
                  autoComplete="off"
                  className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
                    identityError
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                  }`}
                />

                {identityError && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {identityError}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <AlertCircle
                  size={15}
                  className="mt-0.5 shrink-0 text-gray-500"
                />

                <p className="text-xs leading-5 text-gray-500">
                  Format validation happens before submission.
                  Actual identity verification requires authorized
                  verification service or admin review.
                </p>
              </div>

              <button
                type="button"
                onClick={submitVerification}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <ShieldCheck size={17} />
                Submit for Verification
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;