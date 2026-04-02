import { useState } from "react";
import { Button } from "../UI/FormElements";

/**
 * ConfirmModal
 *
 * Props:
 *  - isOpen: boolean
 *  - title: string
 *  - message: string
 *  - confirmLabel: string (default "Confirm")
 *  - cancelLabel: string (default "Cancel")
 *  - variant: "danger" | "primary" (default "primary")
 *  - withReason: boolean — shows a textarea for a reason (e.g. rejection)
 *  - reasonPlaceholder: string
 *  - onConfirm: (reason?: string) => void
 *  - onCancel: () => void
 */
export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  withReason = false,
  reasonPlaceholder = "Enter reason...",
  onConfirm,
  onCancel,
}) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(withReason ? reason : undefined);
    setReason("");
  };

  const handleCancel = () => {
    setReason("");
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="relative bg-surface rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 border border-app">
        <h3 className="heading-md text-primary mb-2">{title}</h3>
        <p className="text-secondary text-sm mb-4">{message}</p>

        {withReason && (
          <textarea
            className="input-field min-h-[80px] mb-4"
            placeholder={reasonPlaceholder}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        )}

        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={handleCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            disabled={withReason && !reason.trim()}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
