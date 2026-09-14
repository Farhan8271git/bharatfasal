function TextAreaField({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-700">{label}</label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none"
      />
    </div>
  );
}

export default TextAreaField;