import { CheckCircle2, Pencil } from "lucide-react";

export default function SectionCard({
  title,
  description,
  icon: Icon,
  isComplete,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  loading,
  children,
}) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 shadow-sm 
                 transition-all duration-300 hover:shadow-md"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-5 sm:p-6 border-b border-gray-100">
        <div className="flex items-start gap-4">
          {/* Icon */}
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-[#0060c4]/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#0060c4]" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

              {/* Completion Badge */}
              {isComplete !== undefined && (
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium
                    ${
                      isComplete
                        ? "bg-green-100 text-green-700"
                        : "bg-[#fd8706]/10 text-[#fd8706]"
                    }`}
                >
                  {isComplete ? "Complete" : "Incomplete"}
                </span>
              )}
            </div>

            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {!isEditing ? (
          onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 text-[#0060c4] hover:bg-[#0060c4]/10 px-3 py-2 rounded-lg transition text-sm font-medium"
            >
              <Pencil className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )
        ) : (
          <div className="flex gap-3 w-full sm:w-auto">
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex-1 sm:flex-none border border-[#fd8706] text-[#fd8706] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#fd8706] hover:text-white transition"
              >
                Cancel
              </button>
            )}

            {onSave && (
              <button
                type="button"
                onClick={onSave}
                disabled={loading}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition
                  ${
                    loading
                      ? "bg-gray-300 text-white cursor-not-allowed"
                      : "bg-[#0060c4] text-white hover:bg-[#0050a8]"
                  }`}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6 animate-fadeIn">{children}</div>
    </div>
  );
}
