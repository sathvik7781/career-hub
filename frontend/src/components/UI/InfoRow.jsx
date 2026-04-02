export default function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 gap-3 group transition-colors duration-300">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 transition-colors group-hover:text-[#0060c4]">
          {label}
        </span>
        <span
          className={`text-base font-semibold transition-all duration-300 ${
            value
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-400 dark:text-slate-600 italic font-normal"
          }`}
        >
          {value || "Not specified"}
        </span>
      </div>

      {/* Decorative indicator for premium feel */}
      <div className="hidden sm:block w-1 h-8 bg-gray-50 dark:bg-slate-800 rounded-full group-hover:bg-[#0060c4]/20 transition-colors" />
    </div>
  );
}
