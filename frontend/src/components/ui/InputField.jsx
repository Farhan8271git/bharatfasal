/** Render a labelled text input controlled by its parent. */
function InputField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-700">{label}</label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1.5 h-11 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}

export default InputField;
