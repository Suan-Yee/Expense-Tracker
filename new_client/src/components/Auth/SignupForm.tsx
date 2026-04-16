import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { useAuthStore } from "../../store/authStore";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuthStore();

  async function handleSubmit(event: ChangeEvent<HTMLFormElement>) {
    event.preventDefault();

    await signup(name, email, password);

    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  return (
    <section className="relative isolate flex h-[100svh] items-center justify-center px-4 py-3 sm:px-6">
      <div className="relative z-10 w-full max-w-[420px]">
        <div className="max-h-[calc(100svh-1.5rem)] overflow-y-auto rounded-[20px] border border-white/75 bg-white/92 px-6 py-6 shadow-[0_30px_60px_-35px_rgba(10,85,60,0.45)] backdrop-blur-md sm:px-7">
          <header className="mb-4 text-center">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-emerald-600">
              AUTHPORTAL
            </p>
            <h1 className="mt-1 text-[29px] font-extrabold leading-tight text-slate-800">
              Create account
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Join the community and start your journey today.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                className="text-[10px] font-bold tracking-[0.08em] text-slate-500"
                htmlFor="name"
              >
                FULL NAME
              </label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  id="name"
                  required
                  disabled={isLoading}
                  placeholder="John Doe"
                  onChange={(event) => setName(event.target.value)}
                  value={name}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition-all duration-300 ease-out placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-[10px] font-bold tracking-[0.08em] text-slate-500"
                htmlFor="email"
              >
                EMAIL
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  required
                  disabled={isLoading}
                  placeholder="john@example.com"
                  onChange={(event) => setEmail(event.target.value)}
                  value={email}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition-all duration-300 ease-out placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-[10px] font-bold tracking-[0.08em] text-slate-500"
                htmlFor="password"
              >
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  disabled={isLoading}
                  placeholder="********"
                  onChange={(event) => setPassword(event.target.value)}
                  value={password}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition-all duration-300 ease-out placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
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

            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 h-10 w-full rounded-xl border border-emerald-600 bg-emerald-600 text-sm font-bold text-white shadow-[0_14px_28px_-16px_rgba(5,150,105,0.85)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-emerald-500 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>

            <div className="mt-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-[10px] font-semibold tracking-[0.08em] text-slate-400">
                OR SIGN UP WITH
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="h-10 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Google
              </button>
              <button
                type="button"
                className="h-10 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Facebook
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
