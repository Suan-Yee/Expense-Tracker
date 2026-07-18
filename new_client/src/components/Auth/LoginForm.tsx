import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AuthFormField from "./AuthFormField";
import AuthLayout from "./AuthLayout";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;
    await login(email.trim(), password);
    if (useAuthStore.getState().isAuthenticated) navigate({ to: "/dashboard" });
  }

  return (
    <AuthLayout>
      <header className="mb-8">
        <p className="page-eyebrow">Welcome back</p>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white sm:text-4xl">Sign in to your account</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Continue to your financial overview and next actions.</p>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300" role="alert">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span>{error}</span>
          </div>
        )}

        <div className="space-y-5">
          <AuthFormField id="email" label="Email address">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input id="email" name="email" type="email" required autoComplete="email" value={email} disabled={isLoading} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10" />
          </AuthFormField>

          <AuthFormField id="password" label="Password">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input id="password" name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" value={password} disabled={isLoading} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="pl-10 pr-12" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} disabled={isLoading} className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800" aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </AuthFormField>
        </div>

        <Button type="submit" disabled={isLoading} className="mt-7 w-full">
          {isLoading ? "Signing in…" : "Sign in"}
        </Button>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">New to Expense Tracker? <Link to="/signup" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300">Create an account</Link></p>
      </form>
    </AuthLayout>
  );
}
