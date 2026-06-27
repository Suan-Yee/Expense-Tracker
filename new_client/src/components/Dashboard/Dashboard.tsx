import { useState, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
    Landmark, ShoppingCart, PiggyBank, RefreshCw,
    ArrowUpRight, ArrowDownRight, Calendar, ReceiptText, AlertTriangle, CheckCircle2, Clock
} from "lucide-react";
import { formatCurrency } from "../../utils/formatUtils";
import { formatDate } from "../../utils/dateUtils";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import DateRangePicker from "../Expenses/DateRangePicker";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { useExpenseStore } from "../../store/expenseStore";
import { useBudgetStore } from "../../store/budgetStore";
import { CATEGORY_COLORS, CATEGORY_HEX_COLORS } from "../../constants/categories";
import type { DashboardRange } from "../../types/analytics.types";

const RANGE_OPTIONS = [
    { label: "This Month",   value: "this_month"  },
    { label: "Last Month",   value: "last_month"  },
    { label: "Last 3 Months",value: "last_3_months"},
    { label: "This Year",    value: "this_year"   },
    { label: "Custom Range", value: "custom"      },
];

const MONTHS = [
    { label: "January",   value: "0"  },
    { label: "February",  value: "1"  },
    { label: "March",     value: "2"  },
    { label: "April",     value: "3"  },
    { label: "May",       value: "4"  },
    { label: "June",      value: "5"  },
    { label: "July",      value: "6"  },
    { label: "August",    value: "7"  },
    { label: "September", value: "8"  },
    { label: "October",   value: "9"  },
    { label: "November",  value: "10" },
    { label: "December",  value: "11" },
];

const YEARS = Array.from({ length: 6 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return { label: year.toString(), value: year.toString() };
});

function getRangeLabel(filters: { range: DashboardRange; startDate?: string | null; endDate?: string | null; month?: string | null; year?: string | null }) {
    if (filters.range === "custom" && filters.startDate && filters.endDate) {
        const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        return `${fmt(filters.startDate)} – ${fmt(filters.endDate)}`;
    }
    if (filters.range === "month" && filters.month && filters.year) {
        return new Date(parseInt(filters.year), parseInt(filters.month)).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }
    if (filters.range === "year" && filters.year) return filters.year;
    return RANGE_OPTIONS.find(o => o.value === filters.range)?.label ?? "This Month";
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    badge?: { value: number; isPositiveGood?: boolean };
    loading: boolean;
}

