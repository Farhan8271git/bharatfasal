/** Render a labelled information row with optional trailing content. */
function InfoRow({ label, value, right, onClick }) {
  const content = (
    <div className="py-3.5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800">{label}</p>

          <p className="text-xs text-gray-500 mt-0.5 truncate">{value}</p>
        </div>

        {right}
      </div>
    </div>
  );

  if (!onClick) {
    return (
      <div className="border-b border-gray-100 last:border-b-0">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
    >
      {content}
    </button>
  );
}

export default InfoRow;
