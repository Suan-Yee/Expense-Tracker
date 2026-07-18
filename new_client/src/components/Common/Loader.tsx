export default function Loader({ text = "Loading your data..." }: { text?: string }) {
    return (
        <div className="flex min-h-64 w-full flex-col items-center justify-center gap-4" role="status" aria-live="polite">
            <div className="size-9 animate-spin rounded-full border-[3px] border-emerald-200 border-t-emerald-700 dark:border-emerald-900 dark:border-t-emerald-300" aria-hidden="true" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{text}</p>
        </div>
    );
}
