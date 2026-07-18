import { useEffect } from "react";
import { useAnalyticsStore } from "../../store/analyticsStore";
import AnalyticsHeader from "./AnalyticsHeader";
import AnalyticsKPIs from "./AnalyticsKPIs";
import AnalyticsCharts from "./AnalyticsCharts";
import AnalyticsTables from "./AnalyticsTables";
import PeriodFilterBar from "../Common/PeriodFilterBar";
import GlobalError from "../Common/GlobalError";
import Loader from "../Common/Loader";
import { Info } from "lucide-react";


export default function AnalyticsView() {
    const {
        dashboardStats,
        trends,
        categoryData,
        monthlyData,
        selectedYear,
        isLoading,
        error,
        fetchDashboard
    } = useAnalyticsStore();

    useEffect(() => {
        void fetchDashboard();
    }, [fetchDashboard]);

    const totalInc = dashboardStats?.totalIncome || 0;
    const totalExp = dashboardStats?.totalExpenses || 0;
    const netCashflow = totalInc - totalExp;
    const savingsRate = totalInc > 0 ? Math.round((netCashflow / totalInc) * 100) : 0;

    return (
        <div className="page-shell gap-8">
            <div className="space-y-8">
                <AnalyticsHeader />
                <PeriodFilterBar />
                {isLoading && !dashboardStats ? <Loader text="Loading analytics…" /> : null}
                {error ? <GlobalError message={error} onRetry={() => void fetchDashboard()} /> : null}
                {dashboardStats && <>
                <AnalyticsKPIs
                    totalInc={totalInc}
                    totalExp={totalExp}
                    netCashflow={netCashflow}
                    savingsRate={savingsRate}
                />

                {dashboardStats?.lastMonthTotal === 0 && (
                    <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3.5 text-sm text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200" role="note">
                        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        <p><span className="font-semibold">No prior-period comparison is available.</span> Add transactions across another month or choose a wider period to see how spending is changing.</p>
                    </div>
                )}

                <AnalyticsCharts
                    categoryData={categoryData}
                    trends={trends}
                />

                <AnalyticsTables
                    categoryData={categoryData}
                    monthlyData={monthlyData}
                    selectedYear={selectedYear}
                />
                </>}
            </div>
        </div>
    );
}
