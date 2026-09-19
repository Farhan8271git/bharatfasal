/** Render a clickable settings row with an icon and supporting text. */
function ActionRow({ icon: Icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition"
    >
      <Icon size={18} className="text-gray-500 shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{title}</p>

        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>

      <ChevronRight size={17} className="text-gray-400 shrink-0" />
    </button>
  );
}

export default ActionRow;
