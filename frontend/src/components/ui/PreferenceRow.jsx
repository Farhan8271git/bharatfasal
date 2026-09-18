/** Render the current value of a named user preference. */
function PreferenceRow({ label, value }) {
  return (
    <div className="py-3.5 border-b border-gray-100">
      <p className="text-[11px] text-gray-400">{label}</p>

      <p className="text-sm font-semibold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

export default PreferenceRow;
