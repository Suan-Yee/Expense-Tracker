import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-0", className)}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center mb-2",
        caption_label: "text-[14px] font-bold text-slate-800",
        nav: "space-x-1 flex items-center absolute inset-x-0 top-0 justify-between px-1",
        button_previous: "flex size-7 items-center justify-center rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors",
        button_next: "flex size-7 items-center justify-center rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors",
        month_grid: "w-full border-collapse",
        weekdays: "grid grid-cols-7 mb-2",
        weekday: "text-[11px] font-bold text-slate-400 text-center",
        week: "grid grid-cols-7 mt-1",
        day: "text-center p-0",
        day_button: cn(
          "flex size-8 items-center justify-center rounded-lg text-[13px] font-medium transition-all mx-auto",
          "text-slate-700 hover:bg-slate-100"
        ),
        selected: "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 rounded-lg hover:bg-emerald-500",
        today: "bg-emerald-50 text-emerald-600 font-bold rounded-lg",
        outside: "text-slate-300",
        disabled: "text-slate-300 opacity-50",
        range_start: "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 rounded-lg",
        range_end: "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 rounded-lg",
        range_middle: "bg-emerald-50 text-emerald-700 rounded-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left"
            ? <ChevronLeft className="size-4" />
            : <ChevronRight className="size-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