function StatCard({ label, value, icon: Icon, iconBg, iconColor, badge, loading }: StatCardProps) {
    const badgeUp = badge && badge.value > 0;
    const badgeColor = badge
        ? badge.isPositiveGood === false
            ? badgeUp ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
            : badgeUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        : "";

    return (
        <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className={`rounded-2xl ${iconBg} p-3.5`}>
                    <Icon size={20} className={iconColor} strokeWidth={2.5} />
                </div>
                {badge && (
                    <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${badgeColor}`}>
                        {badgeUp ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
                        {Math.abs(badge.value)}%
                    </div>
                )}
            </div>
            <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
                {loading ? (
                    <div className="mt-2 h-8 w-32 animate-pulse rounded-lg bg-slate-100" />
                ) : (
                    <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                        {typeof value === "number" ? formatCurrency(value) : value}
                    </h3>
                )}
            </div>
        </Card>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();
    const { dashboardStats, dashFilters: filters, isLoading: analyticsLoading, error, setFilters, fetchDashboard } = useAnalyticsStore();
    const { expenses, isLoading: expensesLoading, getAllExpenses } = useExpenseStore();
    const { budgets, isLoading: budgetsLoading, fetchBudgets } = useBudgetStore();

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

    useEffect(() => {
        fetchDashboard(filters);
        getAllExpenses();
        fetchBudgets();
    }, []);

    const isCustom  = filters.range === "custom";
    const isMonthMod = filters.range === "month";
    const isYearMod  = filters.range === "year";

    const handleRangeChange = (value: string) => {
        const range = value as DashboardRange;
        if (range === "last_7_days") {
            setFilters({ range: "last_7_days", startDate: null, endDate: null, month: null, year: null });
        } else if (range === "month") {
            setFilters({ range: "month", month: selectedMonth, year: selectedYear });
        } else if (range === "year") {
            setFilters({ range: "year", year: selectedYear, month: null });
        } else {
            setFilters({ range: "custom", startDate: filters.startDate, endDate: filters.endDate, month: null, year: null });
        }
    };

    const handleMonthChange = (val: string) => {
        setSelectedMonth(val);
        setFilters({ ...filters, month: val, year: selectedYear });
    };

    const handleYearChange = (val: string) => {
        setSelectedYear(val);
        setFilters({ ...filters, year: val });
    };

    const handleCustomDates = (start: string | null, end: string | null) => {
        if (start && end) setFilters({ range: "custom", startDate: start, endDate: end, month: null, year: null });
    };

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
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-500 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Dashboard</h1>
                    <p className="text-slate-500 font-medium mt-1">Daily command center for your spending pulse and immediate actions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => navigate({ to: "/expenses" })} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 shadow-sm shadow-emerald-600/20">
                        + Log Transaction
                    </Button>
                </div>
            </div>

            {/* Filter Bar */}
            <Card className="px-6 py-4 rounded-[20px] shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2.5 text-slate-500 mr-1">
                            <Calendar size={18} />
                            <span className="text-sm font-bold text-slate-800 whitespace-nowrap">Filter Period:</span>
                        </div>

                        <div className="w-[160px]">
                            <Select value={isMonthMod ? "month" : isYearMod ? "year" : filters.range} onValueChange={handleRangeChange}>
                                <SelectTrigger className="font-semibold"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {RANGE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value} className="font-semibold">{o.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {isMonthMod && (
                            <div className="w-[145px]">
                                <Select value={selectedMonth} onValueChange={handleMonthChange}>
                                    <SelectTrigger className="font-semibold"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {MONTHS.map(m => <SelectItem key={m.value} value={m.value} className="font-semibold">{m.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {(isMonthMod || isYearMod) && (
                            <div className="w-[105px]">
                                <Select value={selectedYear} onValueChange={handleYearChange}>
                                    <SelectTrigger className="font-semibold"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {YEARS.map(y => <SelectItem key={y.value} value={y.value} className="font-semibold">{y.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {isCustom && !isMonthMod && !isYearMod && (
                            <DateRangePicker
                                startDate={filters.startDate ?? null}
                                endDate={filters.endDate ?? null}
                                onChange={handleCustomDates}
                            />
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-slate-500">
                            Active Period: {getRangeLabel(filters)}
                        </span>
                    </div>
                </div>
            </Card>

            {/* Budget Health Banner */}
            {totalBudgetLimit > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <div className={`rounded-2xl p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${
                        budgetUsedPercent >= 90 ? "bg-rose-50 border-rose-200" : budgetUsedPercent >= 75 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"
                    }`}>
                        <div className="flex items-center gap-3.5">
                            <div className={`p-3 rounded-xl ${budgetUsedPercent >= 90 ? "bg-rose-100 text-rose-600" : budgetUsedPercent >= 75 ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}>
                                {budgetUsedPercent >= 90 ? <AlertTriangle size={22} strokeWidth={2.5} /> : <CheckCircle2 size={22} strokeWidth={2.5} />}
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-slate-900">
                                    Monthly Budget Consumption: {budgetUsedPercent}%
                                </h4>
                                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                                    You have spent {formatCurrency(totalBudgetSpent)} out of your {formatCurrency(totalBudgetLimit)} monthly ceiling.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link to="/budgets" className="text-xs font-bold underline text-slate-700 hover:text-slate-900">
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
                <StatCard label="Total Income"      value={stats?.totalIncome ?? 0}       icon={Landmark}     iconBg="bg-slate-100"  iconColor="text-slate-700"   loading={isLoading} />
                <StatCard label="Total Expenses"    value={stats?.totalExpenses ?? 0}     icon={ShoppingCart} iconBg="bg-rose-50"    iconColor="text-rose-600"    badge={{ value: monthlyChange, isPositiveGood: false }} loading={isLoading} />
                <StatCard label="Budget Remaining"  value={totalBudgetLimit > 0 ? Math.max(0, totalBudgetLimit - totalBudgetSpent) : stats?.currentMonthTotal ?? 0} icon={PiggyBank} iconBg="bg-emerald-50" iconColor="text-emerald-600" loading={isLoading} />
                <StatCard label="Recurring Bills"   value={`${recurringExpenses.length} active (${formatCurrency(recurringTotal)})`} icon={RefreshCw} iconBg="bg-violet-50" iconColor="text-violet-600" loading={isLoading} />
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

                        <div className="divide-y divide-slate-100">
                            {recentTransactions.length > 0 ? (
                                recentTransactions.map((tr, i) => {
                                    const isIncome = tr.type === "income" || (tr.type === undefined && tr.amount > 0);
                                    const badgeColor = CATEGORY_COLORS[tr.category?.toLowerCase()] ?? "bg-slate-100 text-slate-600";

                                    return (
                                        <div key={tr._id} className={`py-3.5 flex items-center justify-between gap-4 px-3 rounded-xl transition-colors ${i % 2 === 1 ? "bg-slate-50/60" : "bg-transparent"} hover:bg-slate-100/70`}>
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                                                    <ReceiptText size={18} strokeWidth={2.2} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-sm text-slate-800 truncate">{tr.description}</p>
                                                        {tr.isRecurring && (
                                                            <span title="Recurring" className="size-4 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                                                                <RefreshCw size={9} strokeWidth={2.5} />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[11px] font-semibold text-slate-400">{formatDate(tr.date, "MMM dd, yyyy")}</span>
                                                        <span className="text-slate-300">&bull;</span>
                                                        <Badge className={`${badgeColor} text-[10px] px-1.5 py-0 font-bold border-0 capitalize`}>
                                                            {tr.category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`text-sm font-bold whitespace-nowrap ${isIncome ? "text-emerald-600" : "text-slate-900"}`}>
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

                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center">
                        <Link to="/expenses">
                            <Button variant="ghost" className="text-xs font-bold text-slate-600 hover:text-slate-900">
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
                            <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto pr-1">
                                {recurringExpenses.map((rec) => (
                                    <div key={rec._id} className="py-2.5 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="size-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                                                <Clock size={14} strokeWidth={2.5} />
                                            </div>
                                            <div className="truncate">
                                                <p className="font-bold text-slate-800 truncate">{rec.description}</p>
                                                <p className="text-[10px] font-semibold text-slate-400 capitalize">{rec.frequency || "Monthly"}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-slate-900 whitespace-nowrap">{formatCurrency(Math.abs(rec.amount))}</span>
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
