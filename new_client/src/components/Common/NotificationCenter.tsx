import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNotificationStore, type NotificationTone } from "../../store/notificationStore";

const toneStyles: Record<NotificationTone, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: "border-emerald-200 bg-white text-emerald-700 dark:border-emerald-500/25 dark:bg-slate-900 dark:text-emerald-300" },
  error: { icon: AlertCircle, className: "border-red-200 bg-white text-red-700 dark:border-red-500/25 dark:bg-slate-900 dark:text-red-300" },
  info: { icon: Info, className: "border-blue-200 bg-white text-blue-700 dark:border-blue-500/25 dark:bg-slate-900 dark:text-blue-300" },
};

export default function NotificationCenter() {
  const { notifications, dismiss } = useNotificationStore();

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-24 z-[80] flex flex-col items-end gap-2 lg:bottom-5 lg:left-auto lg:w-[380px]" aria-live="polite" aria-atomic="false">
      <AnimatePresence initial={false}>
        {notifications.map((notification) => {
          const tone = toneStyles[notification.tone];
          const Icon = tone.icon;
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className={`pointer-events-auto flex w-full items-start gap-3 rounded-2xl border p-4 shadow-xl shadow-slate-950/10 ${tone.className}`}
              role={notification.tone === "error" ? "alert" : "status"}
            >
              <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{notification.title}</p>
                {notification.message && <p className="mt-0.5 text-xs leading-5 text-slate-600 dark:text-slate-400">{notification.message}</p>}
              </div>
              <button type="button" onClick={() => dismiss(notification.id)} className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800" aria-label="Dismiss notification">
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
