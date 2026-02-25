export default function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={`text-sm font-medium ${
          value ? "text-gray-900" : "text-gray-400 italic"
        }`}
      >
        {value || "Not provided"}
      </span>
    </div>
  );
}
