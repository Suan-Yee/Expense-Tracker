import { useMemo, useState } from "react";
import { CalendarDays, Check, ChevronRight, Clock3, Flag, Minus, Pencil, Plus, Target, Trash2, Trophy } from "lucide-react";
import type { Goal } from "../../types/goal.types";

interface Props {
    goals: Goal[];
    onEdit: (goal: Goal) => void;
    onDelete: (id: string) => void;
    onDeposit: (goal: Goal, isDeposit: boolean) => void;
    onCreate: () => void;
}

const PAGE_LOADED_AT = Date.now();

function getTiming(goal: Goal) {
    if (goal.currentAmount >= goal.targetAmount) return { label: "Completed", date: "Goal reached", overdue: false, months: 0 };
    if (!goal.deadline) return { label: "No deadline", date: "Flexible timeline", overdue: false, months: null };
    const deadline = new Date(goal.deadline);
    const days = Math.ceil((deadline.getTime() - PAGE_LOADED_AT) / 86400000);
    if (days < 0) return { label: `${Math.abs(days)}d overdue`, date: deadline.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }), overdue: true, months: 1 };
    return { label: days === 0 ? "Due today" : `${days} days left`, date: deadline.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }), overdue: false, months: Math.max(Math.ceil(days / 30.44), 1) };
}

