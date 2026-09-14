function ProtectedStep({ number, title, text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-green-50 text-green-700 flex items-center justify-center text-xs font-bold shrink-0">
        {number}
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>

        <p className="text-xs text-gray-500 mt-1 leading-5">{text}</p>
      </div>
    </div>
  );
}

export default ProtectedStep;