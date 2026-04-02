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
    <div className="card transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-5 sm:p-6 border-b border-app">
        <div className="flex items-start gap-4">
          {/* Icon */}
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-semibold text-primary">{title}</h2>

              {/* Completion Badge */}
              {isComplete !== undefined && (
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium
                    ${
                      isComplete
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                    }`}
                >
                  {isComplete ? "Complete" : "Incomplete"}
                </span>
              )}
            </div>

            {description && (
              <p className="text-sm text-secondary mt-1">{description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {!isEditing ? (
          onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-2 rounded-lg transition text-sm font-medium"
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
                className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium border border-orange-500 text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-900/20 transition"
              >
                Cancel
              </button>
            )}

            {onSave && (
              <button
                type="button"
                onClick={onSave}
                disabled={loading}
                className="btn-primary flex-1 sm:flex-none"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 sm:p-10 animate-fadeIn text-primary">{children}</div>
    </div>
  );
}
