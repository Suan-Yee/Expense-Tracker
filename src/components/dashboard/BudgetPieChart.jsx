import React from 'react'
import { motion } from 'framer-motion'
import { PieChart, Cell, Pie, ResponsiveContainer } from 'recharts';

const BudgetPieChart = ({ needs, wants, savings}) => {

    needs = 3000 , wants = 6000, savings = 2000
    const total = needs + wants + savings;

    const data = [
        { name: 'NEEDS', value: needs, fill: '#000000'},
        { name: 'WANTS', value: wants, fill: '#FFFFFF'},
        { name: 'SAVINGS', value: savings, fill: '#666666'},
    ].filter(item => item.value > 0);

    if (total === 0) {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0}}
          className='bg-white border-[3px] border-black p-8'
          style={{ boxShadow: '6px 6px 0px 0px rgba(0, 0, 0, 1)'}}>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-3 h-3 bg-black'></div>
              <p className='font-mono text-[10px] tracking-[0.3em] text-black/60'>BUDGET ALLOCATION</p>
            </div>
            <div className='h-64 flex items-center justify-center border-2 border-dashed border-black/20'>
              <p className='font-mono text-sm text-black/40'>NO DATA AVAILABLE</p>
            </div>
        </motion.div>
      );
    }

    const legendItems = [
      { name: 'NEEDS', value: needs, color: 'bg-black', percentage: ((needs / total) * 100).toFixed(0) },
      { name: 'WANTS', value: wants, color: 'bg-white border-2 border-black', percentage: ((wants / total) * 100).toFixed(0) },
      { name: 'SAVINGS', value: savings, color: 'bg-gray-500', percentage: ((savings / total) * 100).toFixed(0) }
    ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0}}
      className='bg-white border-[3px] border-black p-8'
      style={{ boxShadow: '6px 6px 0px 0px rgba(0, 0, 0, 1)'}}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-3 h-3 bg-black" />
          <p className="font-mono text-[10px] tracking-[0.3em] text-black/60">BUDGET ALLOCATION</p>
      </div>

      <div className='flex flex-col lg:flex-row items-center gap-12'>
        {/* Chart Container */}
        <div className='relative'>
          <div className='h-72 w-72'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie data={data}
                  cx='50%' cy='50%'
                  innerRadius={70} outerRadius={120}
                  dataKey='value' stroke='#000000' strokeWidth={3}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Center text */}
          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <p className='font-mono text-[10px] tracking-[0.2em] text-black/50 mb-1'>TOTAL</p>
            <p className='font-mono text-2xl font-black'>${total.toLocaleString()}</p>
          </div>
        </div>

        {/* Legend */}
        <div className='flex-1 w-full lg:w-auto'>
          <div className='space-y-4'>
            {legendItems.map((item, index) => (
              <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 ${item.color}`} />
                    <span className="font-mono text-xs tracking-[0.2em]">{item.name}</span>
                  </div>
                  <span className="font-mono text-2xl font-black">{item.percentage}%</span>
                </div>
                <div className="h-2 bg-black/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-black"
                  />
                </div>
                <p className="font-mono text-xs text-black/50 mt-1">
                  ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default BudgetPieChart