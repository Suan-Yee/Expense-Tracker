import { ShieldAlert, Loader, Check } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "@tanstack/react-router";

interface DeleteAccountModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteAccountModal({ onClose, onConfirm }: DeleteAccountModalProps) {
  const { deleteAccount, logout, error } = useAuthStore();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [localError, setLocalError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setLocalError("");
    setSuccessMsg("");
    
    // Simulating loading for 1.5 seconds as requested before executing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const success = await deleteAccount();
    if (success) {
      setSuccessMsg("Account deleted successfully!");
      setTimeout(() => {
        onConfirm(); // Optional callback
        logout();
        navigate({ to: "/login" });
      }, 1500);
    } else {
       setLocalError(error || "Failed to delete account");
       setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm overflow-hidden rounded-[20px] bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-red-100 text-red-500 mb-4 shadow-sm border border-red-200/50">
             {successMsg ? <Check size={28} className="text-emerald-500" strokeWidth={2.5}/> : <ShieldAlert size={28} strokeWidth={2.5} />}
          </div>
          <h3 className="text-xl font-bold text-slate-900">{successMsg ? "Farewell" : "Delete Account?"}</h3>
          
          {localError && <p className="mt-2 text-sm text-red-500 font-medium">{localError}</p>}
          
          {successMsg ? (
              <p className="mt-2 text-[15px] font-medium text-emerald-600">
                {successMsg}
              </p>
          ) : (
            <p className="mt-2 text-[15px] font-medium text-slate-500">
                This action cannot be undone. All your data, expenses, and settings will be permanently wiped.
            </p>
          )}
        </div>

        {!successMsg && (
            <div className="mt-8 flex flex-col gap-3">
            <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 w-full rounded-full bg-red-500 px-5 py-2.5 text-[15px] font-bold text-white shadow-md shadow-red-500/20 transition-all hover:-translate-y-0.5 hover:bg-red-600 disabled:opacity-50 disabled:cursor-wait"
            >
                {isDeleting ? <><Loader size={16} className="animate-spin" /> Deleting...</> : "Yes, Delete Account"}
            </button>
            <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="w-full rounded-full border border-slate-200 px-5 py-2.5 text-[15px] font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50"
            >
                Cancel
            </button>
            </div>
        )}
      </div>
    </div>
  );
}
