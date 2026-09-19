import {
  CheckCircle2,
  Clock3,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import CardHeader from "../../../components/ui/CardHeader";
import VerificationBadge from "../../../components/ui/VerificationBadge";

/** Render verification progress and the appropriate next action. */
export default function VerificationSection({
  isBuyer,
  isVerified,
  verificationStatus,
  verification,
  roleInfo,
  onOpenVerification,
}) {
  const status = isVerified ? "approved" : verificationStatus;
  const statusConfig = {
    approved: {
      icon: CheckCircle2,
      title: "Verification Approved",
      description: "Your identity verification has been approved.",
      iconClass: "text-green-600",
      bgClass: "bg-green-50",
    },
    pending: {
      icon: Clock3,
      title: "Verification Pending",
      description: "Your verification request is awaiting review.",
      iconClass: "text-amber-600",
      bgClass: "bg-amber-50",
    },
    under_review: {
      icon: Clock3,
      title: "Verification Under Review",
      description: "Your submitted details are currently being reviewed.",
      iconClass: "text-blue-600",
      bgClass: "bg-blue-50",
    },
    rejected: {
      icon: XCircle,
      title: "Verification Rejected",
      description:
        "Your verification request was rejected. Please review your details and submit again.",
      iconClass: "text-red-600",
      bgClass: "bg-red-50",
    },
  };

  const config = statusConfig[status] || {
    icon: ShieldCheck,
    title: "Identity Verification",
    description: "Complete verification to build trust on BharatFasal.",
    iconClass: "text-gray-600",
    bgClass: "bg-gray-50",
  };

  const StatusIcon = config.icon;

  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <CardHeader
        icon={ShieldCheck}
        iconClass="text-blue-600"
        iconBg="bg-blue-50"
        title={`${roleInfo.label} Verification`}
        subtitle="Verify your identity and account details"
      />

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl ${config.bgClass} flex items-center justify-center shrink-0`}
          >
            <StatusIcon size={24} className={config.iconClass} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900">
                {config.title}
              </h3>

              <VerificationBadge status={status} />
            </div>

            <p className="text-sm text-gray-500 mt-1">
              {config.description}
            </p>
          </div>
        </div>

        {verification?.rejectionReason && status === "rejected" && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">
              Rejection Reason
            </p>
            <p className="text-sm text-red-700 mt-1">
              {verification.rejectionReason}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onOpenVerification}
          className="w-full mt-5 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition"
        >
          {status === "approved"
            ? "View Verification"
            : status === "pending" || status === "under_review"
              ? "View Verification"
              : "Complete Verification"}
        </button>
      </div>
    </section>
  );
}
