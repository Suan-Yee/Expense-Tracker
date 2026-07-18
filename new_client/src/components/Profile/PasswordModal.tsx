import { X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useModalAccessibility } from "../../hooks/useModalAccessibility";
import { useNotificationStore } from "../../store/notificationStore";

interface PasswordModalProps {
  onClose: () => void;
  inputClasses: string;
}

export default function PasswordModal({ onClose, inputClasses }: PasswordModalProps) {
  const { changePassword, error } = useAuthStore();
  const notify = useNotificationStore((state) => state.notify);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const modalRef = useModalAccessibility<HTMLDivElement>(true, onClose);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setLocalError("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setLocalError("New passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const success = await changePassword({ currentPassword, newPassword });
    setIsSubmitting(false);

    if (success) {
      setSuccessMsg("Password updated successfully!");
      notify({ tone: "success", title: "Password updated", message: "Your new password is now active." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(onClose, 1500);
    } else {
      notify({ tone: "error", title: "Password wasn’t updated", message: useAuthStore.getState().error ?? "Check your current password and try again." });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="password-modal-title" className="relative w-full max-w-md overflow-hidden rounded-[20px] bg-white/90 p-8 shadow-2xl backdrop-blur-xl border border-white/50 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 id="password-modal-title" className="text-xl font-bold text-slate-800">Change Password</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:rotate-90 transition-all duration-300"
            aria-label="Close modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {(error || localError) && (
            <div id="password-form-error" role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50/90 px-3 py-2.5 text-[13px] font-medium text-red-600 shadow-sm backdrop-blur-sm">
              {error || localError}
            </div>
        )}
        
        {successMsg && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/90 px-3 py-2.5 text-[13px] font-medium text-emerald-600 shadow-sm backdrop-blur-sm">
              {successMsg}
            </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="current-password" className="block text-xs font-bold tracking-wide text-slate-600 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input 
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                className={`${inputClasses} pr-10`} 
                required 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isSubmitting}
                aria-invalid={!!(error || localError)}
                aria-describedby={error || localError ? "password-form-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((p) => !p)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="new-password" className="block text-xs font-bold tracking-wide text-slate-600 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input 
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                className={`${inputClasses} pr-10`} 
                required 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                aria-invalid={!!(error || localError)}
                aria-describedby={error || localError ? "password-form-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((p) => !p)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-xs font-bold tracking-wide text-slate-600 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input 
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                className={`${inputClasses} pr-10`} 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                aria-invalid={!!(error || localError)}
                aria-describedby={error || localError ? "password-form-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="mt-8 pt-2 flex justify-end gap-3 border-t border-slate-200/60">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
