import {
  Building2,
  CheckCircle2,
  FileCheck,
  FileText,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import InputField from "../../../components/ui/InputField";
import DocumentCheck from "../../../components/ui/DocumentCheck";

export default function VerificationModal({
  open,
  onClose,
  isBuyer,
  profile,
  businessDetails,
  documents,
  identityDetails,
  setIdentityDetails,
  identityError,
  verification,
  onSubmit,
}) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={isBuyer ? "Business Verification" : "Identity Verification"}
    >
      <div className="space-y-5">
        {isBuyer ? (
          <>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <Building2
                  size={20}
                  className="text-blue-600 shrink-0 mt-0.5"
                />

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">
                    Business Information
                  </p>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 size={15} />
                      <span>
                        {businessDetails?.businessName || "Not added"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText size={15} />
                      <span>
                        {businessDetails?.businessType || "Not added"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={15} />
                      <span>
                        {businessDetails?.address || "Not added"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2">
                <UserRound size={19} className="text-gray-600" />

                <p className="text-sm font-semibold text-gray-800">
                  Contact Person
                </p>
              </div>

              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p>{profile?.name || "Not added"}</p>
                <p>{profile?.phone || "Phone not added"}</p>
                <p>{profile?.email || "Email not added"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="PAN"
                value={businessDetails?.pan || ""}
                readOnly
              />

              <InputField
                label="GSTIN"
                value={businessDetails?.gstin || ""}
                readOnly
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileCheck size={19} className="text-green-600" />

                <p className="text-sm font-semibold text-gray-800">
                  Documents
                </p>
              </div>

              <div className="space-y-2">
                <DocumentCheck
                  label="PAN Card"
                  checked={Boolean(documents?.pan)}
                />

                <DocumentCheck
                  label="GST Certificate"
                  checked={Boolean(documents?.gst)}
                />

                <DocumentCheck
                  label="Business Proof"
                  checked={Boolean(documents?.businessProof)}
                />

                <DocumentCheck
                  label="Bank Proof"
                  checked={Boolean(documents?.bankProof)}
                />
              </div>
            </div>

            {verification?.rejectionReason && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">
                  Previous Rejection Reason
                </p>

                <p className="text-sm text-red-700 mt-1">
                  {verification.rejectionReason}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={20}
                  className="text-blue-600 shrink-0 mt-0.5"
                />

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Verify your identity
                  </p>

                  <p className="text-xs text-gray-600 mt-1">
                    Submit a valid identity document to complete verification.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="verification-document-type"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Document Type
              </label>

              <select
                id="verification-document-type"
                value={identity?.documentType || ""}
                onChange={(event) =>
                  onIdentityChange("documentType", event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="">Select document type</option>
                <option value="aadhaar">Aadhaar</option>
                <option value="pan">PAN</option>
                <option value="voter">Voter ID</option>
                <option value="driving">Driving Licence</option>
              </select>
            </div>

            <InputField
              label="Document Number"
              value={identity?.documentNumber || ""}
              onChange={(event) =>
                onIdentityChange("documentNumber", event.target.value)
              }
              placeholder="Enter document number"
              error={identityError}
            />
          </>
        )}

        <div className="rounded-xl border border-green-100 bg-green-50 p-4 flex items-start gap-3">
          <CheckCircle2
            size={19}
            className="text-green-600 shrink-0 mt-0.5"
          />

          <p className="text-xs text-green-700">
            Your submitted information will be reviewed as part of the
            verification process.
          </p>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            className="flex-1 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition"
          >
            Submit for Verification
          </button>
        </div>
      </div>
    </Modal>
  );
}