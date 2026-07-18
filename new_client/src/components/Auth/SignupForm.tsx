import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Check, Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AuthFormField from "./AuthFormField";
import AuthLayout from "./AuthLayout";
import { useNotificationStore } from "../../store/notificationStore";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuthStore();
  const notify = useNotificationStore((state) => state.notify);
  const passwordReady = useMemo(() => password.length >= 8, [password]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading || !passwordReady) return;
    const success = await signup(name.trim(), email.trim(), password);
    if (success) {
      notify({ tone: "success", title: "Account created", message: "Your account is ready. Sign in to open your financial workspace." });
      navigate({ to: "/login" });
    }
  }

  return (
    <AuthLayout>
      <header className="mb-7">
        <p className="page-eyebrow">Get started</p>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white sm:text-4xl">Create your account</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Build a clearer view of your spending, budgets, and goals.</p>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        {error && <div className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300" role="alert"><AlertCircle className="mt-0.5 size-4 shrink-0" /><span>{error}</span></div>}

        <div className="space-y-4">
          <AuthFormField id="name" label="Full name">
            <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input id="name" name="name" type="text" required autoComplete="name" disabled={isLoading} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
          </AuthFormField>
          <AuthFormField id="email" label="Email address">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input id="email" name="email" type="email" required autoComplete="email" disabled={isLoading} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
          </AuthFormField>
          <AuthFormField id="password" label="Password">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input id="password" name="password" type={showPassword ? "text" : "password"} required minLength={8} autoComplete="new-password" disabled={isLoading} placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-12" aria-describedby="password-help" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} disabled={isLoading} className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
          </AuthFormField>
        </div>

        <p id="password-help" className={`mt-2 flex items-center gap-1.5 text-xs ${passwordReady ? "text-emerald-700 dark:text-emerald-300" : "text-slate-500"}`}><Check size={13} /> Use 8 or more characters</p>
        <Button type="submit" disabled={isLoading || !passwordReady} className="mt-6 w-full">{isLoading ? "Creating account…" : "Create account"}</Button>
        <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">Already have an account? <Link to="/login" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300">Sign in</Link></p>
      </form>
    </AuthLayout>
  );
}
