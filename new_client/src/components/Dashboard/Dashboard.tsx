import { useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    Landmark, ShoppingCart, PiggyBank, RefreshCw,
    ArrowUpRight, ArrowDownRight, ReceiptText, AlertTriangle, CheckCircle2, Clock
} from "lucide-react";
import { formatCurrency } from "../../utils/formatUtils";
import { formatDate } from "../../utils/dateUtils";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { useExpenseStore } from "../../store/expenseStore";
import { useBudgetStore } from "../../store/budgetStore";
import { CATEGORY_COLORS, CATEGORY_HEX_COLORS } from "../../constants/categories";
import PeriodFilterBar from "../Common/PeriodFilterBar";
import KPICard from "../Common/KPICard";

export default function Dashboard() {
    const navigate = useNavigate();
    const { dashboardStats, isLoading: analyticsLoading, error, fetchDashboard } = useAnalyticsStore();
    const { expenses, isLoading: expensesLoading, getAllExpenses } = useExpenseStore();
    const { budgets, isLoading: budgetsLoading, fetchBudgets } = useBudgetStore();

    useEffect(() => {
        void fetchDashboard();
        void getAllExpenses();
        void fetchBudgets();
    }, [fetchBudgets, fetchDashboard, getAllExpenses]);


    const stats = dashboardStats;
    const monthlyChange = stats?.monthlyChange ?? 0;

    // Derived operational data
    const recentTransactions = expenses
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    const recurringExpenses = expenses.filter(e => e.isRecurring);
    const recurringTotal = recurringExpenses.reduce((sum, e) => sum + Math.abs(e.amount), 0);

    const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalBudgetSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
    const budgetUsedPercent = totalBudgetLimit > 0 ? Math.round((totalBudgetSpent / totalBudgetLimit) * 100) : 0;

    const sortedBudgets = budgets
        .slice()
        .sort((a, b) => (b.percentage || 0) - (a.percentage || 0));

    const isLoading = analyticsLoading || expensesLoading || budgetsLoading;

    return (
        <div className="mx-auto mt-6 flex w-full max-w-[1400px] animate-in flex-col gap-6 px-4 pb-12 duration-500 fade-in sm:px-6 lg:mt-8 lg:gap-8 lg:px-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Daily command center for your spending pulse and immediate actions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => navigate({ to: "/expenses" })} className="px-5 py-2.5 font-bold shadow-sm shadow-emerald-600/20">
                        + Log Transaction
                    </Button>
                </div>
            </div>

            {/* Filter Bar */}
            <PeriodFilterBar />

            {/* Budget Health Banner */}
            {totalBudgetLimit > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <div className={`rounded-2xl p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-all ${
                        budgetUsedPercent >= 90 ? "bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800/40" : budgetUsedPercent >= 75 ? "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/40" : "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/40"
                    }`}>
                        <div className="flex items-center gap-3.5">
                            <div className={`p-3 rounded-xl ${budgetUsedPercent >= 90 ? "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400" : budgetUsedPercent >= 75 ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"}`}>
                                {budgetUsedPercent >= 90 ? <AlertTriangle size={22} strokeWidth={2.5} /> : <CheckCircle2 size={22} strokeWidth={2.5} />}
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-slate-900 dark:text-emerald-300">
                                    Monthly Budget Consumption: {budgetUsedPercent}%
                                </h4>
                                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                                    You have spent {formatCurrency(totalBudgetSpent)} out of your {formatCurrency(totalBudgetLimit)} monthly ceiling.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link to="/budgets" className="text-xs font-bold underline text-slate-700 hover:text-slate-900 dark:text-emerald-400 dark:hover:text-emerald-300">
                                Adjust Budgets &rarr;
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}

            {error && (
                <div className="rounded-2xl bg-red-50 border border-red-100 px-5 py-4 text-sm font-semibold text-red-600">
                    {error}
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard label="Total Income" value={stats?.totalIncome ?? 0} icon={Landmark} theme="emerald" delay={0} loading={isLoading} />
                <KPICard
                    label="Total Expenses"
                    value={stats?.totalExpenses ?? 0}
                    icon={ShoppingCart}
                    theme="rose"
                    delay={0.05}
                    loading={isLoading}
                    badge={
                        monthlyChange !== 0 ? (
                            <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${monthlyChange > 0 ? "bg-red-50 text-red-600 dark:bg-red-950/80 dark:text-red-300 dark:border dark:border-red-800/50" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-800/50"}`}>
                                {monthlyChange > 0 ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
                                {Math.abs(monthlyChange)}%
                            </div>
                        ) : undefined
                    }
                />
                <KPICard label="Budget Remaining" value={totalBudgetLimit > 0 ? Math.max(0, totalBudgetLimit - totalBudgetSpent) : stats?.currentMonthTotal ?? 0} icon={PiggyBank} theme="blue" delay={0.1} loading={isLoading} />
                <KPICard label="Recurring Bills" value={`${recurringExpenses.length} active (${formatCurrency(recurringTotal)})`} icon={RefreshCw} theme="violet" delay={0.15} loading={isLoading} />
            </div>

            {/* Operational Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left 2 Cols: Recent Transactions Feed */}
                <Card className="p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-bold text-slate-800 mb-1">Recent Transactions</h3>
                                <p className="text-xs text-slate-400">Latest 5 financial entries logged</p>
                            </div>
                            <Link to="/expenses" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                                View All Ledger &rarr;
                            </Link>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {recentTransactions.length > 0 ? (
                                recentTransactions.map((tr) => {
                                    const isIncome = tr.type === "income" || (tr.type === undefined && tr.amount > 0);
                                    const badgeColor = CATEGORY_COLORS[tr.category?.toLowerCase()] ?? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

                                    return (
                                        <div key={tr._id} className={`py-3.5 flex items-center justify-between gap-4 px-3 bg-transparent`}>
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                                                    <ReceiptText size={18} strokeWidth={2.2} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{tr.description}</p>
                                                        {tr.isRecurring && (
                                                            <span title="Recurring" className="size-4 rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400 flex items-center justify-center shrink-0">
                                                                <RefreshCw size={9} strokeWidth={2.5} />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[11px] font-semibold text-slate-400">{formatDate(tr.date, "MMM dd, yyyy")}</span>
                                                        <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                                                        <Badge className={`${badgeColor} text-[10px] px-1.5 py-0 font-bold border-0 capitalize`}>
                                                            {tr.category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`text-sm font-bold whitespace-nowrap ${isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>
                                                {isIncome ? "+" : ""}{formatCurrency(Math.abs(tr.amount))}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-12 text-center text-slate-400">
                                    <ReceiptText size={36} className="mx-auto mb-2 opacity-30" />
                                    <p className="text-sm font-semibold">No recent transactions recorded yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex justify-center">
                        <Link to="/expenses">
                            <Button variant="ghost" className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                                Open Expense Ledger &rarr;
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* Right 1 Col: Operational Widgets Stack */}
                <div className="space-y-6">
                    
                    {/* Budget Watchlist */}
                    <Card className="p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-slate-800 mb-1">Budget Watchlist</h3>
                                <p className="text-xs text-slate-400">Top consuming categories</p>
                            </div>
                            <Link to="/budgets" className="text-xs font-bold text-emerald-600 hover:underline">
                                Edit &rarr;
                            </Link>
                        </div>

                        {sortedBudgets.length > 0 ? (
                            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1 [scrollbar-gutter:stable]">
                                {sortedBudgets.map((b) => {
                                    const pct = b.percentage || 0;
                                    const barColor = CATEGORY_HEX_COLORS[b.category.toLowerCase()] ?? "#10b981";

                                    return (
                                        <div key={b._id} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-bold text-slate-700 capitalize">{b.category}</span>
                                                <span className="font-bold text-slate-900">{formatCurrency(b.spent || 0)} <span className="font-medium text-slate-400">/ {formatCurrency(b.limit)}</span></span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="py-6 text-center text-xs font-semibold text-slate-400">No active budgets monitored.</p>
                        )}
                    </Card>

                    {/* Recurring Commitments Widget */}
                    <Card className="p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-slate-800 mb-1">Recurring Bills</h3>
                                <p className="text-xs text-slate-400">Active automatic expenses</p>
                            </div>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                                {recurringExpenses.length} Active
                            </span>
                        </div>

                        {recurringExpenses.length > 0 ? (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[220px] overflow-y-auto pr-1">
                                {recurringExpenses.map((rec) => (
                                    <div key={rec._id} className="py-2.5 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="size-7 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400 flex items-center justify-center shrink-0">
                                                <Clock size={14} strokeWidth={2.5} />
                                            </div>
                                            <div className="truncate">
                                                <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{rec.description}</p>
                                                <p className="text-[10px] font-semibold text-slate-400 capitalize">{rec.frequency || "Monthly"}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap">{formatCurrency(Math.abs(rec.amount))}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="py-6 text-center text-xs font-semibold text-slate-400">No recurring transactions configured.</p>
                        )}
                    </Card>

                </div>

            </div>
        </div>
    );
}
