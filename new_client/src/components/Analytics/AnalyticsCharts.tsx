import { PieChart as PieIcon, BarChart3 } from "lucide-react";
import {
    ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { Card } from "../ui/card";
import { formatCurrency } from "../../utils/formatUtils";
import { CATEGORY_HEX_COLORS } from "../../constants/categories";
import { useThemeStore } from "../../store/themeStore";
import type { CategoryTotal, SpendingTrend } from "../../types/analytics.types";

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-xl backdrop-blur-md">
                {label && <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>}
                <div className="space-y-1.5">
                    {payload.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color || item.payload.fill }} />
                                <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                                    {item.name}:
                                </span>
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white">
                                {formatCurrency(item.value)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

interface AnalyticsChartsProps {
    categoryData: CategoryTotal[];
    trends: SpendingTrend[];
}

export default function AnalyticsCharts({ categoryData, trends }: AnalyticsChartsProps) {
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const pieData = categoryData.map(cat => ({
        name: cat.category,
        value: cat.total,
        fill: CATEGORY_HEX_COLORS[cat.category.toLowerCase()] || "#64748b"
    }));

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Donut Chart: Spending by Category */}
            <Card className="p-6 shadow-sm lg:col-span-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <PieIcon size={18} className="text-slate-400" />
                            <h3 className="font-bold text-slate-800 dark:text-white">Expense Breakdown</h3>
                        </div>
                        <span className="text-xs font-semibold text-slate-400">
                            Top Categories
                        </span>
                    </div>

                    <div className="my-6 flex h-[260px] items-center justify-center">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={95}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center">
                                <PieIcon size={40} className="text-slate-200 dark:text-slate-700 mb-2" />
                                <p className="text-sm font-semibold text-slate-400">No category spending recorded</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Category Legend */}
                    <div className="space-y-2 divide-y divide-slate-400/80 dark:divide-slate-800">
                        {categoryData.slice(0, 4).map((cat) => (
                            <div key={cat.category} className="flex items-center justify-between pt-2 first:pt-0 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_HEX_COLORS[cat.category.toLowerCase()] || "#64748b" }} />
                                    <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">{cat.category}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(cat.total)}</span>
                                    <span className="font-semibold text-slate-400 w-8 text-right">{cat.percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Bar Chart: Income vs Expenses Trends */}
            <Card className="p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <BarChart3 size={18} className="text-slate-400" />
                            <h3 className="font-bold text-slate-800 dark:text-white">Cashflow Comparison</h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">Monthly breakdown of income versus expenses & savings</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold">
                        <div className="flex items-center gap-1.5">
                            <span className="size-3 rounded bg-emerald-500" />
                            <span className="text-slate-600 dark:text-slate-300">Income</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="size-3 rounded bg-slate-400" />
                            <span className="text-slate-600 dark:text-slate-300">Expenses</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="size-3 rounded bg-teal-500" />
                            <span className="text-slate-600 dark:text-slate-300">Savings</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 h-[320px] w-full">
                    {trends.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#475569"} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? "#94a3b8" : "#334155", fontWeight: 600 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? "#94a3b8" : "#334155", fontWeight: 600 }} tickFormatter={(val) => `$${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                <Bar dataKey="expenses" name="Expenses" fill="#64748b" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                <Bar dataKey="savings" name="Savings" fill="#14b8a6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <BarChart3 size={40} className="text-slate-200 dark:text-slate-700 mb-2" />
                            <p className="text-sm font-semibold text-slate-400">No trend data available for selected range</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
