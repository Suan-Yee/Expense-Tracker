import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"
import { parseDateForUI } from "../../utils/dateUtils"

interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  className?: string;
}

export default function CustomDatePicker({ value, onChange, className = "" }: CustomDatePickerProps) {
  const [open, setOpen] = useState(false)

  const selectedDate = value ? parseDateForUI(value) : undefined

  const handleSelect = (date: Date | undefined) => {
    if (!date) return
    const dayStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    onChange(dayStr)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start gap-3 rounded-xl border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] font-medium text-slate-700 hover:bg-slate-100",
            !value && "text-slate-400",
            className
          )}
        >
          <CalendarIcon size={16} className={cn("transition-colors", open ? "text-emerald-500" : "text-slate-400")} />
          {value ? format(parseDateForUI(value), "MMM dd, yyyy") : "Select Date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start" side="top">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
