import { Link, useNavigate } from "@tanstack/react-router"
import { useAuthStore } from "../../store/authStore"
import {
    LayoutDashboard, ReceiptText, PieChart,
    Target, BarChart3, Settings, LogOut, Wallet, ChevronRight
} from "lucide-react"
import { Button } from "../ui/button"

const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Expenses",  path: "/expenses",  icon: ReceiptText  },
    { name: "Budgets",   path: "/budgets",   icon: PieChart     },
    { name: "Goals",     path: "/goal",      icon: Target       },
    { name: "Analytics", path: "/analytics", icon: BarChart3    },
    { name: "Settings",  path: "/settings",  icon: Settings     },
]

function getInitials(name?: string) {
    if (!name) return "JD"
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
}

export default function Navigation() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate({ to: "/login" })
    }

    return (
        <div className="fixed left-0 top-0 z-40 h-screen w-64 pr-[1px] bg-border-gradient animate-border-shift shadow-sm">
            <aside className="flex h-full w-full flex-col bg-white/50 px-4 py-8 backdrop-blur-xl">
                {/* Logo */}
                <div className="mb-10 flex items-center gap-3 px-2">
                    <div className="flex size-7 items-center justify-center rounded-[6px] bg-emerald-500 text-white shadow-sm">
                        <Wallet size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-[17px] font-extrabold tracking-tight text-slate-800">Expense Tracker</span>
                </div>

                {/* Nav */}
                <nav className="flex-1 space-y-1.5">
                    {navLinks.map(({ name, path, icon: Icon }) => (
                        <Link
                            key={name}
                            to={path as any}
                            className="flex items-center gap-4 rounded-[10px] px-3 py-2.5 text-[15px] transition-all"
                            activeProps={{ className: "bg-emerald-50/60 text-emerald-700 font-bold shadow-[inset_3px_0_0_0_#10b981]" }}
                            inactiveProps={{ className: "font-medium text-slate-600 hover:bg-white/40 hover:text-slate-800" }}
                        >
                            <Icon size={18} strokeWidth={2.5} className="opacity-90" />
                            {name}
                        </Link>
                    ))}
                </nav>

                {/* Profile & Logout */}
                <div className="mt-auto border-t border-slate-200/60 pt-4 space-y-2.5">
                    <div
                        className="group flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-white/50 p-2.5 shadow-xs border border-slate-200/60 transition-all duration-300 hover:bg-white hover:shadow-md hover:border-emerald-500/30 active:scale-[0.98]"
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
                                <span className="truncate text-[11px] font-semibold text-slate-400">
                                    {user?.email || "Personal Profile"}
                                </span>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-emerald-600 shrink-0" />
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full rounded-xl border-slate-200/60 bg-white/50 py-2.5 text-[12px] font-bold text-slate-600 shadow-2xs transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut size={14} strokeWidth={2.5} className="mr-1.5" />
                        Sign Out
                    </Button>
                </div>
            </aside>
        </div>
    )
}
