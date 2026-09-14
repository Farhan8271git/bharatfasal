import { IndianRupee } from "lucide-react";

function PaymentHistoryItem({ order, crop, amount, status }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200">
      <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
        <IndianRupee size={18} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{order}</p>

        <p className="text-xs text-gray-500 mt-0.5">
          {crop} · {amount}
        </p>
      </div>

      <span
        className={`
          px-2 py-1
          rounded-full
          text-[10px]
          font-semibold
          ${
            status === "Released" || status === "Completed"
              ? "bg-green-50 text-green-700"
              : "bg-blue-50 text-blue-700"
          }
        `}
      >
        {status}
      </span>
    </div>
  );
}

export default PaymentHistoryItem;