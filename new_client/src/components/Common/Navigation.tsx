import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../../store/authStore";
import {
    LayoutDashboard,
    ReceiptText,
    PieChart,
    Target,
    BarChart3,
    Settings,
    LogOut,
    Wallet
} from "lucide-react";

export default function Navigation() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate({ to: "/login" });
    }

    function handleProfile() {
        navigate({ to: "/profile" })
    }

    const navLinks = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Expenses", path: "/expenses", icon: ReceiptText },
        { name: "Budgets", path: "/budgets", icon: PieChart },
        { name: "Goals", path: "/goal", icon: Target },
        { name: "Analytics", path: "/analytics", icon: BarChart3 },
        { name: "Settings", path: "/settings", icon: Settings },
    ];

    const getInitials = (name?: string) => {
        if (!name) return "JD"; // Defaulting to JD for Jane Doe mockup fallback
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    };

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

                {/* Nav list */}
                <nav className="flex-1 space-y-1.5">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link 
                                key={link.name}
                                to={link.path as any}
                                className="flex items-center gap-4 rounded-[10px] px-3 py-2.5 text-[15px] transition-all"
                                activeProps={{
                                    className: "bg-emerald-50/60 text-emerald-700 font-bold shadow-[inset_3px_0_0_0_#10b981]"
                                }}
                                inactiveProps={{
                                    className: "font-medium text-slate-600 hover:bg-white/40 hover:text-slate-800"
                                }}
                            >
                                <Icon size={18} strokeWidth={2.5} className="opacity-90" />
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* Profile & Logout */}
                <div className="mt-auto border-t border-slate-200/40 pt-4">
                    <div className="flex cursor-pointer items-center justify-between gap-3 rounded-[10px] px-2 py-2 transition-colors hover:bg-white/40" onClick={handleProfile}>
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-full bg-emerald-100/60 text-[13px] font-bold text-emerald-700">
                                {getInitials(user?.name)}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[14px] font-bold text-slate-800">{user?.name || "Jane Doe"}</span>
                                <span className="text-[11px] font-medium text-slate-500">{user?.email}</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-[10px] border border-slate-200/50 bg-white/40 py-2 text-[13px] font-bold text-slate-600 shadow-sm transition-all hover:border-red-200 hover:bg-red-50/80 hover:text-red-700"
                    >
                        <LogOut size={15} strokeWidth={2.5} />
                        Log out
                    </button>
                </div>
            </aside>
        </div>
    );
}