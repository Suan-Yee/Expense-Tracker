import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatCurrency } from "../../utils/formatUtils";

interface AnalyticsKPIsProps {
    totalInc: number;
    totalExp: number;
    netCashflow: number;
    savingsRate: number;
}

export default function AnalyticsKPIs({
    totalInc,
    totalExp,
    netCashflow,
    savingsRate
}: AnalyticsKPIsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card className="relative overflow-hidden p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-emerald-500/10 blur-xl" />
                    <div className="flex items-center justify-between">
                        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 p-3.5 text-emerald-600 dark:text-emerald-400">
                            <TrendingUp size={22} strokeWidth={2.5} />
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold border-0 dark:border dark:border-emerald-800/50">Income</Badge>
                    </div>
                    <div className="mt-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Income</p>
                        <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                            {formatCurrency(totalInc)}
                        </h3>
                    </div>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
                <Card className="relative overflow-hidden p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-rose-500/10 blur-xl" />
                    <div className="flex items-center justify-between">
                        <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/60 p-3.5 text-rose-600 dark:text-rose-400">
                            <TrendingDown size={22} strokeWidth={2.5} />
                        </div>
                        <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 font-bold border-0 dark:border dark:border-rose-800/50">Expenses</Badge>
                    </div>
                    <div className="mt-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Expenses</p>
                        <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                            {formatCurrency(totalExp)}
                        </h3>
                    </div>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                <Card className="relative overflow-hidden p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-blue-500/10 blur-xl" />
                    <div className="flex items-center justify-between">
                        <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/60 p-3.5 text-blue-600 dark:text-blue-400">
                            <Wallet size={22} strokeWidth={2.5} />
                        </div>
                        <Badge className={netCashflow >= 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold border-0 dark:border dark:border-emerald-800/50" : "bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 font-bold border-0 dark:border dark:border-rose-800/50"}>
                            {netCashflow >= 0 ? "Surplus" : "Deficit"}
                        </Badge>
                    </div>
                    <div className="mt-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Cashflow</p>
                        <h3 className={`mt-1 text-xl font-bold sm:text-2xl ${netCashflow >= 0 ? "text-slate-900 dark:text-white" : "text-rose-600 dark:text-rose-400"}`}>
                            {netCashflow < 0 ? "-" : ""}{formatCurrency(Math.abs(netCashflow))}
                        </h3>
                    </div>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
                <Card className="relative overflow-hidden p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-violet-500/10 blur-xl" />
                    <div className="flex items-center justify-between">
                        <div className="rounded-2xl bg-violet-50 dark:bg-violet-950/60 p-3.5 text-violet-600 dark:text-violet-400">
                            <PiggyBank size={22} strokeWidth={2.5} />
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400">
                            {savingsRate >= 20 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            Target: 20%
                        </div>
                    </div>
                    <div className="mt-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Savings Rate</p>
                        <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                            {savingsRate}%
                        </h3>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
