import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { useAuthStore } from "../../store/authStore";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  async function handleSubmit(event: ChangeEvent<HTMLFormElement>) {
    event.preventDefault();

    await login(email, password);

    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }

  return (
    <section className="relative flex h-[100svh] items-center justify-center overflow-hidden px-4 py-4">
      <div className="relative z-10 w-full max-w-[420px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[22px] border border-white/75 bg-white/92 px-6 py-7 shadow-[0_30px_60px_-38px_rgba(8,75,54,0.55)] backdrop-blur-md sm:px-8"
        >
          <header className="mb-6 text-center">
            <p className="text-xs font-semibold tracking-[0.14em] text-emerald-600">
              AUTHPORTAL
            </p>
            <h1 className="mt-1 text-3xl font-extrabold text-slate-800">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Log in to continue managing your expenses.
            </p>
          </header>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                className="text-[11px] font-bold tracking-[0.08em] text-slate-500"
                htmlFor="email"
              >
                EMAIL
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  disabled={isLoading}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="john@example.com"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-[15px] text-slate-700 outline-none transition-all duration-300 ease-out placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-[11px] font-bold tracking-[0.08em] text-slate-500"
                htmlFor="password"
              >
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  disabled={isLoading}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="********"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-[15px] text-slate-700 outline-none transition-all duration-300 ease-out placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 text-right">
            <button
              type="button"
              className="text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 h-11 w-full rounded-xl border border-emerald-600 bg-emerald-600 text-[15px] font-bold text-white shadow-[0_14px_28px_-16px_rgba(5,150,105,0.85)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-emerald-500 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-65"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-500">
            New here?{" "}
            <Link
              to="/signup"
              className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
            >
              Create account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
