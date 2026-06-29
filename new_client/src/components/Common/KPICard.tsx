import React from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { formatCurrency } from "../../utils/formatUtils";

export type KPITheme = "emerald" | "rose" | "blue" | "violet" | "amber" | "slate";

const THEME_CONFIG: Record<KPITheme, { iconBg: string; iconColor: string; glow: string }> = {
    emerald: {
        iconBg: "bg-emerald-50 dark:bg-emerald-950/60",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        glow: "bg-emerald-500/10 dark:bg-emerald-400/10",
    },
    rose: {
        iconBg: "bg-rose-50 dark:bg-rose-950/60",
        iconColor: "text-rose-600 dark:text-rose-400",
        glow: "bg-rose-500/10 dark:bg-rose-400/10",
    },
    blue: {
        iconBg: "bg-blue-50 dark:bg-blue-950/60",
        iconColor: "text-blue-600 dark:text-blue-400",
        glow: "bg-blue-500/10 dark:bg-blue-400/10",
    },
    violet: {
        iconBg: "bg-violet-50 dark:bg-violet-950/60",
        iconColor: "text-violet-600 dark:text-violet-400",
        glow: "bg-violet-500/10 dark:bg-violet-400/10",
    },
    amber: {
        iconBg: "bg-amber-50 dark:bg-amber-950/60",
        iconColor: "text-amber-600 dark:text-amber-400",
        glow: "bg-amber-500/10 dark:bg-amber-400/10",
    },
    slate: {
        iconBg: "bg-slate-100 dark:bg-slate-800",
        iconColor: "text-slate-700 dark:text-slate-200",
        glow: "bg-slate-500/10 dark:bg-slate-400/10",
    },
};

export interface KPICardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    theme?: KPITheme;
    iconBg?: string;
    iconColor?: string;
    glowColor?: string;
    badge?: React.ReactNode;
    loading?: boolean;
    valueClassName?: string;
    delay?: number;
}

export default function KPICard({
    label,
    value,
    icon: Icon,
    theme = "emerald",
    iconBg,
    iconColor,
    glowColor,
    badge,
    loading = false,
    valueClassName,
    delay = 0,
}: KPICardProps) {
    const cfg = THEME_CONFIG[theme] || THEME_CONFIG.emerald;
    const finalIconBg = iconBg || cfg.iconBg;
    const finalIconColor = iconColor || cfg.iconColor;
    const finalGlow = glowColor || cfg.glow;

    const displayValue = typeof value === "number" ? formatCurrency(value) : value;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
        >
            <Card className="relative overflow-hidden p-6 shadow-sm hover:shadow-md transition-shadow">
                {/* Color Spot in top right corner */}
                <div className={`absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full blur-xl pointer-events-none ${finalGlow}`} />

                <div className="flex items-center justify-between relative z-10">
                    <div className={`rounded-2xl p-3.5 ${finalIconBg} ${finalIconColor}`}>
                        <Icon size={22} strokeWidth={2.5} />
                    </div>
                    {badge && <div className="flex items-center">{badge}</div>}
                </div>

                <div className="mt-5 relative z-10">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
                    {loading ? (
                        <div className="mt-2 h-8 w-32 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
                    ) : (
                        <h3 className={`mt-1 text-xl font-bold tracking-tight sm:text-2xl ${valueClassName || "text-slate-900 dark:text-white"}`}>
                            {displayValue}
                        </h3>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}
