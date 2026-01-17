import React from 'react'
import { motion } from 'framer-motion'

const scrollbarStyles = `
    .scrollbar-brutalist::-webkit-scrollbar {
        width: 8px;
        height: 8px;
  }
    .scrollbar-brutalist::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.1);
  }
    .scrollbar-brutalist::-webkit-scrollbar-thumb {
        background: #000;
  }
    .scrollbar-brutalist::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.8);
  }
`;

const CATEGORY_ICONS = {
    rent: '⌂',
    groceries: '◉',
    utilities: '⚡',
    transport: '→',
    entertainment: '★',
    dining: '◇',
    health: '+',
    other: '●' 
}

const CategoryBreakdown = ({ transactions = [] }) => {

    const expenses = transactions.filter(tran => tran.type === 'expenses');
    const totalExpenses = expenses.reduce((sum, trans) => sum + Math.abs(trans.amount), 0);

    const categoryTotals = expenses.reduce((acc, trans) => {
        acc[trans.category] = (acc[trans.category] || 0) + Math.abs(trans.amount);
        return acc;
    }, {});

    const sortedCategories = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className='bg-white border-[3px] border-black overflow-hidden'
        style={{ boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
            <style>{scrollbarStyles}</style>

            {/* Header */}
            <div className='bg-black text-white p-5 flex items-center gap-3'>
                <div className='w-2 h-2 bg-white'></div>
                <p className='font-mono text-[10px] tracking-[0.3em]'>SPENDING BY CATEGORY</p>
            </div>

            {sortedCategories.length === 0 ? (
                <div className='p-8 text-center'>
                    <div className='w-12 h-12 mx-auto border-2 border-dashed border-black/20 flex items-center justify-center'>
                        <span className='font-mono text-xl text-black/20'>∅</span>
                    </div>
                    <p className='font-mono text-xs text-black/40'>NO EXPENSES</p>
                </div>
            ) : (
               <div className='p-4'>
                    <div className='max-h-[280px] overflow-y-auto space-y-4 pr-2 scrollbar-brutalist'>
                        {sortedCategories.map(([category, amount], index) => {
                            const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                            return (
                                <motion.div key={category}
                                    initial={{ opacity: 0, x: -20}} animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className='group'>
                                        <div className='flex items-center justify-between mb-2'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-8 h-8 bg-black text-white flex items-center justify-center
                                                    font-mono text-sm group-hover:scale-110 transition-transform'>
                                                        {CATEGORY_ICONS[category] || '●'}
                                                </div>
                                                <div>
                                                    <span className='font-mono text-xs tracking-[0.15em] font-bold block'>
                                                        {category.toUpperCase()}
                                                    </span>
                                                    <span className='font-mono text-[10px] text-black/50'>
                                                        {percentage.toFixed(1)}% of total
                                                    </span>
                                                </div>
                                            </div>
                                            <span className='font-mono text-lg font-black'>
                                                ${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                                            </span>
                                        </div>
                                        
                                        <div className='h-2 bg-black/5 overflow-hidden'>
                                            <motion.div initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ delay: index * 0.1 + 0.2, duration: 0.6, ease: "easeOut" }}
                                                className="h-full bg-black"/>
                                        </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Total */}
                    <div className="pt-4 mt-4 border-t-2 border-black flex justify-between items-center">
                        <span className="font-mono text-[10px] tracking-[0.3em] text-black/60">TOTAL EXPENSES</span>
                        <span className="font-mono text-xl font-black">
                            ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
               </div> 
            )}
    </motion.div>
  );
}

export default CategoryBreakdown