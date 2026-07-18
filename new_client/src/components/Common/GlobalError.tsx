import { AlertTriangle } from "lucide-react";

export default function GlobalError({ message, onRetry }: { message: string; onRetry?: () => void }) {
    return (
        <div className="mx-auto mt-10 flex w-full max-w-2xl flex-col items-center rounded-[18px] border border-red-200 bg-red-50 p-6 text-center shadow-sm dark:border-red-500/20 dark:bg-red-500/10" role="alert">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300">
                <AlertTriangle size={22} strokeWidth={2.25} aria-hidden="true" />
            </div>
            <h3 className="text-[17px] font-bold tracking-tight text-red-800">Something went wrong</h3>
            <p className="text-[14px] font-medium text-red-600/80 mt-1.5 max-w-md">{message}</p>
            
            {onRetry && (
                <button type="button"
                    onClick={onRetry} 
                    className="mt-6 min-h-11 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 shadow-sm transition-colors hover:bg-red-100 dark:border-red-500/30 dark:bg-slate-900 dark:text-red-300"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
