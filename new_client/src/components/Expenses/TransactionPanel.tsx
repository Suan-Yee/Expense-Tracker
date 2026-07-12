import { X, Trash2, Loader2, ArrowUpCircle, ArrowDownCircle, PiggyBank, RefreshCw, Tag, X as XSmall } from "lucide-react"
import { useState } from "react"
import type { KeyboardEvent } from "react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import CustomDatePicker from "./CustomDatePicker"
import { useExpenseStore } from "../../store/expenseStore"
import { EXPENSE_CATEGORIES } from "../../constants/categories"
import { type ExpenseFormData } from "../../types/expense.types"
import { TransactionType, RecurringFrequency, type Expense } from "../../types"
import { formatCurrency } from "../../utils/formatUtils"
import { motion, AnimatePresence } from "framer-motion"

const FREQUENCY_OPTIONS = [
    { label: "Daily",   value: RecurringFrequency.DAILY   },
    { label: "Weekly",  value: RecurringFrequency.WEEKLY  },
    { label: "Monthly", value: RecurringFrequency.MONTHLY },
    { label: "Yearly",  value: RecurringFrequency.YEARLY  },
]

interface TransactionPanelProps {
  transaction: Expense | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function TransactionPanel({ transaction, onClose, onDelete }: TransactionPanelProps) {
  const initialDate = transaction?.date
    ? (typeof transaction.date === "string" ? transaction.date.split("T")[0] : transaction.date.toISOString().split("T")[0])
    : new Date().toISOString().split("T")[0]
  const [description, setDescription] = useState(transaction?.description ?? "")
  const [amount, setAmount] = useState(transaction ? Math.abs(transaction.amount).toString() : "")
  const [type, setType] = useState<TransactionType>(transaction?.type ?? TransactionType.EXPENSE)
  const [category, setCategory] = useState(transaction?.category ?? "food")
  const [date, setDate] = useState(initialDate)
  const [tags, setTags] = useState<string[]>(transaction?.tags ?? [])
  const [tagInput, setTagInput] = useState("")
  const [isRecurring, setIsRecurring] = useState(transaction?.isRecurring ?? false)
  const [frequency, setFrequency] = useState<RecurringFrequency>(transaction?.frequency ?? RecurringFrequency.MONTHLY)
  const [localError, setLocalError] = useState("")

  const isEdit = !!transaction
  const isIncome = type === TransactionType.INCOME
  const { createExpense, updateExpense, isLoading, error } = useExpenseStore()

  // Tag input handlers
  const addTag = (raw: string) => {
    const t = raw.trim().toLowerCase()
    if (t && !tags.includes(t) && tags.length < 8) {
      setTags(prev => [...prev, t])
    }
    setTagInput("")
  }

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(tagInput)
    }
    if (e.key === "Backspace" && !tagInput && tags.length) {
      setTags(prev => prev.slice(0, -1))
    }
  }

  const removeTag = (t: string) => setTags(prev => prev.filter(x => x !== t))

  const handleSave = async () => {
    setLocalError("")
    if (!description || !amount || !category || !date) {
      setLocalError("Please fill in all required fields.")
      return
    }

    const expenseData: ExpenseFormData = {
      amount: Math.abs(parseFloat(amount)),
      type,
      category,
      description,
      date,
      tags,
      isRecurring,
      frequency: isRecurring ? frequency : undefined,
    }

    if (isEdit) {
      await updateExpense(transaction._id, expenseData)
      if (!useExpenseStore.getState().error) onClose()
    } else {
      await createExpense(expenseData)
      if (!useExpenseStore.getState().error) onClose()
    }
  }

  const normalizedCategories = EXPENSE_CATEGORIES.map((o) =>
    typeof o === "string" ? { label: o, value: o } : o
  )

  return (
    <div className="flex h-full w-full flex-col border-l border-white/70 bg-white/92 shadow-2xl shadow-slate-950/15 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/92">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <h2 id="transaction-panel-title" className="text-lg font-bold text-slate-800 dark:text-white">
          {isEdit ? "Transaction Details" : "New Transaction"}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
          <X size={18} strokeWidth={2.5} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">

        {isEdit && (
          <div className="flex flex-col items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{description || "No Description"}</h3>
            <p className={`text-2xl font-black tracking-tight ${isIncome ? "text-emerald-500 dark:text-emerald-400" : "text-slate-800 dark:text-white"}`}>
              {isIncome ? "+" : "−"}{formatCurrency(parseFloat(amount) || 0)}
            </p>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              {date ? format(date.length === 10 ? new Date(date + "T00:00:00") : new Date(date), "MMM dd, yyyy") : "No Date"}
            </p>
            {isRecurring && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-violet-100 dark:bg-violet-950/80 dark:text-violet-300 dark:border dark:border-violet-800/50 px-3 py-1 text-[11px] font-bold text-violet-600"
              >
                <RefreshCw size={10} strokeWidth={3} />
                Recurring · {frequency}
              </motion.span>
            )}
          </div>
        )}

        {localError && (
          <div className="mb-6 rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50/90 dark:bg-red-950/80 px-3 py-2.5 text-[13px] font-medium text-red-600 dark:text-red-300 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
            {localError}
          </div>
        )}

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>

          {/* Transaction Type */}
          <div>
            <Label className="mb-2.5">Transaction Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: TransactionType.EXPENSE, label: "Expense", icon: <ArrowDownCircle size={16} />, active: "bg-slate-900 dark:bg-slate-800 border-slate-900 dark:border-slate-700 text-white shadow-lg shadow-slate-200 dark:shadow-none" },
                { value: TransactionType.INCOME,  label: "Income",  icon: <ArrowUpCircle size={16} />,  active: "bg-emerald-500 dark:bg-emerald-600 border-emerald-500 dark:border-emerald-600 text-white shadow-lg shadow-emerald-100 dark:shadow-none" },
                { value: TransactionType.SAVING,  label: "Saving",  icon: <PiggyBank size={16} />,      active: "bg-blue-600 dark:bg-blue-600 border-blue-600 dark:border-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none" },
              ].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[12px] font-bold transition-all border-2 ${
                    type === t.value ? t.active : "bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700"
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="mb-1.5">Description / Merchant</Label>
            <Input
              id="description"
              type="text"
              placeholder={type === TransactionType.INCOME ? "E.g. Monthly Salary, Freelance" : "E.g. Figma, Uber, Starbucks"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="amount" className="mb-1.5">Amount</Label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${type === TransactionType.INCOME ? "text-emerald-500" : "text-slate-400"}`}>$</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 font-bold"
              />
            </div>
          </div>

          <div>
            <Label className="mb-1.5">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {normalizedCategories.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5">Date</Label>
            <CustomDatePicker value={date} onChange={setDate} />
          </div>

          {/* Tags */}
          <div>
            <Label className="mb-1.5 flex items-center gap-1.5">
              <Tag size={12} strokeWidth={2.5} />
              Tags
              <span className="text-[11px] font-normal text-slate-400 ml-1">Press Enter or comma to add</span>
            </Label>
            <div className="min-h-[42px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 px-3 py-2 flex flex-wrap gap-1.5 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 dark:focus-within:ring-emerald-950 transition-all">
              <AnimatePresence mode="popLayout">
                {tags.map(tag => (
                  <motion.span
                    key={tag}
                    layout
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 text-[12px] font-semibold text-emerald-700 dark:text-emerald-300 dark:border dark:border-emerald-800/50"
                  >
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-0.5 text-emerald-500 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-200">
                      <XSmall size={10} strokeWidth={3} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => tagInput && addTag(tagInput)}
                placeholder={tags.length === 0 ? "e.g. work, tax-deductible..." : ""}
                className="flex-1 min-w-[80px] bg-transparent text-[13px] text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-300 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Recurring toggle */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4 space-y-3">
            <button
              type="button"
              onClick={() => setIsRecurring(v => !v)}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className={`flex size-8 items-center justify-center rounded-lg transition-colors ${isRecurring ? "bg-violet-500 text-white" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-400"}`}>
                  <RefreshCw size={14} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200">Recurring Transaction</p>
                  <p className="text-[11px] text-slate-400">Auto-creates on a schedule</p>
                </div>
              </div>
              {/* Toggle pill */}
              <div className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${isRecurring ? "bg-violet-500" : "bg-slate-200 dark:bg-slate-700"}`}>
                <span className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${isRecurring ? "translate-x-5" : "translate-x-0"}`} />
              </div>
            </button>

            <AnimatePresence>
              {isRecurring && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Select value={frequency} onValueChange={(v) => setFrequency(v as RecurringFrequency)}>
                    <SelectTrigger className="bg-white dark:bg-slate-900">
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCY_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <p className="text-xs font-bold text-red-500 mt-2 px-1">{error}</p>
          )}
        </form>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-900/80 rounded-b-[20px]">
        {isEdit ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => transaction?._id && onDelete(transaction._id)}
            disabled={isLoading}
            className="size-10 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/80 hover:text-red-600 dark:hover:text-red-300"
          >
            <Trash2 size={16} strokeWidth={2.5} />
          </Button>
        ) : <div />}
        <Button variant="pill" onClick={handleSave} disabled={isLoading} className="px-8 py-2.5 text-[14px]">
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {isEdit ? "Save Changes" : "Save Transaction"}
        </Button>
      </div>
    </div>
  )
}
