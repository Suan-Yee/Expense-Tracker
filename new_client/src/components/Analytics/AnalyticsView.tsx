import { useEffect } from "react";
import { useAnalyticsStore } from "../../store/analyticsStore";
import AnalyticsHeader from "./AnalyticsHeader";
import AnalyticsKPIs from "./AnalyticsKPIs";
import AnalyticsCharts from "./AnalyticsCharts";
import AnalyticsTables from "./AnalyticsTables";

export default function AnalyticsView() {
    const {
        dashboardStats,
        trends,
        categoryData,
        monthlyData,
        dashFilters,
        selectedYear,
        isLoading,
        setFilters,
        setSelectedYear,
        fetchDashboard
    } = useAnalyticsStore();

    useEffect(() => {
        fetchDashboard();
    }, []);

    const totalInc = dashboardStats?.totalIncome || 0;
    const totalExp = dashboardStats?.totalExpenses || 0;
    const netCashflow = totalInc - totalExp;
    const savingsRate = totalInc > 0 ? Math.round((netCashflow / totalInc) * 100) : 0;

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-500 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div className="space-y-8">
                <AnalyticsHeader
                    range={dashFilters.range}
                    selectedYear={selectedYear}
                    isLoading={isLoading}
                    onRangeChange={(val) => setFilters({ ...dashFilters, range: val, year: new Date().getFullYear().toString() })}
                    onYearChange={(val) => setSelectedYear(val)}
                />

                <AnalyticsKPIs
                    totalInc={totalInc}
                    totalExp={totalExp}
                    netCashflow={netCashflow}
                    savingsRate={savingsRate}
                />

                <AnalyticsCharts
                    categoryData={categoryData}
                    trends={trends}
                />

                <AnalyticsTables
                    categoryData={categoryData}
                    monthlyData={monthlyData}
                    selectedYear={selectedYear}
                />
            </div>
        </div>
    );
}
