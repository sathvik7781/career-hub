export default function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className={`w-full rounded-lg px-3 py-2 text-sm transition border ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-400"
            : "border-gray-300 focus:ring-2 focus:ring-[#0060c4]"
        }`}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
