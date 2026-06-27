import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"

interface DateRangePickerProps {
  startDate: string | null;
  endDate: string | null;
  onChange: (start: string | null, end: string | null) => void;
  className?: string;
}

export default function DateRangePicker({ startDate, endDate, onChange, className = "" }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  const range: DateRange | undefined =
    startDate
      ? {
          from: new Date(startDate + "T00:00:00"),
          to: endDate ? new Date(endDate + "T00:00:00") : undefined,
        }
      : undefined

  const handleSelect = (selected: DateRange | undefined) => {
    if (!selected) {
      onChange(null, null)
      return
    }
    const start = selected.from ? format(selected.from, "yyyy-MM-dd") : null
    const end = selected.to ? format(selected.to, "yyyy-MM-dd") : null
    onChange(start, end)
    if (selected.from && selected.to) {
      setTimeout(() => setOpen(false), 150)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null, null)
    setOpen(false)
  }

  let displayText = "Select Date Range"
  if (startDate && endDate) {
    displayText = `${format(new Date(startDate + "T00:00:00"), "MMM dd")} - ${format(new Date(endDate + "T00:00:00"), "MMM dd, yyyy")}`
  } else if (startDate) {
    displayText = `${format(new Date(startDate + "T00:00:00"), "MMM dd, yyyy")} - ...`
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-10 min-w-[200px] justify-start gap-2 rounded-xl border-slate-200 bg-white/60 px-4 text-[13px] font-semibold text-slate-600 hover:bg-white",
            (open || startDate) && "border-emerald-400",
            className
          )}
        >
          <CalendarIcon size={14} className={cn("transition-colors", open || startDate ? "text-emerald-500" : "text-slate-400")} />
          <span className="whitespace-nowrap">{displayText}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <Calendar
          mode="range"
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={1}
          initialFocus
        />
        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={handleClear}
            className="text-[12px] font-semibold text-slate-400 hover:text-red-500 transition-colors"
          >
            Clear dates
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
