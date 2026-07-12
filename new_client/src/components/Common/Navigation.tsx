import { Link, useNavigate } from "@tanstack/react-router"
import { useAuthStore } from "../../store/authStore"
import {
    LayoutDashboard, ReceiptText, PieChart,
    Target, BarChart3, Settings, LogOut, Wallet, ChevronRight, Moon, Sun
} from "lucide-react"
import { Button } from "../ui/button"
import { useThemeStore } from "../../store/themeStore"

const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Expenses",  path: "/expenses",  icon: ReceiptText  },
    { name: "Budgets",   path: "/budgets",   icon: PieChart     },
    { name: "Goals",     path: "/goal",      icon: Target       },
    { name: "Analytics", path: "/analytics", icon: BarChart3    },
    { name: "Settings",  path: "/settings",  icon: Settings     },
] as const

function getInitials(name?: string) {
    if (!name) return "JD"
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
}

export default function Navigation() {
    const { user, logout } = useAuthStore()
    const { theme, toggleTheme } = useThemeStore()
    const navigate = useNavigate()
    const isDark = theme === "dark"

    function handleLogout() {
        logout()
        navigate({ to: "/login" })
    }

    return (
        <>
        <div className="fixed left-0 top-0 z-40 hidden h-screen w-64 pr-[1px] bg-border-gradient shadow-sm dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.32),rgba(15,23,42,0.9))] lg:block">
            <aside className="flex h-full w-full flex-col bg-white/72 px-4 py-8 backdrop-blur-xl dark:bg-slate-950/72">
                {/* Logo */}
                <div className="mb-10 flex items-center gap-3 px-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                        <Wallet size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-[16px] font-extrabold tracking-tight text-slate-800 dark:text-slate-100">Expense Tracker</span>
                </div>

                {/* Nav */}
                <nav className="flex-1 space-y-1.5">
                    {navLinks.map(({ name, path, icon: Icon }) => (
                        <Link
                            key={name}
                            to={path}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] transition-all"
                            activeProps={{ className: "bg-emerald-50 text-emerald-700 font-bold shadow-[inset_3px_0_0_0_#059669] dark:bg-emerald-500/12 dark:text-emerald-300" }}
                            inactiveProps={{ className: "font-semibold text-slate-600 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-slate-100" }}
                        >
                            <Icon size={18} strokeWidth={2.5} className="opacity-90" />
                            {name}
                        </Link>
                    ))}
                </nav>

                {/* Profile & Logout */}
                <div className="mt-auto space-y-2.5 border-t border-slate-200/60 pt-4 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="flex w-full items-center justify-between rounded-lg border border-slate-200/70 bg-white/65 px-3 py-2.5 text-left text-[13px] font-bold text-slate-700 transition-all hover:bg-white dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-800"
                        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                    >
                        <span className="flex items-center gap-2">
                            {isDark ? <Moon size={15} className="text-emerald-300" /> : <Sun size={15} className="text-amber-500" />}
                            {isDark ? "Dark theme" : "Light theme"}
                        </span>
                        <span className={`relative h-5 w-9 rounded-full transition-colors ${isDark ? "bg-emerald-500" : "bg-slate-300"}`}>
                            <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${isDark ? "translate-x-4" : "translate-x-0.5"}`} />
                        </span>
                    </button>

                    <div
                        className="group flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-slate-200/70 bg-white/65 p-2.5 shadow-xs transition-all duration-300 hover:border-emerald-500/30 hover:bg-white hover:shadow-md active:scale-[0.98] dark:border-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-800"
                        onClick={() => navigate({ to: "/profile" })}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 text-[13px] font-extrabold text-white shadow-sm ring-2 ring-emerald-500/20 transition-transform duration-300 group-hover:scale-105">
                                {getInitials(user?.name)}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="truncate text-[13px] font-bold text-slate-800 transition-colors group-hover:text-emerald-600">
                                    {user?.name || "Jane Doe"}
                                </span>
                                <span className="truncate text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                                    {user?.email || "Personal Profile"}
                                </span>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-emerald-600 shrink-0" />
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full border-slate-200/70 bg-white/65 py-2.5 text-[12px] font-bold text-slate-600 shadow-2xs transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                    >
                        <LogOut size={14} strokeWidth={2.5} className="mr-1.5" />
                        Sign Out
                    </Button>
                </div>
            </aside>
        </div>

        <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-6 gap-1 rounded-xl border border-white/70 bg-white/88 p-1.5 shadow-lg shadow-slate-900/10 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/88 lg:hidden">
            {navLinks.map(({ name, path, icon: Icon }) => (
                <Link
                    key={name}
                    to={path}
                    aria-label={name}
                    className="flex h-11 items-center justify-center rounded-lg text-slate-500 transition-colors"
                    activeProps={{ className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" }}
                    inactiveProps={{ className: "hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100" }}
                >
                    <Icon size={19} strokeWidth={2.5} />
                    <span className="sr-only">{name}</span>
                </Link>
            ))}
        </nav>
        </>
    )
}
