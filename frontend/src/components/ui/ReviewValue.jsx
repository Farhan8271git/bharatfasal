/** Render a labelled value in a verification review summary. */
function ReviewValue({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-100">
      <span className="text-xs text-gray-500">{label}</span>

      <span className="text-sm font-semibold text-gray-800 text-right max-w-[65%] break-words">
        {value}
      </span>
    </div>
  );
}

export default ReviewValue;
