import React from 'react'

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle } from 'lucide-react';


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

const CATEGORY_LABELS = {
  rent: 'Rent',
  groceries: 'Groceries',
  utilities: 'Utilities',
  transport: 'Transport',
  entertainment: 'Entertainment',
  dining: 'Dining',
  health: 'Health',
  savings: 'Savings',
  other: 'Other'
};

const OverspendingAlerts = ({ transactions = [], budgets = [] }) => {

  const expenses = transactions
    .filter(trans => trans.type === 'expense');

  const categorySpending = expenses.reduce((acc, trans) => {
    acc[trans.category] = (acc[trans.category] || 0) + Math.abs(trans.amount);
    return acc;
  }, {});

  const alerts = budgets
    .map((budget) => {
    const spent = categorySpending[budget.category] || 0;
    const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    return {
      category: budget.category,
      spent,
      limit: budget.limit,
      percentage,
      isOverspent: percentage >= 100,
      isWarning: percentage >= 75 && percentage < 100,
      isHealthy: percentage < 75
    };
  })
    .filter((alert) => alert.percentage >= 75)
    .sort((a, b) => b.percentage - a.percentage);

  if (alerts.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className='bg-white border-[3px] border-black overflow-hidden'
        style={{ boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
          <div className='bg-black text-white p-5 flex items-center gap-3'>
            <CheckCircle className='w-4 h-4' />
            <p className='font-mono text-[10px] tracking-[0.3em]'>BUDGET STATUS</p>
          </div>
          <div className='p-6 text-center'>
            <div className='w-16 h-16 mb-4 mx-auto border-2 border-black flex items-center justify-center'>
              <CheckCircle className='w-8 h-8' />
            </div>
            <p className='font-mono text-xs tracking-wider text-black/60'>ALL BUDGETS ON TRACK</p>
          </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0}}
      className='bg-white border-[3px] border-black overflow-hidden'
      style={{ boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
        <style>{scrollbarStyles}</style>

        <div className='bg-black text-white p-5 flex items-center gap-3'>
          <AlertTriangle className='w-4 h-4' />
          <p className='font-mono text-[10px] tracking-[0.3em]'>BUDGET ALERTS</p>
        </div>

        <div className='p-4'>
          <div className='max-h-[300px] overflow-y-auto pr-2 scrollbar-brutalist'>
            <div className='space-y-3'>
              <AnimatePresence>
                {alerts.map((alert, index) => (
                  <motion.div key={alert.category}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-4 border-2 
                      ${alert.isOverspent ? 'border-black bg-black text-white' : 'border-black/40 bg-white'  
                      }`}>
                      <div className='flex items-start gap-3'>
                        <div className={`w-10 h-10 flex items-center justify-center ${
                          alert.isOverspent ? 'bg-white text-black' : 'bg-black text-white'
                        }`}>
                          <AlertTriangle className='w-5 h-5' />
                        </div>
  
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs tracking-[0.15em] font-bold">
                              {CATEGORY_LABELS[alert.category] || alert.category.toUpperCase()}
                            </span>
                            <span className="font-mono text-xl font-black">
                              {Math.round(alert.percentage)}%
                            </span>
                          </div>
  
                          <p className={`font-mono text-[11px] ${
                            alert.isOverspent ? 'text-white/80' : 'text-black/60'
                          }`}>
                            {alert.isOverspent 
                              ? `Over budget by $${(alert.spent - alert.limit).toFixed(0)}`
                              : `You have used ${Math.round(alert.percentage)}% of your ${(CATEGORY_LABELS[alert.category] || alert.category)} budget this month.`
                            }
                          </p>
  
                          <div className="mt-3 h-2 bg-black/10 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(alert.percentage, 100)}%` }}
                              transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                              className={`h-full ${
                                alert.isOverspent ? 'bg-white' : 'bg-black'
                              }`}
                            />
                          </div>
                          
                          <div className={`flex justify-between mt-2 font-mono text-[10px] ${
                            alert.isOverspent ? 'text-white/60' : 'text-black/40'
                          }`}>
                            <span>${alert.spent.toFixed(0)} spent</span>
                            <span>${alert.limit.toFixed(0)} limit</span>
                          </div>
                        </div>
                      </div>
                      
                      {alert.isOverspent && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white flex items-center justify-center">
                          <span className="font-mono text-[10px] font-bold">!</span>
                        </div>
                      )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
    </motion.div>
  )
}

export default OverspendingAlerts