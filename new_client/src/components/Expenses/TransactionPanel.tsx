import { X, Trash2, Loader2, ArrowUpCircle, ArrowDownCircle, PiggyBank, RefreshCw, Tag, X as XSmall } from "lucide-react"
import { useState, useEffect } from "react"
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
import { TransactionType, RecurringFrequency } from "../../types"
import { formatCurrency } from "../../utils/formatUtils"
import { motion, AnimatePresence } from "framer-motion"

const FREQUENCY_OPTIONS = [
    { label: "Daily",   value: RecurringFrequency.DAILY   },
    { label: "Weekly",  value: RecurringFrequency.WEEKLY  },
    { label: "Monthly", value: RecurringFrequency.MONTHLY },
    { label: "Yearly",  value: RecurringFrequency.YEARLY  },
]

interface TransactionPanelProps {
  transaction: any | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function TransactionPanel({ transaction, onClose, onDelete }: TransactionPanelProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE)
  const [category, setCategory] = useState("food")
  const [date, setDate] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [frequency, setFrequency] = useState<RecurringFrequency>(RecurringFrequency.MONTHLY)
  const [localError, setLocalError] = useState("")

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description)
      setAmount(Math.abs(transaction.amount).toString())
      setType(transaction.type || (transaction.amount >= 0 ? TransactionType.INCOME : TransactionType.EXPENSE))
      setCategory(transaction.category)
      const rawDate = transaction.date
      setDate(typeof rawDate === "string" ? rawDate.split("T")[0] : new Date(rawDate).toISOString().split("T")[0])
      setTags(Array.isArray(transaction.tags) ? transaction.tags : [])
      setIsRecurring(!!transaction.isRecurring)
      setFrequency(transaction.frequency || RecurringFrequency.MONTHLY)
    } else {
      setDescription("")
      setAmount("")
      setType(TransactionType.EXPENSE)
      setCategory("food")
      setDate(new Date().toISOString().split("T")[0])
      setTags([])
      setTagInput("")
      setIsRecurring(false)
      setFrequency(RecurringFrequency.MONTHLY)
    }
  }, [transaction])

  const isEdit = !!transaction
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
    <div className="flex h-full w-full flex-col rounded-[20px] bg-white/95 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">
          {isEdit ? "Transaction Details" : "New Transaction"}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-slate-400 hover:text-slate-700">
          <X size={18} strokeWidth={2.5} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">

        {isEdit && (
          <div className="flex flex-col items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800">{description || "No Description"}</h3>
            <p className={`text-2xl font-black tracking-tight ${parseFloat(amount) >= 0 ? "text-emerald-500" : "text-slate-800"}`}>
              {parseFloat(amount) >= 0 ? "+" : ""}{formatCurrency(parseFloat(amount) || 0)}
            </p>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              {date ? format(date.length === 10 ? new Date(date + "T00:00:00") : new Date(date), "MMM dd, yyyy") : "No Date"}
            </p>
            {isRecurring && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-[11px] font-bold text-violet-600"
              >
                <RefreshCw size={10} strokeWidth={3} />
                Recurring · {frequency}
              </motion.span>
            )}
          </div>
        )}

        {localError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50/90 px-3 py-2.5 text-[13px] font-medium text-red-600 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
            {localError}
          </div>
        )}

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>

          {/* Transaction Type */}
          <div>
            <Label className="mb-2.5">Transaction Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: TransactionType.EXPENSE, label: "Expense", icon: <ArrowDownCircle size={16} />, active: "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" },
                { value: TransactionType.INCOME,  label: "Income",  icon: <ArrowUpCircle size={16} />,  active: "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100" },
                { value: TransactionType.SAVING,  label: "Saving",  icon: <PiggyBank size={16} />,      active: "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" },
              ].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[12px] font-bold transition-all border-2 ${
                    type === t.value ? t.active : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
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
            <div className="min-h-[42px] rounded-xl border border-slate-200 bg-white/60 px-3 py-2 flex flex-wrap gap-1.5 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
              <AnimatePresence mode="popLayout">
                {tags.map(tag => (
                  <motion.span
                    key={tag}
                    layout
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[12px] font-semibold text-emerald-700"
                  >
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-0.5 text-emerald-500 hover:text-emerald-700">
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
                className="flex-1 min-w-[80px] bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Recurring toggle */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 space-y-3">
            <button
              type="button"
              onClick={() => setIsRecurring(v => !v)}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className={`flex size-8 items-center justify-center rounded-lg transition-colors ${isRecurring ? "bg-violet-500 text-white" : "bg-white border border-slate-200 text-slate-400"}`}>
                  <RefreshCw size={14} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-bold text-slate-700">Recurring Transaction</p>
                  <p className="text-[11px] text-slate-400">Auto-creates on a schedule</p>
                </div>
              </div>
              {/* Toggle pill */}
              <div className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${isRecurring ? "bg-violet-500" : "bg-slate-200"}`}>
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
                    <SelectTrigger className="bg-white">
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

      <div className="flex items-center justify-between border-t border-slate-100 p-6 bg-slate-50/50 rounded-b-[20px]">
        {isEdit ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => transaction?._id && onDelete(transaction._id)}
            disabled={isLoading}
            className="size-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
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
