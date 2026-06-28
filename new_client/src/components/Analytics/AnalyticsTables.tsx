import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatCurrency } from "../../utils/formatUtils";
import { CATEGORY_COLORS, CATEGORY_HEX_COLORS } from "../../constants/categories";
import type { CategoryTotal, MonthlyTotal } from "../../types/analytics.types";

interface AnalyticsTablesProps {
    categoryData: CategoryTotal[];
    monthlyData: MonthlyTotal[];
    selectedYear: number;
}

export default function AnalyticsTables({
    categoryData,
    monthlyData,
    selectedYear,
}: AnalyticsTablesProps) {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Deep-Dive Category List */}
            <Card className="p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-white mb-1">Spending by Category Breakdown</h3>
                <p className="text-xs text-slate-400 mb-6">Detailed view of transaction counts and percentage share</p>

                {categoryData.length > 0 ? (
                    <div className="space-y-5">
                        {categoryData.map((cat) => {
                            const badgeColor = CATEGORY_COLORS[cat.category.toLowerCase()] ?? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-800/50";
                            const barColor = CATEGORY_HEX_COLORS[cat.category.toLowerCase()] ?? "#10b981";

                            return (
                                <div key={cat.category} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2.5">
                                            <Badge className={`${badgeColor} font-bold capitalize border-0`}>
                                                {cat.category}
                                            </Badge>
                                            <span className="text-xs font-semibold text-slate-400">
                                                {cat.count} {cat.count === 1 ? "txn" : "txns"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-slate-800 dark:text-white">{formatCurrency(cat.total)}</span>
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-300 w-10 text-right">{cat.percentage}%</span>
                                        </div>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700/60">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(cat.percentage, 100)}%` }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: barColor }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-12 text-center text-sm font-semibold text-slate-400">
                        No expenses logged yet.
                    </div>
                )}
            </Card>

            {/* Monthly Totals Summary Table */}
            <Card className="p-6 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white mb-1">Monthly Performance ({selectedYear})</h3>
                    <p className="text-xs text-slate-400 mb-6">Month-by-month cashflow ledger</p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider text-slate-400">
                                    <th className="pb-3 pl-2">Month</th>
                                    <th className="pb-3 text-right text-emerald-600 dark:text-emerald-400">Income</th>
                                    <th className="pb-3 text-right text-rose-600 dark:text-rose-400">Expenses</th>
                                    <th className="pb-3 text-right pr-2">Net Cashflow</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
                                {monthlyData.length > 0 ? (
                                    monthlyData.map((m) => {
                                        const net = m.income - m.expenses;
                                        return (
                                            <tr key={m.month} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                                <td className="py-3 pl-2 font-bold text-slate-800 dark:text-white">{m.month}</td>
                                                <td className="py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                                                    {m.income > 0 ? `+${formatCurrency(m.income)}` : "—"}
                                                </td>
                                                <td className="py-3 text-right font-bold text-rose-600 dark:text-rose-400">
                                                    {m.expenses > 0 ? `-${formatCurrency(m.expenses)}` : "—"}
                                                </td>
                                                <td className="py-3 text-right pr-2">
                                                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold border-0 dark:border ${net >= 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/50" : "bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800/50"}`}>
                                                        {net < 0 ? "-" : "+"}{formatCurrency(Math.abs(net))}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center font-medium text-slate-400">
                                            No monthly records found for {selectedYear}.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        </div>
    );
}
