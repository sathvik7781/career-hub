import React from "react";

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl animate-modalEnter p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>

        <p className="text-sm text-gray-500 mb-6">{description}</p>

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100 transition"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
