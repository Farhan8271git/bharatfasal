/** Render an icon button that opens a modal action. */
function ModalButton({ onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full mt-2 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold flex items-center justify-center gap-2"
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

export default ModalButton;
