import type { ReactNode } from "react";
import { BarChart3, CheckCircle2, PiggyBank, ShieldCheck } from "lucide-react";
import AuthHeroBackground from "./AuthHeroBackground";
import BrandMark from "../Common/BrandMark";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="relative min-h-[100svh] bg-[#f3f7f4] dark:bg-slate-950 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(440px,.95fr)]">
      <div className="relative isolate hidden overflow-hidden bg-[#073b2b] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
        <AuthHeroBackground />
        <div className="relative flex items-center gap-3">
          <BrandMark className="size-11" />
          <div><p className="font-semibold">Expense Tracker</p><p className="text-xs text-emerald-100/60">Personal finance, made clearer</p></div>
        </div>

        <div className="relative max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Know where you stand</p>
          <h2 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-[-0.035em] xl:text-5xl">Turn everyday spending into confident decisions.</h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-emerald-50/70">See cash flow, protect your monthly plan, and make steady progress toward the goals that matter.</p>
          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {[
              { icon: BarChart3, label: "Clear cash flow" },
              { icon: ShieldCheck, label: "Budget guardrails" },
              { icon: PiggyBank, label: "Visible progress" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/6 p-4">
                <Icon size={19} className="text-emerald-300" /><p className="mt-3 text-sm font-medium text-emerald-50">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative flex items-center gap-2 text-xs text-emerald-100/55"><CheckCircle2 size={15} /> Your records stay connected to your secured account.</p>
      </div>

      <div className="flex min-h-[100svh] items-center justify-center px-4 py-8 sm:px-8 lg:bg-white lg:px-12 dark:lg:bg-slate-950">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <BrandMark className="size-10" />
            <div><p className="text-sm font-semibold text-slate-900 dark:text-white">Expense Tracker</p><p className="text-[11px] text-slate-500">Personal finance, made clearer</p></div>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
