import { Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { DashboardRange } from "../../types/analytics.types";

const currentYear = new Date().getFullYear();
const UNIFIED_OPTIONS = [
    { label: "This Month", value: "this_month" },
    { label: "Last Month", value: "last_month" },
    { label: "Last 3 Months", value: "last_3_months" },
    { label: `This Year (${currentYear})`, value: "this_year" },
    { label: `Year ${currentYear - 1}`, value: `year_${currentYear - 1}` },
    { label: `Year ${currentYear - 2}`, value: `year_${currentYear - 2}` },
];

interface AnalyticsHeaderProps {
    range: DashboardRange;
    selectedYear: number;
    isLoading?: boolean;
    onRangeChange: (val: DashboardRange) => void;
    onYearChange: (val: number) => void;
}

export default function AnalyticsHeader({
    range,
    selectedYear,
    onRangeChange,
    onYearChange,
}: AnalyticsHeaderProps) {
    const activeValue = range === "year" ? `year_${selectedYear}` : range;

    const handleSelectionChange = (val: string) => {
        if (val.startsWith("year_")) {
            const yr = Number(val.replace("year_", ""));
            onYearChange(yr);
        } else {
            onRangeChange(val as DashboardRange);
        }
    };

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-2">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
                    Analytics
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-500">
                    Deep dive into your spending breakdown, cashflow trends, and budget health.
                </p>
            </div>

            <div className="flex items-center">
                <div className="flex items-center gap-1 rounded-xl bg-white/70 backdrop-blur-xl px-3 py-1 shadow-sm border border-white/60">
                    <Calendar size={15} className="text-slate-400 shrink-0" />
                    <Select value={activeValue} onValueChange={handleSelectionChange}>
                        <SelectTrigger className="h-8 border-0 bg-transparent hover:bg-transparent focus:bg-transparent focus:ring-0 shadow-none px-1.5 text-xs font-bold text-slate-700">
                            <SelectValue placeholder="Select Period" />
                        </SelectTrigger>
                        <SelectContent>
                            {UNIFIED_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="text-xs font-semibold">
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
