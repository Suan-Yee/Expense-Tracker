export default function AnalyticsHeader() {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-2">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
                    Analytics
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Deep dive into your spending breakdown, cashflow trends, and budget health.
                </p>
            </div>
        </div>
    );
}
