import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FiltersBar from "../components/Expenses/FiltersBar";
import TransactionsTable from "../components/Expenses/TransactionsTable";
import Pagination from "../components/Expenses/Pagination";
import TransactionPanel from "../components/Expenses/TransactionPanel";
import { useExpenseStore } from "../store/expenseStore";
import ActionConfirmModal from "../components/Common/ActionConfirmModal";

// Mock Data (Keeping as fallback or for design reference)
export const MOCK_TRANSACTIONS = [
  { id: "1", amount: -15.0, category: "food", description: "Figma", date: "2023-10-24", insertDate: "2023-10-24T10:23:00Z", status: "Cleared" },
  { id: "2", amount: -18.5, category: "food", description: "Sweetgreen", date: "2023-10-22", insertDate: "2023-10-22T14:10:00Z", status: "Cleared" },
];

export default function ExpensesPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const { expenses, getAllExpenses, deleteExpense, setFilters, filters, isLoading } = useExpenseStore();

  // Map backend sort string ("-date", "amount") to table sortConfig ({ key, direction })
  const sortConfig = filters.sort ? {
    key: filters.sort.startsWith("-") ? filters.sort.slice(1) : filters.sort,
    direction: filters.sort.startsWith("-") ? ("desc" as const) : ("asc" as const)
  } : null;

  useEffect(() => {
    getAllExpenses();
  }, [getAllExpenses]);

  const handleSort = (key: string) => {
    let newSort = key;
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      newSort = `-${key}`;
    }
    setFilters({ sort: newSort });
  };

  const openAddPanel = () => {
    setEditingTransaction(null);
    setIsPanelOpen(true);
  };

  const openEditPanel = (tr: any) => {
    setEditingTransaction(tr);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setEditingTransaction(null), 300); // Clear after animation
  };

  const confirmDelete = async () => {
    if (transactionToDelete) {
      await deleteExpense(transactionToDelete);
      setTransactionToDelete(null);
      if (isPanelOpen) {
        closePanel();
      }
    }
  };

  return (
    <div className="relative isolate flex h-[100svh] w-full flex-col overflow-hidden px-4 py-8 sm:px-8 lg:px-10">
      {/* Header section */}
      <div className="z-10 flex w-full items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
          Expenses
        </h1>
        <button
          onClick={openAddPanel}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-600 active:translate-y-0"
        >
          <Plus size={16} strokeWidth={3} />
          Add Expense
        </button>
      </div>

      {/* Main Content Area */}
      <div className="z-10 flex w-full flex-1 gap-6 min-h-0">
        
        {/* Left Side: Table & Filters */}
        <motion.div 
            layout 
            className="flex flex-col flex-1 min-w-0"
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        >
          <div className="flex flex-col h-full rounded-[20px] bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <FiltersBar />
            
            <div className="flex-1 mt-4 overflow-auto min-h-0 relative">
                {isLoading && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
                     <div className="size-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                  </div>
                )}
                <TransactionsTable 
                transactions={expenses} 
                isPanelOpen={isPanelOpen} 
                onEdit={openEditPanel} 
                onDelete={(id) => setTransactionToDelete(id)}
                sortConfig={sortConfig}
                onSort={handleSort}
                />
                
                {!isLoading && expenses.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                    <p className="text-sm font-medium">No transactions found</p>
                  </div>
                )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100">
               <Pagination />
            </div>
          </div>
        </motion.div>

        {/* Right Side: Add/Edit Panel */}
        <AnimatePresence>
          {isPanelOpen && (
            <motion.div
              initial={{ opacity: 0, width: 0, x: 20 }}
              animate={{ opacity: 1, width: 400, x: 0 }}
              exit={{ opacity: 0, width: 0, x: 20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="relative shrink-0"
            >
              <div className="absolute inset-0 w-[400px]">
                 <TransactionPanel 
                   transaction={editingTransaction} 
                   onClose={closePanel} 
                   onDelete={(id) => setTransactionToDelete(id)}
                 />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <ActionConfirmModal
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Yes, Delete"
        variant="danger"
        isLoading={isLoading}
      />
    </div>
  );
}
