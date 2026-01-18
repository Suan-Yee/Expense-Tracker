import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftRight } from 'lucide-react'
import {
    Bar,
    BarChart,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

const CATEGORY_LABELS = {
    rent: 'Rent',
    groceries: 'Food',
    utilities: 'Bills',
    transport: 'Travel',
    entertainment: 'Fun',
    dining: 'Dining',
    health: 'Health',
    savings: 'Savings',
    other: 'Other'
}

const MonthlyComparison = ({
    currentMonthTransactions = [],
    lastMonthTransactions = [],
}) => {

    const calculateCategoryTotals = (transactions) => {
        return transactions
            .filter(tran => tran.type === 'expense')
            .reduce((acc, tran) => {
                acc[tran.category] = (acc[tran.category] || 0) + Math.abs(tran.amount);
                return acc;
            }, {});
    };

    const currentMonthTotals = calculateCategoryTotals(currentMonthTransactions);
    const lastMonthTotals = calculateCategoryTotals(lastMonthTransactions);

    const allCategories = [...new Set([
        ...Object.keys(currentMonthTotals),
        ...Object.keys(lastMonthTotals)
    ])]

    const chartData = allCategories
        .map(category => ({
            category,
            label: CATEGORY_LABELS[category] || category,
            thisMonth: currentMonthTotals[category] || 0,
            lastMonth: lastMonthTotals[category] || 0,
            change: ((currentMonthTotals[category] || 0) - (lastMonthTotals[category] || 0))
        }))
        .sort((a, b) => (b.thisMonth + b.lastMonth) - (a.thisMonth + a.lastMonth))
        .slice(0, 6);

    const currentTotal = Object.values(currentMonthTotals).reduce((a, b) => a + b, 0);
    const lastTotal = Object.values(lastMonthTotals).reduce((a, b) => a + b, 0);
    const totalChange = currentTotal - lastTotal;
    const changePercent = lastTotal > 0 ? ((totalChange / lastTotal) * 100) : 0;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black text-white p-3 font-mono text-xs border-0">
                    <p className="font-bold mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="flex justify-between gap-4">
                            <span className="opacity-60">{entry.name}:</span>
                            <span>${entry.value.toFixed(0)}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-[3px] border-black overflow-hidden"
            style={{ boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}
        >
            <div className="bg-black text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ArrowLeftRight className="w-4 h-4" />
                    <p className="font-mono text-[10px] tracking-[0.3em]">MONTHLY COMPARISON</p>
                </div>
                <div className={`font-mono text-xs px-2 py-1 ${totalChange <= 0 ? 'bg-white text-black' : 'bg-white/20 text-white'
                    }`}>
                    {totalChange <= 0 ? '↓' : '↑'} {Math.abs(changePercent).toFixed(0)}%
                </div>
            </div>

            <div className="p-4">
                {/* Summary cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="border-2 border-black p-3">
                        <p className="font-mono text-[10px] tracking-wider text-black/60 mb-1">THIS MONTH</p>
                        <p className="font-mono text-2xl font-black">${currentTotal.toFixed(0)}</p>
                    </div>
                    <div className="border-2 border-black/30 p-3 bg-black/5">
                        <p className="font-mono text-[10px] tracking-wider text-black/60 mb-1">LAST MONTH</p>
                        <p className="font-mono text-2xl font-black text-black/60">${lastTotal.toFixed(0)}</p>
                    </div>
                </div>

                {/* Chart */}
                {chartData.length > 0 ? (
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} barGap={2} barCategoryGap="20%">
                                <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 9, fontFamily: 'monospace', fill: '#000' }}
                                    axisLine={{ stroke: '#000', strokeWidth: 2 }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 9, fontFamily: 'monospace', fill: '#666' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="thisMonth" name="This Month" radius={[0, 0, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#000000" />
                                    ))}
                                </Bar>
                                <Bar dataKey="lastMonth" name="Last Month" radius={[0, 0, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#00000040" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center">
                        <p className="font-mono text-xs text-black/40">NO DATA TO COMPARE</p>
                    </div>
                )}

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t-2 border-black/10">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-black" />
                        <span className="font-mono text-[10px] tracking-wider">THIS MONTH</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-black/40" />
                        <span className="font-mono text-[10px] tracking-wider">LAST MONTH</span>
                    </div>
                </div>

                {/* Category changes */}
                <div className="mt-4 space-y-2">
                    {chartData.slice(0, 4).map((item, index) => (
                        <motion.div
                            key={item.category}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between py-2 border-b border-black/10"
                        >
                            <span className="font-mono text-xs">{item.label}</span>
                            <span className={`font-mono text-xs font-bold ${item.change <= 0 ? 'text-black' : 'text-black/60'
                                }`}>
                                {item.change <= 0 ? '↓' : '↑'} ${Math.abs(item.change).toFixed(0)}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default MonthlyComparison