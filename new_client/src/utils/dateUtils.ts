import { format, parseISO, isValid } from "date-fns";

export const parseDateForUI = (val: string | null | undefined): Date => {
  if (!val) return new Date();
  if (val.length === 10) return new Date(val + "T00:00:00");
  return new Date(val);
};

export const formatDate = (dateValue: string | number | Date | null | undefined, formatStr: string): string => {
  if (!dateValue) return "N/A";
  const date =
    typeof dateValue === "string" ? parseISO(dateValue) : new Date(dateValue);
  return isValid(date) ? format(date, formatStr) : "Invalid Date";
};

export const getMonths = (
  locale: string = 'en-US', 
  format: 'long' | 'short' | 'narrow' = 'long'
): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { month: format });
  
  return Array.from({ length: 12 }, (_, i): string => 
    formatter.format(new Date(2023, i, 1))
  );
};

export const getYears = (
  backwards: number = 50, 
  forwards: number = 10
): string[] => {
  const currentYear = new Date().getFullYear();
  
  return Array.from(
    { length: backwards + forwards + 1 }, 
    (_, i): string => ((currentYear - backwards) + i).toString()
  );
};
