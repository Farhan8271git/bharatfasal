function VerificationBadge({ status }) {
  if (status === "approved") {
    return (
      <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
        ✓ Verified
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold">
        Verification Rejected
      </span>
    );
  }

  return (
    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
      Verification Pending
    </span>
  );
}

export default VerificationBadge;