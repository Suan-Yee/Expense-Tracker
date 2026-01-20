import React from 'react'

import { motion } from 'framer-motion'
import { Target, Plane, Shield, Home, Car, Gift, GraduationCap, Heart, Star, Plus } from 'lucide-react';

const ICONS = {
    plane: Plane,
    shield: Shield,
    home: Home,
    car: Car,
    gift: Gift,
    graduation: GraduationCap,
    heart: Heart,
    star: Star
};

const CircularProgress = ({ percentage, size = 120 , strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <svg width={size} height={size} className='transform-rotate-90'>
            {/* Background Circle */}
            <circle
                cx = {size / 2}
                cy = {size / 2}
                r = {radius}
                stroke = "currentColor"
                strokeWidth = {strokeWidth}
                fill = "none"
                className= "text-black/10"/>
            {/* Progress circle */}
            <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="square"
                className="text-black"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                    strokeDasharray: circumference
                }}
            />
        </svg>
    );
}

const SavingGoals = ({ goals, onAddGoal }) => {
    if (!goals || goals.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20}}
                animate={{ opacity: 1, y: 0 }}
                className='bg-white border-[3px] border-black overflow-hidden'
                style={{ boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
                <div className='bg-black text-white p-5 flex items-center gap-3'>
                    <Target className='w-4 h-4'/>
                    <p className='font-mono text-[10px] tracking-[0.3em]'>SAVINGS GOALS</p>
                </div>
                <div className='p-8 text-center'>
                    <div className='w-16 h-16 mx-auto mb-4 border-2 border-dashed border-black/30 flex items-center justify-center'>
                        <Target className='w-8 h-8 text-black/30' />
                    </div>
                    <p className='font-mono text-xs text-black/40 mb-4'>NO SAVINGS GOALS YET</p>
                    {onAddGoal && (
                        <button
                            onClick={onAddGoal}
                            className='inline-flex items-center gap-2 bg-black text-white px-4 py-2 font-mono text-xs hover:bg-black/80 transition-colors'>
                                <Plus className='w-4 h-4' />ADD GOAL
                        </button>
                    )}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white border-[3px] border-black overflow-hidden'
            sytle={{ boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
            <div className='bg-black text-white p-5 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <Target className='w-4 h-4'/>
                    <p className='font-mono text-[10px] tracking-[0.3em]'>SAVINGS GOALS</p>
                </div>
                {onAddGoal && (
                    <button
                        onClick={onAddGoal}
                        className='w-6 h-6 bg-white text-black flex items-center justify-center hover:bg-white/80 transition-colors'>
                            <Plus className='w-4 h-4'/>
                    </button>
                )}
            </div>

            <div className='p-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {goals.map((goal, index) => {
                        const percentage = goal.target_amount > 0
                            ? Math.min((goal.current_amount / goal.target_amount) * 100, 100) : 0;
                        const Icon = ICONS[goal.icon] || Star;
                        const remaining = goal.target_amount - goal.current_amount;

                        return (
                            <motion.div
                                key={goal.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative border-2 border-black p-4 group hover:bg-black/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <CircularProgress percentage={percentage} size={80} strokeWidth={6} />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono text-xs font-bold tracking-wider truncate mb-1">
                                            {goal.name.toUpperCase()}
                                        </p>
                                        <p className="font-mono text-2xl font-black">
                                            {Math.round(percentage)}%
                                        </p>
                                        <p className="font-mono text-[10px] text-black/50">
                                            complete
                                        </p>
                                    </div>                       
                                </div>

                                <div className="mt-4 pt-3 border-t border-black/10">
                                    <div className="flex justify-between font-mono text-[10px]">
                                        <span className="text-black/50">SAVED</span>
                                        <span className="font-bold">${goal.current_amount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-mono text-[10px] mt-1">
                                        <span className="text-black/50">TARGET</span>
                                        <span>${goal.target_amount.toLocaleString()}</span>
                                    </div>
                                    {remaining > 0 && (
                                        <div className="flex justify-between font-mono text-[10px] mt-1">
                                            <span className="text-black/50">REMAINING</span>
                                            <span className="text-black/70">${remaining.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                                {/* Corner accent */}
                                <div className="absolute top-0 right-0 w-0 h-0 border-t-16 border-t-black border-l-16 border-l-transparent" />
                            </motion.div>
                        );
                    })}
                </div>
 
                {/* Total progress */}
                {goals.length > 0 && (
                <div className="mt-4 pt-4 border-t-2 border-black">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] tracking-wider text-black/60">
                            TOTAL SAVED
                        </span>
                        <span className="font-mono text-xl font-black">
                            ${goals.reduce((sum, g) => sum + g.current_amount, 0).toLocaleString()}
                        </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <span className="font-mono text-[10px] tracking-wider text-black/40">
                            TOTAL TARGET
                        </span>
                    <span className="font-mono text-sm text-black/60">
                        ${goals.reduce((sum, g) => sum + g.target_amount, 0).toLocaleString()}
                    </span>
                    </div>
                </div>
                )}
            </div>
        </motion.div>
    )
}

export default SavingGoals