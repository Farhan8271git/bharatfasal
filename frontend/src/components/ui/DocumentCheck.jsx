import { FileCheck } from "lucide-react";

/** Render a labelled checkbox for selecting a verification document. */
function DocumentCheck({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-green-600"
      />

      <FileCheck size={17} className="text-gray-500" />

      <span className="text-sm font-medium text-gray-800">{label}</span>
    </label>
  );
}

export default DocumentCheck;
