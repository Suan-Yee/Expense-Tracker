import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card } from "../ui/card";
import DateRangePicker from "../Expenses/DateRangePicker";
import { useAnalyticsStore } from "../../store/analyticsStore";
import type { DashboardRange } from "../../types/analytics.types";

export const RANGE_OPTIONS = [
    { label: "This Month",   value: "this_month"  },
    { label: "Last Month",   value: "last_month"  },
    { label: "Last 3 Months",value: "last_3_months"},
    { label: "This Year",    value: "this_year"   },
    { label: "Pick Month",   value: "month"       },
    { label: "Pick Year",    value: "year"        },
    { label: "Custom Range", value: "custom"      },
];

export const MONTHS = [
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

export const YEARS = Array.from({ length: 6 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return { label: year.toString(), value: year.toString() };
});

export function getRangeLabel(filters: { range: DashboardRange; startDate?: string | null; endDate?: string | null; month?: string | null; year?: string | null }) {
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

export default function PeriodFilterBar() {
    const { dashFilters: filters, setFilters } = useAnalyticsStore();

    const [selectedMonth, setSelectedMonth] = useState(filters.month ?? new Date().getMonth().toString());
    const [selectedYear, setSelectedYear] = useState(filters.year ?? new Date().getFullYear().toString());

    useEffect(() => {
        if (filters.month) setSelectedMonth(filters.month);
        if (filters.year) setSelectedYear(filters.year);
    }, [filters.month, filters.year]);

    const isCustom  = filters.range === "custom";
    const isMonthMod = filters.range === "month";
    const isYearMod  = filters.range === "year";

    const handleRangeChange = (value: string) => {
        const range = value as DashboardRange;
        if (range === "month") {
            setFilters({ range: "month", month: selectedMonth, year: selectedYear });
        } else if (range === "year") {
            setFilters({ range: "year", year: selectedYear, month: null });
        } else if (range === "custom") {
            setFilters({ range: "custom", startDate: filters.startDate, endDate: filters.endDate, month: null, year: null });
        } else {
            setFilters({ range, startDate: null, endDate: null, month: null, year: null });
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

    return (
        <Card className="px-4 py-4 shadow-sm sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2.5 text-slate-500 mr-1">
                        <Calendar size={18} />
                        <span className="text-sm font-bold text-slate-800 dark:text-white whitespace-nowrap">Filter Period:</span>
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
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Active Period: {getRangeLabel(filters)}
                    </span>
                </div>
            </div>
        </Card>
    );
}
