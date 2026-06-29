import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "../ui/badge";
import KPICard from "../Common/KPICard";
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
    const isSurplus = netCashflow >= 0;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
                label="Total Income"
                value={totalInc}
                icon={TrendingUp}
                theme="emerald"
                delay={0}
                badge={
                    <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold border-0 dark:border dark:border-emerald-800/50">
                        Income
                    </Badge>
                }
            />

            <KPICard
                label="Total Expenses"
                value={totalExp}
                icon={TrendingDown}
                theme="rose"
                delay={0.05}
                badge={
                    <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 font-bold border-0 dark:border dark:border-rose-800/50">
                        Expenses
                    </Badge>
                }
            />

            <KPICard
                label="Net Cashflow"
                value={`${isSurplus ? "" : "-"}${formatCurrency(Math.abs(netCashflow))}`}
                icon={Wallet}
                theme="blue"
                delay={0.1}
                valueClassName={isSurplus ? "text-slate-900 dark:text-white" : "text-rose-600 dark:text-rose-400"}
                badge={
                    <Badge className={isSurplus ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold border-0 dark:border dark:border-emerald-800/50" : "bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 font-bold border-0 dark:border dark:border-rose-800/50"}>
                        {isSurplus ? "Surplus" : "Deficit"}
                    </Badge>
                }
            />

            <KPICard
                label="Savings Rate"
                value={`${savingsRate}%`}
                icon={PiggyBank}
                theme="violet"
                delay={0.15}
                badge={
                    <div className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400">
                        {savingsRate >= 20 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        Target: 20%
                    </div>
                }
            />
        </div>
    );
}
