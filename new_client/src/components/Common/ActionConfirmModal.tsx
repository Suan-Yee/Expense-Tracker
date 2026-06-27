import { AlertTriangle, Loader, Check, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog"


interface ActionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "success" | "info";
  isLoading?: boolean;
}

export default function ActionConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ActionConfirmModalProps) {

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <AlertTriangle size={28} className="text-red-500" strokeWidth={2.5} />,
          bg: "bg-red-100",
          border: "border-red-200/50",
          btnClass: "bg-red-500 hover:bg-red-600 shadow-red-500/20",
        }
      case "success":
        return {
          icon: <Check size={28} className="text-emerald-500" strokeWidth={2.5} />,
          bg: "bg-emerald-100",
          border: "border-emerald-200/50",
          btnClass: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20",
        }
      case "warning":
        return {
          icon: <AlertTriangle size={28} className="text-amber-500" strokeWidth={2.5} />,
          bg: "bg-amber-100",
          border: "border-amber-200/50",
          btnClass: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20",
        }
      default:
        return {
          icon: <Info size={28} className="text-blue-500" strokeWidth={2.5} />,
          bg: "bg-blue-100",
          border: "border-blue-200/50",
          btnClass: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/20",
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !isLoading) onClose() }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className={`flex size-16 items-center justify-center rounded-full ${styles.bg} mb-5 shadow-sm border ${styles.border} mx-auto`}>
            {styles.icon}
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 w-full rounded-2xl ${styles.btnClass} px-5 py-3 text-[15px] font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-wait`}
          >
            {isLoading ? <><Loader size={18} className="animate-spin" /> Working...</> : confirmText}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-[15px] font-bold text-slate-600 transition-all hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50"
          >
            {cancelText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
