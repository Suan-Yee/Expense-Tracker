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
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white px-4 py-8 shadow-sm">
            {/* Logo */}
            <div className="mb-10 flex items-center gap-3 px-2">
                <div className="flex size-7 items-center justify-center rounded-[6px] bg-emerald-500 text-white">
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
                            className="flex items-center gap-4 rounded-[10px] px-3 py-2.5 text-[15px] font-medium transition-all"
                            activeProps={{
                                className: "bg-[#eaf8f1] text-[#059669] font-semibold"
                            }}
                            inactiveProps={{
                                className: "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                            }}
                        >
                            <Icon size={18} strokeWidth={2.5} className="opacity-90" />
                            {link.name}
                        </Link>
                    )
                })}
            </nav>

            {/* Profile & Logout */}
            <div className="mt-auto border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-[#eaf8f1] text-[13px] font-bold text-[#059669]">
                            {getInitials(user?.name)}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-slate-800">{user?.name || "Jane Doe"}</span>
                            <span className="text-[11px] font-medium text-slate-400">{user?.email}</span>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleLogout}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-[10px] border border-slate-200 bg-white py-2 text-[13px] font-bold text-slate-600 shadow-sm transition-all hover:bg-red-50 hover:border-red-100 hover:text-red-600"
                >
                    <LogOut size={15} strokeWidth={2.5} />
                    Log out
                </button>
            </div>
        </aside>
    );
}