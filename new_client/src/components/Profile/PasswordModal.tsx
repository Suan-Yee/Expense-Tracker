import { X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

interface PasswordModalProps {
  onClose: () => void;
  inputClasses: string;
}

export default function PasswordModal({ onClose, inputClasses }: PasswordModalProps) {
  const { changePassword, error } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(onClose, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-[20px] bg-white/90 p-8 shadow-2xl backdrop-blur-xl border border-white/50 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Change Password</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:rotate-90 transition-all duration-300"
            aria-label="Close modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {(error || localError) && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50/90 px-3 py-2.5 text-[13px] font-medium text-red-600 shadow-sm backdrop-blur-sm">
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
            <label className="block text-xs font-bold tracking-wide text-slate-600 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input 
                type={showCurrentPassword ? "text" : "password"}
                className={`${inputClasses} pr-10`} 
                required 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isSubmitting}
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
            <label className="block text-xs font-bold tracking-wide text-slate-600 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input 
                type={showNewPassword ? "text" : "password"}
                className={`${inputClasses} pr-10`} 
                required 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
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
            <label className="block text-xs font-bold tracking-wide text-slate-600 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                className={`${inputClasses} pr-10`} 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
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
