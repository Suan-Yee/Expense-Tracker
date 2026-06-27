import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { cn } from "../../lib/utils"

interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: (string | SelectOption)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({ options, value, onChange, placeholder = "Select...", className = "" }: CustomSelectProps) {
  const normalized: SelectOption[] = options.map((o) =>
    typeof o === "string" ? { label: o, value: o } : o
  );

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("h-10", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {normalized.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