export default function GoalRoadmap({ goals, onEdit, onDelete, onDeposit, onCreate }: Props) {
    const sortedGoals = useMemo(() => [...goals].sort((a, b) => {
        const aDone = a.currentAmount >= a.targetAmount;
        const bDone = b.currentAmount >= b.targetAmount;
        if (aDone !== bDone) return aDone ? 1 : -1;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }), [goals]);

    const [selectedId, setSelectedId] = useState(sortedGoals[0]?._id ?? "");
    const selected = sortedGoals.find((goal) => goal._id === selectedId) ?? sortedGoals[0];
    if (!selected) return null;

    const completed = selected.currentAmount >= selected.targetAmount;
    const percentage = selected.targetAmount ? Math.min(Math.round((selected.currentAmount / selected.targetAmount) * 100), 100) : 0;
    const remaining = Math.max(selected.targetAmount - selected.currentAmount, 0);
    const timing = getTiming(selected);
    const perMonth = timing.months ? Math.ceil(remaining / timing.months) : null;

    return (
        <section className="grid min-h-0 overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-sm backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/60 lg:h-full lg:grid-cols-[minmax(250px,34%)_1fr]">
            <div className="flex min-h-0 flex-col border-b border-slate-200/70 lg:border-b-0 lg:border-r dark:border-slate-700/70">
                <div className="flex items-center justify-between px-4 py-3.5 sm:px-5">
                    <div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">Roadmap</p><h2 className="text-base font-black text-slate-900 dark:text-white">Your milestones</h2></div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-500 dark:bg-slate-800">{goals.length} goals</span>
                </div>

                <div className="flex gap-2 overflow-x-auto px-3 pb-3 lg:block lg:flex-1 lg:space-y-1 lg:overflow-y-auto lg:px-2.5 lg:pb-3">
                    {sortedGoals.map((goal, index) => {
                        const isSelected = goal._id === selected._id;
                        const isDone = goal.currentAmount >= goal.targetAmount;
                        const itemTiming = getTiming(goal);
                        const progress = goal.targetAmount ? Math.min(Math.round(goal.currentAmount / goal.targetAmount * 100), 100) : 0;
                        return (
                            <button key={goal._id} onClick={() => setSelectedId(goal._id)} className={`min-w-[230px] rounded-xl border p-3 text-left transition-all lg:w-full lg:min-w-0 ${isSelected ? "border-emerald-300 bg-emerald-50 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-500/10" : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/70"}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-black ${isDone ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" : itemTiming.overdue ? "bg-red-100 text-red-600 dark:bg-red-500/15" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"}`}>{isDone ? <Trophy size={14} /> : index + 1}</div>
                                    <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-xs font-extrabold text-slate-800 dark:text-white">{goal.title}</p><ChevronRight size={13} className={isSelected ? "text-emerald-500" : "text-slate-300"} /></div><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-700"><div className={`h-full rounded-full ${isDone ? "bg-amber-400" : itemTiming.overdue ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${progress}%` }} /></div><div className="mt-1 flex justify-between text-[9px] font-bold text-slate-400"><span>{progress}% saved</span><span className={itemTiming.overdue ? "text-red-500" : ""}>{itemTiming.label}</span></div></div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className={`flex min-h-0 flex-col p-4 sm:p-5 lg:p-5 ${completed ? "lg:overflow-y-auto" : "lg:overflow-y-hidden"}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div><div className="mb-2 flex items-center gap-2"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${completed ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" : timing.overdue ? "bg-red-50 text-red-600 dark:bg-red-500/15" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"}`}>{completed ? <Check size={10} /> : timing.overdue ? <Flag size={10} /> : <Target size={10} />}{timing.label}</span><span className="text-[10px] font-bold capitalize text-slate-400">{selected.category}</span></div><h2 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">{selected.title}</h2>{selected.notes && <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">{selected.notes}</p>}</div>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                        {!completed && <>
                            <button onClick={() => onDeposit(selected, true)} className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-emerald-700"><Plus size={14} strokeWidth={3} />Add savings</button>
                            <button onClick={() => onDeposit(selected, false)} disabled={selected.currentAmount <= 0} className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"><Minus size={14} />Withdraw</button>
                        </>}
                        <div className="flex gap-1">
                            <button onClick={() => onEdit(selected)} aria-label="Edit selected goal" className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"><Pencil size={15} /></button>
                            <button onClick={() => onDelete(selected._id)} aria-label="Delete selected goal" className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"><Trash2 size={15} /></button>
                        </div>
                    </div>
                </div>

                <div className="mt-5"><div className="flex flex-wrap items-end justify-between gap-3"><p><span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">${selected.currentAmount.toLocaleString()}</span><span className="ml-2 text-sm font-bold text-slate-400">of ${selected.targetAmount.toLocaleString()}</span></p><span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{percentage}%</span></div><div role="progressbar" aria-label={`${selected.title} savings progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"><div className={`h-full rounded-full ${completed ? "bg-amber-400" : timing.overdue ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${percentage}%` }} /></div></div>

                {completed && <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-400 text-amber-950"><Trophy size={19} /></div><div><h3 className="text-sm font-semibold text-slate-900 dark:text-white">Goal complete—well done.</h3><p className="mt-0.5 text-xs leading-5 text-slate-600 dark:text-slate-400">Keep the momentum going by choosing your next milestone.</p></div></div><button type="button" onClick={onCreate} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"><Plus size={14} />Create another goal</button></div>}

                <div className="mt-auto grid grid-cols-2 gap-2.5 pt-4 xl:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70"><p className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wide text-slate-400"><Target size={11} />Remaining</p><p className="mt-1.5 text-base font-black text-slate-800 dark:text-white">${remaining.toLocaleString()}</p></div>
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70"><p className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wide text-slate-400"><CalendarDays size={11} />Deadline</p><p className={`mt-1.5 text-sm font-black ${timing.overdue ? "text-red-600" : "text-slate-800 dark:text-white"}`}>{timing.date}</p></div>
                    <div className="col-span-2 rounded-xl bg-emerald-50 p-3 dark:bg-emerald-500/10 xl:col-span-1"><p className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wide text-emerald-700 dark:text-emerald-300"><Clock3 size={11} />Suggested pace</p><p className="mt-1.5 text-base font-black text-slate-800 dark:text-white">{completed ? "Finished" : perMonth ? `$${perMonth.toLocaleString()} / month` : "Flexible"}</p></div>
                </div>
            </div>
        </section>
    );
}
