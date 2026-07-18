import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronRight, CircleDollarSign, Globe2, LogOut, Moon, ShieldCheck, Sun, UserRound, Wallet } from "lucide-react";
import { useThemeStore } from "../store/themeStore";
import { useAuthStore } from "../store/authStore";
import PageHeader from "../components/Common/PageHeader";

export default function SettingsPage() {
    const { theme, setTheme } = useThemeStore();
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate({ to: "/login" });
    };

    return (
        <div className="page-shell">
            <PageHeader eyebrow="Preferences" title="Settings" description="Personalize the interface and manage how you access your account." />

            <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.15fr_.85fr]">
                <div className="space-y-5">
                    <section className="app-surface p-5 sm:p-6">
                        <div className="mb-5"><h2 className="text-base font-extrabold text-slate-900 dark:text-white">Appearance</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Choose how Expense Tracker looks on this device.</p></div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: "light" as const, label: "Light", description: "Bright and clean", icon: Sun },
                                { value: "dark" as const, label: "Dark", description: "Easy on the eyes", icon: Moon },
                            ].map(({ value, label, description, icon: Icon }) => {
                                const selected = theme === value;
                                return <button key={value} onClick={() => setTheme(value)} className={`relative rounded-2xl border p-4 text-left transition-all ${selected ? "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-500/10 dark:border-emerald-500/50 dark:bg-emerald-500/10" : "border-slate-200 bg-slate-50 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800/65"}`}>
                                    <div className={`mb-4 grid size-9 place-items-center rounded-xl ${selected ? "bg-emerald-600 text-white" : "bg-white text-slate-500 dark:bg-slate-700 dark:text-slate-300"}`}><Icon size={17} /></div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{label}</p><p className="mt-0.5 text-[11px] text-slate-400">{description}</p>
                                    {selected && <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-emerald-600 text-white"><Check size={12} strokeWidth={3} /></span>}
                                </button>;
                            })}
                        </div>
                    </section>

                    <section className="app-surface p-5 sm:p-6">
                        <div className="mb-4"><h2 className="text-base font-extrabold text-slate-900 dark:text-white">Regional formats</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">These are the current account-wide defaults. Editing will be available in a future update.</p></div>
                        <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
                            <div className="flex items-center justify-between gap-4 bg-slate-50 px-4 py-3.5 dark:bg-slate-800/60"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"><CircleDollarSign size={17} /></div><div><p className="text-xs font-bold text-slate-800 dark:text-white">Currency</p><p className="text-[10px] text-slate-400">Used for budgets, expenses and goals</p></div></div><span className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">USD ($)</span></div>
                            <div className="flex items-center justify-between gap-4 bg-slate-50 px-4 py-3.5 dark:bg-slate-800/60"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300"><Globe2 size={17} /></div><div><p className="text-xs font-bold text-slate-800 dark:text-white">Language</p><p className="text-[10px] text-slate-400">Application display language</p></div></div><span className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">English</span></div>
                        </div>
                    </section>
                </div>

                <div className="space-y-5">
                    <section className="app-surface p-5 sm:p-6">
                        <div className="mb-5 flex items-center gap-3"><div className="grid size-11 place-items-center rounded-xl bg-emerald-600 text-white"><UserRound size={20} /></div><div className="min-w-0"><h2 className="truncate text-sm font-extrabold text-slate-900 dark:text-white">{user?.name || "Your account"}</h2><p className="truncate text-[11px] text-slate-400">{user?.email || "Manage personal information"}</p></div></div>
                        <button type="button" onClick={() => navigate({ to: "/profile" })} className="flex min-h-14 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800/65 dark:hover:bg-emerald-500/10"><span className="flex items-center gap-3"><ShieldCheck size={17} className="text-emerald-600 dark:text-emerald-400" /><span><span className="block text-xs font-bold text-slate-800 dark:text-white">Profile & security</span><span className="block text-[11px] text-slate-400">Name, password and account controls</span></span></span><ChevronRight size={16} className="text-slate-400" /></button>
                    </section>

                    <section className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/8">
                        <div className="flex items-start gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white"><Wallet size={17} /></div><div><h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Expense Tracker</h2><p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">Your theme preference is stored on this device. Financial records remain connected to your secured account.</p><p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-emerald-700/70 dark:text-emerald-300/70">Version 1.0</p></div></div>
                    </section>

                    <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15"><LogOut size={15} />Sign out of this device</button>
                </div>
            </div>
        </div>
    );
}
