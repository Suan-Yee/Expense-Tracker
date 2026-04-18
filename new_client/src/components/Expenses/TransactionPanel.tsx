import { X, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import CustomSelect from "./CustomSelect";
import CustomDatePicker from "./CustomDatePicker";
import { useExpenseStore } from "../../store/expenseStore";
import { EXPENSE_CATEGORIES } from "../../constants/categories";
import type { ExpenseFormData } from "../../types/expense.types";

interface TransactionPanelProps {
  transaction: any | null;
  onClose: () => void;
}

export default function TransactionPanel({ transaction, onClose }: TransactionPanelProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(Math.abs(transaction.amount).toString());
      setCategory(transaction.category);
      setDate(transaction.date);
    } else {
      setDescription("");
      setAmount("");
      setCategory("food");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [transaction]);

  const isEdit = !!transaction;
  const { createExpense, isLoading, error } = useExpenseStore();

  const handleSave = async () => {
    if (!description || !amount || !category || !date) {
      alert("Please fill in all required fields");
      return;
    }

    const expenseData: ExpenseFormData = {
      amount: parseFloat(amount),
      category,
      description,
      date,
    };

    if (isEdit) {
      // Handle edit logic here if needed, but the user only asked for createExpense
      console.log("Edit logic not yet implemented", expenseData);
    } else {
      await createExpense(expenseData);
      // We check the store's error state after the async call completes
      if (!useExpenseStore.getState().error) {
        onClose();
      }
    }
  };

  return (
    <div className="flex h-full w-full flex-col rounded-[20px] bg-white/95 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">
          {isEdit ? "Transaction Details" : "New Transaction"}
        </h2>
        <button 
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={18} strokeWidth={2.5}/>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        
        {/* Dynamic Avatar & Header display (if Edit mode) */}
        {isEdit && (
          <div className="flex flex-col items-center mb-8">
            <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-600 mb-3 border border-slate-200">
              {description.charAt(0).toUpperCase() || "?"}
            </div>
            <h3 className="text-lg font-bold text-slate-800">{description}</h3>
            <p className={`text-2xl font-black tracking-tight ${transaction.amount > 0 ? "text-emerald-500" : "text-slate-800"}`}>
              {transaction.amount > 0 ? "+" : "-"}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(transaction.amount))}
            </p>
            <p className="text-xs font-semibold text-slate-400 mt-1">
               {format(parseISO(transaction.date), "MMM dd, yyyy 'at' hh:mm a")}
            </p>
          </div>
        )}

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {!isEdit && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Description / Merchant
                </label>
                <input 
                type="text" 
                placeholder="E.g. Figma, Uber, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
            </div>
          )}

          {!isEdit && (
            <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Amount
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                    type="number" 
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-8 pr-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />
                </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Category
            </label>
            <CustomSelect 
              options={EXPENSE_CATEGORIES}
              value={category}
              onChange={setCategory}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Date
            </label>
            <CustomDatePicker 
              value={date}
              onChange={setDate}
            />
          </div>
          
          {error && (
            <p className="text-xs font-bold text-red-500 mt-2 px-1">
              {error}
            </p>
          )}

        </form>
      </div>

      {/* Footer / Actions */}
      <div className="flex items-center justify-between border-t border-slate-100 p-6 bg-slate-50/50 rounded-b-[20px]">
        {isEdit ? (
           <button className="flex size-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-colors hover:bg-red-100 hover:text-red-600">
             <Trash2 size={16} strokeWidth={2.5}/>
           </button>
        ) : (
            <div></div> // Spacer
        )}
        <button 
          onClick={handleSave}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-2.5 text-[14px] font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-600 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {isEdit ? "Save Changes" : "Save Transaction"}
        </button>
      </div>

    </div>
  );
}
