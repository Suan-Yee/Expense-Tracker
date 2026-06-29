import { motion } from "framer-motion";
import { Target, Sparkles, TrendingUp } from "lucide-react";

export default function GoalLoader() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[350px] w-full gap-8 py-12">
            {/* Cool Animated Centerpiece */}
            <div className="relative flex items-center justify-center">
                {/* Outer Pulsating Rings */}
                <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute size-36 rounded-full bg-emerald-500/20 dark:bg-emerald-400/15 blur-md"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="absolute size-28 rounded-full border-2 border-emerald-500/30 dark:border-emerald-400/20 border-dashed animate-spin"
                    style={{ animationDuration: "12s" }}
                />

                {/* Floating Orbiting Sparkles */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute size-32 flex items-start justify-center"
                >
                    <Sparkles size={16} className="text-amber-400 animate-bounce" />
                </motion.div>
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute size-24 flex items-end justify-start"
                >
                    <TrendingUp size={16} className="text-emerald-500" />
                </motion.div>

                {/* Center Glowing Target Icon */}
                <motion.div
                    animate={{ y: [-4, 4, -4], scale: [0.98, 1.05, 0.98] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-xl shadow-emerald-500/30 ring-4 ring-white dark:ring-slate-900"
                >
                    <Target size={36} strokeWidth={2.2} />
                </motion.div>
            </div>

            {/* Loading text with shimmer */}
            <div className="flex flex-col items-center gap-2">
                <p className="text-lg font-extrabold text-slate-800 dark:text-white tracking-tight">
                    Fetching your savings goals...
                </p>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="inline-block size-2 rounded-full bg-emerald-500 animate-ping" />
                    Calculating progress & milestones
                </div>
            </div>

            {/* Skeleton Grid Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl px-4 mt-2 opacity-60">
                {[1, 2, 3].map((n) => (
                    <div
                        key={n}
                        className="flex flex-col justify-between h-44 rounded-2xl bg-white/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/40 p-5 animate-pulse"
                    >
                        <div className="flex items-center gap-3">
                            <div className="size-11 rounded-xl bg-slate-200 dark:bg-slate-700" />
                            <div className="space-y-2 flex-1">
                                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                                <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                                <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
