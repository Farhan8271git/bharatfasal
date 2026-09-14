import { MapPin, Phone, UserRound } from "lucide-react";
import CardHeader from "../../../components/ui/CardHeader";
import VerificationBadge from "../../../components/ui/VerificationBadge";

export default function ProfileSection({
  isBuyer,
  profile,
  businessDetails,
  roleInfo,
  isVerified,
  verificationStatus,
  onManageProfile,
}) {
  const RoleIcon = roleInfo.icon;

  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <CardHeader
        icon={RoleIcon}
        iconClass={roleInfo.color}
        iconBg={roleInfo.bg}
        title={roleInfo.profileTitle}
        subtitle={roleInfo.profileSubtitle}
      />

      <div className="p-5">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
            <UserRound
              size={38}
              strokeWidth={1.8}
              className={roleInfo.color}
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {isBuyer
                ? profile.companyName ||
                  businessDetails.businessName ||
                  profile.name ||
                  "Business Name not added"
                : profile.name || "User"}
            </h3>

            {isBuyer && profile.name && (
              <p className="text-sm text-gray-500 mt-0.5">
                {profile.name}
              </p>
            )}

            {profile.phone && (
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                <Phone size={14} />
                {profile.phone}
              </p>
            )}

            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
              <MapPin size={14} />
              {profile.location || "India"}
            </p>

            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
              <RoleIcon size={14} />
              {roleInfo.label}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {roleInfo.label}
          </span>

          {isBuyer && (
            <VerificationBadge
              status={isVerified ? "approved" : verificationStatus}
            />
          )}
        </div>

        <button
          type="button"
          onClick={onManageProfile}
          className="w-full mt-5 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Manage Profile
        </button>
      </div>
    </section>
  );
}